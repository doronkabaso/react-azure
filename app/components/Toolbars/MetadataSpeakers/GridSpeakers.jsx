import React from 'react';
import FaPlus from 'react-icons/lib/fa/plus';
import Speaker from './Speaker.jsx';
import {supportedTranscriptionLanguages, supportedTranscriptionGenders, supportedTranscriptionSides, UILanguage} from '../../../Root/config'
import {metadataDialogLabels} from '../../../strings/metadataDialogLabels';

export default class GridSpeakers extends React.Component {

    eachSpekaer = (speaker, i) => {
        return (
            <Speaker
                key={i}
                id={speaker.id}
                name={speaker.name}
                language={speaker.language}
                gender={speaker.gender}
                side={speaker.side}
                editing={speaker.editing}
                onSubmit={this.props.editSpeaker}
                onRemove={this.props.removeSpeaker}
                languageOptions={supportedTranscriptionLanguages}
                genderOptions={supportedTranscriptionGenders}
                sideOptions={supportedTranscriptionSides}
            />
        )
    }

    renderGridTitles = () => {
        return (
            <div>
                <div className="gridSpeakersSubTitle">
                    {metadataDialogLabels.subTitle[UILanguage]}
                </div>
                <div className="flexRowContainer">
                    <input className="speakerItentifierTitle speakerItentifierCellWidth" value={metadataDialogLabels.speakerIdentifier[UILanguage]} disabled />
                    <input className="speakerCellWidth" value={metadataDialogLabels.speakerName[UILanguage]} disabled />
                    <input className="speakerCellWidth" value={metadataDialogLabels.speakerLanguage[UILanguage]} disabled />
                    <input className="speakerCellWidth" value={metadataDialogLabels.speakerGender[UILanguage]} disabled />
                    <input className="speakerCellWidth" value={metadataDialogLabels.speakerSide[UILanguage]} disabled />
                </div>
            </div>

        )
    }

    render() {
        return (
            <div className="gridSpeakers">
                {this.renderGridTitles()}
                {this.props.speakers.map(this.eachSpekaer)}
                <button onClick={this.props.addSpeaker} id="add"><FaPlus /></button>
            </div>
        )
    }
}