import React from 'react';
import {Dropdown} from 'semantic-ui-react';

export default class AudioTypeDropdown extends React.Component {
    render() {
        return (
            <Dropdown
                onChange={this.props.updateAudioType}
                button
                className="icon"
                floating
                labeled
                options={this.props.audioTypeOptions}
                value={this.props.currentAudioType}/>
        );
    }
}