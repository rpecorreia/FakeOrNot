button.addEventListener('click', () =>{
    // send msg to bg telling to delete credentials
    chrome.extension.sendRequest({'message':'logout'},function(response){
        if (response === 'success')
            console.log('Logout successful');
    });
});