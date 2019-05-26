
export function loadFile(files,dispatchedFunction) {
    if (files[0].type.substr(0, 5) == 'json') {
        var URL = window.URL || window.webkitURL;
        var fileBlob = URL.createObjectURL(files[0])
        dispatchedFunction(fileBlob,files[0].name,files[0])
    }
}

export function handleFileSelect(evt, dispatchedFunction){
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files;
    this.loadFile(files,dispatchedFunction)
}