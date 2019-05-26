import actions from '../actions/Editor.actions.js';

let editor = (state = {response: []}, action) => {
    switch (action.type) {

        case actions.update_selected_line_number:
            return Object.assign({}, state, {selectedLineNo: action.selectedLineNo});

        case actions.update_missing_keywords:
            let missingKeywords = {};
            missingKeywords[action.language] = action.missingKeywords;
            return Object.assign({}, state, {missingKeywords: missingKeywords});

        case actions.update_language:
            return Object.assign({}, state, {language: action.language});

        case actions.update_is_loading:
            return Object.assign({}, state, {isLoading: action.bool});

        case actions.update_speakers:
            return Object.assign({}, state, {speakers: action.speakers});

        case actions.update_transcript:
            return Object.assign({}, state, {transcript: action.transcript});

        case actions.is_updating_transcript:
            return Object.assign({}, state, {updatingTranscript: action.updatingTranscript});

        case actions.update_is_help_icons_open:
            return Object.assign({}, state, {isHelpIconsOpen: action.isHelpIconsOpen});

        case actions.update_anchor_offset:
            return Object.assign({}, state, {anchorOffset: action.anchorOffset});

        case actions.toggle_tag_left_to_all_lines:
            return Object.assign({}, state, {tagLeftToAllLines: action.tagLeftToAllLines});

        case actions.toggle_render_mark_errors:
            return Object.assign({}, state, {isRenderMarkErrors: action.isRenderMarkErrors});

        case actions.set_arena_number:
            return Object.assign({}, state, {arenaNumber: action.arenaNumber});

        case actions.set_user_tagging_data:
            return Object.assign({}, state, {userTaggingData: action.userTaggingData});

        case actions.update_audio_type:
            return Object.assign({}, state, {audioType: action.audioType});

        default:
            return state
    }
};

export default editor;