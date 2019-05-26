import React from 'react';
import {Button} from 'semantic-ui-react';
import Draggable from 'react-draggable';
import {UILanguage, UIDirection, Directions} from '../../Root/config';
import {metadataDialogLabels} from '../../strings/metadataDialogLabels';
import GridSpeakers from './MetadataSpeakers/GridSpeakers.jsx';

export default class MetadataDialog extends React.Component {
    constructor(props) {
        super(props);
        this.exitButtonSide = UIDirection === Directions.RTL ? 'left' : 'right';
    }

    close = () => this.props.closeDialog();

    render() {

        return (
            <Draggable>
                <div className="panel speakersPanel">
                    <div className="flexColumnContainer">
                    <span><GridSpeakers speakers={this.props.speakers}
                                        editSpeaker = {this.props.editSpeaker}
                                        removeSpeaker = {this.props.removeSpeaker}
                                        addSpeaker = {this.props.addSpeaker} /></span>
                    </div>

                    <Button className="exitButtonEditSpeakers" positive
                            onClick={this.props.closeDialog}>{metadataDialogLabels.exitButtonLabel[UILanguage]}</Button>
                </div>
            </Draggable>
        )
    }
}
