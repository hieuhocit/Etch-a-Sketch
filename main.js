const colorPicker = document.querySelector('#pick-color');
const btnColor = document.querySelector('#colorBtn');
const btnClear = document.querySelector('#clearBtn');
const btnGridLine = document.querySelector('#gridLineBtn');
const grid = document.querySelector(".container");
const gridSize = document.querySelector("#grid-size");
const size = document.querySelector("#size");
const btnModes = document.querySelectorAll(".btn.mode");

let mouseDown = false;
let mode = "Color";

document.body.addEventListener("mousedown", () => mouseDown = true);
document.body.addEventListener("mouseup", () => mouseDown = false);

gridSize.addEventListener("input", generateGrid);
btnClear.addEventListener("click", toggleClear);
btnGridLine.addEventListener("click", toggleGridLine);

grid.addEventListener("mousedown", paintColor);
grid.addEventListener("mouseover", paintColor);

btnColor.classList.add("active");
btnModes.forEach(btnMode => {
    btnMode.addEventListener("click", applyMode);
});

generateGrid();

function applyMode(e) {
    btnModes.forEach(btn => {
        btn.classList.remove("active");
    });
    e.target.classList.add("active");
    mode = e.target.dataset.mode;
}

function toggleClear() {
    grid.innerHTML = "";
    generateGrid();
}

function paintColor(e) {
    if ((mouseDown || e.type === "mousedown") && e.target !== grid) {
        switch (mode) {
            case "Color":
                e.target.style.backgroundColor = colorPicker.value;
                break;
            case "Rainbow":
                e.target.style.backgroundColor = generateRandomColor();
                break;
            case "Eraser":
                e.target.style.backgroundColor = "transparent";
                break;
            case "Shading":
                {
                    const rgb = e.target.style.backgroundColor || "rgb(255,255,255)";
                    let [h, s, l] = rgbToHsl(rgb) || [0, 0, 0];
                    l = l - 10;
                    e.target.style.backgroundColor = `hsl(${h}deg,${s}%,${l}%)`;
                }
                break;
            case "Lighten":
                {
                    const rgb = e.target.style.backgroundColor || "rgb(255,255,255)";
                    let [h, s, l] = rgbToHsl(rgb) || [0, 0, 0];
                    l = l + 10;
                    e.target.style.backgroundColor = `hsl(${h}deg,${s}%,${l}%)`;
                }
                break;
        }
    }
}

function toggleGridLine() {
    grid.classList.toggle("grid-line");
    btnGridLine.classList.toggle("active");
}

function generateGrid() {
    size.textContent = gridSize.value + " x " + gridSize.value;
    grid.innerHTML = "";
    for (let i = 1; i <= (Math.pow(gridSize.value, 2)); i++) {
        const gridItem = document.createElement("div");
        gridItem.style.cssText = `width: ${100 / gridSize.value}%; height: ${100 / gridSize.value}%;`;
        grid.appendChild(gridItem);
    }
}

function generateRandomColor() {
    return `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
}

function rgbToHsl(rgb) {
    let regex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
    let matches = rgb.match(regex);

    if (matches) {
        let r = matches[1] - 0;
        let g = matches[2] - 0;
        let b = matches[3] - 0;

        r /= 255;
        g /= 255;
        b /= 255;

        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h * 360, s * 100, l * 100];
    }
}