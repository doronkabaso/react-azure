import * as subtitleUtils from './SubtitleLabel.js'

export function playMedia(){
    let textLines = document.getElementById("subtitleTextArea").innerText.split('\n');
    let textTimeTuples = subtitleUtils.getTimeTuples(textLines);

    subtitleUtils.updateSubtitlesLabel = subtitleUtils.updateSubtitlesLabel.bind(this);
    this.props.updatePlayMedia(function(){subtitleUtils.updateSubtitlesLabel(textLines,textTimeTuples)});
}

export function pauseMedia(){
    this.props.updatePauseMedia(this.props.intervalId);
}