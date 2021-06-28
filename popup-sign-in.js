document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const pass = document.querySelector('#password').value;

    if (email && pass) {
        // send msg to bg with email and pass
        chrome.extension.sendRequest({'message':'login', 'payload': {email, pass}},function(response){
            if (response === 'success') window.location.replace('popup.html');
        });
    }
    else {
        document.querySelector('#email').placeholder= "Enter an email.";
        document.querySelector('#password').placeholder= "Enter a password.";
        document.querySelector('#email').style.background= 'red';
        document.querySelector('#password').style.background= 'red';
        document.querySelector('#email').classList.add('white_placeholder');
        document.querySelector('#password').classList.add('white_placeholder');
    }
})