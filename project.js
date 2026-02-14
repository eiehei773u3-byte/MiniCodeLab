const fileTree = document.getElementById("fileTree");
const editor = document.getElementById("editor");
const fileName = document.getElementById("fileName");

const addFileBtn = document.getElementById("addFileBtn");
const addFolderBtn = document.getElementById("addFolderBtn");
const downloadFileBtn = document.getElementById("downloadFileBtn");
const downloadProjectBtn = document.getElementById("downloadProjectBtn");
const backBtn = document.getElementById("backBtn");

const contextMenu = document.getElementById("contextMenu");
const renameBtn = document.getElementById("renameBtn");
const deleteBtn = document.getElementById("deleteBtn");

let project = [];
let selectedItem = null;
let selectedParent = null;

function isValidFileName(name, targetArray) {
    name = name.trim();

    if (name.length === 0) return false;

    if (name.startsWith(".")) return false;
    if (name.endsWith(".")) return false;
    if (name.includes("..")) return false;

    // проверка на дубликат
    const exists = targetArray.some(item => item.name === name);
    if (exists) return false;

    return true;
}

// ====== РЕНДЕР ======
function renderTree() {
    fileTree.innerHTML = "";
    renderItems(project, fileTree, 0);
}
//=======массив расширений=====================
function getFileIcon(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();

    const icons = {
        html: "🌐",
        css: "🎨",
        js: "🟨",
        json: "🗂️",
        md: "📘",
        png: "🖼️",
        jpg: "🖼️",
        jpeg: "🖼️",
        svg: "🖼️",
        py: "🐍",
        java: "☕",
        cpp: "⚙️",
        c: "⚙️"
    };

    return icons[ext] || "📄";
}
//===== дерево файлов отрисовка=================

function renderItems(items, container, level = 0) {
    items.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("file-item");
        div.style.paddingLeft = (level * 20) + "px";

         if (item.type === "folder") {
    div.textContent = (item.open ? "📂 " : "📁 ") + item.name;
} else {
    div.textContent = getFileIcon(item.name) + " " + item.name;
}

        if (item === selectedItem) {
            div.style.background = "#2a2a2a";
        }

        div.onclick = (e) => {
    e.stopPropagation();

    selectedItem = item;
    selectedParent = items;

    if (item.type === "file") {
        fileName.textContent = item.name;
        editor.value = item.content;
    }

    renderTree();
};

// ДВОЙНОЙ КЛИК — открыть/закрыть папку
div.ondblclick = (e) => {
    e.stopPropagation();

    if (item.type === "folder") {
        item.open = !item.open;
        renderTree();
    }
};

        div.oncontextmenu = (e) => {
            e.preventDefault();
            selectedItem = item;
            selectedParent = items;

            contextMenu.style.display = "block";
            contextMenu.style.left = e.pageX + "px";
            contextMenu.style.top = e.pageY + "px";
        };

        container.appendChild(div);

        if (item.type === "folder" && item.open) {
            renderItems(item.children, container, level + 1);
        }
    });
}

function getTargetArray() {
    if (!selectedItem) return project;

    if (selectedItem.type === "folder") {
        return selectedItem.children;
    }

    return selectedParent || project;
}

// ====== СОЗДАНИЕ ======
addFileBtn.onclick = () => {
    const name = prompt("Имя файла:");
    if (!name) return;

    const target = getTargetArray();

    if (!isValidFileName(name, target)) {
        alert("Неверное или уже существующее имя");
        return;
    }

    target.push({
        type: "file",
        name: name.trim(),
        content: ""
    });

    renderTree();
};

addFolderBtn.onclick = () => {
    const name = prompt("Имя папки:");
    if (!name) return;

const target = getTargetArray();

if (!isValidFileName(name, target)) {
    alert("Неверное имя файла");
    return;
}


    target.push({
        type: "folder",
        name,
        open: true,
        children: []
    });

    renderTree();
};
// ====== РЕДАКТОР ======
editor.oninput = () => {
    if (selectedItem && selectedItem.type === "file") {
        selectedItem.content = editor.value;
    }
};

// ====== ПЕРЕИМЕНОВАНИЕ ======
renameBtn.onclick = () => {
    if (!selectedItem) return;

    const newName = prompt("Новое имя:", selectedItem.name);
    if (!newName) return;

    selectedItem.name = newName;
    contextMenu.style.display = "none";
    renderTree();
};

// ====== УДАЛЕНИЕ ======
deleteBtn.onclick = () => {
    if (!selectedItem) return;

    const confirmDelete = confirm("Удалить?");
    if (!confirmDelete) return;

    const index = selectedParent.indexOf(selectedItem);
    selectedParent.splice(index, 1);

    selectedItem = null;
    editor.value = "";
    fileName.textContent = "Выберите файл";

    contextMenu.style.display = "none";
    renderTree();
};

// ====== СКРЫТИЕ МЕНЮ ======
document.onclick = () => {
    contextMenu.style.display = "none";
};

// ====== СКАЧАТЬ ФАЙЛ ======
downloadFileBtn.onclick = () => {
    if (!selectedItem || selectedItem.type !== "file") {
        alert("Выберите файл");
        return;
    }

    const blob = new Blob([selectedItem.content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = selectedItem.name;
    link.click();
};

// ====== СКАЧАТЬ ПРОЕКТ ======
downloadProjectBtn.onclick = async () => {
    const zip = new JSZip();

    function addToZip(items, path = "") {
        items.forEach(item => {
            if (item.type === "file") {
                zip.file(path + item.name, item.content);
            } else {
                addToZip(item.children, path + item.name + "/");
            }
        });
    }

    addToZip(project);

    const content = await zip.generateAsync({ type: "blob" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "project.zip";
    link.click();
};

// ====== НАЗАД ======
backBtn.onclick = () => {
    window.history.back();
};

// ====== СТАРТ ======
renderTree();