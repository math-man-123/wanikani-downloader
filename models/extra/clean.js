// This file contains a script that is to be attached to basic and reversed kanji 
// anki cards. It can create links to similar kanjis and append them. Also it cleans 
// up empty reading rows e.g. only kun-readings exists -> delete on-readings row.

// creates and appends link elements to similar kanjis
function createKanjiLinks() {
    let links = document.querySelector('.links');
    let characters = '{{similar_characters}}'.split(', ');
    let meanings = '{{similar_meanings}}'.split(', ');

    // creates a single link to a given kanji
    function createKanjiLink(character, meaning) {
        let kanji = document.createElement('a');
        kanji.href = `https://www.wanikani.com/kanji/${character}`;
        kanji.classList.add('kanji');

        kanji.innerHTML = `
            <div class="character">${character}</div>
            <div class="meaning">${meaning}</div>
		`.trim();

        return kanji;
    }

    // loop through all the similar kanjis and create links
    for (let i = 0; i < characters.length; i++) {
        let kanjiLink = createKanjiLink(characters[i], meanings[i]);
        links.appendChild(kanjiLink);
    }
}

// deletes empty kun-/on-readings row if empty
// also it deletes the similar kanji row if empty
function deleteEmptyParts() {
    let onyomi = document.getElementById('onyomi');
    let kunyomi = document.getElementById('kunyomi');

    // checks if given row is empty and deltes it if so
    function deleteRowIfEmpty(row) {
        let primary = row.querySelector('.primary').innerHTML;
        let other = row.querySelector('.other').innerHTML;

        if (!primary && !other) row.remove();
    }

    deleteRowIfEmpty(onyomi);
    deleteRowIfEmpty(kunyomi);

    // this sections handels the similar kanji row
    let similar = document.getElementById('similar');
    let rulers = document.querySelectorAll('hr');
    let lastRuler = rulers[rulers.length - 1];

    if (!'{{similar_characters}}') {
        similar.remove(); lastRuler.remove();
    }
}

createKanjiLinks(); deleteEmptyParts();