// Contains Anki models and NoteTypes for Writing cards. Radical, Kanji,
// Vocab cards are basically the same so they can be contained together.
import * as UTIL from '../../other/util.js';
import { CHECKBOX } from '../../other/io.js';
import { NoteType } from '../type.js';

const CSS = 
    await fetch('./models/extra/cards.css')
    .then(file => file.text());

const DMAK =
    await fetch('./models/extra/dmak.js')
    .then(file => file.text());


// anki note fields (radical, kanji, vocab are the same here)
const FIELDS = [
    'subject', 'meaning', 'url',
    'identifier (do not remove)',
].map((name) => ({ name }));

// no prop object is needed as only a single thing changes
const QUESTION = (type) =>
`<script src="https://cdnjs.cloudflare.com/ajax/libs/raphael/2.3.0/raphael.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/mbilbille/dmak@master/dist/dmak.min.js"></script>

Write and name this <span class="${type.toLowerCase()}">${UTIL.capFirst(type)}</span>.
<div id="dmak" onclick="loadDMAK('{{subject}}')"></div>

<div id="settings">
    <label>
        <input type="checkbox" id="order" onchange="toggleOrder('{{subject}}')" />
        stroke order
    </label>
    <label>
        <input type="range" min="0" max="0.03" step="0.0001" id="speed" onchange="changeSpeed('{{subject}}')" />
        speed
    </label>
</div>

<script>
${DMAK}
</script>

<script>
	// ensures DMAK is redrawn on card flip
	setTimeout(() => loadDMAK('{{subject}}'), 0);
</script>`

// the answer even stays always the exact same
const ANSWER =
`{{FrontSide}}<hr />

<div class="main-row">
    <span class="info">name:</span>
    <span class="primary">{{meaning}}</span>
	<a class="url" href="{{url}}">➲</a>
</div>`

// each note type needs its own ID
const ID = {
    RADICAL: '1232547118',
    KANJI: '2004762197',
    VOCABULARY: '1512331754',
};

const MODEL = (type) => new Model({
    id: ID[type],
    name: `WK-${UTIL.capFirst(type)}-Writing`,
    css: CSS, flds: FIELDS,

    tmpls: [{
        name: `${UTIL.capFirst(type)}-Writing`,
        qfmt: QUESTION(type),
        afmt: ANSWER,
    }],
    req: [[0, 'all', [0]]],
});


// this function grabs all the needed field 
// data from WaniKani's API subject data
const PROCESS = (subject, identifier = '') => [
    subject.data.characters || '?',
    UTIL.getPrimary(subject.data.meanings).meaning,
    subject.data.document_url,
    identifier
];


// finally create all the NoteType objects (3) 
// export them to be reorganised in models.js
export const WRI = UTIL.SUBJECT.reduce((wri, type) => {
    let noteType = new NoteType(
        CHECKBOX[type], ID[type], 
        UTIL.OBJECT[type],
        MODEL(type), PROCESS );

    wri.push(noteType); return wri; }, []);
