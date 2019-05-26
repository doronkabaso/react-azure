import React from 'react';
import {connect} from 'react-redux';
import Wavesurfer from 'react-wavesurfer';
import actions from '../../actions/Media.actions';
import * as importMediaUtils from '../../js/ImportMedia';
import * as subtitleUtils from '../../js/SubtitleLabel';
import {playerConfig, desktopVersion} from '../../Root/config';
import editorActions from '../../actions/Editor.actions'
import {labels} from '../../strings/labels'
import {UILanguage} from '../../Root/config';
import {helpDialogLabels} from "../../strings/helpDialogLabels";
import AlertModal from "../Toolbars/AlertModal";

require('wavesurfer.js');

class VoiceTimelineHelper extends React.Component {

    constructor(props) {
        super(props);
        subtitleUtils.updateSubtitlesLabel = subtitleUtils.updateSubtitlesLabel.bind(this);
        this.state = {
            isOpenAlertMessage: false
        };
        this.prevPosLineNo=-1;
    }


    handlePosChange(e) {
        if (this.props.pos<1) {
            this.prevPosLineNo=-1;
        }
        this.props.onPosChange(e.originalArgs[0]);

        let textLines = document.getElementById("subtitleTextArea").innerText.split('\n');
        let textTimeTuples = subtitleUtils.getTimeTuples(textLines);
        subtitleUtils.updateSubtitlesLabel(textLines,textTimeTuples);
    }

    handleNewDuration(e) {
        this.props.handleNewDuration(e.wavesurfer.getDuration());
        this.props.onPosChange(0);
        if (playerConfig.enableDragSelection) {
            e.wavesurfer.enableDragSelection({});
        }
    }

    addClassToAudioRegion = () => {
        return (this.props.audioFile === '') ? "playerBackground onDropRegionForAudio" : "playerBackground";
    }

    renderOnDropAudioLabel = (label) => {
        if (this.props.audioFile === '') {
            return (
                <div className="dropAudioRegionLabel">{label}</div>
            );
        }
    }

    showAlertModal = (refreshPage) => {
        if (refreshPage) {
            this.setState({isOpenAlertMessage: true});
        }
    }

    closeAlertMessage = () => {
        this.setState({isOpenAlertMessage: false});
        document.location.reload(true);
    }

    renderAlertModalBeforeRefreshPage = (message) => {
        if (this.state.isOpenAlertMessage) {
            return (
                <AlertModal message={message}
                            open={this.state.isOpenAlertMessage} onClose={this.closeAlertMessage}/>
            );
        }
    }

    render() {
        let metaSettings = {
            uuid: '',
            timestamp: '',
            version:0,
        };
        return (
            <div
                onDragOver={(evt)=>importMediaUtils.handleDragOver(evt)}
                onDrop={(evt)=>{
                    if (!desktopVersion) {
                        importMediaUtils.validVersionNumber(this.showAlertModal);
                    }
                    importMediaUtils.handleFileSelect(evt,this.props.loadAudioFile);
                    this.props.setMetaSettings(metaSettings);
                }}
                className={this.addClassToAudioRegion()}
            >
                {this.renderOnDropAudioLabel(labels.dropAudioLabel[UILanguage])}
                {this.renderAlertModalBeforeRefreshPage(helpDialogLabels.soonDownloadNewClientVersion[UILanguage])}
                <Wavesurfer
                    audioFile={this.props.audioFile}
                    pos={this.props.pos}
                    onPosChange={e=>this.handlePosChange(e)}
                    playing={this.props.isPlaying}
                    volume={this.props.mediaVolume}
                    options={{waveColor: '#a4ebdf', progressColor: '#71a098',audioRate: this.props.audioRate, splitChannels: true, height: 75}}
                    onReady={e=>this.handleNewDuration(e)}
                >
                </Wavesurfer>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        audioFile: state.media.audioFile,
        isPlaying: state.media.isPlaying,
        audioRate: state.media.audioRate,
        mediaVolume: state.media.mediaVolume,
        uploadedAudioFile: state.media.uploadedAudioFile,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadAudioFile: (audioFile,fileName,uploadedAudioFile) => dispatch({type: actions.load_audio_file,audioFile,fileName,uploadedAudioFile}),
        handleNewDuration: (newDuration) => dispatch({type: actions.handle_new_duration,newDuration}),
        handleSubtitleUpdate: (newSubtitle) => dispatch({type: actions.handle_subtitle_update,newSubtitle}),
        setMetaSettings: (metaSettings) => dispatch({type: actions.reset_meta_settings,metaSettings}),
        updateSelectedLineNo: (selectedLineNo) => dispatch({type: editorActions.update_selected_line_number, selectedLineNo}),
        isUpdatingTranscript: (updatingTranscript) => dispatch({type: editorActions.is_updating_transcript,updatingTranscript}),
    }
};

const VoiceTimeline = connect(mapStateToProps,mapDispatchToProps)(VoiceTimelineHelper);
export default VoiceTimeline;