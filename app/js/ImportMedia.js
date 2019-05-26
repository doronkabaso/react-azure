import {AudioCacheUrl, ServerUrlBase, UILanguage} from '../Root/config'
import {helpDialogLabels} from '../strings/helpDialogLabels';
import {fetchWrapper} from '../js/ServerCommunication'

export function importFileWizard(dispatchedFunction){
    document.getElementById("fileLoader").click()
    document.getElementById("fileLoader").onchange = function (e) {
        var files = e.target.files;
        this.loadFile(files,dispatchedFunction);
    }.bind(this)
}

export function loadFile(files,dispatchedFunction,currentUser) {
    if (files[0].type.substr(0, 5) == 'audio') {
        var URL = window.URL || window.webkitURL;
        var fileBlob = URL.createObjectURL(files[0]);
        let mJson = JSON.parse(localStorage.getItem("tagger-json"));
        if (mJson === null) {
            mJson = {};
        }
        mJson.fileName = files[0].name;
        mJson.uuid = '';
        mJson.timestamp ='';
        mJson.currentUser = currentUser;
        localStorage.setItem("tagger-json",JSON.stringify(mJson));
        dispatchedFunction(fileBlob,files[0].name,files[0])
    }
}

export function handleDragOver(evt){
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

export function handleFileSelect(evt, dispatchedFunction){
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files;
    this.loadFile(files,dispatchedFunction)
}

export function validVersionNumber(dispatchedFunction) {
    fetchWrapper({
        url: ServerUrlBase + 'validTaggerVersion',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'GET',
        onReceive: (response) => {
            if (helpDialogLabels.versionNumber[UILanguage] !== response.versionNumber){
                dispatchedFunction(true);
            }
        },
        onError: () => {console.log("error while validTaggerVersion");}
    });
}

export function downloadAudioFileFromServer (session_uuid, filename, dispatchedFunction) {
    fetch(AudioCacheUrl+session_uuid, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT'
        },
        method: 'GET',
    }, {mode: 'no-cors'})
        .then( (response) => {
            //this.handleFetchAudio(response,filename, dispatchedFunction)
            handleLoadAudioFile(response.url,filename,dispatchedFunction)
        })
        .then((response) =>{
            this.handleFetchAudioError(response)
        });
}

function handleLoadAudioFile(url,filename,dispatchedFunction) {
    let request = new XMLHttpRequest();
    request.open('GET',url,true);
    request.responseType='blob';
    request.addEventListener("load", function () {
        let reader = new FileReader();
        reader.readAsDataURL(request.response);
        reader.onload = function(e) {
            let audioFile = new File([request.response],filename)
            let fileBlob = URL.createObjectURL(audioFile);
            dispatchedFunction(fileBlob,filename,audioFile);
        };
    })
    request.send();
}

export function handleFetchAudio (response,filename, dispatchedFunction) {
    if (response && response.url) {
        let audioFile = new File([response.url], filename);
        dispatchedFunction(response.url,filename,audioFile);
    }
}

export function handleFetchAudioError (response) {
    console.log(response + "handleFetchAudioError")
}

