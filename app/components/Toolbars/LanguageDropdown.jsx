import React from 'react';
import {Dropdown} from 'semantic-ui-react';

export default class LanguageDropdown extends React.Component {
    render() {
        return (
                <Dropdown
                    onChange={this.props.updateLanguage}
                    button
                    className="icon"
                    floating
                    labeled
                    icon="world"
                    options={this.props.languageOptions}
                    value={this.props.currentLanguage}
                />
        );
    }
}