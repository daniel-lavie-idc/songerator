import * as Tone from "tone";
import * as NoteGenerator from './noteGenerator.js';

window.addEventListener('load', () => {
    window.SCALE_JUMP = [0, 2, 3, 5, 7, 8, 10, 12];
    window.CURRENT_SCALE = [];
    window.START_NOTE = 60;
    window.SCALE_SELECT = "minor";
    window.MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10, 12];
    window.MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11, 12];
    window.NOTES_SELECTED_BY_USER = [];
    //default settings
    for (let i = 0; i < window.SCALE_JUMP.length; i++) {
        window.CURRENT_SCALE[i] = window.START_NOTE + window.SCALE_JUMP[i];
    }
})

//updating current scale, when the scale list is changed
document.getElementById("SCALE_SELECT").addEventListener("change", () => {
    window.SCALE_SELECT = document.getElementById("SCALE_SELECT").value;
    
    for (let i = 0; i < window.SCALE_JUMP.length; i++) {
        window.CURRENT_SCALE[i] = window.START_NOTE + window.SCALE_JUMP[i];
    }
});
//updating start note, when the note 
document.getElementById("note_select").addEventListener("change", () => {
    window.START_NOTE = document.getElementById("note_select").value;
    for (let i = 0; i < window.SCALE_JUMP.length; i++) {
        window.CURRENT_SCALE[i] = window.START_NOTE + window.SCALE_JUMP[i];
    }
}
);

function onAutoCompleteClicked() {
    /*
    unfilledNotes = getUnfilledNotes();
    unfilledNotes.array.forEach(element => {
        nextNote = generateNextNote();
        updateNoteInUI(element); 
    });*/
}


document.getElementById("inst_1").addEventListener("click", () => onAutoCompleteClicked());
document.getElementById("inst_2").addEventListener("click", () => NoteGenerator.generateNextNote());