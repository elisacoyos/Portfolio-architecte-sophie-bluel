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
  console.log('hola') ;  
  const errorMessage= document.querySelector(".error-message")
  fetch('http://localhost:5678/api/users/login',{
    
    method: 'POST',
    body: JSON.stringify({email, password}),
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then(async response => {
      
      if (response.status === 200) {
        console.log('Connexion réussie');
        errorMessage.style.display="none";
       const data = await response.json();
       console.log(data);

       const token = data.token;
       localStorage.setItem('token', data.token);
       
       window.location.href = './index.html';

      } else if (response.status === 500) {
        console.error('Erreur du serveur');
        errorMessage.style.display="block";
      } else if (response.status === 404) {
        console.error('Utilisateur non trouvé');
        errorMessage.style.display="block";
      } else {
        console.error('Erreur inconnue');
        errorMessage.style.display="block";
      }
    })
    .catch(error => {
      console.error('Erreur de réseau:', error);
      errorMessage.style.display="block";
    });
}



  

