// Select all input areas
let htmlInput = document.querySelector(".codeeditor-html textarea");
let cssInput = document.querySelector(".codeeditor-css textarea");
let jsInput = document.querySelector(".codeeditor-js textarea");
let save = document.querySelector("#save-output");
let outputFrame = document.getElementById("output");
let full = document.querySelector("#fullscreen-output");
let outputContainer = document.querySelector(".output-container");
let copy = document.querySelectorAll(".copy-btn");
const resizerHtml = document.getElementById("resizer-html");
const resizerCss = document.getElementById("resizer-css");
const htmlEditor = document.querySelector(".codeeditor-html");
const cssEditor = document.querySelector(".codeeditor-css");
const jsEditor = document.querySelector(".codeeditor-js");
// Import & Export Buttons
let importBtns = document.querySelectorAll(".fa-file-import");
let exportBtns = document.querySelectorAll(".fa-file-export");

// Function to update the output frame
function updateOutput() {
    let htmlCode = htmlInput.value;
    let cssCode = `<style>${cssInput.value}</style>`;
    let jsCode = `<script>${jsInput.value}<\/script>`;

    let finalCode = `
        ${htmlCode}
        ${cssCode}
        ${jsCode}
    `;

    outputFrame.srcdoc = finalCode; // Safer execution
}

// Save button event listener
save.addEventListener("click", updateOutput);

// Toggle Fullscreen Mode
full.addEventListener("click", () => {
    outputContainer.classList.toggle("output-fullScreen");
    full.style.transform = outputContainer.classList.contains("output-fullScreen") ? "rotate(180deg)" : "rotate(0deg)";
});

// Copy Code to Clipboard
copy.forEach((btn) => {
    btn.addEventListener("click", () => {
        let targetInput = btn.classList.contains("copy1") ? htmlInput :
                          btn.classList.contains("copy2") ? cssInput : jsInput;
        navigator.clipboard.writeText(targetInput.value);
    });
});

// Auto Line Numbering
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".editor-wrapper").forEach((editor) => {
        const textarea = editor.querySelector(".code-input");
        const lineNumbers = editor.querySelector(".line-numbers");

        function updateLineNumbers() {
            let numbersHTML = "";
            for (let i = 1; i <= textarea.value.split("\n").length; i++) {
                numbersHTML += i + "<br>";
            }
            lineNumbers.innerHTML = numbersHTML;
        }

        textarea.addEventListener("input", updateLineNumbers);
        textarea.addEventListener("scroll", () => {
            lineNumbers.scrollTop = textarea.scrollTop;
        });

        updateLineNumbers();
    });
});

// Export Button Functionality
exportBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        let content = index === 0 ? htmlInput.value :
                      index === 1 ? cssInput.value : jsInput.value;
        let fileName = index === 0 ? "code.html" :
                       index === 1 ? "style.css" : "script.js";

        let blob = new Blob([content], { type: "text/plain" });
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        a.click();
    });
});

// Import Button Functionality
importBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = index === 0 ? ".html" : index === 1 ? ".css" : ".js";

        input.addEventListener("change", () => {
            let file = input.files[0];
            if (!file) return;

            let reader = new FileReader();
            reader.onload = () => {
                if (index === 0) htmlInput.value = reader.result;
                else if (index === 1) cssInput.value = reader.result;
                else jsInput.value = reader.result;
            };
            reader.readAsText(file);
        });

        input.click();
    });
});

// Theme Selection and Persistence
document.addEventListener("DOMContentLoaded", function () {
    const themeSelect = document.getElementById("theme-select");
    const savedTheme = localStorage.getItem("selectedTheme") || "light";

    applyTheme(savedTheme);
    themeSelect.value = savedTheme;

    themeSelect.addEventListener("change", function () {
        let selectedTheme = this.value;
        applyTheme(selectedTheme);
        localStorage.setItem("selectedTheme", selectedTheme);
    });

    function applyTheme(theme) {
        document.body.classList.remove("light-theme", "dark-theme", "solarized-theme", "cyberpunk-theme");
        document.body.classList.add(`${theme}-theme`);
    }
});

// Font Size Adjustment (Fixing Issue)
document.getElementById("fontSize").addEventListener("change", function () {
    const selectedSize = this.value;
    document.querySelectorAll(".code-input").forEach((input) => {
        input.style.fontSize = selectedSize;
    });
});


// Load saved layout from localStorage when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const savedLayout = localStorage.getItem("selectedLayout") || "horizontal-layout";
    editorContainer.classList.add(savedLayout);
});


document.addEventListener("DOMContentLoaded", function () {
    // Auto-indent when pressing "Enter" inside the editor
    document.querySelectorAll(".code-input").forEach(textarea => {
        textarea.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                const start = this.selectionStart;
                const end = this.selectionEnd;
                this.value = this.value.substring(0, start) + "\n    " + this.value.substring(end);
                this.selectionStart = this.selectionEnd = start + 5;
            }
        });
    });
});

function initResizer(resizer, leftDiv, rightDiv) {
    let isResizing = false;

    resizer.addEventListener("mousedown", (event) => {
        isResizing = true;
        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", stopResize);
    });

    function resize(event) {
        if (isResizing) {
            let newWidth = event.clientX - leftDiv.getBoundingClientRect().left;
            let containerWidth = document.querySelector(".codeeditor-container").offsetWidth;

            if (newWidth > 100 && newWidth < containerWidth - 200) {
                leftDiv.style.flex = `0 0 ${newWidth}px`;
                rightDiv.style.flex = `1`;
            }
        }
    }

    function stopResize() {
        isResizing = false;
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopResize);
    }
}

initResizer(resizerHtml, htmlEditor, cssEditor);
initResizer(resizerCss, cssEditor, jsEditor);