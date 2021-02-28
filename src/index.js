import * as Tone from "tone";
import * as NoteGenerator from './noteGenerator.js';
import * as Algorithm from './Algorithm.js';
import * as Globals from './globals.js';

window.addEventListener('load', () => {
    //default values
    //SCALE_JUMP refers to the intervals between notes
    //according to CURRENT_SCALE
    // window.CURRENT_SCALE = [];
    // window.START_NOTE = 60;
    // window.SCALE_SELECT = "minor";



   
 
      setupSynth("#up_left", Globals.synthUpperLeft, Globals.C4);
      setupSynth("#up_right", Globals.synthUpperRight, Globals.C4);
      setupSynth("#down_left", Globals.synthBottomLeft, Globals.C4);
      setupSynth("#down_right", Globals.synthBottomRight, Globals.C3);  
    //default settings
    for (let i = 0; i < Globals.SCALE_JUMP.length; i++) {
        Globals.CURRENT_SCALE[i] =  Globals.song.currentSongPart.startNote + Globals.SCALE_JUMP[i];
    }
    Algorithm.hookStepSequencerUpdateCell(Globals.song.currentSongPart.sequencer1);
    Algorithm.hookStepSequencerUpdateCell(Globals.song.currentSongPart.sequencer2);
    updateWithSelector();
});
document.querySelector("tone-play-toggle").addEventListener("stop", () => Tone.Transport.stop());

//updating current scale, when the scale list is changed
document.getElementById("SCALE_SELECT").addEventListener("change", () => {
    let newNote =parseInt(document.getElementById("note_select").value);
    updateWithSelector();
    renderSeq(Globals.song.currentSongPart.startNote);
   
    // TODO:PLACE HERE FUNC TO RENDER THE NEW SEQUENCER
});

//updating the root note of the step sequencer, when its dropdown list
// is being changed
document.getElementById("note_select").addEventListener("change", () => {
    let newNote =parseInt(document.getElementById("note_select").value);
    Globals.song.currentSongPart.startNote =newNote ;
    updateWithSelector();
    renderSeq(newNote);

});
function updateWithSelector()
{   let SCALE_SELECT = parseInt(document.getElementById("SCALE_SELECT").value);
     switch (SCALE_SELECT) {
        case 1:
          Globals.SCALE_JUMP = Globals.MINOR_INTERVALS;
            break;
        case 2:
          Globals.SCALE_JUMP = Globals.MAJOR_INTERVALS;
            break;
  }
    for (let i = 0; i < Globals.SCALE_JUMP.length; i++) {
        let currNote = Globals.song.currentSongPart.startNote + Globals.SCALE_JUMP[i];
        Globals.CURRENT_SCALE[i] = currNote;
        //update the notes indexes near the sequencers
        let html_update = document.querySelectorAll(".note_" + i);
        html_update.forEach((element) => {
            element.innerHTML = midiToNote(currNote);
        })
        html_update.innerHTML = midiToNote(currNote);
}
}
function midiToNote(currNote) {
    let note_arr = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return note_arr[currNote % 12];
}

//when clicked on Auto Complete, fill the rest of the sequencer
function onAutoCompleteClicked(sequencer) {
    if (sequencer.lastNoteDegree == null) {
        console.log("No note was chosen by the user");
        return;
    }
    Algorithm.fillUp(sequencer);
}

//inst_1 refers to the upper left sequencer, inst_2 to the upper right sequencer
document.getElementById("inst_1").addEventListener("click", () => onAutoCompleteClicked(Globals.song.currentSongPart.sequencer1));
document.getElementById("inst_2").addEventListener("click", () => onAutoCompleteClicked(Globals.song.currentSongPart.sequencer2));

function renderSeq(startNote)
{
  var ul = document.getElementById('up_left');
  var ur = document.getElementById('up_right');
  var dl = document.getElementById('down_left');
  var dr = document.getElementById('down_right');
  setupSynth("#up_left", ul , startNote);
  setupSynth("#up_right", ur , startNote);
  setupSynth("#down_left", dl , startNote);
  setupSynth("#down_right", dr , startNote);
}


function setupSynth(synthId,  synthTone, startNote) {
    //TODO:FIX BUG- synthTone is undefined, maybe pass by parameter instead?
    document
      .querySelector(synthId)
      .addEventListener("trigger", ({ detail }) => {
      let SCALE_SELECT = parseInt(document.getElementById("SCALE_SELECT").value);
        switch (SCALE_SELECT) {
          case 1:
            Globals.SCALE_JUMP = Globals.MINOR_INTERVALS;
            break;
          case 2:
            Globals.SCALE_JUMP = Globals.MAJOR_INTERVALS;
            break;
        }
        for (let i = 0; i < Globals.SCALE_JUMP.length; i++) {
          Globals.CURRENT_SCALE[i] = startNote + Globals.SCALE_JUMP[i];
        }
        switch (detail.row) {
          case 0: {
            synthTone.triggerAttackRelease(
              Tone.Frequency(Globals.CURRENT_SCALE[0], "midi").toNote(),
              "4n",
              detail.time
            );
            Globals.NOTES_SELECTED_BY_USER.push(Globals.CURRENT_SCALE[0]);
            break;
          }
          case 1: {
            synthTone.triggerAttackRelease(
              Tone.Frequency(Globals.CURRENT_SCALE[1], "midi").toNote(),
              "4n",
              detail.time
            );
            Globals.NOTES_SELECTED_BY_USER.push(Globals.CURRENT_SCALE[1]);
            break;
          }
          case 2: {
            synthTone.triggerAttackRelease(
              Tone.Frequency(Globals.CURRENT_SCALE[2], "midi").toNote(),
              "4n",
              detail.time
            );
            Globals.NOTES_SELECTED_BY_USER.push(Globals.CURRENT_SCALE[2]);
            break;
          }
          case 3: {
            synthTone.triggerAttackRelease(
              Tone.Frequency(Globals.CURRENT_SCALE[3], "midi").toNote(),
              "4n",
              detail.time
            );
            Globals.NOTES_SELECTED_BY_USER.push(Globals.CURRENT_SCALE[3]);
            break;
          }
          case 4: {
            synthTone.triggerAttackRelease(
              Tone.Frequency(Globals.CURRENT_SCALE[4], "midi").toNote(),
              "4n",
              detail.time
            );
            Globals.NOTES_SELECTED_BY_USER.push(Globals.CURRENT_SCALE[4]);
            break;
          }
          case 5: {
            synthTone.triggerAttackRelease(
              Tone.Frequency(Globals.CURRENT_SCALE[5], "midi").toNote(),
              "4n",
              detail.time
            );
            Globals.NOTES_SELECTED_BY_USER.push(Globals.CURRENT_SCALE[5]);
            break;
          }
          case 6: {
            synthTone.triggerAttackRelease(
              Tone.Frequency(Globals.CURRENT_SCALE[6], "midi").toNote(),
              "4n",
              detail.time
            );
            Globals.NOTES_SELECTED_BY_USER.push(Globals.CURRENT_SCALE[6]);
            break;
          }
          case 7: {
            synthTone.triggerAttackRelease(
              Tone.Frequency(Globals.CURRENT_SCALE[7], "midi").toNote(),
              "4n",
              detail.time
            );
            Globals.NOTES_SELECTED_BY_USER.push(Globals.CURRENT_SCALE[7]);
            break;
          }
          case 8: {
            synthTone.triggerAttackRelease(
              Tone.Frequency(Globals.CURRENT_SCALE[8], "midi").toNote(),
              "4n",
              detail.time
            );
            Globals.NOTES_SELECTED_BY_USER.push(Globals.CURRENT_SCALE[8]);
            break;
          }
        }
      });
    }
