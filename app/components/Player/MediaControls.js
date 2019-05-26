//React-Redux
import React from 'react';
import {connect} from 'react-redux';
//Components
import { PlayButton, PauseButton, ProgressBar,TimeMarker } from 'react-player-controls';
import actions from '../../actions/Media.actions';
import * as mediaUtil from  '../../js/Media';
import {supportedPlaybackRates} from '../../Root/config'

require('../../sass/mediaControls.scss')


class PlayerControlsHelper extends React.Component {
    constructor(props) {
        super(props);
        mediaUtil.playMedia = mediaUtil.playMedia.bind(this);
        mediaUtil.pauseMedia = mediaUtil.pauseMedia.bind(this);
        this.state={
            inputCaption: "1x",
            pendingRate: false
        };
    }

    handleEnterPress(evt){
        if (evt.keyCode==13){
            this.handleRateChange()
        }
    }

    handleRateChange() {
        let submittedRate = Math.round(parseFloat(this.state.inputCaption)*10)/10

        if (submittedRate>3)
            submittedRate = 3
        else if (submittedRate<0.5)
            submittedRate = 0.5
        else if (isNaN(submittedRate))
            submittedRate = 1

        this.props.handleRateChange(submittedRate)

        this.setState({
            pendingRate: false,
            inputCaption: submittedRate+'x'
        })
    }

    handleVolumeChange(e) {
        this.props.handleVolumeChange(e)
    }

    handleProgressbarSeek(time){
        this.props.onPosChange(time)
    }

    renderSelectRateInputOptions = () => {
        return supportedPlaybackRates.map((option) => {
                    return (
                        <option key={option.key} value={option.value}>{option.text}</option>
                    );
                });
    };

    render() {
        return (
            <div className="playerBackground">

                <div style={{position: 'relative',display: "flex",height: '50px', "justifyContent": 'center' }}>
                    {
                        this.props.isPlaying && this.props.isPlayable
                            ? <PauseButton
                            isEnabled={this.props.isPlaying}
                            onClick={()=>mediaUtil.pauseMedia()}
                        />
                            : <PlayButton
                            isEnabled={this.props.isPlayable}
                            onClick={()=>mediaUtil.playMedia()}
                            className="PlayButton"
                        />
                    }
                    <select
                        className="playbackRateInput"
                        type="text"
                        value={this.state.pendingRate==true?this.state.inputCaption:this.props.audioRate+'x'}
                        onChange={(evt)=>this.setState({inputCaption: evt.target.value,pendingRate: true})}
                        onKeyUp={evt=>this.handleEnterPress(evt)}
                        onKeyDown={()=>{}}
                        onBlur={()=>this.handleRateChange()}
                        defaultValue={supportedPlaybackRates[2]}>
                            {this.renderSelectRateInputOptions()}
                    </select>
                </div>
                <div>
                    <ProgressBar
                        totalTime={this.props.duration}
                        currentTime={this.props.position}
                        isSeekable={true}
                        onSeek={time=>this.handleProgressbarSeek(time)}
                    />
                    <TimeMarker
                        totalTime={this.props.duration}
                        currentTime={this.props.position}
                        markerSeparator=" / "
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isPlaying: state.media.isPlaying,
        isPlayable: state.media.isPlayable,
        duration: state.media.duration,
        audioRate: state.media.audioRate,
        mediaVolume: state.media.mediaVolume,
        intervalId: state.media.intervalId,
        subtitles: state.media.subtitles
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        updatePlayMedia: (functionInterval) => dispatch({type: actions.play_media,functionInterval}),
        updatePauseMedia: (intervalId) => dispatch({type: actions.pause_media,intervalId}),
        updateIsPlaying: (newStatus,intervalId) => dispatch({type: actions.update_is_playing,newStatus,intervalId}),
        handleRateChange: (newRate) => dispatch ({type: actions.handle_rate_change,newRate}),
        handleVolumeChange: (newVolume) => dispatch({type: actions.handle_volume_change,newVolume}),
        handleSubtitleUpdate: (newSubtitle) => dispatch({type: actions.handle_subtitle_update,newSubtitle}),
    }
};

const PlayerControls = connect(mapStateToProps,mapDispatchToProps)(PlayerControlsHelper);
export default PlayerControls;
