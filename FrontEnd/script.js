
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
        console.error('Error:', error);
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

