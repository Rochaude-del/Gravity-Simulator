import { data, interactiveCanvas, lockonPoint } from "./declarations.js";
import { settings } from "./settings.js";
import { createPlanetMenu, ctrlPressed, altPressed, shiftPressed, createPlanetVisually } from "./UI.js";
import { swap } from "./diskCreation.js";
import { Quadtree } from "./Quadtree.js";
import { centripitalVel } from "./generators.js";
import { ToggleButton } from "./UIElements.js";

let lowestStep = 0;
let step = 0;
let placementX;
let placementY;
const color = settings.color;
let checksArrayPlanet = getPlanetChecks();

function resetChecksArrayPlanet() {
    checksArrayPlanet = getPlanetChecks();
    lowestStep = findFirstCheck();
    step = lowestStep;
    planetToAdd = getPlanetValuesWithNAN();
}


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
        resetPlacement();                              //updating placement value needed for proper display when checkmarks are checked during visual creation 
        planetToAdd = getPlanetValuesWithNAN();

        //console.log(findFirstCheck());
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
    if (settings.createInOrbitPlanet) {
        planetToAddReturn[2] = 0;
        planetToAddReturn[3] = 0;
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
    if (settings.createInOrbitPlanet) {
        const velArray = centripitalVel(planetToAdd[0], planetToAdd[1], lockonPoint.mass);
        planetToAdd[2] = velArray[0];
        planetToAdd[3] = velArray[1];
    }
    return planetToAdd;
}

const createPlanetButton = document.createElement("button");
createPlanetButton.textContent = "create planet";
createPlanetButton.setAttribute("id", "create-planet");
createPlanetMenu.panel.prepend(createPlanetButton);
createPlanetButton.addEventListener("click", createVisually);

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



createPlanetVisually.addEventListener("click", () => {
    if (!settings.createPlanetVisually) {
        resetPlacement();
    }
    settings.createPlanetVisually = !settings.createPlanetVisually;
    settings.createDiskVisually = false; //sets other to false to prevent confusion, can only have one visual creation mode on at once
    checksArrayPlanet = getPlanetChecks();
    if (settings.createInOrbitPlanet) {
        checksArrayPlanet[2] = 1;
    }

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
    if (settings.createInOrbitPlanet) {
        array[2] = 1;
    }
    //console.log(array);
    return array;

}

const numInputs = createPlanetMenu.querySelectorAll("input[type = 'number']");
for (const input of numInputs) {
    input.addEventListener("input", () => {
        step = lowestStep;
        planetToAdd = getPlanetValuesWithNAN();
    });
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        createPlanetVisually.classList.remove("toggle-button");
        settings.createPlanetVisually = false;
        step = lowestStep;
    }
});


const createInOrbitPlanet = new ToggleButton();
createInOrbitPlanet.disabled = true;
createPlanetMenu.panel.appendChild(createInOrbitPlanet);
createInOrbitPlanet.textContent = "create in orbit";
createInOrbitPlanet.addEventListener("click", () => {
    if (settings.lockedon) {
        if (!settings.createInOrbitPlanet) {
            settings.createInOrbitPlanet = !settings.createInOrbitPlanet;
            checksArrayPlanet[2] = 1;
            lowestStep = findFirstCheck();
            step = lowestStep;
            planetToAdd = getPlanetValuesWithNAN();
        }
        else {
            settings.createInOrbitPlanet = !settings.createInOrbitPlanet;
            checksArrayPlanet = getPlanetChecks();
            lowestStep = findFirstCheck();
            step = lowestStep;
            planetToAdd = getPlanetValuesWithNAN();
        }

    }
});

function resetPlacement() {
    if (!settings.lockedon) {
        placementX = interactiveCanvas.xOfCanvasToWindow(planetToAdd[0]);
        placementY = interactiveCanvas.yOfCanvasToWindow(planetToAdd[1]);
    }
    else {
        placementX = interactiveCanvas.width / 2 + planetToAdd[0] * interactiveCanvas.scale;
        placementY = interactiveCanvas.height / 2 + planetToAdd[1] * interactiveCanvas.scale;
        if (settings.createInOrbitPlanet) {
            const velArray = centripitalVel(planetToAdd[0], planetToAdd[1], lockonPoint.mass);
            planetToAdd[2] = (altPressed) ? velArray[0] : -velArray[0];
            planetToAdd[3] = (altPressed) ? velArray[1] : -velArray[1];
        }
    }
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
            if (settings.createInOrbitPlanet && checksArrayPlanet[0]) {
                if (!altPressed) {
                    planetToAdd[2] *= -1;
                    planetToAdd[3] *= -1;
                }
            }

        }

        if (step === 0) {
            if (ctrlPressed) {
                return;
            }

            else {

                placementX = interactiveCanvas.tempX;
                placementY = interactiveCanvas.tempY;

                if (!settings.lockedon) {
                    planetToAdd[0] = interactiveCanvas.xOfWindowToCanvas(placementX);
                    planetToAdd[1] = interactiveCanvas.yOfWindowToCanvas(placementY);
                    interactiveCanvas.enableMove = false;
                    interactiveCanvas.enableZoom = false;
                }
                else {
                    planetToAdd[0] = (placementX - interactiveCanvas.width / 2) / interactiveCanvas.scale;
                    planetToAdd[1] = (placementY - interactiveCanvas.height / 2) / interactiveCanvas.scale;
                    interactiveCanvas.enableMove = false;
                    interactiveCanvas.enableZoom = false;
                    if (settings.createInOrbitPlanet) {
                        const velArray = centripitalVel(planetToAdd[0], planetToAdd[1], lockonPoint.mass);
                        planetToAdd[2] = (altPressed) ? velArray[0] : -velArray[0];
                        planetToAdd[3] = (altPressed) ? velArray[1] : -velArray[1];
                    }
                }
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
    if (settings.createInOrbitPlanet) {
        UseInputArray[2] = UseInputArray[3] = 0;
    }
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
    const xShift = (settings.lockedon) ? lockonPoint.x : 0;
    const yShift = (settings.lockedon) ? lockonPoint.y : 0;
    const xVelShift = (settings.lockedon) ? lockonPoint.xVel : 0;
    const yVelShift = (settings.lockedon) ? lockonPoint.yVel : 0;

    if (!settings.createPlanetVisually) {
        const planet = getPlanetValues();
        if (!planet) return;
        planetToAdd = planet;
    }

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
    const xShift = (settings.lockedon) ? lockonPoint.x : 0;
    const yShift = (settings.lockedon) ? lockonPoint.y : 0;
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

    const xVel = planetToAdd[2];
    const yVel = planetToAdd[3];

    if (checksArrayPlanet[0] || step > 0) {
        canvas.ctx.globalAlpha = 0.5;
        canvas.drawCircle(x, y, 1, color);
        canvas.ctx.globalAlpha = 1;
        if (step != 0) {
            if (settings.createInOrbitPlanet) {
                const velArray = centripitalVel(planetToAdd[0], planetToAdd[1], lockonPoint.mass);
                const xVel = (altPressed) ? velArray[0] : -velArray[0];
                const yVel = (altPressed) ? velArray[1] : -velArray[1];
                canvas.drawLine(x, y, x + xVel, y + yVel, "red");
            }
        }
    }
    if (checksArrayPlanet[1] || step > 1) {
        canvas.ctx.globalAlpha = 0.5;
        if (step === 0) canvas.drawCircle(ctxX, ctxY, size, color);
        else canvas.drawCircle(x, y, size, color);
        canvas.ctx.globalAlpha = 1;
    }
    if (checksArrayPlanet[2] || step > 2) {
        canvas.ctx.globalAlpha = 0.5;
        if (settings.createInOrbitPlanet) {
            if (step === 0) {
                const xDist = (mouseX - interactiveCanvas.width / 2) / interactiveCanvas.scale;
                const yDist = (mouseY - interactiveCanvas.height / 2) / interactiveCanvas.scale;
                const velArray = centripitalVel(xDist, yDist, lockonPoint.mass);
                const xVel = (altPressed) ? velArray[0] : -velArray[0];
                const yVel = (altPressed) ? velArray[1] : -velArray[1];
                canvas.drawLine(ctxX, ctxY, ctxX + xVel, ctxY + yVel, "red");
            }
            else {
                if (!checksArrayPlanet[0]) canvas.drawLine(x, y, x + xVel, y + yVel, "red");
            }

        }
        else if (step === 0) {

            canvas.drawLine(ctxX, ctxY, ctxX + xVel, ctxY + yVel, "red");
        }
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

export { animatePlanetPlacement, emptyPlanet, createInOrbitPlanet, resetChecksArrayPlanet };