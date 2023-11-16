
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


const arrowCategory = document.getElementById('arrow-category');
const categoryDropdown = document.getElementById('category-dropdown');
const categorieInput = document.getElementById('categorie');

// Evento click en la flecha
arrowCategory.addEventListener('click', function () {
  // si esta oculto el desglose se llama a la funcion de mostrar y se cambia la flecha y si no  que seria lo mismo a que esta mostrado todo a la inversa//
  if (categoryDropdown.style.display === 'none') {
    showCategoryDropdown();
    rotateArrowIcon(true); // Gira la flecha hacia arriba
  } else {
    hideCategoryDropdown();
    rotateArrowIcon(false); // Gira la flecha hacia abajo
  }
});

// Función para mostrar el desglose
function showCategoryDropdown() {
  categoryDropdown.style.display = 'block';
  
  getCategoriesAPI()
    .then(categories => {
      displayCategoryOptions(categories);
    })
    .catch(error => {
      console.error('Error', error);
    });
}

// Función para ocultar el desglose
function hideCategoryDropdown() {
  categoryDropdown.style.display = 'none';
}

// Función para girar la flecha
function rotateArrowIcon(upward) {
  if (upward) {
    arrowCategory.classList.remove('fa-chevron-down');
    arrowCategory.classList.add('fa-chevron-up');
  } else {
    arrowCategory.classList.remove('fa-chevron-up');
    arrowCategory.classList.add('fa-chevron-down');
  }
}

// Función para mostrar las opciones de categoría
function displayCategoryOptions(categories) {
    categoryDropdown.innerHTML = ''; //esto hace que cada vez que hago click limpie el desglose del click anterioir y me ponga de nuevo las categories sino se repiten //

  categories.forEach(category => {
    const optionButton = document.createElement('button');
    optionButton.textContent = category.name;

    // Evento click en una opción
    optionButton.addEventListener('click', function () {
      categorieInput.value = category.name; // esto mete un value o contenido en el input categoria que sea igual a la propiedad name de cada elemento del array categories//
      hideCategoryDropdown(); // Ocultar el desglose
      rotateArrowIcon(false); // Gira la flecha hacia abajo
    });

    categoryDropdown.appendChild(optionButton); // sino pongo esto ni se ven los botones de las categorias, porque si bien las creo desde js tengo que insertarla en la div//
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
    imageElement.style.maxWidth = '100%'; // Añadir estilo para ajustar al ancho máximo
    imageElement.style.maxHeight = '100%'; // Añadir estilo para ajustar a la altura máxima
    imageElement.style.objectFit = 'cover';
    photoIconContainer.innerHTML = ''; // Limpia el contenido actual
    photoIconContainer.appendChild(imageElement);
  };

  reader.readAsDataURL(file);
}



   //para que no se cierre sola la second despues de cargar los tres cosos y al boton se activa//


  