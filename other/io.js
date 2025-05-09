// grabs all needed dom elements once then exports them
import * as UTIL from './util.js';


// checkbox elements as an array but also accessible by name
export const SUBJECT = UTIL.customKeyArray(UTIL.SUBJECT);
export const DECK = UTIL.customKeyArray(UTIL.DECK);
export const CHECKBOX = UTIL.customKeyArray([...UTIL.SUBJECT, ...UTIL.DECK]);


const $ = id => document.getElementById(id);

// all the other dom elements grabed by id
export const API_TOKEN = $('api-token');
export const ERROR = $('error');
export const MSG = $('msg');
export const CONTENT = $('content');
export const DOWNLOAD = $('download');
export const CONTAINER = $('container');
