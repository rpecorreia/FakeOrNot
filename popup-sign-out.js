var out = document.getElementById("out");

out.addEventListener('click', () =>{
    // send msg to bg telling to delete credentials
    chrome.extension.sendRequest({'message':'logout'},function(response){
        if (response === 'success'){
            alert('out');
            window.location.replace('popup-sign-in.html');
        }
    });
});