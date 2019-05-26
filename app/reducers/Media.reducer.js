import actions from '../actions/Media.actions';

let media = (state = {response: []}, action) => {
    switch (action.type){
        case actions.play_media:
            return Object.assign({}, state, {isPlaying:true});

        case actions.pause_media:
            return Object.assign({}, state, {isPlaying:false});

        case actions.handle_subtitle_update:
            return Object.assign({}, state, {subtitles:action.newSubtitle});

        case actions.handle_pos_change:
            return Object.assign({}, state, {pos:action.pos});

        case actions.load_audio_file:
            return Object.assign({}, state, {audioFile:action.audioFile, fileName:action.fileName, uploadedAudioFile:action.uploadedAudioFile});

        case actions.handle_new_duration:
            return Object.assign({}, state, {duration:action.newDuration});

        case actions.handle_rate_change:
            return Object.assign({}, state, {audioRate:action.newRate});

        case actions.handle_volume_change:
            return Object.assign({}, state, {mediaVolume:action.newVolume});

        case actions.reset_meta_settings:
            return Object.assign({}, state, {uuid:action.metaSettings.uuid, timestamp:action.metaSettings.timestamp, version:action.metaSettings.version});

        case actions.update_version:
            return Object.assign({}, state, {version:action.version});

        case actions.set_audio_file_name:
            return Object.assign({}, state, {fileName:action.fileName});

        case actions.set_current_user:
            return Object.assign({}, state, {currentUser:action.currentUser});


        default:
            return state
    }
}

export default media;