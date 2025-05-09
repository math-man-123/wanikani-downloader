// This file basically acts as a router file. Grabing all the 
// NoteTypes for the Anki cards and bundling them into DeckTypes.
import { DeckType } from './type.js';
import { CHECKBOX } from '../other/io.js';
import { RAD } from './anki/radical.js';
import { KAN } from './anki/kanji.js';
import { VOC } from './anki/vocab.js';
import { WRI } from './anki/writing.js';

const BAS = [RAD.BASIC, KAN.BASIC, VOC.BASIC];
const REV = [RAD.REVERSED, KAN.REVERSED, VOC.REVERSED];

const BASIC = new DeckType(CHECKBOX.BASIC, BAS);
const REVERSED = new DeckType(CHECKBOX.REVERSED, REV);
const WRITING = new DeckType(CHECKBOX.WRITING, WRI);

export const TYPE = [ BASIC, REVERSED, WRITING ];
