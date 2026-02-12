import { data, interactiveCanvas } from "./declarations.js";
import { generateDiskWithVel } from "./generators.js";
import { settings } from "./settings.js";
import { createDiskMenu, ctrlPressed } from "./UI.js";
import { Quadtree } from "./Quadtree.js";
import { lockonPoint } from "./lockon.js";

let lowestStep = 0;
let step = 0;
let placementX = interactiveCanvas.width / 2;
let placementY = interactiveCanvas.height / 2;
const color = settings.color;
let checksArrayDisk = getDiskChecks();

function findFirstCheck() {

    for (let i = 0; i < checksArrayDisk.length; i++) {
        if (checksArrayDisk[i] === 0) return i;
    }
    return checksArrayDisk.length;

}

function findNextCheck(index) {
    for (let i = index + 1; i < checksArrayDisk.length; i++) {
        if (checksArrayDisk[i] === 0) return i;
    }
    return checksArrayDisk.length;
}

function swap(array, a, b) {
    let temp = array[a];
    array[a] = array[b];
    array[b] = temp;
}

const diskChecks = createDiskMenu.panel.querySelectorAll(".disk-checkbox");
for (const check of diskChecks) {
    check.addEventListener("click", () => {
        checksArrayDisk = getDiskChecks();
        lowestStep = findFirstCheck();
        step = lowestStep;
        const xValue = document.querySelector("#disk-menu #x-pos");
        const yValue = document.querySelector("#disk-menu #y-pos");
        placementX = interactiveCanvas.width / 2 + xValue.valueAsNumber * interactiveCanvas.scale; //updating placement value needed for proper display when checkmarks are checked during visual creation
        placementY = interactiveCanvas.height / 2 + yValue.valueAsNumber * interactiveCanvas.scale;
        diskToAdd = getDiskValues();
        console.log(findFirstCheck());
    });
}

const names2 = ["center mass", "x position", "y position", "x velocity", "y velocity", "min disk radius", "max disk radius", "min disk mass", "max disk mass", "number of orbiting bodies", "spin direction"];
const values2 = ["500", "0", "0", "0", "0", "50", "400", "5", "20", "30"];
const ids2 = ["center-mass", "x-pos", "y-pos", "x-vel", "y-vel", "min-radius", "max-radius", "min-mass", "max-mass", "number", "spin"];
const checkIdsDisk = ["center-mass", "pos-check", "vel-check", "min-radius", "max-radius"];


function getDiskValues() {
    const children = document.querySelectorAll("#disk-menu input[type = 'number']");
    const diskToAddReturn = Array(11).fill(0);
    let i = 0;
    for (const child of children) {
        const value = child.valueAsNumber;
        if (isNaN(value)) {
            diskToAdd = Array(11).fill(0);
            return 0;
        }
        diskToAddReturn[i] = value;
        i++
    }

    const spini = document.querySelector("#disk-menu  input[name='spin']:checked");
    let spin = Number(spini.value);
    if (isNaN(spin)) {
        diskToAdd = Array(11).fill(0);
        return 0;
    }
    if (spin === 0) spin = -1;
    diskToAddReturn[10] = spin;

    console.log(diskToAddReturn);
    return diskToAddReturn;


}

function getDiskValuesWithNAN() {
    const children = document.querySelectorAll("#disk-menu input[type = 'number']");
    const diskToAdd = Array(11).fill(0);
    let i = 0;
    for (const child of children) {
        const value = child.valueAsNumber;
        diskToAdd[i] = value;
        i++
    }

    const spini = document.querySelector("#disk-menu  input[name='spin']:checked");
    let spin = Number(spini.value);

    if (spin === 0) spin = -1;
    diskToAdd[10] = spin;
    if (settings.createInOrbitDisk) {
        diskToAdd[0] = lockonPoint.mass;
        diskToAdd[1] = 0;
        diskToAdd[2] = 0;
        diskToAdd[3] = 0;
        diskToAdd[4] = 0;
    }

    return diskToAdd;


}

const createDiskButton = document.createElement("button");
createDiskButton.textContent = "create disk";
createDiskButton.setAttribute("id", "create-disk");
createDiskMenu.panel.appendChild(createDiskButton);
createDiskButton.addEventListener("click", createDisk);

function createDisk() {
    const diskToAdd = getDiskValues();
    if (!diskToAdd) return;
    let disk = generateDiskWithVel(...diskToAdd);
    for (const point of disk) {
        data.push(point);
    }
}

const createDiskVisually = document.createElement("button");
createDiskVisually.textContent = "create visually";
createDiskMenu.panel.appendChild(createDiskVisually);



createDiskVisually.addEventListener("click", () => {
    settings.createDiskVisually = !settings.createDiskVisually;
    settings.createPlanetVisually = false;
    checksArrayDisk = getDiskChecks();
    if (settings.createInOrbitDisk) {
        checksArrayDisk[0] = checksArrayDisk[1] = checksArrayDisk[3] = 1;
    }

});

function getDiskChecks() { //will need to change ordering to match desired visual creation steps
    let array = [];
    const checks = createDiskMenu.querySelectorAll("input[type = 'checkbox']");
    for (const check of checks) {
        if (check.checked) {
            array.push(1);
        }
        else {
            array.push(0);
        }
    }
    swap(array, 0, 1);
    swap(array, 2, 3);
    console.log(array);
    return array;

}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {

        settings.createDiskVisually = false;
        step = lowestStep;
        substep = 0;
    }
});


const createInOrbitDisk = document.createElement("button");
createDiskMenu.panel.appendChild(createInOrbitDisk);
createInOrbitDisk.textContent = "create in orbit";
createInOrbitDisk.addEventListener("click", () => {
    if (settings.lockedon) {
        if (!settings.createInOrbitDisk) {
            settings.createInOrbitDisk = !settings.createInOrbitDisk;
            checksArrayDisk[0] = checksArrayDisk[1] = checksArrayDisk[3] = 1;
            lowestStep = findFirstCheck();
            step = lowestStep;
            diskToAdd = getDiskValuesWithNAN();
        }
        else {
            settings.createInOrbitDisk = !settings.createInOrbitDisk;
            checksArrayDisk = getDiskChecks();
            lowestStep = findFirstCheck();
            step = lowestStep;
            diskToAdd = getDiskValuesWithNAN();
        }

    }
});

const numInputs = createDiskMenu.querySelectorAll("input[type = 'number']");
for (const input of numInputs) {
    input.addEventListener("input", () => {
        step = lowestStep;
        diskToAdd = getDiskValues();
    });
}

let diskToAdd = Array(11).fill(0);
let substep = 0;
interactiveCanvas.addEventListener("click", (e) => {
    if (settings.createDiskVisually) {
        if (step === lowestStep) {

            diskToAdd = getDiskValuesWithNAN();
            if (isNaNInputsNeeded()) {
                return;
            }


        }


        if (checksArrayDisk[0]) {
            if (isNaN(diskToAdd[1]) || isNaN(diskToAdd[2])) { return };
            placementX = interactiveCanvas.width / 2 + diskToAdd[1] * interactiveCanvas.scale;
            placementY = interactiveCanvas.height / 2 + diskToAdd[2] * interactiveCanvas.scale;

        }

        if (step === 0) {
            if (ctrlPressed) {
                return;
            }

            else {

                placementX = interactiveCanvas.tempX;
                placementY = interactiveCanvas.tempY;
                diskToAdd[1] = (placementX - interactiveCanvas.width / 2) / interactiveCanvas.scale;
                diskToAdd[2] = (placementY - interactiveCanvas.height / 2) / interactiveCanvas.scale;
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
            diskToAdd[0] = mass ** 3;
        }

        else if (step === 2) {
            if (ctrlPressed) {
                return;
            }
            if (!substep) {
                let minRadius = Math.sqrt((interactiveCanvas.mouseX - placementX) ** 2 + (interactiveCanvas.mouseY - placementY) ** 2);
                minRadius = minRadius / interactiveCanvas.scale;
                diskToAdd[5] = minRadius;
                substep = 1;
                return;
            }
            else if (substep) {
                let maxRadius = Math.sqrt((interactiveCanvas.mouseX - placementX) ** 2 + (interactiveCanvas.mouseY - placementY) ** 2);
                maxRadius = maxRadius / interactiveCanvas.scale;
                diskToAdd[6] = maxRadius;
                substep = 0;
            }
        }

        else if (step === 3) {
            if (ctrlPressed) {
                return;
            }
            diskToAdd[3] = (interactiveCanvas.mouseX - placementX) / interactiveCanvas.scale;
            diskToAdd[4] = (interactiveCanvas.mouseY - placementY) / interactiveCanvas.scale;
            createVisually();
            step = lowestStep;
            //diskToAdd = Array(11).fill(0);

            if (!settings.lockedon) {
                interactiveCanvas.enableZoom = true;
                interactiveCanvas.enableMove = true;
            }
            return;
        }

        step = findNextCheck(step);

        if (step === 4) {
            if (ctrlPressed) {
                return;
            }
            createVisually();
            step = lowestStep;
            //diskToAdd = Array(11).fill(0);
            if (!settings.lockedon) {
                interactiveCanvas.enableZoom = true;
                interactiveCanvas.enableMove = true;
            }
            return;
        }
    }
});

function arrayConvert() {
    const array = Array(11).fill(0);
    const arraySwap = [...checksArrayDisk];
    swap(arraySwap, 0, 1);
    swap(arraySwap, 2, 3); //undoes swapping
    array[0] = arraySwap[0];
    for (let i = 1; i < 4; i++) {
        array[i * 2 - 1] = array[i * 2] = arraySwap[i];
    }
    array.splice(7, 5, ...Array(4).fill(1));
    return array;
}
function isNaNInputsNeeded() {
    const diskValues = getDiskValuesWithNAN();
    const UseInputArray = arrayConvert();
    if (settings.createInOrbitDisk) {
        UseInputArray[0] = UseInputArray[1] = UseInputArray[2] = UseInputArray[3] = UseInputArray[4] = 0;
    }
    for (let i = 0; i < UseInputArray.length; i++) {
        if (UseInputArray[i]) {
            const inputValue = diskValues[i];
            if (isNaN(inputValue)) {
                return 1;
            }

        }
    }
    return 0;
}

function createVisually() {

    const xShift = (settings.lockedon) ? lockonPoint.x : interactiveCanvas.xOfWindowToCanvas(interactiveCanvas.width / 2);
    const yShift = (settings.lockedon) ? lockonPoint.y : interactiveCanvas.yOfWindowToCanvas(interactiveCanvas.height / 2);
    const xVelShift = (settings.lockedon) ? lockonPoint.xVel : 0;
    const yVelShift = (settings.lockedon) ? lockonPoint.yVel : 0;
    diskToAdd[1] += xShift;
    diskToAdd[2] += yShift;
    diskToAdd[3] += xVelShift;
    diskToAdd[4] += yVelShift;

    let disk = generateDiskWithVel(...diskToAdd);
    for (const point of disk) {
        if (settings.createInOrbitDisk) {
            if (point != disk[0]) data.push(point);
        }
        else data.push(point);

    }
    diskToAdd[1] = 0;
    diskToAdd[2] = 0;
    diskToAdd[3] = 0;
    diskToAdd[4] = 0;
}
/*
function createVisually() {
    const diskValues = getDiskValuesWithNAN();
    const UseInputArray = arrayConvert();
    for(let i = 0; i < UseInputArray.length; i ++){
        if(UseInputArray[i]){
            const inputValue = diskValues[i];
            if(isNaN(inputValue)){
                return;
            }
            diskToAdd[i] = inputValue;
        }
    }
    let disk = generateDiskWithVel(...diskToAdd);
    for (const point of disk) {
        data.push(point);
    }

}
*/

interactiveCanvas.addEventListener("contextmenu", (e) => { //cancels placing planet visually
    if (settings.createDiskVisually) {
        e.preventDefault();
        step = lowestStep;
        substep = 0;

        if (!settings.lockedon) {
            interactiveCanvas.enableZoom = true;
            interactiveCanvas.enableMove = true;
        }



    }
});




function animateDiskPlacement(canvas) {

    const xShift = (settings.lockedon) ? lockonPoint.x : interactiveCanvas.xOfWindowToCanvas(interactiveCanvas.width / 2);
    const yShift = (settings.lockedon) ? lockonPoint.y : interactiveCanvas.yOfWindowToCanvas(interactiveCanvas.height / 2);
    const xVelShift = (settings.lockedon) ? lockonPoint.xVel : 0;
    const yVelShift = (settings.lockedon) ? lockonPoint.yVel : 0;

    const mouseX = canvas.mouseX;
    const mouseY = canvas.mouseY;
    const ctxX = canvas.xOfWindowToCanvas(mouseX);
    const ctxY = canvas.yOfWindowToCanvas(mouseY);
    const scale = canvas.scale;
    //const ctxPlacementX = canvas.xOfWindowToCanvas(placementX);
    //const ctxPlacementY = canvas.yOfWindowToCanvas(placementY);

    const x = diskToAdd[1] + xShift;
    const y = diskToAdd[2] + yShift;
    const size = Quadtree.cubeRootMass(diskToAdd[0]);
    const minRadius = diskToAdd[5];
    const maxRadius = diskToAdd[6];
    const xVel = diskToAdd[3];
    const yVel = diskToAdd[4];

    if (checksArrayDisk[0] || step > 0) {
        if (!settings.createInOrbitDisk) {
            canvas.ctx.globalAlpha = 0.5;
            canvas.drawCircle(x, y, 1, color);
            canvas.ctx.globalAlpha = 1;
        }
    }
    if (checksArrayDisk[1] || step > 1) {
        if (!settings.createInOrbitDisk) {
            canvas.ctx.globalAlpha = 0.5;
            if (step === 0) canvas.drawCircle(ctxX, ctxY, size, color);
            else canvas.drawCircle(x, y, size, color);
            canvas.ctx.globalAlpha = 1;
        }
    }
    if (checksArrayDisk[2] || step > 2) {
        canvas.ctx.globalAlpha = 0.5;
        if (step === 0) canvas.drawRing(ctxX, ctxY, minRadius, maxRadius, color);
        else canvas.drawRing(x, y, minRadius, maxRadius, color);
        canvas.ctx.globalAlpha = 1;
    }
    if (checksArrayDisk[3] || step > 3) {
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
        let radius = Math.sqrt((mouseX - placementX) ** 2 + (mouseY - placementY) ** 2);
        radius /= scale;
        if (substep === 0) {
            canvas.drawCircleOutline(x, y, radius, color);
        }
        else if (substep === 1) {
            canvas.drawRing(x, y, minRadius, radius, color);
        }
    }
    else if (step === 3) {
        const xVel = (mouseX - placementX) / scale;
        const yVel = (mouseY - placementY) / scale;
        canvas.drawLine(x, y, x + xVel, y + yVel, "red");
    }





}


export { getDiskValues, animateDiskPlacement, findFirstCheck, findNextCheck, swap };


