import * as Tone from "tone";
import * as NoteGenerator from './noteGenerator.js';
import * as Algorithm from './Algorithm.js';

window.addEventListener('load', () => {
  setupSynth("#up_left", window.SYNTH_UPPER_LEFT, window.C4);
  setupSynth("#up_right", window.SYNTH_UPPER_RIGHT, window.C4);
  setupSynth("#down_left", window.SYNTH_BOTTOM_LEFT, window.C4);
  setupSynth("#down_right", window.SYNTH_BOTTOM_RIGHT, window.C3);

  //default settings
  for (let i = 0; i < window.SCALE_JUMP.length; i++) {
  window.SYNTH_UPPER_LEFT = new Tone.PolySynth().toDestination();
  window.SYNTH_UPPER_RIGHT = new Tone.DuoSynth().toDestination();
  window.SYNTH_UPPER_RIGHT.volume.value = -8; // Normalize DuoSynth volume, as it's very loud

  window.SYNTH_BOTTOM_LEFT = new Tone.MetalSynth().toDestination();
  window.SYNTH_BOTTOM_LEFT.volume.value = -8; // Normalize MetalSynth volume, as it's very loud
  window.SYNTH_BOTTOM_RIGHT = new Tone.MonoSynth().toDestination();    
  window.CURRENT_SCALE[i] = window.SONG.currentSongPart.startNote + window.SCALE_JUMP[i];
  }
  Algorithm.hookStepSequencerUpdateCell(window.SONG.currentSongPart.sequencer1);
  Algorithm.hookStepSequencerUpdateCell(window.SONG.currentSongPart.sequencer2);
  updateWithSelector();
});

//document.querySelector("tone-play-toggle").addEventListener("stop", () => Tone.Transport.stop());

//updating current scale, when the scale list is changed
document.getElementById("SCALE_SELECT").addEventListener("change", () => {
  window.newNote = parseInt(document.getElementById("note_select").value);
  updateWithSelector();
  renderSeq(window.SONG.currentSongPart.startNote);
  // TODO:PLACE HERE FUNC TO RENDER THE NEW SEQUENCER
});

//updating the root note of the step sequencer, when its dropdown list
// is being changed
document.getElementById("note_select").addEventListener("change", () => {
  let newNote = parseInt(document.getElementById("note_select").value);
  window.SONG.currentSongPart.startNote = newNote;
  updateWithSelector();
  renderSeq(newNote);
});

function updateWithSelector() {
  window.SCALE_SELECT = parseInt(document.getElementById("SCALE_SELECT").value);
  switch (window.SCALE_SELECT) {
    case 1:
      window.SCALE_JUMP = window.MINOR_INTERVALS;
      break;
    case 2:
      window.SCALE_JUMP = window.MAJOR_INTERVALS;
      break;
  }
  for (let i = 0; i < window.SCALE_JUMP.length; i++) {
    let currNote = window.SONG.currentSongPart.startNote + window.SCALE_JUMP[i];
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
  window.note_arr = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return window.note_arr[currNote % 12];
}

//when clicked on Auto Compwindow.e, fill the rest of the sequencer
function onAutoCompleteClicked(sequencer) {
  if (sequencer.lastNoteDegree == null) {
    console.log("No note was chosen by the user");
    return;
  }
  Algorithm.fillUp(sequencer);
}

//inst_1 refers to the upper left sequencer, inst_2 to the upper right sequencer
document.getElementById("inst_1").addEventListener("click", () => onAutoCompleteClicked(window.SONG.currentSongPart.sequencer1));
document.getElementById("inst_2").addEventListener("click", () => onAutoCompleteClicked(window.SONG.currentSongPart.sequencer2));

function renderSeq(startNote) {
  var ul = document.getElementById('up_left');
  var ur = document.getElementById('up_right');
  var dl = document.getElementById('down_left');
  var dr = document.getElementById('down_right');  
  
  //setupSynth("#up_left", window.SYNTH_UPPER_LEFT, startNote);
  //setupSynth("#up_right", window.SYNTH_UPPER_RIGHT, startNote);
  //setupSynth("#down_left", window.SYNTH_BOTTOM_LEFT, startNote);
  //setupSynth("#down_right", window.SYNTH_BOTTOM_RIGHT, startNote);
}


function setupSynth(synthId, synthTone, startNote) {
  //TODO:FIX BUG- synthTone is undefined, maybe pass by parameter instead?
  console.log("In setupSynth function")
  document
    .querySelector(synthId)
    .addEventListener("trigger", ({ detail }) => {
      console.log("In trigger function");
      window.SCALE_SELECT = parseInt(document.getElementById("SCALE_SELECT").value);
      switch (window.SCALE_SELECT) {
        case 1:
          window.SCALE_JUMP = window.MINOR_INTERVALS;
          break;
        case 2:
          window.SCALE_JUMP = window.MAJOR_INTERVALS;
          break;
      }
      for (let i = 0; i < window.SCALE_JUMP.length; i++) {
        window.CURRENT_SCALE[i] = startNote + window.SCALE_JUMP[i];
      }

      console.log("Before switch in trigger function");

      console.log("detail.row: " + detail.row);
      console.log("detail.time: " + detail.time);

      switch (detail.row) {
        case 0: {
          synthTone.triggerAttackRelease(
            Tone.Frequency(window.CURRENT_SCALE[0], "midi").toNote(),
            "4n",
            detail.time
          );
          window.NOTES_SELECTED_BY_USER.push(window.CURRENT_SCALE[0]);
          break;
        }
        case 1: {
          synthTone.triggerAttackRelease(
            Tone.Frequency(window.CURRENT_SCALE[1], "midi").toNote(),
            "4n",
            detail.time
          );
          window.NOTES_SELECTED_BY_USER.push(window.CURRENT_SCALE[1]);
          break;
        }
        case 2: {
          synthTone.triggerAttackRelease(
            Tone.Frequency(window.CURRENT_SCALE[2], "midi").toNote(),
            "4n",
            detail.time
          );
          window.NOTES_SELECTED_BY_USER.push(window.CURRENT_SCALE[2]);
          break;
        }
        case 3: {
          synthTone.triggerAttackRelease(
            Tone.Frequency(window.CURRENT_SCALE[3], "midi").toNote(),
            "4n",
            detail.time
          );
          window.NOTES_SELECTED_BY_USER.push(window.CURRENT_SCALE[3]);
          break;
        }
        case 4: {
          synthTone.triggerAttackRelease(
            Tone.Frequency(window.CURRENT_SCALE[4], "midi").toNote(),
            "4n",
            detail.time
          );
          window.NOTES_SELECTED_BY_USER.push(window.CURRENT_SCALE[4]);
          break;
        }
        case 5: {
          synthTone.triggerAttackRelease(
            Tone.Frequency(window.CURRENT_SCALE[5], "midi").toNote(),
            "4n",
            detail.time
          );
          window.NOTES_SELECTED_BY_USER.push(window.CURRENT_SCALE[5]);
          break;
        }
        case 6: {
          synthTone.triggerAttackRelease(
            Tone.Frequency(window.CURRENT_SCALE[6], "midi").toNote(),
            "4n",
            detail.time
          );
          window.NOTES_SELECTED_BY_USER.push(window.CURRENT_SCALE[6]);
          break;
        }
        case 7: {
          synthTone.triggerAttackRelease(
            Tone.Frequency(window.CURRENT_SCALE[7], "midi").toNote(),
            "4n",
            detail.time
          );
          window.NOTES_SELECTED_BY_USER.push(window.CURRENT_SCALE[7]);
          break;
        }
        case 8: {
          synthTone.triggerAttackRelease(
            Tone.Frequency(window.CURRENT_SCALE[8], "midi").toNote(),
            "4n",
            detail.time
          );
          window.NOTES_SELECTED_BY_USER.push(window.CURRENT_SCALE[8]);
          break;
        }
      }
    });
}
