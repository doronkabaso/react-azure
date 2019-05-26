import React from 'react';
import FaPencil from 'react-icons/lib/fa/pencil';
import FaTrash from 'react-icons/lib/fa/trash';
import FaFloppyO from 'react-icons/lib/fa/floppy-o';
import {Dropdown} from 'semantic-ui-react'

export default class Speaker extends React.Component {
    edit = () => {
        this.props.onSubmit({
            name: this.props.name,
            language: this.props.language,
            gender: this.props.gender,
            side: this.props.side,
            editing: true,
        },
        this.props.id);
    }

    remove = () => {
        this.props.onRemove(this.props.id);
    }

    save = (e) => {
        e.preventDefault();
        this.props.onSubmit({
            name: this._newName.value,
            language: (this._newLanguage) ? this._newLanguage : this.props.language,
            gender: (this._newGender) ? this._newGender : this.props.gender,
            side: (this._newSide) ? this._newSide : this.props.side,
            editing: false,
            },
            this.props.id);
    }

    changeLanguage = (event, choice) => {
        this._newLanguage = choice.options.find(option => option.key === choice.value);
    };

    changeGender = (event, choice) => {
        this._newGender = choice.options.find(option => option.key === choice.value);
    };

    changeSide = (event, choice) => {
        this._newSide = choice.options.find(option => option.key === choice.value);
    };

    renderForm = () => (
                <div>
                    <div className="flexRowContainer">
                        <form onSubmit={this.save}>
                            <textarea value={this.props.id} className="editSpeakerItentifierTitle" disabled/>
                            <textarea className="speakerCellSize" ref={(input) => { this._newName = input; }} defaultValue={this.props.name} />
                            <Dropdown
                                onChange={this.changeLanguage}
                                className="speakerCellWidth"
                                button
                                floating
                                labeled
                                options={this.props.languageOptions}
                                defaultValue={this.props.language.value}
                            />
                            <Dropdown
                                onChange={this.changeGender}
                                className="speakerCellWidth"
                                button
                                floating
                                labeled
                                options={this.props.genderOptions}
                                defaultValue={this.props.gender.value}
                            />
                            <Dropdown
                                onChange={this.changeSide}
                                className="speakerCellWidth"
                                button
                                floating
                                labeled
                                options={this.props.sideOptions}
                                defaultValue={this.props.side.value}
                            />
                            <button id="save"><FaFloppyO /></button>
                        </form>
                    </div>
                </div>
            );

    renderDisplay = () => (
            <div className="flexRowContainer">
                <span><button onClick={this.edit} id="edit"><FaPencil/></button></span>
                <span><button onClick={this.remove} id="remove"><FaTrash/></button></span>
                <input className="speakerItentifierCellWidth" value={this.props.id} disabled />
                <input className="speakerCellWidth" value={this.props.name} disabled />
                <input className="speakerCellWidth" value={this.props.language.text} disabled />
                <input className="speakerCellWidth" value={this.props.gender.text} disabled />
                <input className="speakerCellWidth" value={this.props.side.text} disabled />
            </div>
        );

    render() {
        return this.props.editing ? this.renderForm() : this.renderDisplay();
    }
}
