/* background scripts are something that run in background and listen for triggers while the user interacts with the chrome browser  */

var arrTexto = [];
var arrThumbsUp = [];
var arrThumbsDown = [];
var seltext = null;

function TU() {
    return arrThumbsUp;
}

function TD() {
    return arrThumbsDown;
}
 
chrome.extension.onRequest.addListener(function(request, sender, sendResponse)
{
    switch(request.message)
    {
        case 'setTextTumbsUp':
            window.seltext = request.data;
            arrTexto.push(request.data);
            arrThumbsUp.push(request.data);
            console.log(arrThumbsUp);
            saveup(request.data);
            sendResponse({resp: "Selection (tu) sent to bg script! :)"});
            break;

        case 'setTextTumbsDown':
            window.seltext = request.data;
            arrTexto.push(request.data);
            arrThumbsDown.push(request.data);
            console.log(arrThumbsDown);
            savedown(request.data);
            sendResponse({resp: "Selection (td) sent to bg script! :)"});
            break;
         
        default:
            sendResponse({data: 'Invalid arguments'});
        break;
    }
});


function saveup(text)
{
    console.log("dataaa: ", text)
    var jax = new XMLHttpRequest();
    var params = "text="+text;
    jax.open("POST","http://localhost:3000/InsertTU", true);
    jax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    jax.send(params);
    jax.onreadystatechange = function() { if(jax.readyState==4) { alert(jax.responseText);  }}
}

function savedown(text)
{
    console.log("dataaa: ", text)
    var jax = new XMLHttpRequest();
    var params = "text="+text;
    jax.open("POST","http://localhost:3000/InsertTD", true);
    jax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    jax.send(params);
    jax.onreadystatechange = function() { if(jax.readyState==4) { alert(jax.responseText);  }}
}


/*
var contexts = ["selection"];
for (var i = 0; i < contexts.length; i++)
{
    var context = contexts[i];
    chrome.contextMenus.create({"title": "Send to Server", "contexts":[context], "onclick": savetext});  
}
*/
