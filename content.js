
//quando clicamos no thumbsup do popup, envia uma query para o content-script (q interage diretamente com a página web), com a request
// "executecode", que é executada no content-script
document.getElementById('btn').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(activeTabs) {
        chrome.tabs.sendMessage(activeTabs[0].id, { action: 'executeCode' });
    });
});

document.getElementById('btn2').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(activeTabs) {
        chrome.tabs.sendMessage(activeTabs[0].id, { action: 'executeCode2' });
    });
});


function onSelection(selection1) {
    document.getElementById("output").innerHTML = selection1; /* outputs the fake text selections */
}

function onSelection2(selection2) {
    document.getElementById("output2").innerHTML = selection2; /* outputs the questionable text selections */
}

var gettingPage = chrome.extension.getBackgroundPage();
const selection1 = gettingPage.Fake(); 
onSelection(selection1);

const selection2 = gettingPage.Questionable(); 
onSelection2(selection2);
