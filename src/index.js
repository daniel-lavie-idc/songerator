import * as Tone from "tone";
import * as NoteGenerator from './noteGenerator.js';
import * as Algorithm from './Algorithm.js';
import * as Globals from './globals.js';

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
    window.LAST_SCALE_DEGREE_PLAYED_BY_USER = -2; // The rightmost note played by the user, -2 means no note was chosen (-1 is silence)
    window.synthUpperLeft = new Tone.PolySynth().toDestination();
    window.synthUpperRight = new Tone.DuoSynth().toDestination();
    window.synthUpperRight.volume.value = -8; // Normalize DuoSynth volume, as it's very loud

    window.synthBottomLeft = new Tone.MetalSynth().toDestination();
    window.synthBottomLeft.volume.value = -8; // Normalize MetalSynth volume, as it's very loud

    window.synthBottomRight = new Tone.MonoSynth().toDestination();

   
      const C4 = 60;
      const C3 = 48;
      setupSynth("#up_left", window.synthUpperLeft, C4);
      setupSynth("#up_right", window.synthUpperRight, C4);
      setupSynth("#down_left", window.synthBottomLeft, C4);
      setupSynth("#down_right", window.synthBottomRight, C3);  
    //default settings
    for (let i = 0; i < window.SCALE_JUMP.length; i++) {
        window.CURRENT_SCALE[i] = window.START_NOTE + window.SCALE_JUMP[i];
    }
    Algorithm.hookStepSequencerUpdateCell(Globals.song.currentSongPart.sequencer1);
    Algorithm.hookStepSequencerUpdateCell(Globals.song.currentSongPart.sequencer2);
});
document.querySelector("tone-play-toggle").addEventListener("stop", () => Tone.Transport.stop());
//updating current scale, when the scale list is changed
document.getElementById("SCALE_SELECT").addEventListener("change", () => {
    let newNote =parseInt(document.getElementById("note_select").value);
    updateWithSelector();
    renderSeq(window.SCALE_SELECT);
   
    // TODO:PLACE HERE FUNC TO RENDER THE NEW SEQUENCER
});

//updating the root note of the step sequencer, when its dropdown list
// is being changed
document.getElementById("note_select").addEventListener("change", () => {
    let newNote =parseInt(document.getElementById("note_select").value);
    window.START_NOTE =newNote ;
    updateWithSelector();
    renderSeq(newNote);

});
function updateWithSelector()
{   let SCALE_SELECT = parseInt(document.getElementById("SCALE_SELECT").value);
    let CURRENT_SCALE = [];
     switch (SCALE_SELECT) {
        case 1:
            window.SCALE_JUMP = window.MINOR_INTERVALS;
            break;
        case 2:
            window.SCALE_JUMP = window.MAJOR_INTERVALS;
            break;
  }
    for (let i = 0; i < window.SCALE_JUMP.length; i++) {
        let currNote = window.START_NOTE + window.SCALE_JUMP[i];
        window.CURRENT_SCALE[i] = currNote;
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
  setupSynth("#up_left", window.synthUpperLeft , startNote);
  setupSynth("#up_right", window.synthUpperRight , startNote);
  setupSynth("#down_left", window.synthBottomLeft , startNote);
  setupSynth("#down_right", window.synthBottomRight , startNote);
}


function setupSynth(synthId,  synthTone, startNote) {
    //TODO:FIX BUG- synthTone is undefined, maybe pass by parameter instead?

    var SCALE_JUMP = [0, 2, 3, 5, 7, 8, 10, 12];
    document
      .querySelector(synthId)
      .addEventListener("trigger", ({ detail }) => {
      let SCALE_SELECT = parseInt(document.getElementById("SCALE_SELECT").value);
      let CURRENT_SCALE = [];
        switch (SCALE_SELECT) {
          case 1:
            SCALE_JUMP = window.MINOR_INTERVALS;
            break;
          case 2:
            SCALE_JUMP = window.MAJOR_INTERVALS;
            break;
        }
        for (let i = 0; i < SCALE_JUMP.length; i++) {
          CURRENT_SCALE[i] = startNote + SCALE_JUMP[i];
        }
        switch (detail.row) {
          case 0: {
            synthTone.triggerAttackRelease(
              Tone.Frequency(CURRENT_SCALE[0], "midi").toNote(),
              "4n",
              detail.time
            );
            window.NOTES_SELECTED_BY_USER.push(CURRENT_SCALE[0]);
            break;
          }
          case 1: {
            synthTone.triggerAttackRelease(
              Tone.Frequency(CURRENT_SCALE[1], "midi").toNote(),
              "4n",
              detail.time
            );
            window.NOTES_SELECTED_BY_USER.push(CURRENT_SCALE[1]);
            break;
          }
          case 2: {
            synthTone.triggerAttackRelease(
              Tone.Frequency(CURRENT_SCALE[2], "midi").toNote(),
              "4n",
              detail.time
            );
            window.NOTES_SELECTED_BY_USER.push(CURRENT_SCALE[2]);
            break;
          }
          case 3: {
            synthTone.triggerAttackRelease(
              Tone.Frequency(CURRENT_SCALE[3], "midi").toNote(),
              "4n",
              detail.time
            );
            window.NOTES_SELECTED_BY_USER.push(CURRENT_SCALE[3]);
            break;
          }
          case 4: {
            synthTone.triggerAttackRelease(
              Tone.Frequency(CURRENT_SCALE[4], "midi").toNote(),
              "4n",
              detail.time
            );
            window.NOTES_SELECTED_BY_USER.push(CURRENT_SCALE[4]);
            break;
          }
          case 5: {
            synthTone.triggerAttackRelease(
              Tone.Frequency(CURRENT_SCALE[5], "midi").toNote(),
              "4n",
              detail.time
            );
            window.NOTES_SELECTED_BY_USER.push(CURRENT_SCALE[5]);
            break;
          }
          case 6: {
            synthTone.triggerAttackRelease(
              Tone.Frequency(CURRENT_SCALE[6], "midi").toNote(),
              "4n",
              detail.time
            );
            window.NOTES_SELECTED_BY_USER.push(CURRENT_SCALE[6]);
            break;
          }
          case 7: {
            synthTone.triggerAttackRelease(
              Tone.Frequency(CURRENT_SCALE[7], "midi").toNote(),
              "4n",
              detail.time
            );
            window.NOTES_SELECTED_BY_USER.push(CURRENT_SCALE[7]);
            break;
          }
          case 8: {
            synthTone.triggerAttackRelease(
              Tone.Frequency(CURRENT_SCALE[8], "midi").toNote(),
              "4n",
              detail.time
            );
            window.NOTES_SELECTED_BY_USER.push(CURRENT_SCALE[8]);
            break;
          }
        }
      });
    }
