// ================== init.js ==================
// Безопасная инициализация проекта с повторными попытками
let MAX_ATTEMPTS = 10;
let attempt = 0;

function safeInit() {
    attempt++;
    console.log(`\n[Init] Попытка ${attempt} запуска безопасной инициализации...`);

    // Проверяем основные элементы DOM
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

    // Лог текущего состояния DOM элементов
    console.log("[Init] Проверка DOM элементов:");
    console.log("fileTree:", !!fileTree, "editor:", !!editor, "fileName:", !!fileName);
    console.log("addFileBtn:", !!addFileBtn, "addFolderBtn:", !!addFolderBtn);
    console.log("downloadFileBtn:", !!downloadFileBtn, "downloadProjectBtn:", !!downloadProjectBtn, "backBtn:", !!backBtn);
    console.log("contextMenu:", !!contextMenu, "renameBtn:", !!renameBtn, "deleteBtn:", !!deleteBtn);

    if (
        fileTree && editor && fileName &&
        addFileBtn && addFolderBtn &&
        downloadFileBtn && downloadProjectBtn && backBtn &&
        contextMenu && renameBtn && deleteBtn
    ) {
        console.log("✅ Все необходимые DOM элементы найдены.");

        // Сохраняем глобально, чтобы основной project.js мог работать
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

        console.log("[Init] Глобальные переменные назначены.");

        // Вызов основного скрипта, если он определён
        if (typeof window.startProject === "function") {
            console.log("[Init] Вызываем функцию startProject()...");
            window.startProject();
        } else {
            console.log("[Init] Функция startProject() пока не определена. Проект нужно запустить позже.");
        }

        return;
    }

    // Если DOM ещё не готов
    if (attempt < MAX_ATTEMPTS) {
        console.log(`⚠ DOM ещё не готов, пробуем снова через 200мс`);
        setTimeout(safeInit, 200);
    } else {
        alert("❌ Не удалось найти основные элементы DOM! Проект не может быть запущен.");
        console.error("[Init] Превышено максимальное число попыток. Инициализация не удалась.");
    }
}

// Запуск после полной загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
    console.log("[Init] DOMContentLoaded сработал. Старт безопасной инициализации...");
    safeInit();
});