// Contains Anki models and NoteTypes for Basic and Reversed Radical cards.
// Basic and Reversed are quite similar so they can be contained together.
import * as UTIL from '../../other/util.js';
import { CHECKBOX } from '../../other/io.js';
import { NoteType } from '../type.js';

const CSS = 
    await fetch('./models/extra/cards.css')
    .then(file => file.text());


// anki note fields (basic and reversed are the same here)
const FIELDS = [
    'subject',
    'meaning', 'mnemonic',
    'url', 'identifier (do not remove)',
].map((name) => ({ name }));


// contains all the info that changes between basic and reversed notes
// used to make question and answer dynamically adjust to current deck
const PROP = {
    BASIC: {prompt: 'name', hint: '{{subject}}', target: '{{meaning}}'},
    REVERSED: {prompt: 'radical', hint: '{{meaning}}', target: '{{subject}}'}
}

const QUESTION = ({ prompt, hint }) =>
`Tell the ${prompt}.
<a class="subject radical" href="{{url}}">${hint}</a>`;

const ANSWER = ({ prompt, target }) =>
`{{FrontSide}}<hr />

<div class="main-row">
    <span class="info">${prompt}:</span>
    <span class="primary">${target}</span>
</div>
<div class="mnemonic">{{mnemonic}}</div>`;


// each deck type needs its own ID
const ID = {
    BASIC: '2044009297',
    REVERSED: '1699631252',
};

const MODEL = (type) => new Model({
    id: ID[type],
    name: `WK-Radical-${UTIL.capFirst(type)}`,
    css: CSS, flds: FIELDS,

    tmpls: [{
        name: `Radical-${UTIL.capFirst(type)}`,
        qfmt: QUESTION(PROP[type]),
        afmt: ANSWER(PROP[type]),
    }],
    req: [[0, 'all', [0, 1]]],
});


// this function grabs all the needed field 
// data from WaniKani's API subject data
const PROCESS = (subject, identifier = '') => [
    subject.data.characters || '?',

    // meaning section
    UTIL.getPrimary(subject.data.meanings).meaning,
    subject.data.meaning_mnemonic,

    // miscellaneous section
    subject.data.document_url, identifier
];


// finally create all the NoteType objects (2) 
// export them to be reorganised in models.js
export const RAD = UTIL.SIMILAR.reduce((rad, type) => {
    let noteType = new NoteType(
        CHECKBOX.RADICAL, ID[type], 
        UTIL.OBJECT.RADICAL,
        MODEL(type), PROCESS );

    rad[type] = noteType; return rad; }, {});
