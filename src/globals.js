import * as Tone from "tone";

window.C4 = 60;
window.C3 = 48;
window.NOTES_SELECTED_BY_USER = [];
window.MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10, 12];
window.MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11, 12];
window.MAX_NOTE_NUMBER_PLAYED = -1;
window.LAST_SCALE_DEGREE_PLAYED_BY_USER = -2;
window.CURRENT_SCALE = [];
window.SCALE_JUMP = [0, 2, 3, 5, 7, 8, 10, 12];

window.SYNTH_UPPER_LEFT = new Tone.PolySynth().toDestination();
window.SYNTH_UPPER_RIGHT = new Tone.DuoSynth().toDestination();
window.SYNTH_UPPER_RIGHT.volume.value = -8; // Normalize DuoSynth volume, as it's very loud

window.SYNTH_BOTTOM_LEFT = new Tone.MetalSynth().toDestination();
window.SYNTH_BOTTOM_LEFT.volume.value = -8; // Normalize MetalSynth volume, as it's very loud
window.SYNTH_BOTTOM_RIGHT = new Tone.MonoSynth().toDestination();

 // The rightmost note played by the user, -2 means no note was chosen (-1 is silence)
//gets an list of tuples representing the chosen notes in the current verse,
//returns a sequencer with the chosen notes 
function arrayToMatrix(arr) {
    var sequencer = [];
    for (let i = 0; i < 8; i++) {
        var row = [];
        for (let j = 0; j < 16; j++) {
            row.push(false);
        }
        sequencer.push([row]);
    }

    for (let i = 0; i < arr.length; i++) {
        sequencer[arr[i][0]][arr[i][1]] = true;
    }
    return sequencer;
}

//creates new verse in the current window.SONG 
//  (by default we have verse1, verse2 and chorus)
function createSongPart(givenBPM, startNote, scaleSelect) {
    let songPart = {
        START_NOTE: startNote,
        SCALE_SELECT: scaleSelect,
        bpm: givenBPM,
        sequencer1: { id: "#up_left", matrix: arrayToMatrix([]), lastNoteNumber: null, lastNoteDegree: null },
        sequencer2: { id: "#up_right", matrix: arrayToMatrix([]), lastNoteNumber: null, lastNoteDegree: null },
        sequencer3: { id: "#down_left", matrix: arrayToMatrix([]), lastNoteNumber: null, lastNoteDegree: null },
        sequencer4: { id: "#down_right", matrix: arrayToMatrix([]), lastNoteNumber: null, lastNoteDegree: null }
    }
    return songPart;
}
//Song represents a variable containing data of the whole program
// (it includes verses, in each verse we have the data of the sequencers, 
// and chosen root note and scale)
window.SONG = {
    verse1: createSongPart(120, 60, "major"),
    verse2: createSongPart(120, 60, "major"),
    chorus1: createSongPart(120, 60, "major")
}
// currentSongPart refers to the verse/chorus the user is currently viewing
window.SONG.currentSongPart = window.SONG.verse1;

//updates the data of the current part of the window.SONG
function updateCurrentSongPart(givenBPM, startNote, scaleSelect) {
    window.SONG[window.SONG.currentSongPart].START_NOTE = startNote;
    window.SONG[window.SONG.currentSongPart].SCALE_SELECT = scaleSelect;
    window.SONG[window.SONG.currentSongPart].bpm = givenBPM;

}

//gets an ID of a sequencer, updates its root note
function updateLastNote(seqID, noteNumber, noteDegree, val) {
    if (val === true && window.SONG[window.SONG.currentSongPart].lastNoteNumber < noteNumber) {
        window.SONG[window.SONG.currentSongPart][seqID].lastNoteNumber = noteNumber;
        window.SONG[window.SONG.currentSongPart][seqID].lastNoteDegree = noteDegree;
    }
    if (val === false) {
        window.SONG[window.SONG.currentSongPart][seqID].lastNoteNumber = null;
        window.SONG[window.SONG.currentSongPart][seqID].lastNoteDegree = null;
        for (let j = 0; j < 16; j++) {
            for (let i = 0; i < 8; i++) {
                if (window.SONG[window.SONG.currentSongPart][seqID].matrix[i][j] === true) {
                    window.SONG[window.SONG.currentSongPart][seqID].lastNoteNumber = j;
                    window.SONG[window.SONG.currentSongPart][seqID].lastNoteDegree = i;
                }
            }
        }
    }
}

//
function updateCurrentSongPartSeq(seqID, seqMatrix) {
    window.SONG[window.SONG.currentSongPart][seqID].matrix = seqMatrix;
    updateLastNote(seqID, 0, 0, false);
}

//
function updateNoteInCurrentSongPartSeq(seqID, noteNumber, noteDegree, val) {
    window.SONG[window.SONG.currentSongPart][seqID].matrix[noteDegree][noteNumber] = val;
    updateLastNote(seqID, noteNumber, noteDegree, val);
}

//gets a key representing a part of the window.SONG, then loads it
//as the current part
function loadSongPart(songPart) {
    let sequencers = [window.SONG[songPart].sequencer1, window.SONG[songPart].sequencer2,
    window.SONG[songPart].sequencer3, window.SONG[songPart].sequencer4];
    for (let s = 0; s < 4; s++) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 16; j++) {
                drawThisInSeq(i, j, sequencers[s].seqID, sequencers[s].matrix[i][j]);
            }
        }
    }
}

//turns on/off(val) a note at row(from bottom) scaleDegree and column note number, at seq with name id to
function drawThisInSeq(noteNumber, scaleDegree, id, val) {
    console.log(`drawThisInSeq:: id = ${id}`);
    let stepSeq = document.querySelector(id);
    //console.log(`drawInSeq::scaleDegree = ${scaleDegree}`);
    const rowInSequencer = stepSeq.rows - (parseInt(scaleDegree) + 1);
    console.log(`drawThisInSeq::rowInSequencer = ${rowInSequencer}, noteNumber = ${noteNumber}`);
    stepSeq._matrix[noteNumber][rowInSequencer] = val;
    stepSeq.requestUpdate()
}


export {drawThisInSeq}