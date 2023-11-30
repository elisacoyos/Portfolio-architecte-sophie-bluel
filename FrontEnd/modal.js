const WORKS_API = "http://localhost:5678/api/works";
const firstModal = document.querySelector('.modal');
const secondModal = document.querySelector('.second-modal');
const photoIconContainer = document.querySelector('.image-icon');
const initialPhotoIconContent = photoIconContainer.innerHTML;

function goBack() {
  secondModal.style.display = 'none';  
  firstModal.style.display = 'block';
}

function showSecondModal() {
  firstModal.style.display = 'none';
  secondModal.style.display = 'block';
}

function closeAllModals() {
  firstModal.style.display = 'none';
  secondModal.style.display = 'none';
}

function fillGalleryModal(projects) {
    const photoGallery = document.querySelector('.photo-gallery');
    photoGallery.innerHTML = "";
    projects.forEach(project => { 
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
          deleteProject(project.id, photoItem); 
        });
    
  
    
        photoItem.appendChild(image);
        photoItem.appendChild(deleteIcon);
        photoGallery.appendChild(photoItem);
      });  
}

function displayGalleryModal(projects) {

    const closeBtn = document.querySelector('.close');

    closeBtn.addEventListener('click', function () {
      const modal = document.querySelector('.modal'); 
      modal.style.display = 'none'; 
    });
    
    displayCategoryOptions();
    fillGalleryModal(projects);    
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



    function openAddProjetFormModal() { 
        const addPhotoButton = document.getElementById('add-photo-button');
      
        addPhotoButton.addEventListener('click', () => {
          showSecondModal();
        });
      
        const closeSecondModal = document.querySelector('.second-modal .close');
        closeSecondModal.addEventListener('click', () => {
          secondModal.style.display = 'none';
        });
      }


      function openGalleryModal() {
        const backButton = document.getElementById('back-button');

        backButton.addEventListener('click', () => {
            goBack();
        });

    
      }

    function deleteProject(projectId, photoItem) { 
        
        fetch(`${WORKS_API}/${projectId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => {
            if (response.ok) {
              photoItem.remove();
              initialLoad();
            } else {
              console.error('Error al eliminar el proyecto');
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }


const categorieSelect = document.getElementById('arrow-category');

function displayCategoryOptions() {
  if (categorieSelect.length > 0) return;

  getCategoriesAPI()
  .then(categories => {
    categorieSelect.innerHTML = ''; 

    const option = document.createElement('option');
    option.value = -1;
    option.textContent = "";
    categorieSelect.appendChild(option);
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categorieSelect.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

const fileInput = document.getElementById('file-input');
const addPhotoLabel = document.getElementById('add-photo');

fileInput.addEventListener('change', function () {
  const selectedFile = fileInput.files[0];
  if (selectedFile) {                        
    displaySelectedPhoto(selectedFile);
  }
});

function displaySelectedPhoto(file) {
  const reader = new FileReader();

  reader.onload = function (e) {    
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


function isFormEmpty() {
    const isEmpty = document.getElementById('titre').value.trim() === "" ||
                    document.getElementById('file-input').value === "" ||
                    document.getElementById('arrow-category').value === "-1";
    document.getElementById("message-empty-form").classList.toggle("hidden", !isEmpty);
}


   document.addEventListener('DOMContentLoaded', function () { 
    const validerButton = document.getElementById('valider-button');

    validerButton.disabled = true;
    setupFormEvents();
    document.getElementById('titre').addEventListener("keyup", () => {
        isFormEmpty();
    });

    document.getElementById('file-input').addEventListener("change", () => {
        isFormEmpty();
    });

    document.getElementById('arrow-category').addEventListener("change", () => {
        isFormEmpty();
    });
});
function setupFormEvents() {
    const formContainer = document.getElementById('photo-form');
    formContainer.addEventListener('input', validateForm);
}

function clearForm() {
  document.getElementById('titre').value = "";
  document.getElementById('arrow-category').selectedIndex = 0;
  document.getElementById('file-input').value = null;
  document.querySelector('.image-icon').innerHTML = initialPhotoIconContent;
}

function validateForm() {
    const titreValue = document.getElementById('titre').value.trim();
    const categorieValue = document.getElementById('arrow-category').value;
    const fileSelected = document.getElementById('file-input').files.length > 0;

    const formIsValid = titreValue !== '' && categorieValue !== '' && fileSelected;

    updateButtonState(formIsValid);
}
function updateButtonState(isValid) {
    const validerButton = document.getElementById('valider-button');
    validerButton.disabled = !isValid;
}

 document.getElementById('valider-button').addEventListener('click', function (e) {
   
    e.preventDefault();
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    const titreValue = document.getElementById('titre').value.trim();
    const categorieValue = document.getElementById('arrow-category').value;

    if (file) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', titreValue); 
        formData.append('category',categorieValue); 

        fetch(WORKS_API, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                
            },
            
        })
        .then(response => {
            if (response.ok) {
                initialLoad(false);
                initModal();
                closeAllModals();
                clearForm();
            } else {
                throw new Error('Error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        console.error('No file selected.');
    }
});
