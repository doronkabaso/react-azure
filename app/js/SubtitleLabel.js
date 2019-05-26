import * as timeTagsKybrdShrtctsUtil from './KeyboardShortcuts/TimeTagsUtilits.js'

export function updateSubtitlesLabel(textLines,textTimeTuples){
    var subtitles = [];
    let pos = this.props.pos;
    let numLines = textLines.length-1;

    let startTime=0;
    let endTime=1;
    let currentTuple;

    for (let i = 0; i < numLines; i++) {
        currentTuple = textTimeTuples[i];
        startTime=currentTuple[0];
        endTime=currentTuple[1];
        if(pos > startTime && pos < endTime){
            let size = textLines[i].length;
            subtitles.push(textLines[i].substr(13,size-26));
        }
    }

    this.props.handleSubtitleUpdate(subtitles);
}

export function getSubtitleLineNo(textLines,textTimeTuples,currentPosition){
    let numLines = textLines.length-1;

    let startTime=0;
    let endTime=1;
    let currentTuple;

    for (let i = 0; i < numLines; i++) {
        currentTuple = textTimeTuples[i];
        startTime=currentTuple[0];
        endTime=currentTuple[1];
        if(currentPosition > startTime && currentPosition < endTime){
            return i;
        }
    }
    return 0;
}

export function getTimeTuples(textLines) {
    let lineTimeTuple = "";
    let textTimeTuples=[];

    for (let i = 0; i < textLines.length-1; i++) {
        lineTimeTuple = timeTagsKybrdShrtctsUtil.returnTimeCodesAsATuple(textLines[i]);
        textTimeTuples.push(lineTimeTuple);
    }

    return textTimeTuples;
}