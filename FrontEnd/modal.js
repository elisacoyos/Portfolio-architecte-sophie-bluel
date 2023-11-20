
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

  //para abrir la seguna modal//

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


   document.addEventListener('DOMContentLoaded', function () {
    const formContainer = document.getElementById('photo-form');
    const validerButton = document.getElementById('valider-button');

    // Deshabilita el botón al cargar la página
    validerButton.disabled = true;

    // Agrega evento input al contenedor del formulario
    formContainer.addEventListener('input', function () {
        const titreValue = document.getElementById('titre').value.trim();
        const categorieValue = document.getElementById('arrow-category').value;
        const fileSelected = document.getElementById('file-input').files.length > 0;

        // Verifica si los tres campos están completos
        const formIsValid = titreValue !== '' && categorieValue !== '' && fileSelected;

        // Habilita o deshabilita el botón en función del resultado
        if (formIsValid) {
            validerButton.removeAttribute('disabled');
        } else {
            validerButton.setAttribute('disabled', 'disabled');
        }
    });


    // Aenviar proyecto a la API y lo muestra en galeria//

    validerButton.addEventListener('click', function () {
        const titreValue = document.getElementById('titre').value.trim();
        const categorieValue = document.getElementById('arrow-category').value;
        const fileInput = document.getElementById('file-input');
        const fileSelected = fileInput.files.length > 0;

        const formIsValid = titreValue !== '' && categorieValue !== '' && fileSelected;

        if (formIsValid) {
            const formData = new FormData();
            formData.append('title', titreValue);
            formData.append('category', categorieValue);
            formData.append('image', fileInput.files[0]);

            fetch('http://localhost:5678/api/works', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error('Error');
                }
            })
            .then(data => {
                console.log('Datos enviados API:', data);
                return getWorksAPI();
            })
            .then(projects => {
                
                displayProjects(projects);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });
});
