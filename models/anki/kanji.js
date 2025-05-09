// Contains Anki models and NoteTypes for Basic and Reversed Kanji cards.
// Basic and Reversed are quite similar so they can be contained together.
import * as UTIL from '../../other/util.js';
import { CHECKBOX } from '../../other/io.js';
import { NoteType } from '../type.js';

const CSS = 
    await fetch('./models/extra/cards.css')
    .then(file => file.text());

const CLEAN = 
    await fetch('./models/extra/clean.js')
    .then(file => file.text());
    

// anki note fields (basic and reversed are the same here)
const FIELDS = [
    'subject', 

    // meaning section
    'primary_meaning', 'other_meanings', 
    'meaning_mnemonic',

    // reading section
    'primary_reading_on', 'other_readings_on',
    'primary_reading_kun', 'other_readings_kun', 
    'reading_mnemonic',

    // miscellaneous section
    'similar_characters', 'similar_meanings',
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
        prompt: 'kanji', hint: '{{primary_meaning}}', extraHint: '{{other_meanings}}',
        target: '{{subject}}', extraTarget: ''
    },
};

const QUESTION = ({ prompt, hint, extraHint }) =>
`Tell the ${prompt} and reading.
<a class="subject kanji" href="{{url}}">${hint}</a>
<span class="other">${extraHint}</span>`

const ANSWER = ({ prompt, target, extraTarget }) =>
`{{FrontSide}}<hr />

<div class="main-row">
    <span class="info">${prompt}:</span>
    <span class="primary">${target}</span>
    <span class="other">${extraTarget}</span>
</div>
<div class="mnemonic">{{meaning_mnemonic}}</div><hr />

<div class="main-row stack">
    <div class="sub-row" id="onyomi">
        <span class="info">on-reading:</span>
        <span class="primary">{{primary_reading_on}}</span>
        <span class="other">{{other_readings_on}}</span>
    </div>
    <div class="sub-row" id="kunyomi">
        <span class="info">kun-reading:</span>
        <span class="primary">{{primary_reading_kun}}</span>
        <span class="other">{{other_readings_kun}}</span>
    </div>
</div>
<div class="mnemonic">{{reading_mnemonic}}</div><hr />

<div class="main-row" id="similar">
    <span class="info">similar kanji:</span>
    <span class="links"></span>
</div>

<script>
${CLEAN}
</script>`


// each deck type needs its own ID
const ID = {
    BASIC: '2140283319',
    REVERSED: '1198871899',
};

const MODEL = (type) => new Model({
    id: ID[type],
    name: `WK-Kanji-${UTIL.capFirst(type)}`,
    css: CSS, flds: FIELDS,

    tmpls: [{
        name: `Kanji-${UTIL.capFirst(type)}`,
        qfmt: QUESTION(PROP[type]),
        afmt: ANSWER(PROP[type]),
    }],
    req: [[0, 'all', [0, 1]]],
});


// this function grabs all the needed field 
// data from WaniKani's API subject data
function PROCESS(subject, identifier = '') {
    let { primary: meaning_primary, others: meaning_others } 
        = UTIL.getPrimaryOthers(subject, 'meaning');

    let { primary: onyomi_primary, others: onyomi_others } 
        = UTIL.getPrimaryOthers(subject, 'reading', 'onyomi');

    let { primary: kunyomi_primary, others: kunyomi_others } 
        = UTIL.getPrimaryOthers(subject, 'reading', 'kunyomi');

    return [
        subject.data.characters || '?',
        
        // meaning section
        meaning_primary, meaning_others,
        subject.data.meaning_mnemonic,

        // reading section
        onyomi_primary, onyomi_others,
        kunyomi_primary, kunyomi_others,
        subject.data.reading_mnemonic,

        // miscellaneous section
        '', '',
        subject.data.document_url,
        identifier
    ];
}


// finally create all the NoteType objects (2) 
// export them to be reorganised in models.js
export const KAN = UTIL.SIMILAR.reduce((kan, type) => {
    let noteType = new NoteType(
        CHECKBOX.KANJI, ID[type], 
        UTIL.OBJECT.KANJI,
        MODEL(type), PROCESS );

    kan[type] = noteType; return kan; }, {});
