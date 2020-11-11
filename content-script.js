function highlightSelection(text) {
    highlightRange(userSelection);

}

function highlightRange(range) {
    var newNode = document.createElement("div");
    newNode.setAttribute(
        "style",
        "background-color: yellow; display: inline;"
    );
    range.surroundContents(newNode);
}

var selectedText = window.getSelection().toString()
chrome.extension.sendRequest(selectedText);

var userSelection = window.getSelection().getRangeAt(0);
highlightSelection(userSelection)