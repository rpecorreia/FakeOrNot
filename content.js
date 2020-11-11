var x = 0;
var y = 0;
document.getElementById("btn").onclick = function() {
    if (x == 0) {
        highlight('some')
        x = 1;
        y = 0;
    } else {
        removehighlight('some')
        x = 0;
    }
};

document.getElementById("btn2").onclick = function() {
    if (y == 0) {
        highlightRed('some')
        y = 1;
        x = 0;
    } else {
        removehighlightRed('some')
        y = 0;
    }
};

function highlight(text) {
    var inputText = document.getElementById("text");
    var innerHTML = inputText.innerHTML;
    var index = innerHTML.indexOf(text);
    if (index >= 0) {
        innerHTML = innerHTML.substring(0, index) + "<span class='highlight'>" + innerHTML.substring(index, index + text.length) + "</span>" + innerHTML.substring(index + text.length);
        inputText.innerHTML = innerHTML;
    }
}

function removehighlight(text) {
    var inputText = document.getElementById("text");
    var innerHTML = inputText.innerHTML;
    var index = innerHTML.indexOf(text);
    if (index >= 0) {
        innerHTML = innerHTML.substring(0, index) + "<span class='highlight2'>" + innerHTML.substring(index, index + text.length) + "</span>" + innerHTML.substring(index + text.length);
        inputText.innerHTML = innerHTML;
    }
}

function highlightRed(text) {
    var inputText = document.getElementById("text");
    var innerHTML = inputText.innerHTML;
    var index = innerHTML.indexOf(text);
    if (index >= 0) {
        innerHTML = innerHTML.substring(0, index) + "<span class='highlightRed'>" + innerHTML.substring(index, index + text.length) + "</span>" + innerHTML.substring(index + text.length);
        inputText.innerHTML = innerHTML;
    }
}

function removehighlightRed(text) {
    var inputText = document.getElementById("text");
    var innerHTML = inputText.innerHTML;
    var index = innerHTML.indexOf(text);
    if (index >= 0) {
        innerHTML = innerHTML.substring(0, index) + "<span class='highlight2Red'>" + innerHTML.substring(index, index + text.length) + "</span>" + innerHTML.substring(index + text.length);
        inputText.innerHTML = innerHTML;
    }
}

function onSelection(text) {
    document.getElementById("output").innerHTML = text; /* imprime a seleção de texto */
}
chrome.extension.getBackgroundPage().getSelection(onSelection); /* vai buscar a seleção de texto ao background.js */