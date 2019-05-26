import React from 'react';
import {Modal, Button} from 'semantic-ui-react';
import {labels} from '../../strings/labels'
import {UIDirection, Directions, UILanguage} from '../../Root/config'

const BUTTON_SIZE = 'large'

export default class AlertModal extends React.Component {
    constructor(props) {
        super(props);
        this.directionAlertTitle = UIDirection == Directions.RTL ? 'rtl' : 'ltr';
    }

    close = () => this.props.onClose();

    render(){
        return (
            <div>
                <Modal size={'small'} open={this.props.open} onClose={this.close}>
                    <Modal.Header className={this.directionAlertTitle}>
                        {this.props.message}
                    </Modal.Header>
                    <Button onClick={()=>{
                        this.close(); }}
                            color='teal' size={BUTTON_SIZE}>{labels.Close[UILanguage]}
                    </Button>
                </Modal>
            </div>
        )
    }
}