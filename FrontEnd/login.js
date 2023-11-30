function init() {
  console.log('The init function is running.');

  const form = document.querySelector('#login-form');

  form.addEventListener('submit', function (event) {
    
    event.preventDefault();

    const email = document.getElementById('email');
    const password = document.getElementById('password-input');

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

    const emailValid = email.value.trim().length > 0 && emailRegex.test(email.value);
    const passwordValid = password.value.trim() !== '';

    const emailErrorMessage = document.getElementById('email-error');
    const passwordErrorMessage = document.getElementById('password-error');

    if (emailValid) {
      emailErrorMessage.textContent = '';  
    } else {
      emailErrorMessage.textContent = 'Email invalid.'; 
      emailErrorMessage.classList.toggle("error-message", false);

    }

    if (passwordValid) {
      passwordErrorMessage.textContent = '';
    } else {
      passwordErrorMessage.textContent = 'Password required.';
      passwordErrorMessage.classList.toggle("error-message", false);
    }
    if (emailValid && passwordValid) {
      login(email.value,password.value);
    }
  });
}

init();



function login(email, password) {
    console.log('hola');
  
    const formdata = new FormData();
    formdata.append('email', email);
    formdata.append('password', password);
     
    fetch('http://localhost:5678/api/users/login',{
      method: 'POST',
      body: formdata
    })
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          console.log('Connexion réussie');
          return response.json();
        } else if (response.status === 500) {
          console.error('Erreur du serveur');
        } else if (response.status === 404) {
          console.error('Utilisateur non trouvé');
        } else {
          console.error('Erreur inconnue');
        }
      })
      .catch(error => {
        console.error('Erreur de réseau:', error);
      });
  }
  

  
  



  