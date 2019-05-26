export function getTranscript() {
    var subtitleTextArea = document.getElementById("subtitleTextArea");
    var transcript= subtitleTextArea.innerText;

    return transcript;
}