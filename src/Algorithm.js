import { generateNextNote, getLastScaleDegreePlayedByUser } from "./noteGenerator";
import { drawThisInSeq } from "./globals"


function hookStepSequencerUpdateCell(sequencer) {
    var stepSeq = document.querySelector(sequencer.id);
    var originalUpdateCell = stepSeq._updateCell;
    var bindedOriginalUpdateCell = originalUpdateCell.bind(stepSeq);
    stepSeq._updateCell = (column, row) => {
        const noteNumber = column; // For better naming
        const scaleDegree = stepSeq.rows - (row + 1); // We want to count the scale from bottom to top in the sequencer
        //we refer to the bottom row as the first row (instead of the top row)
        if (stepSeq._matrix[column][row] === false) {
            console.log(`SequencerID: ${sequencer.id} - User clicked note number: ${noteNumber}, scale degree: ${scaleDegree}`);
            if (sequencer.lastNoteNumber == null || noteNumber > sequencer.lastNoteNumber) {
                console.log(`SequencerID: ${sequencer.id} - New latest note number ${noteNumber} was detected, updating last (note) scale degree: ${scaleDegree}`);
                sequencer.lastNoteNumber = noteNumber;
                sequencer.lastNoteDegree = scaleDegree;
            }
        }
        /* TODO: Decide if it's necessary
        else {
            //delete the note from the NOTES_SELECTED_BY_USER array
            const index = window.NOTES_SELECTED_BY_USER.indexOf(column);
            if (index > -1) {
                window.NOTES_SELECTED_BY_USER.splice(index, 1);
            }
            //if we removed the far right note,update MAX_NOTE_NUMBER_PLAYED
            if (column === window.MAX_NOTE_NUMBER_PLAYED) {
                for (let i in window.NOTES_SELECTED_BY_USER)
                    window.MAX_NOTE_NUMBER_PLAYED = Math.max(window.MAX_NOTE_NUMBER_PLAYED, i);
            }
        }*/
        bindedOriginalUpdateCell(column, row);
    };
}

// fills the rest of the sequencer
function fillUp(sequencer) {
    console.log(`In fillUp function, sequencer id: ${sequencer.id}`);
    var stepSeq = document.querySelector(sequencer.id);
    const scaleDegreeChosenByUser = sequencer.lastNoteDegree;
    console.log(`fillUp::scaleDegreeChosenByUser: ${scaleDegreeChosenByUser}`);
    let lastScaleDegree = scaleDegreeChosenByUser;
    //lastNoteNumber is the far right played note 
    let lastNoteNumber = sequencer.lastNoteNumber + 1;
    while (lastNoteNumber < stepSeq.columns) {
        const nextNote = parseInt(generateNextNote(lastScaleDegree));
        console.log(`fillUp:: next note = ${nextNote}`);
        if (nextNote === -1) {
            console.log("fillUp:: Got a silence note, continuing");
            lastNoteNumber++;
            continue;
        }
        lastScaleDegree = nextNote;
        console.log(`fillUp: Setting note number ${lastNoteNumber}, lastScaleDegree: ${lastScaleDegree}`);
        drawThisInSeq(lastNoteNumber, lastScaleDegree, sequencer.id, true);
        lastNoteNumber++;
    }
    sequencer.lastNoteNumber = stepSeq.columns - 1; // Setting last note to last note of the matrix, so autocomplete would not be invoked again
}

export { hookStepSequencerUpdateCell, fillUp };