//teste de sublinhar no popup
var x = 0;
var y = 0;
document.getElementById("btn").onclick = function() {
    if (x == 0) {
        highlight('dummy')
        x = 1;
        y = 0;
    } else {
        removehighlight('dummy')
        x = 0;
    }
};

document.getElementById("btn2").onclick = function() {
    if (y == 0) {
        highlightRed('dummy')
        y = 1;
        x = 0;
    } else {
        removehighlightRed('dummy')
        y = 0;
    }
};
//teste de sublinhar no popup a verde 
function highlight(text) {
    var inputText = document.getElementById("text");
    var innerHTML = inputText.innerHTML;
    var index = innerHTML.indexOf(text);
    if (index >= 0) {
        innerHTML = innerHTML.substring(0, index) + "<span class='highlight'>" + innerHTML.substring(index, index + text.length) + "</span>" + innerHTML.substring(index + text.length);
        inputText.innerHTML = innerHTML;
    }
}

//teste de remover sublinhado verde no popup 
function removehighlight(text) {
    var inputText = document.getElementById("text");
    var innerHTML = inputText.innerHTML;
    var index = innerHTML.indexOf(text);
    if (index >= 0) {
        innerHTML = innerHTML.substring(0, index) + "<span class='highlight2'>" + innerHTML.substring(index, index + text.length) + "</span>" + innerHTML.substring(index + text.length);
        inputText.innerHTML = innerHTML;
    }
}

//teste de sublinhar no popup a vermelho 
function highlightRed(text) {
    var inputText = document.getElementById("text");
    var innerHTML = inputText.innerHTML;
    var index = innerHTML.indexOf(text);
    if (index >= 0) {
        innerHTML = innerHTML.substring(0, index) + "<span class='highlightRed'>" + innerHTML.substring(index, index + text.length) + "</span>" + innerHTML.substring(index + text.length);
        inputText.innerHTML = innerHTML;
    }
}

//teste de remover sublinhado vermelho no popup 
function removehighlightRed(text) {
    var inputText = document.getElementById("text");
    var innerHTML = inputText.innerHTML;
    var index = innerHTML.indexOf(text);
    if (index >= 0) {
        innerHTML = innerHTML.substring(0, index) + "<span class='highlight2Red'>" + innerHTML.substring(index, index + text.length) + "</span>" + innerHTML.substring(index + text.length);
        inputText.innerHTML = innerHTML;
    }
}


//quando clicamos no thumbsup do popup, envia uma query para o content-script (q interage diretamente com a página web), com a request
// "executecode", que é executada no content-script
document.getElementById('btn').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(activeTabs) {
        // WAY 1
        chrome.tabs.sendMessage(activeTabs[0].id, { action: 'executeCode' });
    });
});

document.getElementById('btn2').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(activeTabs) {
        // WAY 1
        chrome.tabs.sendMessage(activeTabs[0].id, { action: 'executeCode2' });
    });
});

document.getElementById('btn3').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(activeTabs) {
        // WAY 1
        chrome.tabs.sendMessage(activeTabs[0].id, { action: 'executeCode3' });
    });
});


function onSelection(selection1) {
    //alert(selection1);
    document.getElementById("output").innerHTML = selection1; /* imprime a seleção de texto */
}

function onSelection2(selection) {
    //alert(selection2);
    document.getElementById("output2").innerHTML = selection2; /* imprime a seleção de texto */
}

var gettingPage = chrome.extension.getBackgroundPage();
const selection1 = gettingPage.TU();
onSelection(selection1);

const selection2 = gettingPage.TD();
onSelection2(selection2);
