import React from 'react';
import {connect} from 'react-redux';
import FaTrash from "react-icons/lib/fa/trash";
import {labels} from "../../strings/labels";
import {UILanguage} from "../../Root/config";
import ConfirmationModal from "./ConfirmationModal";
import Draggable from 'react-draggable';
import {Button} from "semantic-ui-react";
import {metadataDialogLabels} from "../../strings/metadataDialogLabels";

const imgPath = 'assets/img/';

class TaggedDataSidebarHelper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userTaggingData: [],
            showConfirmationModal: false,
            uuid: null
        }
        this.search = "";
    }

    handleSidebarHide = () => this.props.hideSidebar();

    componentDidUpdate() {
        if (this.isUserTaggedDataUpdated(this.props.userTaggingData)) {
            this.setState({userTaggingData: this.props.userTaggingData})
        }
    }

    componentDidMount() {
        this.setState({userTaggingData: this.props.userTaggingData})
    }

    isUserTaggedDataUpdated = (userTaggingData) => {
        if (userTaggingData.length !== this.state.userTaggingData.length) {
            return true;
        }
        userTaggingData.forEach( (item,index) => {
            if (item.lastModified !== this.state.userTaggingData[index].lastModified) {
                return true;
            }
        })
        return false;
    }

    getJsonFromElastic = (uuid) => {
        this.props.onHandleGetJsonFromElastic(uuid);
    }

    renderConfirmationModal = (uuid) => {
        this.setState({
            uuid,
            showConfirmationModal: true
        })
    }

    drawConfirmationModal = () => {
        if (this.state.showConfirmationModal) {
            let message = labels.ConfirmationRemoveJsonMessage[UILanguage];
            return (
                <ConfirmationModal open={true} message={message}
                                   onApproval={() => this.removeJson()} onClose={this.handleSidebarHide}/>
            );
        }
    }

    closeRemoveJson = () => {
        this.setState({
            showConfirmationModal: false
        });
    }

    removeJson = () => {
        this.props.handleDeleteJsonFromElastic(this.state.uuid);
        let userTaggedData = this.state.userTaggingData.filter((item) => item.uuid !== this.state.uuid);
        this.setState({userTaggingData: userTaggedData});
    }

    drawUserTaggingData = () => {
        return this.state.userTaggingData.map((item) => {
            return (
                <div className="flexRowContainer" key={item.uuid}>
                    <button onClick={() => this.renderConfirmationModal(item.uuid)}><FaTrash/></button>
                    <div className="itemTaggedDataText" onClick={() => this.getJsonFromElastic(item.uuid)} >
                          {item.lastModified} &nbsp;&nbsp;&nbsp;&nbsp; {item.fileName}
                    </div>
                </div>

            )
        });
    }


    handleSearchUser = (e) => {
        this.props.onHandleSearchUser(e.target.value);
    }

    handleSearchTaggedData = (e) => {
        this.props.onHandleSearchTaggedData(this.search.value);
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.handleSearchTaggedData(e);
        }
    }

    handleKeyUp = () => {
        if (this.search.value=="") {
            this.props.onHandleSearchTaggedData(this.search.value);
        }
    }

    drawSearchTaggingData = () => {
        return (
            <div className="flexRowContainer">
                <input className="inputSidebar" placeholder={labels.PlaceHolderSearchByFileName[UILanguage]} defaultValue={this.props.searchFieldValue} ref={(input) => { this.search = input; }}  type="text" onKeyPress={(e) => this.handleKeyPress(e)} onKeyUp={() => this.handleKeyUp() }/>
                <img className="searchIcon" src={imgPath + 'search.png'} onClick={() => this.handleSearchTaggedData()}/>
            </div>

        )
    }


    render() {
        return (
            <Draggable>
                <div className="panel previousTaggingPanel ">
                    <div className="flexColumnContainer">
                        {this.drawSearchTaggingData()}
                        {this.drawUserTaggingData()}
                        {this.drawConfirmationModal()}
                    </div>

                    <Button className="exitButtonEditSpeakers" positive
                            onClick={this.props.hideSidebar}>{metadataDialogLabels.exitButtonLabel[UILanguage]}</Button>
                </div>
            </Draggable>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userTaggingData: state.editor.userTaggingData,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
    }
};

const TaggedDataSidebar = connect(mapStateToProps, mapDispatchToProps)(TaggedDataSidebarHelper);
export default TaggedDataSidebar