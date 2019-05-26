import React from 'react';
import {connect} from 'react-redux';
import {Button} from 'semantic-ui-react';
import {UILanguage} from '../../Root/config';
import {tagsLabelsEvents} from '../../strings/tagsLabels';
import editorActions from '../../actions/Editor.actions';
import {helpDialogLabels} from '../../strings/helpDialogLabels';
import * as tagUtils from '../../js/KeyboardShortcuts/TimeTagsUtilits';

class HelpIconsHelper extends React.Component {
    constructor(props) {
        super(props);
    }

    addTagLabel = (keyCode,tagLabel) => {
        let textBefore = this.props.transcript.document.nodes[this.props.selectedLineNo].nodes[0].leaves[0].text.substring(0,this.props.anchorOffset);
        if (!this.doAddTagLabel(textBefore))
            return;
        let textLength =  this.props.transcript.document.nodes[this.props.selectedLineNo].nodes[0].leaves[0].text.length;
        let textAfter = this.props.transcript.document.nodes[this.props.selectedLineNo].nodes[0].leaves[0].text.substring(this.props.anchorOffset,textLength);
        // if (this.inTimeTag(textBefore,textAfter))
        //     return;
        let transcript = this.props.transcript;
        transcript.document.nodes[this.props.selectedLineNo].nodes[0].leaves[0].text = textBefore + tagLabel +textAfter;
        this.props.updateTranscript(transcript);
        this.props.isUpdatingTranscript(true);
    }

    doAddTagLabel = (lineText) => {
        let timeTagsHandle = new tagUtils.readTimeCode(lineText);
        let startPos = timeTagsHandle.getStartTimePos();
        return (startPos >= 0);
    }

    inTimeTag = (textBefore,textAfter) => {
        let regTimeTag = /[0-9.:]/;
        return (textBefore[textBefore.length-1].match(regTimeTag).length>0 && textAfter[0].match(regTimeTag).length>0 );
    }

    renderTagLabels = () => {
        return Object.keys(tagsLabelsEvents).map( (tagLabelName, tagIndex) => {
            return (
                <Button className={"helpIcon imgButton" + this.toolBarDirectionClass} onClick={() => this.addTagLabel(tagsLabelsEvents[tagLabelName].keyCode,tagsLabelsEvents[tagLabelName].shortcut)} key={tagIndex}>
                    <div className="flexRowContainer flexJustifyContent">
                        <div>{tagsLabelsEvents[tagLabelName].label[UILanguage]}</div>
                    <b><div className="shortcutKeysLabel">({tagsLabelsEvents[tagLabelName].shortcutKeys})</div></b>
                    </div>
                </Button>
            )
        });
    }

    renderHelpIconPanel = () => {
        if (this.props.isHelpIconsOpen) {
            return (
                <div className="iconsPanel flexColumnContainer">
                    {this.renderTagLabels()}
                    <Button positive className="exitHelpIconsButton"
                            onClick={this.props.closeDialog}>{helpDialogLabels.exitButtonLabel[UILanguage]}</Button>
                </div>
            )
        }
    };

    render() {
        return (
            <div>
                {this.renderHelpIconPanel()}

            </div>
        )
    }
}



const mapStateToProps = (state) => {
    return {
        selectedLineNo: state.editor.selectedLineNo,
        transcript: state.editor.transcript,
        anchorOffset: state.editor.anchorOffset,
        isHelpIconsOpen: state.editor.isHelpIconsOpen
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        isUpdatingTranscript: (updatingTranscript) => dispatch({type: editorActions.is_updating_transcript,updatingTranscript}),
        updateTranscript: (transcript) => dispatch({type: editorActions.update_transcript,transcript}),
    }
};

const HelpIcons = connect(mapStateToProps, mapDispatchToProps)(HelpIconsHelper);
export default HelpIcons