import {tagsLabels} from '../../strings/tagsLabels'

export function formatRawPOS(pos) {
    var h = parseInt(pos / 3600); //Hours
    var m = parseInt((pos % 3600) / 60);
    var s = parseInt((pos % 3600) % 60);
    var f = parseInt((pos % 1) * 100);

    var result = getTimeInFormat(h, m, s, f);
    return result;
}

function getTimeInFormat(h, m, s, f) {
    var result = "[" + zeroPad(h, 2) + ":" + zeroPad(m, 2) + ":" + zeroPad(s, 2) + "." + zeroPad(f, 2) + "]"
    return result
}

export function returnTimeCodesAsATuple(inputLine) {
    let startTime = new timeCodeObject();
    let endTime = new timeCodeObject();
    let gotStart = false;
    let gotEnd = false;
    let startTimePOS = undefined;
    let endTimePOS = undefined;

    if (inputLine.length >= 13) {
        gotStart = startTime.parseFromString(inputLine);
        if (inputLine.length >= 26) {
            inputLine = inputLine.substr(inputLine.length - 13, 13);
            gotEnd = endTime.parseFromString(inputLine);
        }
    }

    if (gotStart) {
        startTimePOS = startTime.timeToPOS();
    }
    if (gotEnd) {
        endTimePOS = endTime.timeToPOS()
    }

    return [startTimePOS, endTimePOS]
}

export function replaceSpeakerTag(inputLine, newTag) {
    let length = inputLine.length;

    let newTagEndingIndex = 13+newTag.length;

    inputLine = inputLine.substr(0, 13) + newTag + inputLine.substr(newTagEndingIndex, length)

    return inputLine;
}

export function getSpeakerTag(inputLine) {
    let tag = inputLine.substr(13, 8);

    if (tag.startsWith(tagsLabels.rightSpeakerTag))
        return tagsLabels.rightSpeakerTag;
    if (tag.startsWith(tagsLabels.leftSpeakerTag))
        return tagsLabels.leftSpeakerTag;
    if (tag.startsWith(tagsLabels.speakerIdPrefix))
        return tagsLabels.speakerIdPrefix;
    return false;
}

export function swapTags(slateDocumentAsJSON) {
    slateDocumentAsJSON.document.nodes.forEach(function (x) {
        let text = x.nodes[0].leaves[0].text;
        let tagIndication = getSpeakerTag(text);

        if (tagIndication === false)
            return;
        if (tagIndication === tagsLabels.rightSpeakerTag)
            x.nodes[0].leaves[0].text = replaceSpeakerTag(text, tagsLabels.leftSpeakerTag)
        if (tagIndication === tagsLabels.leftSpeakerTag)
            x.nodes[0].leaves[0].text = replaceSpeakerTag(text, tagsLabels.rightSpeakerTag)
    });

    return slateDocumentAsJSON;
}

export function readTimeCode(inputLine) {
    let startTime = new timeCodeObject();
    let endTime = new timeCodeObject();
    let content = "";
    let gotStart = false;
    let gotEnd = false;

    if (inputLine.length >= 13) {
        gotStart = startTime.parseFromString(inputLine);
        content = inputLine.substring(13, inputLine.length - 13);
        if (inputLine.length >= 14) {
            inputLine = inputLine.substr(inputLine.length - 13, 13);
            gotEnd = endTime.parseFromString(inputLine);
        }
    }

    let result = "";

    if (gotStart && gotEnd) {
        result = "both";
    } else if (gotStart && !gotEnd) {
        result = "start";
    } else if (!gotStart && gotEnd) {
        result = "end";
    } else {
        result = "failed";
    }

    this.getTagsLocation = function () {
        return result;
    };

    this.getStartTimePos = function () {
        return startTime.timeToPOS();
    };

    this.getEndTimePos = function () {
        return endTime.timeToPOS();
    }
}

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

export function timeCodeObject() {
    this.h = 0;
    this.m = 0;
    this.s = 0;
    this.f = 0;
    this.empty = true;

    this.strVal = function () {
        var result = "";
        if (this.empty) {
            return result
        }

        result = getTimeInFormat(h, m, s, f)
        return result
    };

    this.timeToPOS = function () {
        var result = 0;
        result = this.f / 100 + this.s + this.m * 60 + this.h * 3600;
        return result;
    }

    this.parseFromString = function (str) {
        if ((str.charAt(0) == "[") && (str.charAt(3) == ":") && (str.charAt(6) == ":") && (str.charAt(9) == ".") && (str.charAt(12) == "]") &&
            (/^\d+$/.test(str.charAt(1))) && (/^\d+$/.test(str.charAt(2))) && (/^\d+$/.test(str.charAt(4))) && (/^\d+$/.test(str.charAt(5))) && (/^\d+$/.test(str.charAt(7))) && (/^\d+$/.test(str.charAt(8))) && (/^\d+$/.test(str.charAt(10))) && (/^\d+$/.test(str.charAt(11)))) {
            this.h = parseInt(str.charAt(1) + str.charAt(2));
            this.m = parseInt(str.charAt(4) + str.charAt(5));
            this.s = parseInt(str.charAt(7) + str.charAt(8));
            this.f = parseInt(str.charAt(10) + str.charAt(11));
            this.empty = false;
            return true;
        } else {
            this.empty = true;
            return false;
        }
    }
}