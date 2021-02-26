var demo1 = {
    START_NOTE = 60,
    SCALE_SELECT = "major",
    sequencer1 = arrayToList[[4,0], [6,1], [6,2], [5,4], [7,5], [7,6], [8,8], [7,9], 
    [6,10], [5,11], [4,12], [4,13], [4,14]],
    sequencer2 = [],
    sequencer3 = [],
    sequencer4 = []
}

function arrayToList(arr){
    var sequencer = []
    for(i=0; i<8; i++){
       var row = []
       for(j=0; i<16; i++){
          row.push(false)
      }
    sequencer.push([row])
    }

    for(i=0; i<arr.length(); i++){
        sequencer[arr[i][0]][arr[i][1]] = true
    }
    return sequencer
}
