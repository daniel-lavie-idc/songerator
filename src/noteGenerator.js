const notes = [
    // C    C#   D   D#   E    F    F#   G    G#   A   A#    B  
    [1643, 77, 420, 70, 514, 116, 606, 232, 110, 554, 299, 649],
    [86, 1750, 408, 156, 377, 152, 608, 157, 298, 277, 117, 700],
    [589, 545, 2739, 26, 607, 156, 866, 581, 125, 425, 419, 665],
    [80, 141, 21, 588, 293, 74, 263, 78, 127, 158, 58, 185],
    [429, 372, 933, 308, 3203, 139, 1065, 741, 346, 591, 300, 850],
    [120, 138, 137, 58, 207, 547, 263, 96, 113, 188, 88, 151],
    [554, 386, 813, 340, 1275, 266, 4199, 931, 396, 1058, 823, 1474],
    [304, 185, 374, 82, 703, 97, 1200, 2732, 130, 633, 406, 820],
    [124, 394, 130, 94, 333, 153, 352, 131, 865, 316, 165, 345],
    [603, 288, 563, 131, 449, 166, 976, 846, 386, 2954, 366, 1084],
    [253, 101, 446, 45, 322, 96, 831, 394, 154, 398, 992, 544],
    [504, 709, 759, 168, 994, 144, 1286, 748, 352, 1260, 543, 4083]
];

// C = 0, C# = 1, ..., B = 11
function generateNextNote() {
    const currentScale = getCurrentScale();
    console.log("Current scale: " + currentScale)
    //scaleNotes gets the array of notes to choose from
    const scaleNotes = getNotesInMajorScale(currentScale); // Array of notes
    console.log("scaleNotes: " + scaleNotes)

    // Assuming the user chose only a single note
    const inputNoteFromUser = getInputNoteFromUser();
    console.log("Input from user: " + inputNoteFromUser)

    const currentNotePosibillities = notes[inputNoteFromUser]
    console.log("currentNotePosibillities: " + currentNotePosibillities)

    // TODO: Add silence probability
    var notesInScaleToPosibillities = {}

    scaleNotes.forEach((currentNote) => {
        notesInScaleToPosibillities.set(currentNote, currentNotePosibillities[currentNote]);
    }
    );

    var totalPossibilitySpace = 0;
    notesInScaleToPosibillities.forEach((note, value_in_table) => {
        totalPossibilitySpace += value_in_table;
    });

    // Calculating notes probabilities by taking number of occurences and dividing by the total number of occurences
    // const notesProbabilities = notesInScaleToPosibillities.map(x => x / totalPossibilitySpace);
    // Generate a random number between 0 - totalPossibilitySpace

    const randomNumber = getRandomInt(totalPossibilitySpace);
    var sumOfOccurences = 0;
    scaleNotes.forEach((currentNote) => {
        sumOfOccurences += notesInScaleToPosibillities[currentNote];
        if (randomNumber < sumOfOccurences) {
            return currentNote;
        }
    });
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getCurrentScale() {
    const nodeSelect = document.getElementById("note_select");
    return parseInt(nodeSelect.options[nodeSelect.selectedIndex].getAttribute("noteIndex"));
}

function getInputNoteFromUser() {
    // Assuming a single number which represent a note
    return window.NOTES_SELECTED_BY_USER[-1];
}

function getNotesInMajorScale(rootNote) {
    return [rootNote,
        getNoteByInterval(rootNote, 2),
        getNoteByInterval(rootNote, 3),
        getNoteByInterval(rootNote, 5),
        getNoteByInterval(rootNote, 7),
        getNoteByInterval(rootNote, 8),
        getNoteByInterval(rootNote, 10)];
}

function getNoteByInterval(originalNote, interval) {
    return ((originalNote + interval) % 12);
}




export { generateNextNote }; // a list of exported items