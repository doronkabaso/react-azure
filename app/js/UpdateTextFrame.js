export function scrollToFocusedLine(zeroBasedLineNumber, textEditorContainingDivId) {
    let textEditorContainingDiv = document.getElementById(textEditorContainingDivId);
    let textEditorRootElement = textEditorContainingDiv.children[0]; //Assuming that the editor is the first element in the containing div
    let focusedLineElement = textEditorRootElement.children[zeroBasedLineNumber];
    // if (focusedLineElement !== undefined) {
    //     focusedLineElement.scrollIntoViewIfNeeded();
    // }
}

function setElementHeight(element, height) {
    document.getElementById(element).style.height = height;
}

export function updateSubtitleFrame(zeroBasedLineNo, lineHeight) {

    let subtitleTextArea = document.getElementById("subtitleTextArea");
    let numLines = subtitleTextArea.innerText.split('\n').length;
    let editorInnerDivs = subtitleTextArea.children[0].children;
    let resultHTML = "";

    //adjust subtitleLineCount height
    setElementHeight("subtitleLineCount", subtitleTextArea.scrollHeight.toString() + "px");

    for (let i = 0; i < numLines - 1; i++) {
        if (i === zeroBasedLineNo) {
            resultHTML = resultHTML + '<li class="subtitle_li selected_li">' + (i + 1).toString() + '</li>';
        } else {
            resultHTML = resultHTML + '<li class="subtitle_li">' + (i + 1).toString() + '</li>';
        }

        //concat <Enter> in the line overflows (word wrap)
        let currentLineHeight = editorInnerDivs[i].scrollHeight;

        if (lineHeight !== 0) {
            for (let j = 1; j < Math.round(currentLineHeight / lineHeight); j++) {
                resultHTML = resultHTML + '<li class="subtitle_li_empty"}}>.</li>';
            }
        }
    }

    document.getElementById("subtitleLineCount_ui").innerHTML = resultHTML;
}

export function getCurrentZeroBasedLineNumber(operation) {
    let zeroBasedLineNumber;

    if (operation.type === 'insert_text') { //writing a new text
        zeroBasedLineNumber = operation.path[0];
    }
    if (operation.type === 'split_node') { //writing a new line <ENTER>
        zeroBasedLineNumber = operation.path[0] + 1;
    }
    if (operation.type === 'set_selection' || operation.type === 'set_value') {
        if (operation.properties.focusPath === undefined)//focus on the same line just a different position
        {
            return -1;
        }
        else//focus on a different line then current
        {
            zeroBasedLineNumber = operation.properties.focusPath[0];
        }
    }
    if (operation.type === 'remove_text') { //deleting a some txt from the line
        zeroBasedLineNumber = operation.path[0];
    }
    if (operation.type === 'remove_node') { //deleting a line
        zeroBasedLineNumber = operation.path[0] - 1
    }

    return zeroBasedLineNumber
}