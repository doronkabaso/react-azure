import React from 'react';
import {connect} from 'react-redux';
import MediaTimeLine from './MediaTimeline';
import MediaControls from './MediaControls';
import {InitMediaPlayerShortcuts} from '../../js/KeyboardShortcuts/MediaPlayerShortcuts';
import actions from '../../actions/Media.actions';

class MediaPlayerHelper extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            position: 0
        };
        InitMediaPlayerShortcuts({
            onPlayPause: this.handleShortcutPlayPause,
            rateSteps: 0.1,
            onRateChange: this.handleShortcutRateChange,
            onPositionChange: this.handleShortcutPositionChange,
            onVolumeChange: this.handleShortcutVolumeChange
        });
    }

    handlePositionChange = (position) => {
        this.props.onPositionUpdate(position);
        this.setState({position});
    };

    handleShortcutPlayPause = () => {
        if (this.props.isPlaying) {
            this.props.updatePauseMedia();
        }
        else {
            this.props.updatePlayMedia();
        }
    };

    handleShortcutRateChange = (diff) => {
        if (diff == 0){ //Reset to default
            this.props.handleRateChange(1);
        } else {
            let newRate = this.props.audioRate + diff;
            newRate = Math.round(newRate * 10) / 10; //Round to 1 decimal point
            if (newRate >= 0.5 && newRate <= 3.0) {
                this.props.handleRateChange(newRate)
            }
        }
    };

    handleShortcutPositionChange = (diff) => {
        if(diff < 0) {
            this.handlePositionChange(Math.max(this.state.position + diff, 0))
        } else {
            this.handlePositionChange(Math.min(this.state.position + diff, this.props.duration))
        }
    };

    handleShortcutVolumeChange = (diff) => {
        if (diff < 0) {
            this.props.handleVolumeChange(Math.max(this.props.mediaVolume + diff, 0.0));
        } else {
            this.props.handleVolumeChange(Math.min(this.props.mediaVolume + diff, 1));
        }
    };

    render() {
        return (
            <div>
                <MediaControls
                    position={this.state.position}
                    onPosChange={this.handlePositionChange}/>
                <MediaTimeLine
                    pos={this.state.position}
                    onPosChange={this.handlePositionChange}/>
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
        subtitles: state.media.subtitles
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        updatePlayMedia: () => dispatch({type: actions.play_media}),
        updatePauseMedia: () => dispatch({type: actions.pause_media}),
        handleRateChange: (newRate) => dispatch ({type: actions.handle_rate_change,newRate}),
        handleVolumeChange: (newVolume) => dispatch({type: actions.handle_volume_change,newVolume}),
        handleSubtitleUpdate: (newSubtitle) => dispatch({type: actions.handle_subtitle_update,newSubtitle}),
    }
};

const MediaPlayer = connect(mapStateToProps,mapDispatchToProps)(MediaPlayerHelper);
export default MediaPlayer;