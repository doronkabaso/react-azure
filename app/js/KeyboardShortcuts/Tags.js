import {Value} from 'slate';
import * as tagUtils from './TimeTagsUtilits';
import {tagsLabels} from '../../strings/tagsLabels';
import {desktopVersion} from "../../Root/config";

export function keyDownKybrd(event, change, tagLeftToAllLines = false) {
    let curLineText = change.value.anchorText.text;
    let key = change.value.anchorKey;
    let offset = change.value.anchorOffset;
    let timeTagsHandle = new tagUtils.readTimeCode(curLineText);
    let timeTagsLocation = timeTagsHandle.getTagsLocation();

    TimeTags = TimeTags.bind(this);
    SlateShortcuts = SlateShortcuts.bind(this);

    TimeTags(event, change, key, offset, curLineText, timeTagsLocation, timeTagsHandle.getStartTimePos(), tagLeftToAllLines);
    SlateShortcuts(event, change, key, offset, curLineText, timeTagsLocation);
}

function SlateShortcuts(event, change, key, offset, curLineText, timeTagsLocation) {

    // Speaker side - alt y
    if (event.keyCode === 89 && event.altKey) {
        if (timeTagsLocation !== "failed") {
            removeExistingSpeakerTag(curLineText,change,key);
            change.insertTextByKey(key, 13, tagsLabels.rightSpeakerTag);
        }
    }

    // Speaker side - alt s
    if (event.keyCode === 83 && event.altKey) {
        if (timeTagsLocation !== "failed") {
            removeExistingSpeakerTag(curLineText,change,key);
            change.insertTextByKey(key, 13, tagsLabels.leftSpeakerTag);
        }
    }

    if (!desktopVersion) {
        //alt+speaker_id ==> Add a speaker id tag
        if (event.keyCode >= 49 && event.keyCode <= 57 && event.altKey) {
            if (timeTagsLocation !== "failed") {
                removeExistingSpeakerTag(curLineText,change,key);
                change.insertTextByKey(key, 13, tagsLabels.speakerIdPrefix + String(event.keyCode - 48) + '>')
            }
        }
    }


    // replace speaker side - alt r
    if (event.keyCode === 82 && event.altKey) {
        let editorObjectAsJSON = this.state.value.toJSON();
        editorObjectAsJSON = tagUtils.swapTags(editorObjectAsJSON);

        let editorValueFormat = Value.fromJSON(editorObjectAsJSON);

        this.setState({
            value: editorValueFormat
        });

        //--Keeps the focus on the editor after setState--
        change.value = editorValueFormat;
        change.focus();
        //-- --
    }



    if (event.keyCode === 90 && event.ctrlKey) {
        change.undo();
    }

    if (event.keyCode === 89 && event.ctrlKey) {
        change.redo();
    }

    if (event.keyCode === 77) { //alt+m - adding laugh
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.laughterTag)
        }
        if (event.ctrlKey) {
            let json = JSON.parse(localStorage.getItem('tagger-json'));
            let mTranscript = json.subtitles;
            change.insertText(mTranscript);
        }
    }

    if (event.keyCode === 78) {
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.voiceMailTag)
        }
    }

    if (event.keyCode === 85) { //alt+u ==> computer environment sound
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.computerEnvSound)
        }
    }

    if (event.keyCode === 73) { //alt+i ==> Bell sound - call hangup
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.bell)
        }
    }

    if (event.keyCode === 75) { //alt+k ==> Tactical PTT Noise
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.tacticalPTT_Noise)
        }
    }

    if (event.keyCode === 90) { //alt+z ==> Praying Noise
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.praying)
        }
    }

    if (event.keyCode === 88) { //alt+x ==> Vehicle Noise
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.vehicle)
        }
    }

    if (event.keyCode === 86) { //alt+v ==> Television Noise
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.television)
        }
    }

    if (event.keyCode === 188) { //alt+<(actually Alt+.) ==> Door slam
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.doorSlam)
        }
    }

    if (event.keyCode === 190) { //alt+>(actually Alt+,) ==> Cleaning Noise
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.cleaningNoise)
        }
    }

    // cry - alt c
    if (event.keyCode === 67) {
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.cryingTag)
        }
    }

    if (event.keyCode === 87) {
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.hesitationTag)
        }
    }

    if (event.keyCode === 66) {
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.breathingTag)
        }
    }

    if (event.keyCode === 84) {
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.coughingTag)
        }
    }

    if (event.keyCode === 79) {
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.cluckingTag);
        }
    }

    if (event.keyCode === 72) {
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.humanBackgroundNoiseTag)
        }
    }

    if (event.keyCode === 71) {
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.stutteringTag)
        }
    }

    if (event.keyCode === 81) {
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.hummingTag)
        }
    }

    if (event.keyCode === 80) {
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.incoherentTag);
        }
    }

    if (event.keyCode === 74) {
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.nonHumanBackgroundNoiseTag)
        }
    }

    if (event.keyCode === 76) {
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.phoneInterfaceNoiseTag)
        }
    }

    if (event.keyCode === 65) {
        if (event.altKey) {
            change.insertTextByKey(key, offset, tagsLabels.lineInterferenceTag)
        }
    }
}

function TimeTags(event, change, key, offset, curLineText, timeTagsLocation, startTimePos, tagLeftToAllLines) {
    let length = curLineText.length;

    if (event.key === 'Backspace' || event.key === 'Delete') {//Perform a custom delete if the placeholder is on a time tag
        if (timeTagsLocation !== "failed") {
            if (offset >= 1 && offset <= 13) { //remove from start
                event.preventDefault();
                change.removeTextByKey(key, 0, 13);
                return;
            }
            if (offset >= length - 12 && timeTagsLocation === "both") { //remove from end
                event.preventDefault();
                change.removeTextByKey(key, length - 12, 13);
                return;
            }
        }
    }

    if ((event.keyCode === 96 && event.ctrlKey) || (event.keyCode === 48 && event.ctrlKey)) {
        event.preventDefault();

        if (timeTagsLocation !== "both")//cant add more than 2 time codes
        {
            let pos = this.props.positionGetter();
            let time = tagUtils.formatRawPOS(pos);
            offset = 0;

            // append in the begining
            if (timeTagsLocation === "failed" || timeTagsLocation === "end") {
                if (tagLeftToAllLines) {
                    time = time + "<>";
                }
                change.insertTextByKey(key, 0, time);
                // append in the end
            }
            else if (timeTagsLocation === "start") {
                offset = curLineText.length;
                change.insertTextByKey(key, offset, time);

            }
        }
    }
}

function removeExistingSpeakerTag(curLineText,change,key){
    let curTag = tagUtils.getSpeakerTag(curLineText);
    if (curTag !== false) {
        let curTagLength = curTag.length;
        if (curTag===tagsLabels.speakerIdPrefix){
            curTagLength+=2;//Suffix is added later
        }
        change.removeTextByKey(key, 13, curTagLength);
    }
}