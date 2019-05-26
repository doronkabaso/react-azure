import {ArabLanguageShortName} from './config'

const state = {
    media: {
        uploadedAudioFile: '',
        audioFile: '',
        fileName: '',
        isPlaying: false,
        isPlayable: true,
        pos: 0,
        duration: 0,
        audioRate: 1.0,
        mediaVolume: 0.5,
        intervalId: 0,
        subtitles: [],
        uuid: '',
        timestamp: '',
        version: 0,
        currentUser: '',
    },
    secondaryToolbar: {
        audioFileName: '',
        fontSize: 20
    },
    editor: {
        userTaggingData:[],
        isRenderMarkErrors: false,
        selectedLineNo: 0,
        missingKeywords: {
            Farsi: ['word'],
            Arab: ['test']
        },
        language: '-----',
        isLoading: false,
        speakers: [],
        transcript: {
            document: {
                "nodes": [//Every 'node' is a new line
                    {
                        "kind": "block",
                        "type": "check-list-item",
                        "nodes": [
                            {
                                "kind": "text",
                                "leaves": [
                                    {
                                        "text": ""
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        updatingTranscript: true,
        isHelpIconsOpen: false,
        anchorOffset: 0,
        openSpeakersModal: false,
        tagLeftToAllLines: false,
        arenaNumber: null,
        audioType: '-----',
    }
};

export default state;