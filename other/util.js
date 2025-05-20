// generic functions and objects that are used at multiple locations


// objects with naming info
export const SUBJECT = ['RADICAL', 'KANJI', 'VOCABULARY'];
export const DECK = ['BASIC', 'REVERSED', 'WRITING'];
export const SIMILAR = ['BASIC', 'REVERSED'];

// objects with wanikani info
export const ORDER = ['radical', 'kanji', 'vocabulary', 'kana_vocabulary'];
export const OBJECT = {
    RADICAL: ['radical'], KANJI: ['kanji'],
    VOCABULARY: ['vocabulary', 'kana_vocabulary'],
};

// creates an array containing all given keys but also adds the keys 
// as object properties: i.e. arr[0] = 'key0' and arr.key0 = 'key0'
export const customKeyArray = (keys) => keys.reduce((arr, key) => {
    arr[key] = document.getElementById(key.toLowerCase());
    arr.push(arr[key]); return arr; }, []);


// gets item from given list that has item.primary == true and
// fulfills given condition (default is no condition at all)
export function getPrimary(items, cond = (item) => true) {
    if (!items) return {};

    for (let item of items) 
        if (item.primary && cond(item)) return item;

    return {};
}

// gets all items from given list that has item.primary == false 
// and fulfill given condition (default is no condition at all)
export function getOthers(items, cond = (item) => true) {
    if (!items) return [];

    let other = [];
    for (let item of items) 
        if (!item.primary && cond(item)) other.push(item);

    return other;
}

// combines both of the above functions into one
export function getPrimaryOthers(note, dataType, readingType = null) {
    let condition = (item) => item.type == readingType;
    if (!readingType) condition = () => true;

    let primary = getPrimary(note.data[dataType + 's'], condition);
    let others = getOthers(note.data[dataType + 's'], condition);

    primary = primary[dataType];
    others = others.map((reading) => reading[dataType]).join(', ');

    return { primary, others };
}


// string mainpulation: capitalizes first letter
export function capFirst(str) {
    if (typeof str != 'string') return;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// returns current time delta hours ago (UTC)
export function getHoursAgo(delta) {
    let date = new Date();
    date.setHours(date.getHours() - delta);
    
    return date.toISOString();
}

// checks if given review is a mistake or not
export function isMistake(review) {
    let meaning_mistake = review.data.meaning_current_streak <= 1;
    let reading_mistake = review.data.reading_current_streak <= 1;

    return meaning_mistake || reading_mistake;
}