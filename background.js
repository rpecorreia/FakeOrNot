/* background scripts are something that run in background and listen for triggers while the user interacts with the chrome browser  */

/*
var selection_callbacks = [];


function getSelection(callback) {
    console.log(callback);
    selection_callbacks.push(callback);
    chrome.tabs.executeScript(null, { file: "content-script.js" });
};


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.seltext){
        //console.log(request.seltext);
        arrTexto.push(request.seltext);
        console.log(arrTexto);
        sendResponse({response: "thanks! :)"});
      }

    }
  );
*/

var arrTexto = [];

  function foo() {
      return arrTexto;
}



var seltext = null;
 
chrome.extension.onRequest.addListener(function(request, sender, sendResponse)
{
    switch(request.message)
    {
        case 'setText':
            window.seltext = request.data;
            arrTexto.push(request.data);
            console.log(request.data);
        break;
         
        default:
            sendResponse({data: 'Invalid arguments'});
        break;
    }
});
/*
 
function savetext(info,tab)
{
    var jax = new XMLHttpRequest();
    jax.open("POST","http://localhost/text/");
    jax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    jax.send("text="+seltext);
    jax.onreadystatechange = function() { if(jax.readyState==4) { alert(jax.responseText);  }}
}
 
var contexts = ["selection"];
for (var i = 0; i < contexts.length; i++)
{
    var context = contexts[i];
    chrome.contextMenus.create({"title": "Send to Server", "contexts":[context], "onclick": savetext});  
}
*/