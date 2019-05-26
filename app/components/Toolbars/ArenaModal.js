import React from 'react';
import {Modal, Button, Dropdown} from 'semantic-ui-react';
import {labels} from '../../strings/labels'
import {UIDirection, Directions, UILanguage, emptyValue} from '../../Root/config'

const BUTTON_SIZE = 'large'

export default class ArenaModal extends React.Component {
    constructor(props) {
        super(props);
        this.directionAlertTitle = UIDirection == Directions.RTL ? 'rtl' : 'ltr';
        this.state = {selectedArena: null};
    }

    approve = () => {
        if (this.state.selectedArena !== emptyValue && this.state.selectedArena !== null) {
            this.props.closeDialog();
        }
    }

    changeArena = (event, choice) => {
        this.setState({selectedArena: choice.value});
        this.props.onChooseArena(choice.value);
    }

    render(){
        return (
            <div>
                <Modal size={'small'} open={this.props.open} onClose={this.close}>
                    <Modal.Header className={this.directionAlertTitle}>
                        {labels.ChooseArenaMessage[UILanguage]}
                    </Modal.Header>
                    <div className="flexColumnContainer">
                        <Dropdown
                            id="dropdownArena"
                            onChange={this.changeArena}
                            className="dropdownChooseArena"
                            button
                            floating
                            labeled
                            options={this.props.arenaOptions}
                            defaultValue={this.props.arenaOptions[0].value}
                        />

                    </div>

                    <Button id="confirmAddLeftTags" onClick={()=>{
                        this.approve(); }}
                            color='teal' size={BUTTON_SIZE}>{labels.Confirm[UILanguage]}
                    </Button>
                </Modal>
            </div>
        )
    }
}