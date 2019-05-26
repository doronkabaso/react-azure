import React from 'react';
import {connect} from 'react-redux';
import actions from '../../actions/Media.actions';
import {labels} from '../../strings/labels';
import {UIDirection, Directions, UILanguage} from '../../Root/config';

require('../../sass/main.scss');

class SecondaryToolbarHelper extends React.Component {

    constructor(props,context){
        super(props,context);
        this.fontSizeFloatSide = UIDirection == Directions.RTL ? 'right' : 'left';
    }

    render() {
        return (
            <div id="subtitleToolbar">
                <span style={{float: this.fontSizeFloatSide}}>{labels.FontSizeSelectorLabel[UILanguage]}</span>
                <input
                        id="fontSizeSlider"
                        style={{float: this.fontSizeFloatSide}}
                        type="range"
                        min="12"
                        max="40"
                        value={this.props.fontSize}
                        onChange={e=>this.props.handle_fontsize_change(e.target.value)}
                        // onChange={e=>console.log(e.target.value)}
                        /*"changeFontSizeSlider();"*/ /*onmousemove="changeFontSizeSlider();" onclick=""*//>
                <span style={{float: this.fontSizeFloatSide}}>{this.props.fontSize}</span>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        audioFileName: state.secondaryToolbar.audioFileName,
        fontSize: state.secondaryToolbar.fontSize
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        handle_fontsize_change: (newFontSize) => dispatch({type: actions.handle_fontsize_change,newFontSize})
    }
};

const SecondaryToolbar = connect(mapStateToProps,mapDispatchToProps)(SecondaryToolbarHelper);
export default SecondaryToolbar