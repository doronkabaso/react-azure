import uuidv4 from 'uuid' //random
import {fetchWrapper} from './ServerCommunication'
import {
    goTagger,
    ServerUrlBase,
    goTaggerUsername,
    MessageNotSavedToHbase,
    MessageSavedToHbase,
    UILanguage,
    desktopVersion
} from '../Root/config'
import {labels} from "../strings/labels";
import * as azureManager from "./AzureManager";



export function saveTranscriptAndAudio(suffix,language,fileName,uploadedAudioFile,metaSettings,currentUser,arenaNumber,audioType,dispatchedFunction) {
    let json_data;
    let uploadToHbase = true;
    let now = new Date();
    let currentMonth = ('0'+(now.getMonth()+1)).slice(-2);
    let currentHours = ('0'+(now.getHours()+1)).slice(-2);
    let currentMinutes = ('0'+(now.getMinutes()+1)).slice(-2);
    let currentSeconds = ('0'+(now.getSeconds()+1)).slice(-2);
    // yyyy-MM-dd HH:mm:ss
    let localDateTimeString =  now.getFullYear().toString() + "-" + currentMonth  + "-" + now.getDate().toString()  + " " +
        currentHours.toString() + ':' + currentMinutes.toString() +':' + currentSeconds.toString();


    if (metaSettings.uuid=='') {
        json_data = {
            subtitles: '',
            language: language,
            fileName: fileName,
            suffix: suffix,
            uuid: uuidv4(),
            timestamp: localDateTimeString,
            lastModified: localDateTimeString,
            version: 1,
            arenaNumber: arenaNumber,
            currentUser: currentUser,
            audioType: audioType,
            source: 'tagger'
        }
    } else {
        json_data = {
            subtitles: '',
            language: language,
            fileName: fileName,
            suffix: suffix,
            uuid: metaSettings.uuid,
            timestamp: metaSettings.timestamp,
            lastModified: localDateTimeString,
            version: metaSettings.version,
            arenaNumber: arenaNumber,
            currentUser: currentUser,
            audioType: audioType,
            source: 'tagger'
        }
        uploadToHbase = true;
    }
    const subtitleText = document.getElementById("subtitleTextArea").innerText;
    json_data.subtitles = subtitleText;

    if (localStorage.getItem(goTaggerUsername)) {
        json_data.currentUser = localStorage.getItem(goTaggerUsername);
    }
    if (desktopVersion) {
        // saveJsonToClientSide(json_data,suffix)
       azureManager.postRequest('http://localhost:1239/api/upload_string', JSON.stringify(json_data))
          .then(data => console.log(data)) 
          .catch(() => console.log("error upload_json"))
    } else {
        saveData(json_data,uploadedAudioFile,uploadToHbase,dispatchedFunction);
    }
    return json_data.uuid;
}

const saveJsonToClientSide = (json_data,suffix) => {

    // let wsshell = new ActiveXObject("wscript.shell");
    // let username = wshhell.ExpandEnviorenmentStrings("%username%");


    var download = "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(json_data));
    var link = document.createElement('a');
    document.body.appendChild(link);
    link.href = download;

    var fileFullName = document.getElementById('audioFileName').innerText;
    var suffixStartIndex = fileFullName.indexOf(".")
    var fileShortName = fileFullName.substr(0,suffixStartIndex);

    link.download = fileShortName+'.'+suffix+'.json';
    link.click();
}

const saveData = (json_data,uploadedAudioFile,uploadToHbase,dispatchedFunction) => {
    fetchWrapper({ //IP instead of hostname, for HFK support
        url: ServerUrlBase+'api/saveJsonToElastic/'+goTagger,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(json_data),
        onReceive: (response) => handleSaveDataResponse(response,uploadedAudioFile,json_data.timestamp,json_data.uuid,uploadToHbase,dispatchedFunction),
        onError: () => handleSaveDataError()
    });
}

const saveAudio = (uploadedAudioFile,timestamp,uuid,dispatchedFunction) => {
    const formData = new FormData();
    formData.append('file',uploadedAudioFile)
    formData.append('uuid',uuid)
    formData.append('sitename',goTagger);

    fetchWrapper({ //IP instead of hostname, for HFK support
        url: '',
        method: 'POST',
        body: formData,
        onReceive: (response) => {
            if (JSON.parse(response).Success) {
                dispatchedFunction(labels.SuccessSaveToHbase[UILanguage] );
            } else {
                dispatchedFunction(labels.FailToSaveToHbase[UILanguage] );
            }
        },
        onError: () => {
            console.log("error")
            dispatchedFunction(labels.FailToSaveToHbase[UILanguage] );
        }
    });
}

const handleSaveDataResponse = (response,uploadedAudioFile,timestamp,uuid,uploadToHbase,dispatchedFunction) => {
    if (uploadToHbase) {
        saveAudio(uploadedAudioFile,timestamp,uuid,dispatchedFunction);
    }
};

const handleSaveDataError = () => {
    console.log("error")
};