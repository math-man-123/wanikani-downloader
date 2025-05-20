// This script contains all the API, ERROR, SUBJECT, INTERFACE, and DOWNLOAD code.
// It enables all the basic functionality of the webpage. Not included are some
// generic utility functions, interface elements, and all the anki model code. 
import * as IO from './other/io.js';
import * as UTIL from './other/util.js';
import * as MODEL from './models/model.js';



// ------------------------------------------------------------------
// ------------------------- API REQUEST CODE -----------------------
// ------------------------------------------------------------------

const API_URL = 'https://api.wanikani.com/v2/';

// requests WaniKani-API endpoint with given params
// handels pagination and returns data as single array
async function apiRequest(endpoint, params = {}) {
    // if no API-Token is input immediatly throw error
    if (!IO.API_TOKEN.dataset.password) {
        IO.CONTAINER.innerHTML = '';
        showError(ERROR_MSG.NO_TOKEN);
        throw new Error('MISSING API TOKEN');
    }

    let url = new URL(API_URL + endpoint);
    url.search = new URLSearchParams(params);

    // fetch one page of data at a time (see WaniKani-API docs)
    let data = [];
    while (url != null) {
        let response = await tryToFetch(url);

        // if fetch successfull push data to array and go next
        data.push(...response.data);
        url = response.pages.next_url;
    }

    return data;
}

// tries to fetch HTTP response from given url (given amount of times)
// returns response parsed as JSON if successfull else throws error
async function tryToFetch(url, retries = 3, delay = 50) {
    let headers = { Authorization: `Bearer ${IO.API_TOKEN.dataset.password}` };

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // fetching response from url and returning it
            let response = await fetch(url, { method: 'GET', headers });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            // parse response as JSON and return it once done
            console.log(`Successfully fetched response from ${url}`);
            return await response.json();
        } 
        
        catch (error) {
            console.log(`REQUEST ERROR ${attempt}/${retries}`);

            // check for error type and adjust message accordingly
            let wrong_token = error.message.includes('401');
            let message = wrong_token
                ? ERROR_MSG.WRONG_TOKEN
                : ERROR_MSG.REQUEST_FAIL;

            // if fatal error status reached print error and throw
            if (wrong_token || attempt == retries) {
                IO.CONTAINER.innerHTML = '';
                showError(message);
                throw new Error(error);
            }

            // retry fetching response after short delay
            await new Promise((res) => setTimeout(res, delay));
        }
    }
}



// ------------------------------------------------------------------
// ------------------------- ERROR CODE -----------------------------
// ------------------------------------------------------------------

// displays error with given message
function showError(message) {
    IO.MSG.textContent = message;
    IO.ERROR.classList.remove('hidden');
}

// hides error message from view
function removeError() {
    IO.ERROR.classList.add('hidden');
}

const ERROR_PREFIX = 'Oops. It seems like';
const ERROR_MSG = {
    NO_TOKEN: `${ERROR_PREFIX} your API token is missing.`,
    WRONG_TOKEN: `${ERROR_PREFIX} your API token is incorrect.`,
    REQUEST_FAIL: `${ERROR_PREFIX} your API request timed out.`,
    NO_SUBJECTS: `${ERROR_PREFIX} no subject is selected.`,
    NO_CONTENT: `${ERROR_PREFIX} there is nothing to show.`,
    NO_DECK: `${ERROR_PREFIX} no deck is selected.`,
};

// checks if any error has occured and displays the
// corresponding error message if so, else hides error
function checkError() {
    // maps error conditions to error messages
    let error = [
        { val: !!IO.API_TOKEN.dataset.password, msg: ERROR_MSG.NO_TOKEN },
        { val: IO.SUBJECT.some((subject) => subject.checked), msg: ERROR_MSG.NO_SUBJECTS },
        { val: !!filterSubjects().length, msg: ERROR_MSG.NO_CONTENT },
        { val: IO.DECK.some((deckType) => deckType.checked), msg: ERROR_MSG.NO_DECK }
    ];

    // loop through all the errors and check fr them
    for (let { val, msg } of error) {
        if (val) continue;
        showError(msg); return true;
    }

    // if no error has occured hide error
    removeError(); return false;
}

IO.CHECKBOX.forEach((box) => (box.onchange = checkError));
showError(ERROR_MSG.NO_TOKEN); // reminds user: API-Token



// ------------------------------------------------------------------
// ------------------------- SUBJECT CODE ---------------------------
// ------------------------------------------------------------------

let SUBJECTS = []; // global subject cache

// loads full subject data of selected content into SUBJECT array
async function loadSubjects() {
    // always request subject endpoint but use correct parameters
    let params = await getContentParams();
    SUBJECTS = await apiRequest('subjects', params);
    sortSubjects();

    // returns parameter object for API-request
    // corresponding to selected content
    async function getContentParams() {
        let content = IO.CONTENT.value;

        // if content is set to recent mistakes grab review stats from
        // WaniKani API and filter ids of recent misstakes to return
        if (/mistake/.test(content)) {
            let reviews = await apiRequest(
                'review_statistics', 
                { updated_after: getHoursAgo(24) });
            
            // first filter for reviews that are mistakes
            // then only keep the subject ids of those
            let mistakes = reviews
                .filter((review) => isMistake(review))
                .map((review) => review.data.subject_id);
            
            return { ids: mistakes.join(',') };
        }

        // if content is set to any level return corresponding level num
        if (/^level\d+$/.test(content))
            return { levels: [content.substring('level'.length)] };

        // if content is set to any SRS-stage return corresponding ids
        if (/^srs/.test(content)) {
            let srs_stages = content.substring('srs'.length);
            let assignments = await apiRequest('assignments', { srs_stages });

            // return only subject ids of the fetched assingments
            return { ids: assignments.map((el) => el.data.subject_id) };
        }
    }
}

// returns current time delta hours ago (UTC)
function getHoursAgo(delta) {
    let date = new Date();
    date.setHours(date.getHours() - delta);
    
    return date.toISOString();
}

// checks if given review is a mistake or not
function isMistake(review) {
    let meaning_mistake = review.data.meaning_current_streak <= 1;
    let reading_mistake = review.data.reading_current_streak <= 1;

    return meaning_mistake || reading_mistake;
}

// sorts subject data in ascending order as defined by UTIL.ORDER array
function sortSubjects() {
    SUBJECTS.sort((A, B) => UTIL.ORDER.indexOf(A.object) - UTIL.ORDER.indexOf(B.object));
}

// filter subjects that do not match any of the selected types
function filterSubjects() {
    // save all selected subject types for filtering
    let types = [];
    UTIL.SUBJECT.forEach(sub => {
        if (IO.SUBJECT[sub].checked) types.push(...UTIL.OBJECT[sub]);
    });

    return SUBJECTS.filter((el) => types.includes(el.object));
}

// shows all subjects that fit current user selection in container
function updateSubjects() {
    // clean container and filter subjects that
    // do not match any of the selected types
    IO.CONTAINER.innerHTML = '';
    let subjects = filterSubjects();
    
    // else create subject cards and append them to container
    subjects = subjects.map((el) => createCard(el));
    IO.CONTAINER.append(...subjects);

    checkError();
}

// factory function for html subject cards
function createCard(subject) {
    let { data } = subject;

    // create card object and setup link
    let card = document.createElement('a');
    card.className = `subject ${subject.object}`;
    card.href = data.document_url;
    card.target = '_blank';

    // create main characters of the subject
    let characters = document.createElement('span');
    characters.className = 'characters';
    characters.textContent = data.characters || '?';

    // create information row of subject
    let information = document.createElement('div');
    information.className = 'information';

    // create primary reading span of subject
    let reading = document.createElement('span');
    reading.className = 'reading';
    
    reading.textContent = UTIL.getPrimary(data.readings).reading;
    if (reading.textContent) information.append(reading);

    // create primary meaning span of subject
    let meaning = document.createElement('span');
    meaning.className = 'meaning';
    meaning.textContent = UTIL.getPrimary(data.meanings).meaning;
    if (meaning.textContent) information.append(meaning);

    card.append(characters, information);
    return card;
}

// load new subject data if content or selection changes
IO.CONTENT.onchange = () => loadSubjects().then(updateSubjects);
IO.SUBJECT.forEach(sub => sub.onchange = updateSubjects);



// ------------------------------------------------------------------
// ------------------------- INTERFACE CODE -------------------------
// ------------------------------------------------------------------

// removes placeholder and unstars input value
IO.API_TOKEN.onfocus = () => {
    // save placeholder then remove it
    IO.API_TOKEN.dataset.placeholder = IO.API_TOKEN.placeholder;
    IO.API_TOKEN.placeholder = '';

    // restore input value to previous state
    IO.API_TOKEN.value = IO.API_TOKEN.dataset.password || '';
};

// restores placeholder and stars input value
// tries loading and showing subject data
IO.API_TOKEN.onblur = () => {
    // restore placeholder to previous state
    IO.API_TOKEN.placeholder = IO.API_TOKEN.dataset.placeholder;

    // save input value then replace it by stars
    let password = IO.API_TOKEN.value.trim();
    IO.API_TOKEN.dataset.password = password;
    IO.API_TOKEN.value = '⭑'.repeat(password.length);

    loadSubjects().then(updateSubjects);
};

// fixes last row of subject container to not look weird
function fixLastRow() {
    let subjects = Array.from(IO.CONTAINER.children);
    if (subjects.length == 0) return;

    // remove .last-row class from all subjects
    subjects.forEach((sub) => sub.classList.remove('last-row'));


    // find subjects of lastRow based on offsetTop value
    let lastRow = null;
    for (let sub of subjects) {
        let row = lastRow && lastRow.top == sub.offsetTop
            ? lastRow : { top: sub.offsetTop, elements: [] };

        if (row != lastRow) lastRow = row;
        row.elements.push(sub);
    }

    // add .last-row class to last row
    lastRow.elements.forEach((el) => el.classList.add('last-row'));
}

// fix last row every time container changes
// as well as every time the window changes
(new MutationObserver(fixLastRow))
    .observe(IO.CONTAINER, { childList: true });
window.onresize = fixLastRow;



// ------------------------------------------------------------------
// ------------------------- DOWNLOAD CODE --------------------------
// ------------------------------------------------------------------

// Gloabl SQL database needed for genanki library
window.SQL = await initSqlJs({
    locateFile: (filename) =>
        `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/${filename}`
});

// Downloads selected content as Anki package file
IO.DOWNLOAD.onclick = () => {
    if (checkError()) return;

    // Initialize base filename
    let content = IO.CONTENT.selectedOptions[0].text;
    let fileName = `WK[${content.replaceAll(' ', '')}]`;

    // Loop through each selected deck type
    let pack = new Package();
    for (let deckType of MODEL.TYPE) {
        if (!deckType.checked) continue;

        // Append deck type abbreviation to filename
        fileName += `_${deckType.name.slice(0, 3).toUpperCase()}[`;
        let identifier = `${content} - ${deckType.name}`;

        // Loop through each selected note type
        let subjects = filterSubjects();
        for (let noteType of deckType.noteTypes) {
            if (!noteType.checked) continue;

            // Append note type abbreviation to filename
            if (!fileName.endsWith('[')) fileName += '+';
            fileName += `${noteType.name.slice(0, 3)}`;

            // Build deck name and create new deck
            let deckName =
                `WaniKani (${deckType.name} Study)::` +
                `${content}::${noteType.name}`;
            let deck = new Deck(noteType.id, deckName);

            // Add notes to the deck
            while (noteType.objects.includes(subjects[0]?.object)) {
                let fields = noteType.process(subjects.shift(), identifier);
                deck.addNote(noteType.model.note(fields));
            }

            pack.addDeck(deck);
        }
        fileName += ']';
    }

    // Export the package to an .apkg file
    pack.writeToFile(`${fileName}.apkg`);
};
