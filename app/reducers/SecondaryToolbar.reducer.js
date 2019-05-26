import actions from '../actions/Media.actions.js'

let secondaryToolbar = (state = {response: []}, action) => {
    switch (action.type){
        case actions.load_audio_file:
             return Object.assign({}, state, {audioFileName:action.fileName});

        case actions.handle_fontsize_change:
            return Object.assign({}, state, {fontSize:action.newFontSize});

        default:
            return state
    }
}

export default secondaryToolbar;