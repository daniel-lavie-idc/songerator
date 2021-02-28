 const C4 = 60;
 const C3 = 48;
 let NOTES_SELECTED_BY_USER = [];
 const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10, 12];
 const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11, 12];
 const MAX_NOTE_NUMBER_PLAYED = -1;
const LAST_SCALE_DEGREE_PLAYED_BY_USER = -2;
let CURRENT_SCALE = [];
let SCALE_JUMP = [0, 2, 3, 5, 7, 8, 10, 12];
let synthUpperLeft = new Tone.PolySynth().toDestination();
let synthUpperRight = new Tone.DuoSynth().toDestination();
synthUpperRight.volume.value = -8; // Normalize DuoSynth volume, as it's very loud

let synthBottomLeft = new Tone.MetalSynth().toDestination();
synthBottomLeft.volume.value = -8; // Normalize MetalSynth volume, as it's very loud

let synthBottomRight = new Tone.MonoSynth().toDestination();
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

//creates new verse in the current song 
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
let song = {
    verse1: createSongPart(120, 60, "major"),
    verse2: createSongPart(120, 60, "major"),
    chorus1: createSongPart(120, 60, "major")
}
// currentSongPart refers to the verse/chorus the user is currently viewing
song.currentSongPart = song.verse1;

//updates the data of the current part of the song
function updateCurrentSongPart(givenBPM, startNote, scaleSelect) {
    song[song.currentSongPart].START_NOTE = startNote;
    song[song.currentSongPart].SCALE_SELECT = scaleSelect;
    song[song.currentSongPart].bpm = givenBPM;

}

//gets an ID of a sequencer, updates its root note
function updateLastNote(seqID, noteNumber, noteDegree, val) {
    if (val === true && song[song.currentSongPart].lastNoteNumber < noteNumber) {
        song[song.currentSongPart][seqID].lastNoteNumber = noteNumber;
        song[song.currentSongPart][seqID].lastNoteDegree = noteDegree;
    }
    if (val === false) {
        song[song.currentSongPart][seqID].lastNoteNumber = null;
        song[song.currentSongPart][seqID].lastNoteDegree = null;
        for (let j = 0; j < 16; j++) {
            for (let i = 0; i < 8; i++) {
                if (song[song.currentSongPart][seqID].matrix[i][j] === true) {
                    song[song.currentSongPart][seqID].lastNoteNumber = j;
                    song[song.currentSongPart][seqID].lastNoteDegree = i;
                }
            }
        }
    }
}

//
function updateCurrentSongPartSeq(seqID, seqMatrix) {
    song[song.currentSongPart][seqID].matrix = seqMatrix;
    updateLastNote(seqID, 0, 0, false);
}

//
function updateNoteInCurrentSongPartSeq(seqID, noteNumber, noteDegree, val) {
    song[song.currentSongPart][seqID].matrix[noteDegree][noteNumber] = val;
    updateLastNote(seqID, noteNumber, noteDegree, val);
}

//gets a key representing a part of the song, then loads it
//as the current part
function loadSongPart(songPart) {
    let sequencers = [song[songPart].sequencer1, song[songPart].sequencer2,
    song[songPart].sequencer3, song[songPart].sequencer4];
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


export {
    NOTES_SELECTED_BY_USER, song, arrayToMatrix, createSongPart, loadSongPart,
    updateCurrentSongPart, updateCurrentSongPartSeq, drawThisInSeq, updateLastNote,
    C3, C4, MINOR_INTERVALS, MAJOR_INTERVALS, MAX_NOTE_NUMBER_PLAYED, LAST_SCALE_DEGREE_PLAYED_BY_USER,
    synthBottomLeft, synthBottomRight, synthUpperLeft, synthUpperRight, CURRENT_SCALE, SCALE_JUMP
}