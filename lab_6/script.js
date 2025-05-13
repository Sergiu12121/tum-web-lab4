// Initialize theme
const themeButton = document.getElementById('toggle-theme');
const addEntityButton = document.getElementById('add-entity');
const entityList = document.getElementById('entity-list');

// Load theme from localStorage
document.body.className = localStorage.getItem('theme') || 'light';

// Toggle theme
themeButton.addEventListener('click', () => {
  const currentTheme = document.body.className;
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.className = newTheme;
  localStorage.setItem('theme', newTheme);
});

// Add entity
addEntityButton.addEventListener('click', () => {
  const entity = prompt('Enter entity name:');
  if (entity) {
    const entityItem = document.createElement('div');
    entityItem.textContent = entity;
    entityItem.className = 'entity-item';
    entityItem.addEventListener('click', () => {
      entityItem.remove();
    });
    entityList.appendChild(entityItem);
  }
});