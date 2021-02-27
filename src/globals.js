let NOTES_SELECTED_BY_USER = [];


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

let song = {
    verse1: createSongPart(120, 60, "major"),
    verse2: createSongPart(120, 60, "major"),
    chorus1: createSongPart(120, 60, "major")
}
song.currentSongPart = song.verse1;

function updateCurrentSongPart(givenBPM, startNote, scaleSelect) {
    song[song.currentSongPart].START_NOTE = startNote;
    song[song.currentSongPart].SCALE_SELECT = scaleSelect;
    song[song.currentSongPart].bpm = givenBPM;

}



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
function updateCurrentSongPartSeq(seqID, seqMatrix) {
    song[song.currentSongPart][seqID].matrix = seqMatrix;
    updateLastNote(seqID, 0, 0, false);
}


function updateNoteInCurrentSongPartSeq(seqID, noteNumber, noteDegree, val) {
    song[song.currentSongPart][seqID].matrix[noteDegree][noteNumber] = val;
    updateLastNote(seqID, noteNumber, noteDegree, val);
}

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
    updateCurrentSongPart, updateCurrentSongPartSeq, drawThisInSeq, updateLastNote
}