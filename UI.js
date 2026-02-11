import { data, interactiveCanvas } from "./declarations.js";
import { settings } from "./settings.js";
import { DropMenuButton, ExpandMenu } from "./dropdown.js";



const color = settings.color;

const createPlanetMenu = new ExpandMenu();
const createDiskMenu = new ExpandMenu();

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
const ids = ["x-pos", "y-pos", "x-vel", "y-vel", "mass"];
const checkIds = ["pos-check", "vel-check", "mass-check"];

const names2 = ["center mass", "x position", "y position", "x velocity", "y velocity", "min disk radius", "max disk radius", "min disk mass", "max disk mass", "number of orbiting bodies", "spin direction"];
const values2 = ["500", "0", "0", "0", "0", "50", "400", "5", "20", "30"];
const ids2 = ["center-mass", "x-pos", "y-pos", "x-vel", "y-vel", "min-radius", "max-radius", "min-mass", "max-mass", "number", "spin"];
const checkIdsDisk = ["center-mass", "pos-check", "vel-check", "min-radius", "max-radius"];

createPlanetMenu.button.textContent = "planet creation";
createDiskMenu.button.textContent = "disk creation";

for (let i = 0; i < 2; i++) {
    const div = document.createElement("div");
    div.classList.add("input-group");
    const div2 = document.createElement("div");
    for (let j = 2 * i; j < (2 * i + 2); j++) {
        div2.appendChild(createNumberInput(names[j], ids[j]));
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
massInput.appendChild(createNumberInput("mass", "mass"));
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
        inputGroup.append(input);
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
        div.appendChild(label);
        div.appendChild(label2);
        inputGroup.appendChild(div);
        div.setAttribute("id", "spin-direction-settings");

        createDiskMenu.panel.appendChild(div);
        i++;

    }
    else if (i === 11) {

        i++;
    }

}

const creationSettings = new DropMenuButton();
creationSettings.button.textContent = "creation menu";
creationSettings.panel.appendChild(createPlanetMenu);
creationSettings.panel.appendChild(createDiskMenu);

const displaySettings = new DropMenuButton();
displaySettings.button.textContent = "display settings";

const pathButton = document.createElement("button");
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
    interactiveCanvas.enableMove = true;
    interactiveCanvas.enableZoom = true;
});

let ctrlPressed = false;
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey) {
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
        shiftPressed = true;
    }
});
document.addEventListener("keyup", (e) => {
    if (e.key === "Shift") {
        shiftPressed = false;
    }
});

function addSettingsButton(menu, textContent, setting) {
    const button = document.createElement("button");
    button.textContent = textContent;

    button.addEventListener("click", () => {
        settings[setting] = !settings[setting];
    });

    menu.panel.appendChild(button);
}


addSettingsButton(displaySettings, "display quadtree", "drawQuadtree");

export { taskbar, createPlanetMenu, createDiskMenu, interactiveCanvas, ctrlPressed, shiftPressed };

