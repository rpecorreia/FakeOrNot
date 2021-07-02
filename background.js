/* background scripts are something that run in background and listen for triggers while the user interacts with the chrome browser  */

var arrTexto = [];
var arrFake = [];
var arrQuestionable = [];
var seltext = null;
let user_signed_in = false;
var creds = "";

/*
let userLoggedIn = false
function updatePopup(status) {
  if (status === userLoggedIn) {
    return
  }
  if (status) {
    userLoggedIn = true
    chrome.browserAction.setPopup({ popup: 'popup.html' })
  } else {
    userLoggedIn = false
    chrome.browserAction.setPopup({ popup: 'signin.html' })
  }
}

chrome.cookies.onChanged.addListener(changeInfo => {
  const cookie = changeInfo.cookie
  if (cookie.name === COOKIE_NAME && cookie.domain === `.${DOMAIN_NAME}`) {
    updatePopup(!(changeInfo.removed))
  }
})

chrome.cookies.get({
  url: `https://www.${DOMAIN_NNAME}`,
  name: COOKIE_NAME
},
cookie => {
  if (cookie !== null) {
    console.log(`Found ${COOKIE_NAME} on intial run`);
    updatePopup(true);
    console.log('set popup to popup.html');
  }

*/



chrome.browserAction.onClicked.addListener(function() {
    if (!user_signed_in){
        chrome.browserAction.setPopup({ popup: 'popup-sign-in.html' })
    }
    else {
        chrome.browserAction.setPopup({ popup: 'popup.html' })

    }
})

/*
chrome.browserAction.onClicked.addListener(function() {
        chrome.browserAction.setPopup({ popup: 'popup.html' })
})
*/

// ------- if(signIn): -----
//this function flips user status. If the signIn is true, we sign them in. It returns a promise. We return a fetch call to the server API
// basically, we hit the localhost:3000/login with the method GET and we send the email and the password throught the Authorization header
// and we're gonna parse that in the backend. If the response is not 200 aka fail, we will resolve a fail. If not, we know we've successfully
// passed the backend test, and we saved that status in the local storage of chrome. We saved the user status which is true or false (in this
// case true), we save the email and the encrypted password. We then got a response. If there is an error, it will resolve a fail. If not, the
// user have successfully signed in, se we change the variable to true, and we resolve the "success". Thats what the case "login" res will
// expect.
// ------- if(!signIn): -----
// if the signIn is false, it means they wanna sign out.  Again, we return a Promise bcnthis function is supose to return a Promise.
// So we do a new Promise, we get the resolve object, we open up the chrome local storage to see if the user has the proper credentials, 
// we'll send that to the backend. So we get the user status and the user info. If there is an error getting the stuff, we send back 'fail'.
// If the status is undefined (it's neither true nor false) we send back a 'fail'. Else, we know thats a true or false, we fetch to the 
// logout URI on the backend through the GET method, we send in the header the authorization with the user email and pass. The backend
// verifies if that user is actually on the system. Is he is,  it sends a 200 code. Otherwise we resolve a 'fail'. If it is 200, we 
// know they have proper credentials. So we open the storage.local.set, we flip the userstatus to false, we clear their userinfo. If there
//is an error doing that, we resolve a 'fail'. If there is no error, we know the whole process was made correctly so the usersignedin will
// be false and we resolve with a success.  
function flip_user_status(signIn, user_info){
    if(signIn){
        // fetch the localhost:3000/login route
        return fetch ('http://localhost:3000/login', {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa(`${user_info.email}:${user_info.pass}`)
            }
        })
            .then(res => {
                return new Promise(resolve => {
                    if (res.status !== 200) resolve('fail');

                    chrome.storage.local.set({userStatus: signIn, user_info}, function(response){
                        if (chrome.runtime.lastError) resolve ('fail');

                        user_signed_in = signIn;
                        resolve('success');
                    });
                }) 
            })
            .catch(err => console.log(err));
    }
    else if(!signIn){
        // fetch the localhost:3000/logout route 
        // again, this function is supose to return a Promise. The fetch is a promise. chrome.storage.local.get is not.
        // so to return an actual promise, we need to wrap it.
        return new Promise (resolve => {
            chrome.storage.local.get(['userStatus', user_info], function(response){
            
                if (browser.runtime.lastError) resolve ('fail');
    
                if (response.userStatus === undefined) resolve ('fail');
                //we expect a false bc user already signed in. we're gonna sign the user out with a fetch.
                fetch ('http://localhost:3000/logout', {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + btoa(`${response.user_info.email}:${response.user_info.pass}`)
                }
                })
                .then(res => {
                    if (res.status !== 200) resolve('fail');

                    chrome.storage.local.set({userStatus: signIn, user_info: { }}, function(response){
                        if (chrome.runtime.lastError) resolve ('fail');
                    
                        user_signed_in = signIn;
                        resolve('success');
                    });
                })
                .catch(err => console.log(err));
    
                 });
        });    
    }
}

//btoa: binary to ascii -> encodes in 64 bit the email and pass. não mandamos a pass em plaintext
//por ex, se eu enviar rita@test.com:123, ele vai codificar para "cml0YUB0ZXN0LmNvbToxMjM="

function Fake() {
    return arrFake;
}

function Questionable() {
    return arrQuestionable;
}
 
chrome.extension.onRequest.addListener(function(request, sender, sendResponse)
{
    switch(request.message)
    {
        case 'login':
            creds = request.payload.email;
            console.log("CREDSSSSSSS", creds);
            flip_user_status(true, request.payload)
                .then(res => sendResponse(res)) //send the final response and close the msg line.
                .catch(err => console.log(err));
            
            return true; //keeps the message line open between the popup-sign-in script and the background script. Processo ASSINCRONO.

        case 'logout':
            flip_user_status(true, null)
                .then(res => sendResponse(res)) // the responde will be success or fail.
                .catch(err => console.log(err));
            return true;

        case 'userStatus':
            break;

        case 'setTextFake':
            chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
                let url = tabs[0].url;
                window.seltext = request.data;
                arrTexto.push(request.data);
                arrFake.push(request.data);
                console.log(arrFake);
                savefake(request.data, creds, url);
                sendResponse({resp: "Selection (fake) sent to bg script! :)"});
            });
            break;

        case 'setTextQuestionable':
            chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
                let url = tabs[0].url;
                window.seltext = request.data;
                arrTexto.push(request.data);
                arrQuestionable.push(request.data);
                console.log(arrQuestionable);
                savequestionable(request.data, creds, url);
                sendResponse({resp: "Selection (questionable) sent to bg script! :)"});
            });
            break;
         
        default:
            sendResponse({data: 'Invalid arguments'});
        break;
    }
});




function savefake(text, creds, url)
{
    console.log("dataaa: ", text);
    console.log("email: ", creds);
    console.log("url: ", url);
    var jax = new XMLHttpRequest();
    var params = "text="+text+"&creds="+creds+"&url="+url;
    jax.open("POST","http://localhost:3000/InsertFake", true);
    jax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    jax.send(params);
    jax.onreadystatechange = function() { if(jax.readyState==4) { alert(jax.responseText);  }}
}

function savequestionable(text, creds, url)
{
    console.log("dataaa: ", text);
    console.log("email: ", creds);
    console.log("url: ", url);
    var jax = new XMLHttpRequest();
    var params = "text="+text+"&creds="+creds+"&url="+url;
    jax.open("POST","http://localhost:3000/InsertQuestionable", true);
    jax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    jax.send(params);
    jax.onreadystatechange = function() { if(jax.readyState==4) { alert(jax.responseText);  }}
}

