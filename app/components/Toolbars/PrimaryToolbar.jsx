import React from 'react'
import {connect} from 'react-redux';
import {Button, Label} from 'semantic-ui-react';
import Dropzone from 'react-dropzone'
import ReactTooltip from 'react-tooltip';
import mediaActions from '../../actions/Media.actions';
import editorActions from '../../actions/Editor.actions';
import {fetchWrapper} from '../../js/ServerCommunication'
import {getTranscript} from '../../js/TranscriptExtractor'
import HelpDialog from './HelpDialog'
import MetadataDialog from './MetadataDialog'
import {
    leftTag,
    rightTag,
    jsonKeyToLocalStorage,
    UILanguage,
    UIDirection,
    Directions,
    supportedTranscriptionLanguages,
    ServerUrlBase,
    supportedTranscriptionGenders,
    supportedTranscriptionSides,
    supportedLanguages,
    ArabLanguageShortName,
    MIN_LINE_DIFF_HIGHLIGHT,
    userArenaNumber,
    supportedArenaOptions,
    goTaggerUsername,
    goTagger,
    supportedAudioTypes,
    defaultType,
    emptyValue,
    desktopVersion
} from '../../Root/config'

import {labels} from '../../strings/labels'
import {tagsLabels} from '../../strings/tagsLabels'
import {transcriptionValidationLabels} from '../../strings/transcriptionValidationLabels'
import UserModal from './UserModal'
import LanguageDropdown from './LanguageDropdown.jsx';
import * as tagUtils from '../../js/KeyboardShortcuts/TimeTagsUtilits';
import * as importMediaUtils from '../../js/ImportMedia';
import {findNonAlphaNumericCharacters, notExistSpeakerTag, isLineDoesNotHaveBothTimeTags, containsWordsThatAreNotEvents, startTimeExists} from '../../js/Decorations'

import AlertModal from './AlertModal';
import ConfirmationModal from './ConfirmationModal';
import ArenaModal from "./ArenaModal";
import TaggedDataSidebar from './TaggedDataSidebar';
import AudioTypeDropdown from './AudioTypeDropdown';
import * as downloadUtils from "../../js/DownloadTranscription";

require('../../sass/main.scss');

const imgPath = 'assets/img/';
class PrimaryToolbarHelper extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isHelpDialogOpen: false,
            isMetadataDialogOpen: false,
            openModal: false,
            isOpenAlertMessage: false,
            isOpenLeftTagMessage: false,
            isArenaModalOpen: false,
            taggedDataSidebarOpen: false,
            searchFieldValue: "",
            mAudioType: defaultType,
            mLanguage: defaultType,
            responseFromBackend: '',
            showSaveToHbaseMessage: false,
            saveToHbaseMessage: ''
        };
        this.toolBarDirectionClass = UIDirection === Directions.RTL ? ' rtlToolBar ' : ' ltrToolBar ';
    }

    componentDidMount() {
        if (!localStorage.getItem(userArenaNumber)) {
            this.setState({isArenaModalOpen: true});
        }
        this.props.updateAudioType("gsm");
        this.props.updateLanguage("Farsi");
    }

    handleTranscriptValidationError = (error) => {
        let displayMsg = transcriptionValidationLabels.validationFailedMessage[UILanguage];
        displayMsg += '\n';
        displayMsg += error.message;
        alert(displayMsg);
        this.shiftFocusToSlateEditor();
    };

    shiftFocusToSlateEditor = () => {
        let textEditorContainingDiv = document.getElementById('subtitleTextArea');
        let textEditorRootElement = textEditorContainingDiv.children[0];
        textEditorRootElement.click();
    }

    validateTranscript = () => {
        let transcript = getTranscript();
        let isArabLanguage=true;
        // let isArabLanguage = true;
        // this.props.language == ArabLanguageShortName ? isArabLanguage=true : isArabLanguage=false;
        if (this.isPersianLanguage()) {
            isArabLanguage=false;
        }
        let transcriptValidationRequest = {
            Language: isArabLanguage,
            Content: transcript,
            isArab: isArabLanguage
        };
        this.validateTranslatedLanguageContent(transcriptValidationRequest);


    };

    isPersianLanguage = () => {
        return (this.props.language == supportedTranscriptionLanguages[6].value)
    }


    validateTranslatedLanguageContent = (transcriptValidationRequest) => {
        fetchWrapper({
            url: ServerUrlBase + 'api/validate',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(transcriptValidationRequest),
            onReceive: (response) => this.handleTranscriptValidationSuccess(response),
            onError: this.handleTranscriptValidationError
        });
    }

    handleTranscriptValidationSuccess = (response) => {
        if (JSON.parse(response).MissingKeywords !== undefined) {
            this.props.updateMissingKeywords(this.props.language, JSON.parse(response).MissingKeywords);
            this.props.toggleRenderMarkErrors(true);
        }
        else {
            alert('Server did not return response for language: ' + this.state.language);
        }
        this.props.updateIsLoading(false);
        this.shiftFocusToSlateEditor();
    };





    closeHelpDialog = () => {
        this.setState({isHelpDialogOpen: false});
    };

    openHelpDialog = () => {
        this.setState({isHelpDialogOpen: true});
    };

    toggleHelpIcons = () => {
        if (!this.props.isHelpIconsOpen) {
            this.setState({isMetadataDialogOpen: false});
        }
        let isHelpIconsOpen = !this.props.isHelpIconsOpen;
        this.props.updateIsHelpIconsOpen(isHelpIconsOpen);
    }

    closeMetadataDialog = () => {
        // remove speakers in editing mode
        let speakers = this.props.speakers;
        this.props.updateSpeakers(speakers.filter(speaker => speaker.editing !== true));
        this.setState({isMetadataDialogOpen: false});
        this.props.isUpdatingTranscript(true);

    };

    closeArenaModal = () => {
        this.setState({isArenaModalOpen: false});
    }

    openMetadataDialog = () => {
        this.props.isUpdatingTranscript(false);
        this.setState({isMetadataDialogOpen: true});
        this.props.updateIsHelpIconsOpen(false);
    };

    handleChooseArena = (value) => {
        localStorage.setItem(userArenaNumber,value);
        this.props.setArenaNumber(value);
    }

    openModal = () => {
        this.setState({
            openModal: true
        });
        this.openAlertMessage();
    };

    closeModal = () => {
        this.setState({
            openModal: false
        });
    };

    updateLanguage = (event, choice) => {
        this.props.updateLanguage(choice.value);
        this.setState({mLanguage:choice.value});
    };

    editSpeaker = (newData, id) => {
        let speakers = this.props.speakers;
        let mSpeakers = speakers.map(
            speaker => (speaker.id !== id) ? speaker : {
                ...speaker,
                name: newData.name,
                language: newData.language,
                gender: newData.gender,
                side: newData.side,
                editing: newData.editing
            }
        )
        this.props.updateSpeakers(mSpeakers);
        this.updateSpeakersInLocalStorage(mSpeakers)
    }

    removeSpeaker = (id) => {
        let speakers = this.props.speakers;
        let mSpeakers = speakers.filter(speaker => speaker.id !== id)
            .map(speaker => {
                if (speaker.id < id) {
                    return speaker
                } else {
                    let temp = speaker.id - 1;
                    return {...speaker, id: temp}
                }
            })
        this.props.updateSpeakers(mSpeakers);
        this.updateSpeakersInLocalStorage(mSpeakers)
    }

    addSpeaker = () => {
        let speakers = this.props.speakers;
        let mSpeakers = speakers.concat({
            id: this.nextId(),
            name: "",
            language: supportedTranscriptionLanguages[0],
            gender: supportedTranscriptionGenders[0],
            side: supportedTranscriptionSides[0],
            editing: true
        })
        this.props.updateSpeakers(mSpeakers);
        this.updateSpeakersInLocalStorage(mSpeakers)
    }

    updateSpeakersInLocalStorage = (speakers) => {
        let json = JSON.parse(localStorage.getItem(jsonKeyToLocalStorage));
        if (json) {
            json.speakers = speakers;
            localStorage.setItem(jsonKeyToLocalStorage, JSON.stringify(json));
        }
    }
    nextId = () => {
        this.uniqueId = this.props.speakers.length + 1
        return this.uniqueId++
    }

    onDropMetadataHandler = (files) => {
        var file = files[0];
        let reader = new FileReader();
        reader.onload = (event) => {
            let json = JSON.parse(event.target.result);
            json.subtitles = json.subtitles.replace("\r","");
            localStorage.setItem(jsonKeyToLocalStorage, JSON.stringify(json));
            this.updateTaggerFromJson(json);
        };
        // reader.onload = (function(file) {
        //     return function (event) {
        //         let json = JSON.parse(event.target.result);
        //         let mJson = json;
        //         localStorage.setItem(jsonKeyToLocalStorage, JSON.stringify(json));
        //         this.updateTaggerFromJson(mJson);
        //     };
        // })(file).bind(this);
        reader.readAsText(file);
    };


    updateTaggerFromJson = (mJson) => {
        this.props.updateSpeakers(mJson.speakers);

        if (mJson.subtitles) {
            let mTranscript = this.createTranscript(mJson.subtitles);
            this.props.updateTranscript(mTranscript);
            this.props.isUpdatingTranscript(true);
        }
        let foldername = mJson.timestamp + '---' + mJson.uuid;
        let metaSettings = {
            uuid: mJson.uuid,
            timestamp: mJson.timestamp,
            version: mJson.version
        };
        this.props.updateAudioType(mJson.audioType);
        this.setState({mAudioType: mJson.audioType});
        this.props.updateLanguage(mJson.language);
        this.setState({mLanguage: mJson.language});

        importMediaUtils.downloadAudioFileFromServer(metaSettings.uuid, mJson.fileName,this.props.loadAudioFile);
        this.props.setMetaSettings(metaSettings);
    }

    createTranscript = (subtitles) => {
        let subtitlesArray = subtitles.split("\n");
        let transcript = {
            document: { //Every 'node' is a new line
                "nodes": []
            }
        };
        subtitlesArray.forEach((subtitle) => {
            if (subtitle !== "") {
                transcript.document.nodes.push({
                    "kind": "block",
                    "type": "check-list-item",
                    "nodes": [
                        {
                            "kind": "text",
                            "leaves": [
                                {
                                    "text": subtitle
                                }
                            ]
                        }
                    ]
                })
            }
        });
        return transcript;
    }

    closeAlertMessage = () => {
        this.setState({isOpenAlertMessage: false, openModal: false, showSaveToHbaseMessage: false});
    }

    openAlertMessage = () => {
        this.setState({isOpenAlertMessage: true});
    }

    openAddLeftSpeakerTag = () => {
        if (this.props.tagLeftToAllLines) {
            this.props.toggleTagLeftToAllLines(false);
        } else {
            this.setState({isOpenLeftTagMessage: true});
        }
    }

    closeLeftTagMessage = () => {
        this.setState({isOpenLeftTagMessage: false});
    }

    addLeftTagToAllLines = () => {
        let transcript = this.props.transcript;
        this.props.transcript.document.nodes.forEach((lineText,index) => {
            let text = this.props.transcript.document.nodes[index].nodes[0].leaves[0].text;
            if (this.doAddLeftSpeakerTag(text)) {
                if (this.existsRightSideTag(text)) {
                    text = text.replace(rightTag,leftTag);
                    transcript.document.nodes[index].nodes[0].leaves[0].text = text;
                } else if (text.includes(tagsLabels.speakerIdPrefix)) {
                    let re = new RegExp('< [0-9]>')
                    text = text.replace(re,leftTag);
                    transcript.document.nodes[index].nodes[0].leaves[0].text = text;
                } else if (!this.existsLeftSideTag(text)) {
                        let textBefore = text.substring(0,13);
                        let textLength =  text.length;
                        let textAfter = text.substring(13,textLength);
                        transcript.document.nodes[index].nodes[0].leaves[0].text = textBefore + leftTag + textAfter;
                }
            }
        })
        this.setState({isOpenLeftTagMessage: false});
        this.props.toggleTagLeftToAllLines(true);
        this.props.updateTranscript(transcript);
        this.props.isUpdatingTranscript(true);
    }

    existsRightSideTag = (lineText) => {
        return (lineText.indexOf(rightTag) !== -1);
    }

    existsLeftSideTag = (lineText) => {
        return (lineText.indexOf(leftTag) !== -1);
    }

    doAddLeftSpeakerTag = (lineText) => {
       return (lineText.length > 2 && lineText.match(/leftTag/g)===null && startTimeExists(lineText));
    }//containsWordsThatAreNotEvents(lineText) &&


    getAlertModalMessage = (timeTagsValidations) => {
        let onLineNumber;
        if (!desktopVersion) {
            onLineNumber =  " ( "+ timeTagsValidations.counter + ")";
        } else {
            onLineNumber =  " ("+ timeTagsValidations.counter + ")";
            // onLineNumber =  " Line Number "+ timeTagsValidations.counter;
        }
        if (timeTagsValidations.isTimeBelowMinTime) {
            return labels.CheckTimeBelowMinTime[UILanguage] + onLineNumber;
        }
        if (timeTagsValidations.isTimeAboveFifteenSeconds) {
            return labels.CheckTimeAboveFifteenSeconds[UILanguage]+ onLineNumber;
        }
        if (timeTagsValidations.isLineDoesNotHaveBothTimeTags) {
            return labels.CheckThatLineHasBothTimeTags[UILanguage]+ onLineNumber;
        }
        if (timeTagsValidations.isMissingSpekaerTag) {
            return labels.CheckMissingSpekaerTag[UILanguage]+ onLineNumber;
        }

        // if (timeTagsValidations.isMissingAudioFile) {
        //     return labels.CheckMissingAudioFile[UILanguage]+ onLineNumber;
        // }
        // if (timeTagsValidations.isStartTimeTagEqualOrSmallerThanEndTimeTagOfPreviousLine) {
        //     return labels.CheckTagTimeOfNextIsGreaterThanPreviousSentenceTagTime[UILanguage];
        // }
        // if (!this.isOneSpeakerAdded()) {
        //     return labels.CheckOneSpeakerAdded[UILanguage];
        // }
        if ( ! (this.props.audioFile.length > 0) ) {
            return labels.CheckAudioFileImported[UILanguage];
        }
        return "";
    }

    isOneSpeakerAdded = () => {
        return (this.props.speakers.length>0);
    }

    isExistAudioFile = () => {
        return (this.props.audioFile !== '');
    }

    validateTimeTags = (timeTagsValidations) => {
        // loop over subtitles and assure that each line has two time tags
        let subtitleText = document.getElementById("subtitleTextArea").innerText;
        let subtitles = subtitleText.split("\n");

        // if (!this.isExistAudioFile()) {
        //     timeTagsValidations.isMissingAudioFile = true;
        // }
        subtitles.forEach((curLineText) => {
            if (curLineText.length > 1) {
                if (timeTagsValidations.isLineDoesNotHaveBothTimeTags ||
                    timeTagsValidations.isTimeAboveFifteenSeconds ||
                    timeTagsValidations.isTimeBelowMinTime ||
                    timeTagsValidations.isMissingSpekaerTag
                    // || timeTagsValidations.isMissingAudioFile
                ) {
                    return timeTagsValidations;
                }
                if (isLineDoesNotHaveBothTimeTags(curLineText)) {
                    timeTagsValidations.isLineDoesNotHaveBothTimeTags = true;
                }
                let timeTagsHandle = new tagUtils.readTimeCode(curLineText);
                let timeTagsLocation = timeTagsHandle.getTagsLocation();
                let startPos = timeTagsHandle.getStartTimePos();
                let endPos = timeTagsHandle.getEndTimePos();
                if (timeTagsLocation === 'both' && endPos - startPos >= 15 && containsWordsThatAreNotEvents(curLineText)) {
                    timeTagsValidations.isTimeAboveFifteenSeconds = true;
                }
                if (timeTagsLocation === 'both' && endPos - startPos <= MIN_LINE_DIFF_HIGHLIGHT) {
                    timeTagsValidations.isTimeBelowMinTime = true;
                }
                if (notExistSpeakerTag(curLineText)) {
                    timeTagsValidations.isMissingSpekaerTag = true;
                }
                // if (findNonAlphaNumericCharacters(curLineText)) {
                //     timeTagsValidations.isMissingSpekaerTag = true;
                // }
                timeTagsValidations.counter = timeTagsValidations.counter + 1;
                // if (index !== 0) {
                //     let prevLineText = subtitles[index-1];
                //     let prevTimeTagsHandle = new tagUtils.readTimeCode(prevLineText);
                //     let prevEndPos = prevTimeTagsHandle.getEndTimePos();
                //     if (!((startPos-prevEndPos)>0)) {
                //         timeTagsValidations.isStartTimeTagEqualOrSmallerThanEndTimeTagOfPreviousLine = true;
                //     }
                // }
            }
        });
        return timeTagsValidations;
    };

    openTaggedDataSidebar = () => {
        if (this.state.taggedDataSidebarOpen) {
            this.setState({taggedDataSidebarOpen: false});
        } else {
            if (!desktopVersion) {
                this.fetchUserTaggedData(this,true,this.state.searchFieldValue);
            }
        }
    }

    hideTaggedDataSidebar = () => {
        this.setState({taggedDataSidebarOpen: false});
    };

    filterTaggedData = (fileName)  => {
        this.setState({searchFieldValue:fileName})
        this.fetchUserTaggedData(this,true,fileName);
    }

    fetchUserTaggedData = (that,taggedDataSidebarOpen = false, fileName="") => {
        // this.setState({userLogin:userLogin})
        if (!fileName) {
            fileName = "null"
        }
        let userLogin = localStorage.getItem(goTaggerUsername);
        fetchWrapper({
            url: ServerUrlBase + 'api/getUserTaggingData/'+userLogin+'/'+fileName+'/'+goTagger,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'GET',
            onReceive: (response) => {
                that.props.setUserTaggingData(JSON.parse(response).userTaggingData);
                that.setState({taggedDataSidebarOpen:taggedDataSidebarOpen})
            },
            onError: () => {
                console.log("error while getting tagging user data");
            }
        });
    }

    showHbaseSaveMessage = (message) => {
        this.setState({showSaveToHbaseMessage:true,saveToHbaseMessage:message})
    }

    renderSaveToHbaseMessage = () => {
        let _message = this.state.saveToHbaseMessage;
        if (this.state.showSaveToHbaseMessage) {
            return (
                <AlertModal setFocus={true} message={_message}
                            open={this.state.showSaveToHbaseMessage} onClose={this.closeAlertMessage}/>
            );
        }
    };

    renderValidateTranscriptToolbarButton = () => {
        if (!desktopVersion) {
            return (
                <div className="validateTranscriptToolbarButton flexRowContainer">
                    <div className={this.toolBarDirectionClass} onClick={this.validateTranscript}>
                        <img className="validateTranscriptIcon imgIcon" src={imgPath + 'output.png'}/>
                        <span className="validateTranscriptLabel">{labels.CheckTranscriptButtonLabel[UILanguage]}</span>
                    </div>
                </div>
            );
        }
    };

    renderTaggedDataPanelIcon = () => {
        if (!desktopVersion) {
            return (
                <div className={"taggedDataPanelIcon imgButton" + this.toolBarDirectionClass} onClick={this.openTaggedDataSidebar}>
                    <img className="imgIcon" src={imgPath + 'previous_tagging_icon.png'}/>
                    {labels.TaggingSidebarLabel[UILanguage]}
                </div>
            );
        }
    };

    renderTagLeftToAll = () => {
        if (!desktopVersion) {
            return (
                <div className={"imgButton" + this.toolBarDirectionClass} onClick={this.openAddLeftSpeakerTag}>
                    <Label className={this.props.tagLeftToAllLines ? 'selectedAddTagLeft' : ''}>
                        <span>{labels.TagLeftToAllLines[UILanguage]}</span>
                        {this.renderAddLeftTagsDialog()}
                    </Label>
                </div>
            );
        }
    };

    renderShortcutTags = () => {
        // if (!desktopVersion) {
            return (
                <div className={"imgButton" + this.toolBarDirectionClass} onClick={this.toggleHelpIcons}>
                    <img className="imgIcon" src={imgPath + 'Reply All Arrow.png'}/>
                    {labels.ShortcutTagsLabel[UILanguage]}
                </div>
            );
        // }
    };



    deleteJsonFromElastic = (uuid) => {
        let that = this;
        fetchWrapper({
            url: ServerUrlBase + 'deleteJsonFromElastic/'+uuid+'/'+goTagger,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'GET',
            onReceive: (response) => {
                if (response.deleted) {
                    that.setState({taggedDataSidebarOpen: false});
                    console.log("successful removal of json from elastic");
                } else {
                    alert("document was not deleted from elastic");
                }
            },
            onError: () => {console.log("error while getting json from elastic");}
        });
    }

    updateAudioType = (event, choice) => {
        this.props.updateAudioType(choice.value);
        this.setState({mAudioType:choice.value});
    };

    renderArenaModal = () => {
        if (this.state.isArenaModalOpen) {
            return (
                <ArenaModal arenaOptions={supportedArenaOptions} open={this.state.isArenaModalOpen} closeDialog={this.closeArenaModal} onChooseArena={this.handleChooseArena}/>
            )
        }
    };

    renderHelpDialog = () => {
        if (this.state.isHelpDialogOpen) {
            return (
                <HelpDialog open={this.state.isHelpDialogOpen} closeDialog={this.closeHelpDialog}/>
            )
        }
    };

    renderMetadataDialog = () => {
        if (this.state.isMetadataDialogOpen) {
            return (
                <MetadataDialog open={this.state.isMetadataDialogOpen} closeDialog={this.closeMetadataDialog}
                                speakers={this.props.speakers}
                                editSpeaker={this.editSpeaker}
                                removeSpeaker={this.removeSpeaker}
                                addSpeaker={this.addSpeaker}/>
            )
        }
    };

    renderSaveDialog = () => {
        if (this.state.openModal) {
            this.props.toggleRenderMarkErrors(true);
            let timeTagsValidations = {
                isTimeAboveFifteenSeconds: false,
                isTimeBelowMinTime: false,
                isLineDoesNotHaveBothTimeTags: false,
                // isStartTimeTagEqualOrSmallerThanEndTimeTagOfPreviousLine: false,
                isMissingSpekaerTag: false,
                // isMissingAudioFile: false,
                isNotSetSpeakerLanguage: false,
                counter: 0
            };
            timeTagsValidations = this.validateTimeTags(timeTagsValidations);
            let message = this.getAlertModalMessage(timeTagsValidations);
            if (!desktopVersion) {
                if (message === "" && !desktopVersion) {
                    message = this.isAudioTypeSelected();
                }
                if (message === "") {
                    message = this.isLanguageSelected();
                }
            }
            let arenaNumber = localStorage.getItem(userArenaNumber);
            if (message === "") {
                    return (
                        <UserModal language={this.props.language} arenaNumber={arenaNumber} audioType={this.props.audioType} open={this.state.openModal} onClose={this.closeModal} showHbaseSaveMessage={this.showHbaseSaveMessage} />
                    );
                } else {
                    return (
                        <AlertModal message={message}
                                    open={this.state.isOpenAlertMessage} onClose={this.closeAlertMessage}/>
                    );
                }
        }
    }

    isAudioTypeSelected = () => {
        let message = "";
        if (!this.state.mAudioType || this.state.mAudioType === emptyValue || this.state.mAudioType === undefined) {
            message = labels.AudioTypeNotFilledMessage[UILanguage];
        }
        return message;
    }

    isLanguageSelected = () => {
        let message = "";
        if (!this.state.mLanguage || this.state.mLanguage === emptyValue || this.state.mLanguage === undefined) {
            message = labels.CheckMissingSpeakerLanguage[UILanguage];
        }
        return message;
    }

    getJsonFromElastic = (uuid) => {
        this.setState({taggedDataSidebarOpen:false});
        fetchWrapper({
            url: ServerUrlBase + 'api/getJsonFromElastic/'+uuid+'/'+goTagger,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'GET',
            onReceive: (response) => {
                this.setJsonFromElastic(JSON.parse(response).jsonFromElastic)
            },
            onError: () => {console.log("error while getting json from elastic");}
        });
    }

    setJsonFromElastic = (json) => {
        this.props.resetStore();
        let that = this;
        setTimeout(function () {
            that.updateTaggerFromJson(json);
        },100)

    }

    renderAddLeftTagsDialog = () => {
        if (this.state.isOpenLeftTagMessage) {
            let message = labels.AlertAddLeftSpeakerTagMessage[UILanguage];
            return (
                <ConfirmationModal message={message}
                                   open={this.state.isOpenLeftTagMessage} onApproval={this.addLeftTagToAllLines} onClose={this.closeLeftTagMessage}/>
            );

        }
    }


    renderTaggedDataSidebar = () => {
        if (this.state.taggedDataSidebarOpen) {
            return (
                <TaggedDataSidebar defaultValue={this.state.userLogin} searchFieldValue={this.state.searchFieldValue} handleDeleteJsonFromElastic={this.deleteJsonFromElastic} onHandleGetJsonFromElastic={this.getJsonFromElastic} visible={this.state.taggedDataSidebarOpen} hideSidebar={this.hideTaggedDataSidebar} onHandleSearchUser={(user) => this.fetchUserTaggedData(this,user)}  onHandleSearchTaggedData={(fileName) => this.filterTaggedData(fileName) }/>
            )
        }
    };

    renderAudioTypeDropdown = () => {
        if (!desktopVersion) {
            return (
                <div className="flexRowContainer">
                    <div className="labelChooseAudioType">
                        {labels.AudioType[UILanguage]}
                    </div>
                    <div data-tip={labels.AudioTypeBlueOrPurple[UILanguage]} >
                        <ReactTooltip />
                        <AudioTypeDropdown audioTypeOptions={supportedAudioTypes}
                                           currentAudioType={this.state.mAudioType} updateAudioType={this.updateAudioType}/>
                    </div>
                </div>
            );
        }
    };

    renderLanguageDropdown = () => {
        if (!desktopVersion) {
            return (
                <div className="flexRowContainer">

                    <div className="labelChooseLanguage">
                        {labels.LanguageType[UILanguage]}
                    </div>
                    <div data-tip={labels.ChooseLanguageType[UILanguage]} >
                        <ReactTooltip />
                        <LanguageDropdown languageOptions={supportedTranscriptionLanguages}
                                          currentLanguage={this.state.mLanguage} updateLanguage={this.updateLanguage}/>

                    </div>
                </div>
            );
        }
    };

    render() {
        return (
            <div id="mainContainer">
                {/*{this.renderArenaModal()}*/}
                {this.renderHelpDialog()}
                {this.renderTaggedDataSidebar()}
                {this.renderSaveToHbaseMessage()}

                <div id="headerFrame" className="flexRowContainer">

                    <input type='file' hidden='false' id="fileLoader"/>
                    {/*<div className={"imgLogo" + this.toolBarDirectionClass}>*/}
                        {/*<img className="imgLogo" src={}/>*/}
                    {/*</div>*/}

                    <div className={"saveImgIcon imgButton" + this.toolBarDirectionClass} onClick={this.openModal}>
                        <img className="imgIcon" src={imgPath + 'save3.png'}/>
                        {labels.SaveButtonLabel[UILanguage]}
                        {this.renderSaveDialog()}

                    </div>

                    {this.renderShortcutTags()}

                    {this.renderTaggedDataPanelIcon()}

                    {this.renderTagLeftToAll()}

                    {this.renderAudioTypeDropdown()}

                    {this.renderLanguageDropdown()}

                    {this.renderValidateTranscriptToolbarButton()}

                    <div className={"helpToolbarButton imgButton" + this.toolBarDirectionClass} onClick={this.openHelpDialog}>
                        <img className="helpImgIcon imgIcon" src={imgPath + 'help2.png'}/>
                        {labels.HelpButtonLabel[UILanguage]}
                    </div>

               </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.editor.language,
        speakers: state.editor.speakers,
        transcript: state.editor.transcript,
        uploadedAudioFile: state.media.uploadedAudioFile,
        isHelpIconsOpen: state.editor.isHelpIconsOpen,
        audioFile: state.media.audioFile,
        tagLeftToAllLines: state.editor.tagLeftToAllLines,
        arenaNumber: state.editor.arenaNumber,
        audioType: state.editor.audioType,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadAudioFile: (audioFile,fileName,uploadedAudioFile) => dispatch({type: mediaActions.load_audio_file,audioFile,fileName,uploadedAudioFile}),
        updateMissingKeywords: (language, missingKeywords) => dispatch({type: editorActions.update_missing_keywords, language, missingKeywords}),
        updateLanguage: (language) => dispatch({type: editorActions.update_language, language}),
        updateIsLoading: (bool) => dispatch({type: editorActions.update_is_loading,bool}),
        updateSpeakers: (speakers) => dispatch({type: editorActions.update_speakers,speakers}),
        updateTranscript: (transcript) => dispatch({type: editorActions.update_transcript,transcript}),
        isUpdatingTranscript: (updatingTranscript) => dispatch({type: editorActions.is_updating_transcript,updatingTranscript}),
        updateIsHelpIconsOpen: (isHelpIconsOpen) => dispatch({type: editorActions.update_is_help_icons_open,isHelpIconsOpen}),
        setMetaSettings: (metaSettings) => dispatch({type: mediaActions.reset_meta_settings,metaSettings}),
        setCurrentUser: (currentUser) => dispatch({type: mediaActions.set_current_user,currentUser}),
        toggleTagLeftToAllLines: (tagLeftToAllLines) => dispatch({type: editorActions.toggle_tag_left_to_all_lines,tagLeftToAllLines}),
        toggleRenderMarkErrors: (isRenderMarkErrors) => dispatch({type: editorActions.toggle_render_mark_errors,isRenderMarkErrors}),
        setArenaNumber: (arenaNumber) => dispatch({type: editorActions.set_arena_number, arenaNumber}),
        setUserTaggingData: (userTaggingData) => dispatch({type: editorActions.set_user_tagging_data, userTaggingData}),
        updateAudioType: (audioType) => dispatch({type: editorActions.update_audio_type,audioType}),
        resetStore: () => dispatch({type: 'RESET_STORE'}),
    }
};

const PrimaryToolbar = connect(mapStateToProps, mapDispatchToProps)(PrimaryToolbarHelper);

export default PrimaryToolbar
