    // function getLastPlayed() {
    //     const stepSeq=document.querySelector("tone-step-sequencer");
    //     for (let i=15; i>=0; i--)
    //     {
    //         for (let j=7; j>=0; j--)
    //         {
    //             if (stepSeq._matrix[i][j] === true)
    //             console.log(j);
    //             return window.CURRENT_SCALE[j];
    //         }
    //     }
    // }

import { Scale } from "tone";
import { generateNextNote } from "./noteGenerator";


function hookStepSequencerUpdateCell() {
    console.log("In " + hookStepSequencerUpdateCell);
    var stepSeq = document.querySelector("tone-step-sequencer");
    var originalUpdateCell = stepSeq._updateCell;
    var bindedOriginalUpdateCell = originalUpdateCell.bind(stepSeq);
    stepSeq._updateCell = (column, row) => {
        if (stepSeq._matrix[column][row] === false) {
            window.NOTES_SELECTED_BY_USER.push(row);
            window.MAX_COLUMN_PLAYED = Math.max(column, window.MAX_COLUMN_PLAYED);
            console.log("User clicked column: " + column + ",row: " + row ); 
        }
        // TODO: (else) Delete if the user regrets
        bindedOriginalUpdateCell(column,row);
    };
}

// function setNoteInSequencer() {
//     var stepSeq = document.querySelector("tone-step-sequencer");
//     if (MAX_COLUMN_PLAYED === 15)
//     return;
//     let Note;
//     //Fills the rest of the sequencer
//     for (let i=MAX_COLUMN_PLAYED; i<16; i ++)
//     {
//     note =generateNextNote();
//     stepSeq._matrix[i][note]=true;
//     stepSeq.render();
//     }
// }

export {hookStepSequencerUpdateCell};