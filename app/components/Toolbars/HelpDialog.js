import React from 'react';
import {Button, Modal, Table} from 'semantic-ui-react';
import {UILanguage, UIDirection, Directions, ServerUrlBase, desktopVersion} from '../../Root/config';
import {helpDialogLabels} from '../../strings/helpDialogLabels';
import {tagsLabelsEvents} from '../../strings/tagsLabels';
import {labels} from '../../strings/labels';

export default class HelpDialog extends React.Component {
    constructor(props) {
        super(props);
        this.exitButtonSide = UIDirection === Directions.RTL ? 'left' : 'right';
    }

    close = () => this.props.closeDialog();

    renderHelpEventsTableBody = () => {
        return Object.keys(tagsLabelsEvents).map( (tagLabelName, tagIndex) => {
            return (
                <Table.Row className="helpIconTableCell" key={tagIndex}>
                    <Table.Cell>
                        {tagsLabelsEvents[tagLabelName].label[UILanguage]}
                    </Table.Cell>
                    <Table.Cell>
                        {tagsLabelsEvents[tagLabelName].eventSound[UILanguage]}
                    </Table.Cell>
                    <Table.Cell>
                        {tagsLabelsEvents[tagLabelName].shortcutKeys}
                    </Table.Cell>
                    <Table.Cell>
                        {tagsLabelsEvents[tagLabelName].shortcut}
                    </Table.Cell>
                </Table.Row>
            )
        });
    }

    downloadPersianOperatorFromServer = (evt,language) => {
        evt.preventDefault();
        evt.stopPropagation();
        let filename;
        if (language === "persian") {
            filename = 'operator-persian-notes.docx';
        } else {
            filename = 'operator-arabic-notes.docx';
        }

        fetch(ServerUrlBase + 'api/files/' + filename, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT'
            },
            method: 'GET',
        }, {mode: 'no-cors'})
        .then( (response) => {
            this.handleFetchSuccess(response, language)
        });
    }

    handleFetchSuccess = (response, language) => {
        var link = document.createElement('a');
        document.body.appendChild(link);
        link.href = response.url;
        if (language === "persian") {
            link.download = "";
        } else {
            link.download = "";
        }
        link.click();
    }


    renderOperatorGuidelines = () => {
        if (!desktopVersion) {
            return (
                <span>
                    <b>
                        {helpDialogLabels.operatorGuidelinesHeaderSubtitle[UILanguage]}
                    </b>
                    <br/>
                    <a className="titleOperatorGuidelinesDownloadLink" onClick={(evt) => this.downloadPersianOperatorFromServer(evt,"persian")} download="persian_operator_guidelines.docx">{helpDialogLabels.operatorGuidelinesPersian[UILanguage]}</a>
                    <br/>
                        <a className="titleOperatorGuidelinesDownloadLink" onClick={(evt) => this.downloadPersianOperatorFromServer(evt,"arab")}  download="arab_operator_guidelines.docx">{helpDialogLabels.operatorGuidelinesArab[UILanguage]}</a>
                    <br/>

                    <br/>
                </span>
            );
        }
    };

    renderShortcutTagsGuidelines = () => {
        if (!desktopVersion) {
            return (
                <span>
                    <br/>
                    <b>
                        {helpDialogLabels.utilititesShortcutsHeaderSubtitle[UILanguage]}
                    </b>
                    <br/>
                        {helpDialogLabels.FindInContentLabel[UILanguage]} - Ctrl+f
                    <br/>
                        {helpDialogLabels.LoadJsonFromLocalStorage[UILanguage]} - Ctrl+m
                    <br/>
                    <br/>
                    <b>
                    {helpDialogLabels.tagsShortcutsEventsSubtitle[UILanguage]}
                    </b>
                    <Table className="tableShortcuts" striped celled>
                    <Table.Header className="tableHeaderShortcutTitles">
                        <Table.HeaderCell>
                            {labels.helpTableTitleShortcutName[UILanguage]}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            {labels.helpTableTitleEventSound[UILanguage]}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                             {labels.helpTableTitleShortcut[UILanguage]}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            {labels.helpTableTitleTimlul[UILanguage]}
                        </Table.HeaderCell>
                        </Table.Header>
                        <Table.Body>
                            {this.renderHelpEventsTableBody()}
                        </Table.Body>
                    </Table>
                    <br/>
                    <b>
                    {helpDialogLabels.versionNumber[UILanguage]}
                    </b>

                    <br/>
                </span>
            );
        }
    };



    render() {
        return (
            <Modal size="small" open={this.props.open} onClose={this.close}>
                <Modal.Header
                    style={{direction: 'rtl', textAlign: 'center', verticalAlign: 'central', lineHeight: '30px'}}>
                    {helpDialogLabels.subTitle[UILanguage]}
                </Modal.Header>
                <Modal.Content style={{textAlign: 'center', direction: 'rtl', width: '93%'}}>

                    {this.renderOperatorGuidelines()}

                    <b>
                        {helpDialogLabels.tagsShortcutsHeaderSubtitle[UILanguage]}
                    </b>
                    <br/>
                    {helpDialogLabels.addTimeTagLabel[UILanguage]} - Ctrl+0
                    <br/>
                    {helpDialogLabels.addRightSpeakerTagLabel[UILanguage]} -
                    Alt+y
                    <br/>
                    {helpDialogLabels.addLeftSpeakerTagLabel[UILanguage]} - Alt+s
                    <br/>
                    {/*{helpDialogLabels.switchAllSpeakersTagsLabel[UILanguage]} - Alt+r*/}
                    {/*<br/>*/}
                    {/*{helpDialogLabels.addSpeakersTagsNumber[UILanguage]} - Alt+ {1}-{9}*/}
                    {/*<br/>*/}



                    {this.renderShortcutTagsGuidelines()}


                    {helpDialogLabels.footerLabel[UILanguage]}

                    <b>
                        {helpDialogLabels.versionNumber[UILanguage]}
                    </b>
                </Modal.Content>
                <Modal.Actions style={{textAlign: this.exitButtonSide, padding: '0 10px'}}>

                    <Button positive className="exitHelpDialogButton"
                            onClick={this.props.closeDialog}>{helpDialogLabels.exitButtonLabel[UILanguage]}</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}