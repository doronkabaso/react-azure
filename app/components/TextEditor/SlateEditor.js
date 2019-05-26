import React from 'react'
import {connect} from 'react-redux';
import {Editor} from 'slate-react'
import {Value} from 'slate'
import ReactTooltip from 'react-tooltip';
import * as UpdateTextFrame from '../../js/UpdateTextFrame'
import * as textTagsKybrdUtils from '../../js/KeyboardShortcuts/Tags'
import editorActions from '../../actions/Editor.actions'
import mediaActions from '../../actions/Media.actions'
import {updateDecorations} from '../../js/Decorations'
import * as importMediaUtils from '../../js/ImportMedia';
import {labels} from '../../strings/labels';
import {UILanguage} from '../../Root/config';

require('../../sass/main.scss');

export const DECORATINOS = {
    highlight: "HIGHLIGHT",
    grammer_underline: "GRAMMER_UNDERLINE"
};

const initialValue = Value.fromJSON({
    document: { //Every 'node' is a new line
        "nodes": [
            {
                "kind": "block",
                "type": "check-list-item",
                "nodes": [
                    {
                        "kind": "text",
                        "leaves": [
                            {
                                "text": ""
                            }
                        ]
                    }
                ]
            }
        ]
    }
});

class SlateEditorHelper extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            value: initialValue
        };
        this.textEditorContainingDivId = 'subtitleTextArea';
        textTagsKybrdUtils.keyDownKybrd = textTagsKybrdUtils.keyDownKybrd.bind(this);
    }

    componentDidMount() {
        UpdateTextFrame.updateSubtitleFrame(this.props.selectedLineNo, this.getLineHeight());
    }

    componentDidUpdate() {
        UpdateTextFrame.scrollToFocusedLine(this.props.selectedLineNo, this.textEditorContainingDivId);

        if (this.props.updatingTranscript) {
            // updateDecorations(undefined, undefined, this.props.positionGetter(),this.state.value,this.props.missingKeywords[this.props.language],this.props.selectedLineNo);
            this.setState({
                value: Value.fromJSON(this.props.transcript)
            });
            this.textEditorContainerElement.children[0].focus();
            this.props.isUpdatingTranscript(false);
        }
    }

    getLineHeight = () => {
        let lineCountArea = document.getElementById("subtitleLineCount_ui");
        if (lineCountArea.scrollHeight === 0) {
            return 0;
        }

        return lineCountArea.children[0].scrollHeight;
    };

    mapToSlateNodes(lineText) {
        return (
        {
            "kind": "block",
            "type": "check-list-item",
            "nodes": [
                {
                    "kind": "text",
                    "leaves": [
                        {
                            "text": lineText
                        }
                    ]
                }
            ]
        }
        )
    }

    toSlateStructure=(linesArray)=>{
        let document = {
            nodes: linesArray.map(this.mapToSlateNodes)
        };
        return Value.fromJSON({document})
    };

    onChange = (value) => {
        this.setState(value)
    };

    editorTextChange = (e) => {
        let operation = e.operations.first();
        if(e.operations.size!==1){
            operation = e.operations.last();
        }

        let zeroBasedLineNumber = UpdateTextFrame.getCurrentZeroBasedLineNumber(operation);
        if (zeroBasedLineNumber !== -1) {
            this.props.updateSelectedLineNo(zeroBasedLineNumber);
            UpdateTextFrame.updateSubtitleFrame(zeroBasedLineNumber, this.getLineHeight());
        }

        this.onChange(e);
    };

    createTranscript = (editorInnerDivs) => {
        let transcript = {
            document: { //Every 'node' is a new line
                "nodes": []
            }
        };
        for (let i=0; i<editorInnerDivs.length; i++) {
            transcript.document.nodes.push({
                "kind": "block",
                "type": "check-list-item",
                "nodes": [
                    {
                        "kind": "text",
                        "leaves": [
                            {
                                "text": editorInnerDivs[i].innerText
                            }
                        ]
                    }
                ]
            })
        }
        return transcript;
    }

    onKeyDown = (event,change) =>{
        if (event.keyCode === 77 && event.ctrlKey) {
            let json = JSON.parse(localStorage.getItem('tagger-json'));
            this.setStoredDataFromJson(json);
        } else {
           textTagsKybrdUtils.keyDownKybrd(event,change,this.props.tagLeftToAllLines);
        }

    };

    onKeyUp = (event,change) =>{
        //Update decorations
        // updateDecorations(event, change, this.props.positionGetter(),this.state.value,this.props.missingKeywords[this.props.language],this.props.selectedLineNo);

        //Update the text frame after changing the text
        UpdateTextFrame.updateSubtitleFrame(this.props.selectedLineNo, this.getLineHeight());

        let subtitleTextArea = document.getElementById("subtitleTextArea");
        let editorInnerDivs = subtitleTextArea.children[0].children;
        let mTranscript = this.createTranscript(editorInnerDivs);
        this.props.updateTranscript(mTranscript);
        this.props.updateAnchorOffset(change.value.selection.anchorOffset);
        // let json = JSON.parse(localStorage.getItem('tagger-json'));
        // if (json) {
        //     json.subtitles = subtitleTextArea.innerText;
        //     localStorage.setItem('tagger-json', JSON.stringify(json));
        // }
    };

    setStoredDataFromJson = (json) => {
        this.props.updateSpeakers(json.speakers);
        if (json.subtitles) {
            let mTranscript = this.createTranscriptFromSubtitles(json.subtitles);
            this.props.updateTranscript(mTranscript);
            this.props.isUpdatingTranscript(true);
        }
        let metaSettings = {
            uuid: json.uuid,
            timestamp: json.timestamp,
            version: json.version
        };
        this.props.setMetaSettings(metaSettings);
        this.props.setAudioFileName(json.fileName);
        if (json.timestamp !== '' && json.uuid !== '') {
            let foldername = json.timestamp + '---' + json.uuid;
            importMediaUtils.downloadAudioFileFromServer(metaSettings.uuid, json.fileName,this.props.loadAudioFile);
        }
    }

    createTranscriptFromSubtitles = (subtitles) => {
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

    renderMark = (props) => {
        if (this.props.isRenderMarkErrors) {
            const {children, mark} = props;
            switch (mark.type) {
                case 'highlight':
                    return <span>
                <span data-tip={labels.CheckTimeAboveFifteenSeconds[UILanguage]} style={{backgroundColor: '#f5ee45'}}>{children}
                        </span>
                    <ReactTooltip />
                </span>;
                case 'highlightBelowMinTime':
                    return <span>
                <span data-tip={labels.CheckTimeBelowMinTime[UILanguage]} style={{backgroundColor: '#f5ee45'}}>{children}
                        </span>
                    <ReactTooltip />
                </span>;
                case 'highlightNotExistBothTimeTags':
                    return <span>
                <span data-tip={labels.CheckThatLineHasBothTimeTags[UILanguage]} style={{backgroundColor: '#f5ee45'}}>{children}
                        </span>
                    <ReactTooltip />
                </span>;
                case 'highlightMissingSpekaerTag':
                    return <span>
                <span data-tip={labels.CheckMissingSpekaerTag[UILanguage]} style={{backgroundColor: '#f5ee45'}}>{children}
                        </span>
                    <ReactTooltip />
                </span>;
                case 'highlightStartTimeTagGreaterThanPreviousLineEndTimeTag':
                    return <span>
                <span data-tip={labels.CheckTagTimeOfNextIsGreaterThanPreviousSentenceTagTime[UILanguage]} style={{backgroundColor: '#f5ee45'}}>{children}
                        </span>
                    <ReactTooltip />
                </span>;
                case 'grammerUnderline':
                    return  (   <span style={{color: '#f55c5c',textDecoration: 'underline'}}>
                                <span style={{color: 'black'}}>{children}</span>
                            </span> );
                // case 'linebold':
                //     return <span style={{fontWeight: 'bold'}}>{children}
                //             </span>
                //     ;
            }
        }
    };

    onClick = (event, change) => {
        updateDecorations(event, change, this.props.positionGetter(), this.state.value, this.props.missingKeywords[this.props.language],this.props.selectedLineNo);
        this.props.updateAnchorOffset(change.value.selection.anchorOffset);
    };

    render() {
        return (
            <div
                id={this.textEditorContainingDivId} className="subtitleElements"
                ref={div=>this.textEditorContainerElement = div}>
                {/*!!! The editor must be the first element in the div !!!*/}
                <Editor
                    id="textEditor"
                    style={{fontSize: this.props.fontSize, width: "100%"}}
                    className="full-height"
                    value={this.state.value}
                    onChange={this.editorTextChange}
                    onKeyUp={this.onKeyUp}
                    onKeyDown={this.onKeyDown}
                    onClick={this.onClick}
                    renderMark={this.renderMark}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isPlaying: state.media.isPlaying,
        isPlayable: state.media.isPlayable,
        selectedLineNo: state.editor.selectedLineNo,
        pos: state.media.pos,
        duration: state.media.duration,
        fontSize: state.secondaryToolbar.fontSize,
        audioRate: state.media.audioRate,
        mediaVolume: state.media.mediaVolume,
        intervalId: state.media.intervalId,
        missingKeywords: state.editor.missingKeywords,
        language: state.editor.language,
        isLoading: state.editor.isLoading,
        anchorOffset: state.editor.anchorOffset,
        isHelpIconsOpen: state.editor.isHelpIconsOpen,
        tagLeftToAllLines: state.editor.tagLeftToAllLines,
        isRenderMarkErrors: state.editor.isRenderMarkErrors,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateSelectedLineNo: (selectedLineNo) => dispatch({type: editorActions.update_selected_line_number, selectedLineNo}),
        handleRateChange: (newRate) => dispatch({type: mediaActions.handle_rate_change, newRate}),
        updatePlayMedia: (functionInterval) => dispatch({type: mediaActions.play_media, functionInterval}),
        updatePauseMedia: (intervalId) => dispatch({type: mediaActions.pause_media, intervalId}),
        handlePosChange: (pos) => dispatch({type: mediaActions.handle_pos_change, pos}),
        handleVolumeChange: (newVolume) => dispatch({type: mediaActions.handle_volume_change, newVolume}),
        updateTranscript: (transcript) => dispatch({type: editorActions.update_transcript,transcript}),
        isUpdatingTranscript: (updatingTranscript) => dispatch({type: editorActions.is_updating_transcript,updatingTranscript}),
        updateAnchorOffset: (anchorOffset) => dispatch({type: editorActions.update_anchor_offset, anchorOffset}),
        updateLanguage: (language) => dispatch({type: editorActions.update_language, language}),
        updateIsLoading: (bool) => dispatch({type: editorActions.update_is_loading,bool}),
        updateSpeakers: (speakers) => dispatch({type: editorActions.update_speakers,speakers}),
        setMetaSettings: (metaSettings) => dispatch({type: mediaActions.reset_meta_settings,metaSettings}),
        loadAudioFile: (audioFile,fileName,uploadedAudioFile) => dispatch({type: mediaActions.load_audio_file,audioFile,fileName,uploadedAudioFile}),
        setAudioFileName: (fileName) => dispatch({type: mediaActions.set_audio_file_name,fileName}),

    }
};

const SlateEditor = connect(mapStateToProps, mapDispatchToProps)(SlateEditorHelper);
export default SlateEditor