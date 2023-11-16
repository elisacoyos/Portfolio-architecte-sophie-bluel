function getWorksAPI() {
  const apiURL = 'http://localhost:5678/api/works';

  return fetch(apiURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        console.error('Error:', error);
      }
    });
}

function displayProjects(projects) {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = ''; 

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];

    const figure = document.createElement('figure');

    const image = document.createElement('img');
    image.src = project.imageUrl;

    const caption = document.createElement('figcaption');
    caption.textContent = project.title;

    figure.appendChild(image);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  }
}

function getCategoriesAPI() {
  const apiURL = 'http://localhost:5678/api/categories';

  return fetch(apiURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        console.error('Error:', response);
      }
    });
}


function displayFilterButtons(categories, projects) {
  const filtersContainer = document.querySelector('.filters-container');

  const allButton = document.createElement('button');
  allButton.textContent = 'Tous';
  filtersContainer.appendChild(allButton);

  allButton.addEventListener('click', () => {
    displayProjects(projects); 
  });

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];

    const button = document.createElement('button');
    button.textContent = category.name;
    filtersContainer.appendChild(button);

    button.addEventListener('click', () => {
      const selectedCategory = category.name;
      const filteredProjects = filterProjectsByCategory(projects, selectedCategory);
      displayProjects(filteredProjects);
    });
    
  }
}

function filterProjectsByCategory(projects, selectedCategory) {
  return projects.filter(project => project.category.name === selectedCategory);
}


Promise.all([getCategoriesAPI(), getWorksAPI()])
  .then(([categories, projects]) => {
    displayProjects(projects);
    displayFilterButtons(categories, projects);
  })
  .catch(error => {
    console.error('Error:', error);
  });
  
  
  const loginButton = document.getElementById('login-button');

  if (localStorage.getItem('token')) {
    loginButton.textContent = 'Logout';
  
    loginButton.addEventListener('click', function () {
      localStorage.removeItem('token');
      window.location.href = './login.html';
    });
  
    
    const adminBanner = document.querySelector('.admin-banner');
    const adminBannerIcon = document.createElement('i');
    adminBannerIcon.classList.add('fa-regular', 'fa-pen-to-square');
    const adminBannerText = document.createElement('h2');
    adminBannerText.textContent = 'Mode édition';
    adminBanner.appendChild(adminBannerIcon);
    adminBanner.appendChild(adminBannerText);
  
    
    const adminPortfolio = document.querySelector('.admin-portfolio');
    const modifierButton = document.createElement('button');
    modifierButton.id = 'modifierBtn';
    const modifierButtonIcon = document.createElement('i');
    modifierButtonIcon.classList.add('fa-regular', 'fa-pen-to-square');
    modifierButton.appendChild(modifierButtonIcon);
    modifierButton.innerHTML += 'Modifier';
    adminPortfolio.appendChild(modifierButton);


    modifierButton.addEventListener('click', function () {
      const modal = document.querySelector('.modal'); 
      modal.style.display = 'block';
    });

    initModal();
    openGalleryModal();

  } else {
    loginButton.addEventListener('click', function () {
      window.location.href = './login.html';
    });
  }
  

  







  