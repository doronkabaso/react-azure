import React from 'react'
import {connect} from 'react-redux';
import {Dimmer, Loader} from 'semantic-ui-react';
import SlateEditor from './SlateEditor';
import {TextEditorDirection, Directions} from '../../Root/config';
import HelpIcons from '../Toolbars/HelpIcons';
import editorActions from '../../actions/Editor.actions';

require('../../sass/main.scss');

class SlateEditorFrameHelper extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.textEditorDirectionClassName = TextEditorDirection === Directions.RTL ? ' rtl ' : ' ltr '
    }

    toVisibility(bool) {
        return (
            bool === true
                ? 'hidden'
                : 'initial'
        )
    }

    showLoader(bool) {
        if (bool === true) {
            return (
                <Dimmer active>
                    <Loader size="massive"></Loader>
                </Dimmer>
            )
        }
    }

    closeHelpIcons = () => {
        this.props.updateIsHelpIconsOpen(false);
    };

    render() {
        return (
            <div
                id="subtitleFrame" className={"fit-height-row-content scroll" + this.textEditorDirectionClassName}>
                <div
                    id="subtitleFormContainer"
                    className="scroll-content full-width"
                    style={{display: "flex", visibility: this.toVisibility(this.props.isLoading)}}
                >
                    <div
                        id="subtitleLineCount"
                        className="subtitleElementsCount"
                    >
                        <ul style={{fontSize: this.props.fontSize}} className="subtitleElementsCount"
                            id="subtitleLineCount_ui"/>
                    </div>
                    <SlateEditor updatingTranscript={this.props.updatingTranscript} transcript={this.props.transcript} positionGetter={this.props.positionGetter}/>
                </div>
                {this.showLoader(this.props.isLoading)}
                <HelpIcons closeDialog={this.closeHelpIcons} />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        fontSize: state.secondaryToolbar.fontSize,
        isLoading: state.editor.isLoading,
        transcript: state.editor.transcript,
        updatingTranscript: state.editor.updatingTranscript
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        updateIsHelpIconsOpen: (isHelpIconsOpen) => dispatch({type: editorActions.update_is_help_icons_open,isHelpIconsOpen}),
    }
};

const SlateEditorFrame = connect(mapStateToProps,mapDispatchToProps)(SlateEditorFrameHelper);
export default SlateEditorFrame