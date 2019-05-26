const Languages = Object.freeze({
    Hebrew: 'Hebrew',
    English: 'English'
});

export const Directions = Object.freeze({
    RTL: 'rtl',
    LTR: 'ltr'
});

export const emptyValue = '-----';


export const supportedLanguages = [
    {key: 'Farsi',value: 'Farsi',text: 'Farsi'}
];

export const supportedPlaybackRates = [
    {key: "0.5", text: '0.5x',value: '0.5x'},
    {key: "0.75", text: '0.75x',value: '0.75x'},
    {key: "1.0", text: '1x',value: '1x'},
    {key: "1.25", text: '1.25x',value: '1.25x'},
    {key: "1.5", text: '1.5x',value: '1.5x'},
    {key: "2.0", text: '2x',value: '2x'}
];

//the values should be as written in the server side
export const supportedTranscriptionGenders = [
    {key: 'Man',value: 'Man',text: 'Man'},
    {key: 'Woman',value: 'Woman',text: 'Woman'}
];

//the values should be as written in the server side
export const supportedTranscriptionSides = [
    {key: 'Empty', value: '-----',text: '-----'},
    {key: 'Right', value: 'Right',text: 'Right'}
];

export const supportedArenaOptions = [
    {key: 'Empty',value: emptyValue,text: emptyValue}
];

export const defaultType = '-----';

export const userArenaNumber = "user-arena-number";

export const playerConfig = {
    enableDragSelection: false
};

export const UILanguage = Languages.Hebrew;

export const UIDirection = Directions.RTL;

export const TextEditorDirection = Directions.RTL;

export const goTaggerUsername = "go-tagger-username";

export const MessageSavedToHbase = "Saved To Hbase";

export const MessageNotSavedToHbase = "Not Saved To Hbase";

export const goTagger = "go-tagger";

let username = window.location.search;
if (username!=="" && username!==undefined) {
    localStorage.setItem(goTaggerUsername,username.split("=")[1]);
}


let _ServerUrlBase;
let _AudioChache;

export const desktopVersion = true;
const DEV_STATE = true;

// if (DEV_STATE) {
_ServerUrlBase = 'http://localhost:1239/';
// } else {
//     _ServerUrlBase = 'http://localhost:1239/';
// }

_AudioChache =  "http://localhost:1239/";

export const ServerUrlBase = _ServerUrlBase;
export const AudioCacheUrl = _AudioChache;

if (desktopVersion) {
    localStorage.setItem(goTaggerUsername,"desktop_source@gmail.com");
}

let supportedLanguagesTemp = [];

if (UILanguage == Languages.Hebrew) {
    supportedLanguagesTemp = [
    ];
} else {
    supportedLanguagesTemp = [
        {key: 'Empty',value: emptyValue,text: emptyValue},
        {key: 'Farsi',value: 'Farsi',text: 'Farsi'}
    ];
}

let supportedAudioTypesTemp = [];
if (UILanguage == Languages.Hebrew) {
    supportedAudioTypesTemp = [
    ];
} else {
    supportedAudioTypesTemp = [
        {key: emptyValue, value: emptyValue, text: emptyValue},
    ];
}

export const supportedAudioTypes = supportedAudioTypesTemp;

export const supportedTranscriptionLanguages = supportedLanguagesTemp;

export const ArabLanguageShortName = 'Arab';

export const MAX_LINE_DIFF_HIGHLIGHT = 15;
export const MIN_LINE_DIFF_HIGHLIGHT = 0.1;


export const jsonKeyToLocalStorage =  'tagger-json';
let leftTagTemp, rightTagTemp;

if (UILanguage == Languages.Hebrew) {
    leftTagTemp = '<שמאל>';
    rightTagTemp = '<ימין>';
} else {
    leftTagTemp = '<چپ>';
    rightTagTemp = '<راست>';
}

export const leftTag = leftTagTemp;
export const rightTag = rightTagTemp;

export const notAllowedCharacters = '!.?,#%*&/;`~+=@"\\-<>؟()'

