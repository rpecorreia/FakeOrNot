document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();

    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const pass = document.querySelector('#password').value;
    const confirmpass = document.querySelector('#password2').value;


    if (name && email && pass) {
        // send msg to bg with email and pass
        chrome.extension.sendRequest({'message':'register', 'payload': {name, email, pass, confirmpass}},function(response){
            if (response === 'success') window.location.replace('popup-sign-in.html');
        });
    }
    else {
        document.querySelector('#name').placeholder= "Enter a name.";
        document.querySelector('#email').placeholder= "Enter an email.";
        document.querySelector('#password').placeholder= "Enter a password.";
        document.querySelector('#password2').placeholder= "Confirm your password.";
        document.querySelector('#name').style.background= 'red';
        document.querySelector('#email').style.background= 'red';
        document.querySelector('#password').style.background= 'red';
        document.querySelector('#password2').style.background= 'red';
        document.querySelector('#name').classList.add('white_placeholder');
        document.querySelector('#email').classList.add('white_placeholder');
        document.querySelector('#password').classList.add('white_placeholder');
        document.querySelector('#password2').classList.add('white_placeholder');

    }
})