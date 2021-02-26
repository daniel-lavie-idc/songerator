import { Scale } from "tone";
import { generateNextNote, getLastScaleDegreePlayedByUser } from "./noteGenerator";


function hookStepSequencerUpdateCell() {
    console.log("In " + hookStepSequencerUpdateCell);
    var stepSeq = document.querySelector("tone-step-sequencer");
    var originalUpdateCell = stepSeq._updateCell;
    var bindedOriginalUpdateCell = originalUpdateCell.bind(stepSeq);
    stepSeq._updateCell = (column, row) => {
        const noteNumber = column; // For better naming
        const scaleDegree = stepSeq.rows - (row + 1); // We want to count the scale from bottom to top in the sequencer
        //we refer to the bottom row as the first row (instead of the top row)
        if (stepSeq._matrix[column][row] === false) {
            console.log("User clicked note number: " + noteNumber + ", scale degree: " + scaleDegree); 
            window.NOTES_SELECTED_BY_USER.push(scaleDegree);
            if (noteNumber > window.MAX_NOTE_NUMBER_PLAYED) {
                console.log(`New latest note number ${noteNumber} was detected, updating last (note) scale degree: ${scaleDegree}`);
                window.MAX_NOTE_NUMBER_PLAYED = noteNumber;
                window.LAST_SCALE_DEGREE_PLAYED_BY_USER = scaleDegree;
            }
        }
        else {
            //delete the note from the NOTES_SELECTED_BY_USER array
            const index = window.NOTES_SELECTED_BY_USER.indexOf(column);
            if (index > -1) {
                window.NOTES_SELECTED_BY_USER.splice(index, 1);
            }
            //if we removed the far right note,update MAX_NOTE_NUMBER_PLAYED
            if (column ===window.MAX_NOTE_NUMBER_PLAYED)
            {
                for ( let i in window.NOTES_SELECTED_BY_USER)
                window.MAX_NOTE_NUMBER_PLAYED= Math.max(window.MAX_NOTE_NUMBER_PLAYED,i);
            }
        }
        bindedOriginalUpdateCell(column,row);
    };
}
// fills the rest of the sequencer
function fillUp()
{
    console.log(`In fillUp function`);
    var stepSeq = document.querySelector("tone-step-sequencer");
    const scaleDegreeChosenByUser = getLastScaleDegreePlayedByUser();
    console.log(`fillUp::scaleDegreeChosenByUser: ${scaleDegreeChosenByUser}`);
    let lastScaleDegree = generateNextNote(scaleDegreeChosenByUser);
    let lastNoteNumber = window.MAX_NOTE_NUMBER_PLAYED + 1;
    do {
        console.log(`fillUp: Setting note number ${lastNoteNumber}, lastScaleDegree: ${lastScaleDegree}`);
        drawInSeq(lastNoteNumber, lastScaleDegree);
        lastScaleDegree = generateNextNote(lastScaleDegree);
        lastNoteNumber++;
    } while (lastNoteNumber < stepSeq.columns)

    /*
    for (currentNoteNumber = lastNoteNumber; currentNoteNumber < 16; i++) {
        drawInSeq(currentNoteNumber, newNote);
        lastScaleDegree = generateNextNote(lastScaleDegree);
    }



    // Auto complete only fills up the right cells from where the user last played a note (stored in the variable `window.MAX_NOTE_NUMBER_PLAYED`)
    for (let i=window.MAX_NOTE_NUMBER_PLAYED + 1; i < 16; i++)
    {
        let lastNote = getLastScaleDegreePlayedByUser();
        let newNote = generateNextNote(lastNote);
        //draw new note in the sequencer matrix
        drawInSeq(i,newNote);
    }
    */
}

//TODO: Add sequencer as parameter in order to be able to use on all sequencers?
function drawInSeq(column,row)
{
    let stepSeq = document.querySelector("tone-step-sequencer");
    stepSeq._matrix[column][row] = true;
    stepSeq.requestUpdate()
}


// function setNoteInSequencer() {
//     var stepSeq = document.querySelector("tone-step-sequencer");
//     if (MAX_NOTE_NUMBER_PLAYED === 15)
//     return;
//     let Note;
//     //Fills the rest of the sequencer
//     for (let i=MAX_NOTE_NUMBER_PLAYED; i<16; i ++)
//     {
//     note =generateNextNote();
//     stepSeq._matrix[i][note]=true;
//     stepSeq.render();
//     }
// }

export {hookStepSequencerUpdateCell, fillUp};