import React from 'react'
import {Dropdown} from 'semantic-ui-react'
import {UILanguage} from '../../Root/config';
import {metadataDialogLabels} from '../../strings/metadataDialogLabels';

export default class QualityDropdown extends React.Component {
    render() {
        const qualityOptions = [{
            value: metadataDialogLabels.qualityHigh[UILanguage],
            text: metadataDialogLabels.qualityHigh[UILanguage],
        },{
            value: metadataDialogLabels.qualityMedium[UILanguage],
            text: metadataDialogLabels.qualityMedium[UILanguage],
        },{
            value: metadataDialogLabels.qualityLow[UILanguage],
            text: metadataDialogLabels.qualityLow[UILanguage],
        }];

        return (
            <Dropdown
                button
                className="icon"
                floating
                labeled
                options={qualityOptions}
                fluid
                selection
                defaultValue={metadataDialogLabels.qualityHigh[UILanguage]}/>
        )
    }
}