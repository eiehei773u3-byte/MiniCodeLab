// ================== init.js ==================
let MAX_ATTEMPTS = 20;
let attempt = 0;

function showErrorModal() {
    // Проверяем, есть ли уже модал
    if (document.getElementById("initErrorModal")) return;

    const modal = document.createElement("div");
    modal.id = "initErrorModal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,0.6)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "9999";

    const box = document.createElement("div");
    box.style.background = "#1e1e1e";
    box.style.color = "white";
    box.style.padding = "20px";
    box.style.borderRadius = "10px";
    box.style.textAlign = "center";
    box.style.width = "300px";
    box.innerHTML = `
        <h2>Ошибка инициализации</h2>
        <p>❌ Не удалось найти основные элементы DOM.</p>
    `;

    const retryBtn = document.createElement("button");
    retryBtn.textContent = "Повторить";
    retryBtn.style.margin = "10px";
    retryBtn.onclick = () => {
        modal.remove();
        attempt = 0; // обнуляем счётчик
        safeInit();
    };

    const homeBtn = document.createElement("button");
    homeBtn.textContent = "Главная";
    homeBtn.style.margin = "10px";
    homeBtn.onclick = () => {
        window.location.href = "index.html";
    };

    box.appendChild(retryBtn);
    box.appendChild(homeBtn);
    modal.appendChild(box);
    document.body.appendChild(modal);
}

function safeInit() {
    attempt++;
    console.log(`[Init] Попытка ${attempt}`);

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

    const historyWindow = document.getElementById("historyWindow");
    const closeHistoryBtn = document.getElementById("closeHistoryBtn");

    if (
        fileTree && editor && fileName &&
        addFileBtn && addFolderBtn &&
        downloadFileBtn && downloadProjectBtn && backBtn &&
        contextMenu && renameBtn && deleteBtn
    ) {
        console.log("[Init] ✅ DOM найден, запускаем проект");
        
        window.fileTree = fileTree;
        window.editor = editor;
        window.fileName = fileName;
        window.addFileBtn = addFileBtn;
        window.addFolderBtn = addFolderBtn;
        window.downloadFileBtn = downloadFileBtn;
        window.downloadProjectBtn = downloadProjectBtn;
        window.backBtn = backBtn;
        window.contextMenu = contextMenu;
        window.renameBtn = renameBtn;
        window.deleteBtn = deleteBtn;
        window.historyWindow = historyWindow;
        window.closeHistoryBtn = closeHistoryBtn;

        if (typeof window.startProject === "function") {
            window.startProject();
        }
        return;
    }

    if (attempt < MAX_ATTEMPTS) {
        console.log("[Init] ⚠ DOM ещё не готов, повторная проверка через 200мс");
        setTimeout(safeInit, 200);
    } else {
        console.error("[Init] ❌ Превышено max число попыток");
        showErrorModal(); // выводим красивое модальное окно
    }
}

document.addEventListener("DOMContentLoaded", safeInit);