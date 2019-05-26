//React-Redux
import React from 'react';
import {connect} from 'react-redux';
import {UIDirection, Directions} from '../../Root/config';

require('../../sass/mediaControls.scss')

class SubtitleDisplayLabelHelper extends React.Component {
    constructor(props) {
        super(props);
        this.fileNameFloatSide = UIDirection == Directions.RTL ? 'left' : 'right';
    }

    displayLine(line) {
        return(
                <span>
                    {line}<br/>
                </span>
        )
    }

    render() {
        return (
            <div id="subtitleBackground" style={{height: '100px'}}>
                <label id="subtitleOverlay">
                    {this.props.subtitles.map(this.displayLine)}
                </label>
                <label id="audioFileName" style={{float: this.fileNameFloatSide}}>{this.props.audioFileName}</label>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        subtitles: state.media.subtitles,
        audioFileName: state.media.fileName,
    }
};

const SubtitleDisplayLabel = connect(mapStateToProps)(SubtitleDisplayLabelHelper);
export default SubtitleDisplayLabel;
