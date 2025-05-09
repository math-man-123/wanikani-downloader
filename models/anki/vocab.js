// Contains Anki models and NoteTypes for Basic and Reversed Vocab cards.
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
    'primary_meaning', 'other_meanings', 'meaning_mnemonic',
    'primary_reading', 'other_readings', 'reading_mnemonic',
    'url', 'identifier (do not remove)'
].map((name) => ({ name }));


// contains all the info that changes between basic and reversed notes
// used to make question and answer dynamically adjust to current deck
const PROP = {
    BASIC: {
        prompt: 'meaning', hint: '{{subject}}', extraHint: '',
        target: '{{primary_meaning}}', extraTarget: '{{other_meanings}}',
    },
    REVERSED: {
        prompt: 'writing', hint: '{{primary_meaning}}', extraHint: '{{other_meanings}}',
        target: '{{subject}}', extraTarget: ''
    },
};

const QUESTION = ({ prompt, hint, extraHint }) =>
`Tell the ${prompt} and reading.
<a class="subject vocabulary" href="{{url}}">${hint}</a>
<span class="other">${extraHint}</span>`

const ANSWER = ({ prompt, target, extraTarget }) =>
`{{FrontSide}}<hr />

<div class="main-row">
    <span class="info">${prompt}:</span>
    <span class="primary">${target}</span>
    <span class="other">${extraTarget}</span>
</div>
<div class="mnemonic">{{meaning_mnemonic}}</div><hr />

<div class="main-row">
    <span class="info">reading:</span>
    <span class="primary">{{primary_reading}}</span>
    <span class="other">{{other_readings}}</span>
</div>
<div class="mnemonic">{{reading_mnemonic}}</div>`


// each deck type needs its own ID
const ID = {
    BASIC: '1659319318',
    REVERSED: '2111489559'
}

const MODEL = (type) => new Model({
    id: ID[type],
    name: `WK-Vocab-${UTIL.capFirst(type)}`,
    css: CSS, flds: FIELDS,

    tmpls: [{
        name: `Vocab-${UTIL.capFirst(type)}`,
        qfmt: QUESTION(PROP[type]),
        afmt: ANSWER(PROP[type]),
    }],
    req: [[0, 'all', [0, 1]]],
});


// this function grabs all the needed field 
// data from WaniKani's API subject data
const PROCESS = (subject, identifier = '') => {
    let { primary: meaning_primary, others: meaning_others } 
        = UTIL.getPrimaryOthers(subject, 'meaning');

    let { primary: reading_primary = subject.data.characters, 
          others: reading_others = '' }

        = subject.object == 'vocabulary'
        ? UTIL.getPrimaryOthers(subject, 'reading') : {};

    return [
        subject.data.characters || '?',
        
        // meaning section
        meaning_primary,
        meaning_others,
        subject.data.meaning_mnemonic,

        // reading section (kana_vocabulary has no readings)
        reading_primary, reading_others,
        subject.object == 'vocabulary' ? subject.data.reading_mnemonic : '',

        // miscellaneous section
        subject.data.document_url,
        identifier
    ];
}


// finally create all the NoteType objects (2) 
// export them to be reorganised in models.js
export const VOC = UTIL.SIMILAR.reduce((voc, type) => {
    let noteType = new NoteType(
        CHECKBOX.VOCABULARY, ID[type], 
        UTIL.OBJECT.VOCABULARY,
        MODEL(type), PROCESS );

    voc[type] = noteType; return voc; }, {});
