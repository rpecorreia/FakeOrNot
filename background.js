var selection_callbacks = [];

/*Vai buscar a seleção ao content-script e coloca-a no array*/
function getSelection(callback) {
    selection_callbacks.push(callback);
    chrome.tabs.executeScript(null, { file: "content-script.js" });
};

/*Fica à escuta para novas seleções*/
chrome.extension.onRequest.addListener(function(request) {
    var callback = selection_callbacks.shift(); /* o shift() retorna o 1º elemento do array */
    callback(request);
});