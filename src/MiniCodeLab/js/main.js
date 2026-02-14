// Массив проектов
let projects = JSON.parse(localStorage.getItem('projects') || '[]');

// Сохраняем массив в localStorage
function saveProjects() {
    localStorage.setItem('projects', JSON.stringify(projects));
    renderProjects();
}

// Отображаем проекты на главной странице
function renderProjects() {
    const list = document.getElementById('projectsList');
    list.innerHTML = '';
    projects.forEach((p, index) => {
        const div = document.createElement('div');
        div.className = 'project-card';
        div.onclick = () => openProject(index);
        div.innerHTML = `
            <div class="project-name">${p.name}</div>
            <div class="project-date">${p.date}</div>
        `;
        list.appendChild(div);
    });
}

// Создание нового проекта
function createProject() {
    const name = prompt('Название нового проекта:');
    if(name) {
        const date = new Date().toLocaleDateString();
        projects.push({name: name, date: date, files: []});
        saveProjects();
    }
}

// Открытие проекта
function openProject(index) {
    const project = projects[index];
    // Проверяем project.html
    window.location.href = `project.html?name=${encodeURIComponent(project.name)}`;
}