import * as tagUtils from './KeyboardShortcuts/TimeTagsUtilits';

import * as consts from '../Root/config';

import {desktopVersion} from "../Root/config";

export function updateDecorations(event, change, pos, value, missingKeywords, selectedLineNo) {
    const texts = value.document.getTextsAsArray();
    let resDecoration;
    let decorations = [];
    let prevNode;
    selectedLineNo = selectedLineNo +1;
    texts.forEach((node, index) => {
        if (index!==selectedLineNo) {
            let {key, text} = node;

            resDecoration = grammerUnderlineWords(key, text, missingKeywords);
            if (resDecoration.length !== 0)
                decorations = decorations.concat(resDecoration);

            if (index > 0) {
                let prevLineText = texts[index - 1].text;
                resDecoration = highlightLines(event, change, key, text, pos, value, prevLineText);
            } else {
                resDecoration = highlightLines(event, change, key, text, pos, value, undefined);
            }


            if (resDecoration !== undefined) {
                if (resDecoration.isPrevLine) {
                    if (index > 0) {
                        let prevLineText = texts[index - 1].text;
                        let {key} = prevNode;
                        resDecoration.anchorKey = key;
                        resDecoration.focusKey = key;
                        resDecoration.anchorOffset = 0;
                        resDecoration.focusOffset = prevLineText.length;
                    }
                }
                decorations.push(resDecoration);

            }
        }
        prevNode = node;

    });
    commitDecorations(change, decorations);
}

function grammerUnderlineWords(key, text, missingKeywords) {
    let lineDecorations = [];

    if (missingKeywords===undefined)
        return [];

    missingKeywords.forEach((keyword)=>{
        let position=0;

        while(text.indexOf(keyword,position)>-1){
            let index = text.indexOf(keyword,position);
            lineDecorations.push(decorate(key,index,index+keyword.length,'grammerUnderline'))
            position = index+keyword.length;
        }
    });

    return lineDecorations;
}

export function notExistSpeakerTag(lineText) {
    if (lineText!==undefined) {
        let timeTagsHandle = new tagUtils.readTimeCode(lineText);
        let timeTagsLocation = timeTagsHandle.getTagsLocation();

        if (timeTagsLocation === 'both') {
            let matchShortcutEvents = lineText.match(/{[\u0590-\u05fe]+}/g);
            let numberShortcutEvents = (matchShortcutEvents !== null ) ? matchShortcutEvents.length : 0;
            lineText = lineText.replace(/\[[0-9.:]+\]/g,''); //remove time tags
            let matchTxtWords = lineText.match(/[\u0590-\u05fe\u0621-\u064A0-9]+/g);
            let numberOfTxtWords = (matchTxtWords !== null) ? matchTxtWords.length : 0;

            if (desktopVersion && matchTxtWords && matchTxtWords.length > numberShortcutEvents) {
                return (  !lineText.includes(consts.rightTag) && !lineText.includes(consts.leftTag));
            }
            if (numberOfTxtWords === numberShortcutEvents && numberOfTxtWords == 0) {
                return true;
            }
        }
    }
    return false;
}

export function findNonAlphaNumericCharacters(lineText) {
    if (lineText.includes(consts.notAllowedSpecialCharacters)) {
        return true;
    }
    return false;
}

export function isLineDoesNotHaveBothTimeTags(lineText) {
    if (lineText!==undefined && lineText.trim() !== "") {
        let endTimeTagStr = lineText.substring(lineText.length-13,lineText.length);
        let endTimeTagMatch = endTimeTagStr.match(/:.[0-9]+/g);
        let lenEndTimeTagMatch = (endTimeTagMatch !== null) ? endTimeTagMatch.length : 0;
        let startTimeTagStr = lineText.substring(0,13);
        let startTimeTagMatch = startTimeTagStr.match(/:.[0-9]+/g);
        let lenStartTimeTagMatch = (startTimeTagMatch !== null) ? startTimeTagMatch.length : 0;
        if ((lenEndTimeTagMatch !== 2 || lenStartTimeTagMatch !== 2 || startTimeTagStr===endTimeTagStr) && lineText.trim() !== ""  && lineText.length > 2 ) {
            return true;
        }
    }
    return false;
}

export function containsWordsThatAreNotEvents(lineText) {
    if (lineText.length > 26) {
        let startTimeTagStr = lineText.substring(0,13);
        let endTimeTagStr = lineText.substring(lineText.length-13,lineText.length);
        lineText = lineText.replace(startTimeTagStr,'');
        lineText = lineText.replace(endTimeTagStr,'');
        return (lineText.match(/[^{][\u0621-\u064A]+[^}]/) !== null);
    } else {
        return false;
    }
}

export function startTimeExists(lineText) {
    let timeTagsHandle = new tagUtils.readTimeCode(lineText);
    let startPos = timeTagsHandle.getStartTimePos();
    let startTimeTagStr = lineText.substring(0,13);
    let startTimeTagMatch = startTimeTagStr.match(/:.[0-9]+/g);
    return (startPos >= 0 && startTimeTagMatch !==null && startTimeTagMatch.length>0);
}

function highlightLines(event, change, key, text, pos, value, prevLineText) {
    let timeTagsHandle = new tagUtils.readTimeCode(text);
    let timeTagsLocation = timeTagsHandle.getTagsLocation();
    let startPos = timeTagsHandle.getStartTimePos();
    let endPos = timeTagsHandle.getEndTimePos();

    if (timeTagsLocation === 'both' && endPos - startPos >= consts.MAX_LINE_DIFF_HIGHLIGHT) {
        if ((event.key === 'Backspace' || event.key === 'Delete') && key === change.value.anchorKey) {
            let offset = change.value.anchorOffset;

            if (!(offset === 0 || offset >= text.length - 12)) {//!(deleting a tag)
                return decorate(key, 0, text.length, 'highlight');
            }
        }
        else {
            if (containsWordsThatAreNotEvents(text)) {
                return decorate(key, 0, text.length, 'highlight');
            }

        }
    } else if (timeTagsLocation === 'both' && Math.abs(endPos - startPos) <= consts.MIN_LINE_DIFF_HIGHLIGHT) {
        return decorate(key, 0, text.length, 'highlightBelowMinTime');
    } else if (isLineDoesNotHaveBothTimeTags(prevLineText)) {
        return decorate(key, 0, text.length, 'highlightNotExistBothTimeTags', true);
    } else if (notExistSpeakerTag(prevLineText)) {
        return decorate(key, 0, text.length, 'highlightMissingSpekaerTag', true);
    }


    //add time-tag
    if (event.keyCode === 96 && event.ctrlKey) {
        if (timeTagsLocation === 'start' || timeTagsLocation === 'end') {
            if (timeTagsLocation === 'start') {
                endPos = pos;
            }
            else {
                startPos = pos;
            }
            if (endPos - startPos >= 15) {
                if (containsWordsThatAreNotEvents(text)) {
                    return decorate(key, 0, text.length, 'highlight');
                }
            }
        }
    }
}

function decorate(key, from, to, type, isPrevLine = false) {
    return ({
        anchorKey: key,
        anchorOffset: from,
        focusKey: key,
        focusOffset: to,
        marks: [{type: type}],
        isPrevLine: isPrevLine
    })
}

function commitDecorations(change, decorations) {
    change
        .setOperationFlag('save', false)
        .setValue({decorations})
        .setOperationFlag('save', true);
}