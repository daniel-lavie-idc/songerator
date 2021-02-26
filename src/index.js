import * as Tone from "tone";
import * as NoteGenerator from './noteGenerator.js';
import * as Algorithm from './Algorithm.js';

window.addEventListener('load', () => {
    //default values
    //SCALE_JUMP refers to the intervals between notes
    //according to CURRENT_SCALE
    window.SCALE_JUMP = [0, 2, 3, 5, 7, 8, 10, 12];
    window.CURRENT_SCALE = [];
    window.START_NOTE = 60;
    window.SCALE_SELECT = "minor";
    window.MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10, 12];
    window.MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11, 12];
    window.NOTES_SELECTED_BY_USER = [];
    window.MAX_NOTE_NUMBER_PLAYED = -1;
    window.LAST_SCALE_DEGREE_PLAYED_BY_USER = -1; // The rightmost note played by the user
    //default settings
    for (let i = 0; i < window.SCALE_JUMP.length; i++) {
        window.CURRENT_SCALE[i] = window.START_NOTE + window.SCALE_JUMP[i];
    }
    Algorithm.hookStepSequencerUpdateCell();
});

//updating current scale, when the scale list is changed
document.getElementById("SCALE_SELECT").addEventListener("change", () => {
    window.SCALE_SELECT = document.getElementById("SCALE_SELECT").value;
    
    for (let i = 0; i < window.SCALE_JUMP.length; i++) {
        window.CURRENT_SCALE[i] = window.START_NOTE + window.SCALE_JUMP[i];
    }
    //TODO:PLACE HERE FUNC TO RENDER THE NEW SEQUENCER
});
//updating the root note of the step sequencer, when its dropdown list
// is being changed
document.getElementById("note_select").addEventListener("change", () => {
    window.START_NOTE = document.getElementById("note_select").value;
    for (let i = 0; i < window.SCALE_JUMP.length; i++) {
        window.CURRENT_SCALE[i] = window.START_NOTE + window.SCALE_JUMP[i];
    }
});
//when clicked on Auto Complete, fill the rest of the sequencer
function onAutoCompleteClicked() {
//TODO: if no notes had been played, use DEMO instead of fillUp
Algorithm.fillUp();
}
//inst_1 refers to the upper left sequencer, inst_2 to the upper right sequencer
document.getElementById("inst_1").addEventListener("click", () => onAutoCompleteClicked());
document.getElementById("inst_2").addEventListener("click", () => NoteGenerator.generateNextNote(window.LAST_SCALE_DEGREE_PLAYED_BY_USER));