
function displayGalleryModal(projects) {
    const photoGallery = document.querySelector('.photo-gallery');
    const closeBtn = document.querySelector('.close');

    closeBtn.addEventListener('click', function () {
      const modal = document.querySelector('.modal'); 
      modal.style.display = 'none'; 
    });
    
    projects.forEach(project => { //itera sobre el array projects y en cada iteracion de cada project hac tdo eso, project es cada elemento del array//
      const photoItem = document.createElement('div');
      photoItem.className = 'photo-item';
      photoItem.id = 'modal-project';
  
      const image = document.createElement('img');
      image.src = project.imageUrl;
  
      const deleteIcon = document.createElement('div');
      deleteIcon.className = 'delete-icon';
      deleteIcon.innerHTML = '<i class="fas fa-trash-alt"></i>';


      deleteIcon.addEventListener('click', function (e) {
        e.preventDefault();
        deleteProject(project.id); 
      });
  

  
      photoItem.appendChild(image);
      photoItem.appendChild(deleteIcon);
      photoGallery.appendChild(photoItem);
    });
  }
  
 
  function initModal() {
    openAddProjetFormModal();
    getWorksAPI()
    
      .then(projects => {
        displayGalleryModal(projects);
        
      })


      
      .catch(error => {
        console.error('Error', error);
      });
  }

  //para abrir la segunda modal//

    function openAddProjetFormModal() { 
        const addPhotoButton = document.getElementById('add-photo-button');
        const secondModal = document.querySelector('.second-modal');
        const firstModal = document.querySelector('.modal');
      
        addPhotoButton.addEventListener('click', () => {
          firstModal.style.display = 'none';
          secondModal.style.display = 'block';
          
        });
      
        const closeSecondModal = document.querySelector('.second-modal .close');
        closeSecondModal.addEventListener('click', () => {
          secondModal.style.display = 'none';
        });
      }
//flecha back//

      function openGalleryModal() {
        const backButton = document.getElementById('back-button');
        const secondModal = document.querySelector('.second-modal');
        const firstModal = document.querySelector('.modal');

        backButton.addEventListener('click', () => {
            secondModal.style.display = 'none';  //Rappeler la fonction displayGalleryModal pour afficher la premiere modal//
            firstModal.style.display = 'block';
          });

    
      }

    //SUPRESION PROJECTO//
    function deleteProject(projectId) { 
        
        fetch(`http://localhost:5678/api/works/${projectId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => {
            if (response.ok) {
            } else {
              console.error('Error al eliminar el proyecto');
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }



      
//click en flecha para ver categories//

const categorieSelect = document.getElementById('arrow-category');

// Agrega un evento click al select para cargar las opciones al hacer clic
categorieSelect.addEventListener('click', function () {
  // Llamada a la API para obtener las categorías 
  getCategoriesAPI()
    .then(categories => {
      displayCategoryOptions(categories);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

// Función para mostrar las opciones de categoría
function displayCategoryOptions(categories) {
  categorieSelect.innerHTML = ''; // Limpia las opciones anteriores

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.name;
    option.textContent = category.name;
    categorieSelect.appendChild(option);
  });
}


  //CARGA DE FOTO EN ICONO DE IMAGEN//

 

const fileInput = document.getElementById('file-input');
const photoIconContainer = document.querySelector('.image-icon');
const addPhotoLabel = document.getElementById('add-photo');


// Evento change, cuando cambia el archivo seleccionado en fileInput (por ejemplo, cuando el usuario elige un archivo usando el cuadro de diálogo de selección de archivos), se ejecuta la función anónima//
fileInput.addEventListener('change', function () {
  const selectedFile = fileInput.files[0];
  if (selectedFile) {                        //si hay un archivo seleccionado llama a la funcion que lo muestra//
    displaySelectedPhoto(selectedFile);
  }
});

// Función para mostrar la foto seleccionada en la misma div
function displaySelectedPhoto(file) {
  const reader = new FileReader(); //esto permite leer contenido de archivos//

  reader.onload = function (e) {     //es un evento que se dispara cuando la operación de lectura del FileReader se completa con éxito.//
    // Muestra la imagen en la misma div
    const imageElement = document.createElement('img');
    imageElement.src = e.target.result;
    imageElement.style.maxWidth = '100%'; 
    imageElement.style.maxHeight = '100%'; 
    imageElement.style.objectFit = 'cover';
    photoIconContainer.innerHTML = ''; 
    photoIconContainer.appendChild(imageElement);
  };

  reader.readAsDataURL(file);
}



   //controler de formulaire//


   document.addEventListener('DOMContentLoaded', function () {   //"Cuando todo el contenido de la página haya sido cargado, haz lo siguiente..."
    const validerButton = document.getElementById('valider-button');

    validerButton.disabled = true;


    setupFormEvents();
});
//Aquí se agrega un evento al contenedor del formulario. El evento es de tipo 'input', lo que significa que se activará cada vez que haya una entrada de usuario en algún campo del formulario. Cuando este evento se dispare, llamará a la función validateForm.//
function setupFormEvents() {
    const formContainer = document.getElementById('photo-form');
    formContainer.addEventListener('input', validateForm);
}
//aca extrae los elementos del formulario para contruir la variable que los controla//
function validateForm() {
    const titreValue = document.getElementById('titre').value.trim();
    const categorieValue = document.getElementById('arrow-category').value;
    const fileSelected = document.getElementById('file-input').files.length > 0;

    const formIsValid = titreValue !== '' && categorieValue !== '' && fileSelected;

    updateButtonState(formIsValid);
}
//le pone disabled cuando la variable booleana isValid es falsa por el !//
function updateButtonState(isValid) {
    const validerButton = document.getElementById('valider-button');
    validerButton.disabled = !isValid;
}




 // subir projecto a la api y postearlo

 document.getElementById('valider-button').addEventListener('click', function (e) {
   
    e.preventDefault();
    // Obtiene el elemento de entrada de archivo
    const fileInput = document.getElementById('file-input');
    // Obtiene el primer archivo seleccionado
    const file = fileInput.files[0];
    const titreValue = document.getElementById('titre').value.trim();
    const categorieValue = document.getElementById('arrow-category').value;
    console.log('categorieValue ',categorieValue)
    // Verifica si se ha seleccionado un archivo
    if (file) {
        // Crea un objeto FormData y agrega el archivo y otros datos a él
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', titreValue); // Puedes ajustar esto con el valor deseado
        formData.append('category',categorieValue); //aca esss

        // Realiza una solicitud fetch (POST) a la API
        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                
            },
            
        })
        .then(response => {
            // Verifica si la respuesta de la API fue exitosa
            if (response.ok) {
                // Parsea la respuesta JSON
                return response.json();
            } else {
                // En caso de error, lanza una excepción
                throw new Error('Error');
            }
        })
        .catch(error => {
            // Captura y maneja errores
            console.error('Error:', error);
        });
    } else {
        // En caso de que no se haya seleccionado ningún archivo
        console.error('No file selected.');
    }
});

      


