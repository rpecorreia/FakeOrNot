
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
