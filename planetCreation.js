import { data, interactiveCanvas } from "./declarations.js";
import { settings } from "./settings.js";
import { createPlanetMenu, ctrlPressed } from "./UI.js";
import { swap } from "./diskCreation.js";
import { Quadtree } from "./Quadtree.js";
import { lockonPoint } from "./lockon.js";

let lowestStep = 0;
let step = 0;
let placementX;
let placementY;
const color = settings.color;
let checksArrayPlanet = getPlanetChecks();


function findFirstCheck() {

    for (let i = 0; i < checksArrayPlanet.length; i++) {
        if (checksArrayPlanet[i] === 0) return i;
    }
    return checksArrayPlanet.length;

}

function findNextCheck(index) {
    for (let i = index + 1; i < checksArrayPlanet.length; i++) {
        if (checksArrayPlanet[i] === 0) return i;
    }
    return checksArrayPlanet.length;
}

const planetChecks = createPlanetMenu.panel.querySelectorAll(".planet-checkbox");
for (const check of planetChecks) {
    check.addEventListener("click", () => {
        checksArrayPlanet = getPlanetChecks();
        lowestStep = findFirstCheck();
        step = lowestStep;
        const xValue = document.querySelector("#planet-menu #x-pos");
        const yValue = document.querySelector("#planet-menu #y-pos");
        placementX = interactiveCanvas.width / 2 + xValue.valueAsNumber * interactiveCanvas.scale; //updating placement value needed for proper display when checkmarks are checked during visual creation
        placementY = interactiveCanvas.height / 2 + yValue.valueAsNumber * interactiveCanvas.scale;
        planetToAdd = getPlanetValuesWithNAN();
        console.log(findFirstCheck());
    });
}

function emptyPlanet() {
    return {
        x: null,
        y: null,
        xVel: null,
        yVel: null,
        xAccel: 0,
        yAccel: 0,
        mass: null,
        size: null,
        color: settings.color,
        delete: false
    };
}


function getPlanetValues() {
    const children = document.querySelectorAll("#planet-menu input[type = 'number']");
    const planetToAddReturn = Array(5).fill(0);
    let i = 0;
    for (const child of children) {
        const value = child.valueAsNumber;
        if (isNaN(value)) {
            planetToAdd = Array(5).fill(0);
            return 0;
        }
        planetToAddReturn[i] = value;
        i++
    }
    return planetToAddReturn;

}
function getPlanetValuesWithNAN() {
    const children = document.querySelectorAll("#planet-menu input[type = 'number']");
    const planetToAdd = Array(5).fill(0);
    let i = 0;
    for (const child of children) {
        const value = child.valueAsNumber;
        planetToAdd[i] = value;
        i++
    }
    return planetToAdd;
}

const createPlanetButton = document.createElement("button");
createPlanetButton.textContent = "create planet";
createPlanetButton.setAttribute("id", "create-planet");
createPlanetMenu.panel.appendChild(createPlanetButton);
createPlanetButton.addEventListener("click", createPlanet);

function createPlanet() {
    const planetToAdd = getPlanetValues();
    if (!planetToAdd) return;
    let planet = {
        x: planetToAdd[0],
        y: planetToAdd[1],
        xVel: planetToAdd[2],
        yVel: planetToAdd[3],
        xAccel: 0,
        yAccel: 0,
        mass: planetToAdd[4],
        size: Quadtree.cubeRootMass(planetToAdd[4]),
        color: color,
        delete: false
    };

    data.push(planet);
}

const createPlanetVisually = document.createElement("button");
createPlanetVisually.textContent = "create visually";
createPlanetMenu.panel.appendChild(createPlanetVisually);

createPlanetVisually.addEventListener("click", () => {
    settings.createPlanetVisually = !settings.createPlanetVisually;
    settings.createDiskVisually = false;
    checksArrayPlanet = getPlanetChecks();

});

function getPlanetChecks() { //will need to change ordering to match desired visual creation steps
    let array = [];
    const checks = createPlanetMenu.querySelectorAll("input[type = 'checkbox']");
    for (const check of checks) {
        if (check.checked) {
            array.push(1);
        }
        else {
            array.push(0);
        }
    }
    swap(array, 1, 2);
    console.log(array);
    return array;

}

const numInputs = createPlanetMenu.querySelectorAll("input[type = 'number']");
for (const input of numInputs) {
    input.addEventListener("input", () => {
        step = lowestStep;
        planetToAdd = getPlanetValuesWithNAN();
    });
}

let planetToAdd = Array(11).fill(0);
let substep = 0;
interactiveCanvas.addEventListener("click", (e) => {
    if (settings.createPlanetVisually) {
        if (step === lowestStep) {
            planetToAdd = getPlanetValuesWithNAN();
            if (isNaNInputsNeeded()) {
                return;
            }
        }


        if (checksArrayPlanet[0]) {
            if (isNaN(planetToAdd[1]) || isNaN(planetToAdd[2])) { return };
            placementX = interactiveCanvas.width / 2 + planetToAdd[0] * interactiveCanvas.scale;
            placementY = interactiveCanvas.height / 2 + planetToAdd[1] * interactiveCanvas.scale;;
        }

        if (step === 0) {
            if (ctrlPressed) {
                return;
            }

            else {

                placementX = interactiveCanvas.tempX;
                placementY = interactiveCanvas.tempY;
                planetToAdd[0] = (placementX - interactiveCanvas.width / 2) / interactiveCanvas.scale;
                planetToAdd[1] = (placementY - interactiveCanvas.height / 2) / interactiveCanvas.scale;
                interactiveCanvas.enableMove = false;
                interactiveCanvas.enableZoom = false;
            }
        }

        else if (step === 1) {
            if (ctrlPressed) {
                return;
            }

            const radius = Math.sqrt((interactiveCanvas.mouseX - placementX) ** 2 + (interactiveCanvas.mouseY - placementY) ** 2);
            const mass = radius / interactiveCanvas.scale;
            planetToAdd[4] = mass ** 3;
        }



        else if (step === 2) {
            if (ctrlPressed) {
                return;
            }
            planetToAdd[2] = (interactiveCanvas.mouseX - placementX) / interactiveCanvas.scale;
            planetToAdd[3] = (interactiveCanvas.mouseY - placementY) / interactiveCanvas.scale;
            createVisually();
            step = lowestStep;
            //planetToAdd = Array(5).fill(0);
            if (!settings.lockedon) {
                interactiveCanvas.enableZoom = true;
                interactiveCanvas.enableMove = true;
            }
            return;
        }
        step = findNextCheck(step);

        if (step === 3) {
            if (ctrlPressed) {
                return;
            }
            createVisually();
            step = lowestStep;
            //planetToAdd = Array(5).fill(0);

            if (!settings.lockedon) {
                interactiveCanvas.enableZoom = true;
                interactiveCanvas.enableMove = true;
            }
            return;
        }
    }
});

function arrayConvert() {
    const array = Array(5).fill(0);
    const arraySwap = [...checksArrayPlanet];
    swap(arraySwap, 1, 2); //undoes swapping
    array[0] = array[1] = arraySwap[0];
    array[2] = array[3] = arraySwap[1];
    array[4] = arraySwap[2];
    return array;

}
function isNaNInputsNeeded() {
    const planetValues = getPlanetValuesWithNAN();
    const UseInputArray = arrayConvert();
    for (let i = 0; i < UseInputArray.length; i++) {
        if (UseInputArray[i]) {
            const inputValue = planetValues[i];
            if (isNaN(inputValue)) {
                return 1;
            }

        }
    }
    return 0;
}

function createVisually() {   //same as normal create?
    if (!planetToAdd) return;
    const xShift = (settings.lockedon) ? lockonPoint.x : interactiveCanvas.xOfWindowToCanvas(interactiveCanvas.width / 2);
    const yShift = (settings.lockedon) ? lockonPoint.y : interactiveCanvas.yOfWindowToCanvas(interactiveCanvas.height / 2);
    const xVelShift = (settings.lockedon) ? lockonPoint.xVel : 0;
    const yVelShift = (settings.lockedon) ? lockonPoint.yVel : 0;
    let planet = {
        x: planetToAdd[0] + xShift,
        y: planetToAdd[1] + yShift,
        xVel: planetToAdd[2] + xVelShift,
        yVel: planetToAdd[3] + yVelShift,
        xAccel: 0,
        yAccel: 0,
        mass: planetToAdd[4],
        size: Quadtree.cubeRootMass(planetToAdd[4]),
        color: color,
        delete: false
    };

    data.push(planet);
}

interactiveCanvas.addEventListener("contextmenu", (e) => { //cancels placing planet visually
    if (settings.createPlanetVisually) {
        e.preventDefault();
        step = lowestStep;

        if (!settings.lockedon) {
            interactiveCanvas.enableZoom = true;
            interactiveCanvas.enableMove = true;
        }


    }
});

function animatePlanetPlacement(canvas) {
    const xShift = (settings.lockedon) ? lockonPoint.x : canvas.xOfWindowToCanvas(canvas.width / 2);
    const yShift = (settings.lockedon) ? lockonPoint.y : canvas.yOfWindowToCanvas(canvas.height / 2);
    const xVelShift = (settings.lockedon) ? lockonPoint.xVel : 0;
    const yVelShift = (settings.lockedon) ? lockonPoint.yVel : 0;
    const mouseX = canvas.mouseX;
    const mouseY = canvas.mouseY;
    const ctxX = canvas.xOfWindowToCanvas(mouseX);
    const ctxY = canvas.yOfWindowToCanvas(mouseY);
    const scale = canvas.scale;
    //const ctxPlacementX = canvas.xOfWindowToCanvas(placementX);
    //const ctxPlacementY = canvas.yOfWindowToCanvas(placementY);

    const x = planetToAdd[0] + xShift;
    const y = planetToAdd[1] + yShift;
    const size = Quadtree.cubeRootMass(planetToAdd[4]);
    const xVel = planetToAdd[2] + xVelShift;
    const yVel = planetToAdd[3] + yVelShift;

    if (checksArrayPlanet[0] || step > 0) {
        canvas.ctx.globalAlpha = 0.5;
        canvas.drawCircle(x, y, 1, color);
        canvas.ctx.globalAlpha = 1;
    }
    if (checksArrayPlanet[1] || step > 1) {
        canvas.ctx.globalAlpha = 0.5;
        if (step === 0) canvas.drawCircle(ctxX, ctxY, size, color);
        else canvas.drawCircle(x, y, size, color);
        canvas.ctx.globalAlpha = 1;
    }
    if (checksArrayPlanet[2] || step > 2) {
        canvas.ctx.globalAlpha = 0.5;
        if (step === 0) canvas.drawLine(ctxX, ctxY, ctxX + xVel, ctxY + yVel, "red");
        else canvas.drawLine(x, y, x + xVel, y + yVel, "red");
        canvas.ctx.globalAlpha = 1;
    }

    if (step === 0) {
        canvas.drawCircle(ctxX, ctxY, 1 / scale, color);
    }
    else if (step === 1) {
        let radius = Math.sqrt((mouseX - placementX) ** 2 + (mouseY - placementY) ** 2);
        radius /= scale;
        canvas.drawCircle(x, y, radius, color);
    }
    else if (step === 2) {
        const xVel = (mouseX - placementX) / scale;
        const yVel = (mouseY - placementY) / scale;
        canvas.drawLine(x, y, x + xVel, y + yVel, "red");
    }
}

export { animatePlanetPlacement, emptyPlanet };