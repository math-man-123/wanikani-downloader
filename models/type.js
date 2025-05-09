// This class handels common checkbox logic.
// It is to be extendes by deck and note types.
class CheckboxItem {
    #checkbox;
    get checked() { return this.#checkbox.checked; }
    get name() { return this.#checkbox.name; }

    constructor(checkbox) { this.#checkbox = checkbox; }
}

// This class is meant to bundel all subjects (radical, kanji, vocab)
// of a certain deck (basic, reversed, writing). There are 3 in total.
export class DeckType extends CheckboxItem {
    constructor(checkbox, noteTypes) {
        super(checkbox);
        Object.assign(this, { noteTypes });
    }
}

// This class is meant to represent a subject (radical, kanji, vocab) 
// for a certain deck (basic, reversed, writing). There are 9 in total.
export class NoteType extends CheckboxItem {
    constructor(checkbox, id, objects, model, process) {
        super(checkbox);
        Object.assign(this, { id, objects, model, process });
    }
}
