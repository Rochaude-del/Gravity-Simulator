import { data, interactiveCanvas } from "./declarations.js";
import { settings } from "./settings.js";
import { DropMenuButton, ExpandMenu, ToggleButton } from "./UIElements.js";



const color = settings.color;

const createPlanetMenu = new ExpandMenu();
const createDiskMenu = new ExpandMenu();

const icon = document.createElement("img");
icon.classList.add("expand-icon");
icon.src = "images/triangle.png";
icon.alt = "menu icon";
icon.style.display = "flex";
icon.style.width = "10px";
icon.style.height = "10px";






createPlanetMenu.setAttribute("id", "planet-menu");
createDiskMenu.setAttribute("id", "disk-menu");

createPlanetMenu.panel.classList.add("create-parameters");
createDiskMenu.panel.classList.add("create-parameters");

function createNumberInput(name, id) {
    const label = document.createElement("label");
    label.textContent = name;
    const input = document.createElement("input");
    input.setAttribute("type", "number");
    input.setAttribute("id", id);
    label.appendChild(input);
    label.classList.add("number-input-label");
    return label;

}

function addCheckBox(div, cssClass, cssId) {
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.classList.add(cssClass);
    checkbox.setAttribute("id", cssId);
    div.appendChild(checkbox);
}

const names = ["x position", "y position", "x velocity", "y velocity", "mass"];
const values = ["0", "0", "0", "0", "100"];
const ids = ["x-pos", "y-pos", "x-vel", "y-vel", "mass"];
const checkIds = ["pos-check", "vel-check", "mass-check"];

const names2 = ["center mass", "x position", "y position", "x velocity", "y velocity", "min disk radius", "max disk radius", "min disk mass", "max disk mass", "number of orbiting bodies", "spin direction"];
const values2 = ["500", "0", "0", "0", "0", "50", "400", "5", "20", "30"];
const ids2 = ["center-mass", "x-pos", "y-pos", "x-vel", "y-vel", "min-radius", "max-radius", "min-mass", "max-mass", "number", "spin"];
const checkIdsDisk = ["center-mass", "pos-check", "vel-check", "min-radius", "max-radius"];



createPlanetMenu.button.textContent = "planet creation";
createDiskMenu.button.textContent = "disk creation";

createPlanetMenu.button.prepend(icon.cloneNode(true)); //for some reason the icon does not show up if I append it before setting the textContent, so I have to do it after
createDiskMenu.button.prepend(icon.cloneNode(true));

for (let i = 0; i < 2; i++) {
    const div = document.createElement("div");
    div.classList.add("input-group");
    const div2 = document.createElement("div");
    for (let j = 2 * i; j < (2 * i + 2); j++) {
        const numInput = createNumberInput(names[j], ids[j]);
        const input = numInput.children[0];
        input.setAttribute("value", values[j]);
        div2.appendChild(numInput);
    }
    div.appendChild(div2);
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.classList.add("planet-checkbox");
    checkbox.setAttribute("id", checkIds[i]);
    div.appendChild(checkbox);
    createPlanetMenu.panel.appendChild(div);

}

const massInput = document.createElement("div");
massInput.classList.add("input-group");
const massInputs = document.createElement("div");
const numInput = createNumberInput(names[4], ids[4]);
const input = numInput.children[0];
input.setAttribute("value", values[4]);
massInputs.appendChild(numInput);
massInput.appendChild(massInputs);
const massCheckbox = document.createElement("input");
massCheckbox.setAttribute("type", "checkbox");
massCheckbox.setAttribute("id", "mass");
massCheckbox.classList.add("planet-checkbox");
massInput.appendChild(massCheckbox);
createPlanetMenu.panel.appendChild(massInput);





let i = 0;
while (i <= names2.length) {
    if (i === 0) {
        const inputGroup = document.createElement("div");
        inputGroup.classList.add("input-group");
        const input = createNumberInput(names2[0], ids2[0]);
        const numInput = input.children[0];
        numInput.setAttribute("value", values2[i]);
        inputGroup.append(input);
        addCheckBox(inputGroup, "disk-checkbox", checkIdsDisk[0]);
        createDiskMenu.panel.appendChild(inputGroup);
        i++;
    }
    else if (i > 0 && i < 9) {
        const inputGroup = document.createElement("div");
        inputGroup.classList.add("input-group");
        const input1 = createNumberInput(names2[i], ids2[i]);
        const numInput1 = input1.children[0];
        numInput1.setAttribute("value", values2[i]);
        const input2 = createNumberInput(names2[i + 1], ids2[i + 1]);
        const numInput2 = input2.children[0];
        numInput2.setAttribute("value", values2[i + 1]);
        const div = document.createElement("div");
        div.classList.add("input-list");
        inputGroup.classList.add("input-group");
        div.appendChild(input1);
        div.appendChild(input2);
        inputGroup.appendChild(div);
        if (i < 7) {
            addCheckBox(inputGroup, "disk-checkbox", checkIdsDisk[(i + 1) / 2])
        }
        createDiskMenu.panel.appendChild(inputGroup);
        i += 2;
    }
    else if (i === 9) {
        const inputGroup = document.createElement("div");
        inputGroup.classList.add("input-group");
        const input = createNumberInput(names2[9], ids2[9]);
        const numInput = input.children[0];
        numInput.setAttribute("value", values2[i]);
        const div = document.createElement("div");
        div.classList.add("input-list");
        div.appendChild(input);
        inputGroup.appendChild(div);

        createDiskMenu.panel.appendChild(inputGroup);
        i++;
    }
    else if (i === 10) {
        const label = document.createElement("label");
        label.textContent = "clockwise";
        const input = document.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("value", "0");
        input.setAttribute("name", ids2[i]);
        label.appendChild(input);

        const label2 = document.createElement("label");
        label2.textContent = "counter-clockwise";
        const input2 = document.createElement("input");
        input2.setAttribute("type", "radio");
        input2.setAttribute("value", "1");
        input2.setAttribute("name", ids2[i]);
        input2.setAttribute("checked", "");
        label2.appendChild(input2);

        const inputGroup = document.createElement("div");
        inputGroup.classList.add("input-group");
        const div = document.createElement("div");
        div.classList.add("input-list");
        div.appendChild(label);
        div.appendChild(label2);
        inputGroup.appendChild(div);
        div.setAttribute("id", "spin-direction-settings");

        createDiskMenu.panel.appendChild(inputGroup);
        i++;

    }
    else if (i === 11) {

        i++;
    }

}


const createPlanetVisually = new ToggleButton();
createPlanetVisually.textContent = "create visually";
createPlanetMenu.panel.appendChild(createPlanetVisually);

const createDiskVisually = new ToggleButton();
createDiskVisually.textContent = "create visually";
createDiskMenu.panel.appendChild(createDiskVisually);

createDiskVisually.addPair(createPlanetVisually);


const creationSettings = new DropMenuButton();
creationSettings.button.textContent = "creation menu";
creationSettings.panel.appendChild(createPlanetMenu);
creationSettings.panel.appendChild(createDiskMenu);





const displaySettings = new DropMenuButton();
displaySettings.button.textContent = "display settings";

const pathButton = new ToggleButton();
pathButton.textContent = "display paths";

pathButton.addEventListener("click", () => {
    settings.paths = !settings.paths;
});

displaySettings.panel.appendChild(pathButton);

const taskbar = document.createElement("div");
taskbar.classList.add("taskbar");
taskbar.appendChild(creationSettings);
taskbar.appendChild(displaySettings);

creationSettings.setParent(taskbar);
displaySettings.setParent(taskbar);

const resetCameraButton = document.createElement("button");
resetCameraButton.textContent = "reset camera";
displaySettings.panel.appendChild(resetCameraButton);
resetCameraButton.addEventListener("click", () => {
    settings.lockedon = false;
    interactiveCanvas.enableMove = true;
    interactiveCanvas.enableZoom = true;
    interactiveCanvas.resetCtx();
});

const clearButton = document.createElement("button");
clearButton.textContent = "clear space";
creationSettings.panel.appendChild(clearButton);

clearButton.addEventListener("click", () => {
    data.length = 0;
    settings.lockedon = false;
    settings.createInOrbitPlanet = false;
    settings.createInOrbitDisk = false;
    interactiveCanvas.enableMove = true;
    interactiveCanvas.enableZoom = true;
});

let ctrlPressed = false;
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey) {
        e.preventDefault();
        ctrlPressed = true;
    }
});
document.addEventListener("keyup", (e) => {
    if (e.key === "Control") {
        ctrlPressed = false;
    }
});

let shiftPressed = false;
document.addEventListener("keydown", (e) => {
    if (e.shiftKey) {
        e.preventDefault();
        shiftPressed = true;
    }
});
document.addEventListener("keyup", (e) => {
    if (e.key === "Shift") {
        shiftPressed = false;
    }
});

let altPressed = false;
document.addEventListener("keydown", (e) => {
    if (e.altKey) {
        altPressed = true;
    }
});
document.addEventListener("keyup", (e) => {
    if (e.key === "Alt") {
        e.preventDefault();
        altPressed = false;

    }
});



function addSettingsButton(menu, textContent, setting) {
    const button = new ToggleButton();
    button.textContent = textContent;

    button.addEventListener("click", () => {
        settings[setting] = !settings[setting];
    });

    menu.panel.appendChild(button);
}


addSettingsButton(displaySettings, "display quadtree", "drawQuadtree");

const animationControls = document.createElement("div");
animationControls.classList.add("taskbar");
animationControls.setAttribute("id", "animation-controls");
const pauseButton = document.createElement("button");

const pauseIcon = document.createElement("img");
pauseIcon.classList.add("play-pause-icon");
pauseIcon.src = "images/pause.png";
pauseIcon.alt = "pause icon";
pauseButton.classList.add("play-pause-button");
pauseButton.appendChild(pauseIcon);
animationControls.appendChild(pauseButton);
pauseButton.addEventListener("click", () => {
    pauseIcon.src = settings.paused ? "images/pause.png" : "images/triangle.png";
    settings.paused = !settings.paused;
});

const speedControl = document.createElement("label");
speedControl.textContent = "simulation speed";
const speedInput = document.createElement("input");
speedInput.setAttribute("type", "number");
speedInput.setAttribute("value", "1");
speedInput.setAttribute("id", "speed-control");
speedControl.appendChild(speedInput);
animationControls.appendChild(speedControl);
speedInput.addEventListener("input", (e) => {
    const value = e.target.valueAsNumber;
    settings.speed = (isNaN(value))? settings.speed : value ;
});


export { taskbar, createPlanetMenu, createDiskMenu, interactiveCanvas, ctrlPressed, shiftPressed, altPressed, animationControls, icon, createNumberInput, createDiskVisually, createPlanetVisually, addSettingsButton };

