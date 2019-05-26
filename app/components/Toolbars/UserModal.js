import React from 'react';
import {connect} from 'react-redux'
import {Button,Modal,Label} from 'semantic-ui-react';
import * as downloadUtils from '../../js/DownloadTranscription'
import mediaActions from '../../actions/Media.actions';
import {labels} from '../../strings/labels';
import {UILanguage} from '../../Root/config';

const BUTTON_SIZE = 'huge'

class UserModalHelper extends React.Component{

    close = () => this.props.onClose()

    render(){
        let metaSettings = {
            uuid: this.props.uuid,
            timestamp: this.props.timestamp,
            version: this.props.version+1
        };
        return (
            <div>
                <Modal size={'small'} open={this.props.open} onClose={this.close}>
                    <Modal.Header style={{direction: 'rtl',textAlign: 'right'}}>{labels.chooseOperatorType[UILanguage]}</Modal.Header>
                    <Modal.Actions className="saveTranscriptActions" >
                        <Button onClick={()=>{
                            metaSettings.uuid = downloadUtils.saveTranscriptAndAudio('operator',this.props.language, this.props.fileName, this.props.uploadedAudioFile, metaSettings, this.props.currentUser, this.props.arenaNumber, this.props.audioType, this.props.showHbaseSaveMessage);
                            this.props.setMetaSettings(metaSettings);
                            this.close();
                            this.props.updateVersion(metaSettings.version);}}
                                color='green' size={BUTTON_SIZE}>{labels.Operator[UILanguage]}</Button>
                        <Button onClick={()=>{
                            metaSettings.uuid = downloadUtils.saveTranscriptAndAudio('secondEye',this.props.language, this.props.fileName, this.props.uploadedAudioFile, metaSettings, this.props.currentUser, this.props.arenaNumber, this.props.audioType, this.props.showHbaseSaveMessage);
                            this.props.setMetaSettings(metaSettings);
                            this.close();
                            this.props.updateVersion(metaSettings.version);}} color='teal' size={BUTTON_SIZE}>{labels.SecondEye[UILanguage]}</Button>
                        <Button onClick={()=>{
                            metaSettings.uuid = downloadUtils.saveTranscriptAndAudio('firstEye',this.props.language, this.props.fileName, this.props.uploadedAudioFile, metaSettings, this.props.currentUser, this.props.arenaNumber, this.props.audioType, this.props.showHbaseSaveMessage);
                            this.props.setMetaSettings(metaSettings);
                            this.close();
                            this.props.updateVersion(metaSettings.version);}} color='blue' size={BUTTON_SIZE}>{labels.FirstEye[UILanguage]}</Button>
                    </Modal.Actions>
                    <div className="saveTranscriptActionsFooter">
                        <div className="transcriptActionsFooterSutitle"><span className="titleSaveTranscriptActionsFooter">{labels.FirstEye[UILanguage]}</span>{labels.FirstEyeExplanation[UILanguage]}</div>
                        <div className="transcriptActionsFooterSutitle"><span className="titleSaveTranscriptActionsFooter">{labels.SecondEye[UILanguage]}</span>{labels.SecondEyeExplanation[UILanguage]}</div>
                        <div className="transcriptActionsFooterSutitle"><span className="titleSaveTranscriptActionsFooter">{labels.Operator[UILanguage]}</span>{labels.OperatorExplanation[UILanguage]}</div>
                    </div>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        fileName: state.media.fileName,
        uploadedAudioFile: state.media.uploadedAudioFile,
        uuid: state.media.uuid,
        timestamp: state.media.timestamp,
        version: state.media.version,
        currentUser: state.media.currentUser,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateVersion: (version) => dispatch({type: mediaActions.update_version,version}),
        setMetaSettings: (metaSettings) => dispatch({type: mediaActions.reset_meta_settings,metaSettings}),
    }
};

const UserModal = connect(mapStateToProps, mapDispatchToProps)(UserModalHelper);

export default UserModal