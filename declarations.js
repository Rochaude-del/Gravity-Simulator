import { InteractiveCanvas } from "./InteractiveCanvas.js";
import { Quadtree } from "./Quadtree.js";
import { settings } from "./settings.js";

const interactiveCanvas = new InteractiveCanvas();

const pathCanvas = new InteractiveCanvas();
const backGround = new InteractiveCanvas();
const zeroMassCanvas = new InteractiveCanvas();

//zeroMassCanvas.ctx.fillStyle = "rgba(255,255,255,0)";
//zeroMassCanvas.ctx.globalCompositeOperation = "lighter";
//zeroMassCanvas.ctx.fillRect(-interactiveCanvas.width / 2, -interactiveCanvas.height / 2, interactiveCanvas.width, interactiveCanvas.height);

const imageData = zeroMassCanvas.ctx.getImageData(0, 0, interactiveCanvas.width, interactiveCanvas.height); //if other color needed, draw rectangle of that color then change alpha to zero
const dataI = imageData.data;
for (let i = 0; i < dataI.length; i += 4) {
    dataI[i] = 255;     // Red
    dataI[i + 1] = 255;   // Green
    dataI[i + 2] = 255;   // Blue
    dataI[i + 3] = 0; // Alpha (0-255)
}
//zeroMassCanvas.ctx.putImageData(imageData, 0, 0);

interactiveCanvas.helperCanvases.push(pathCanvas);
interactiveCanvas.helperCanvases.push(backGround);
interactiveCanvas.helperCanvases.push(zeroMassCanvas);

let data = [];
function filterData() {
    data = data.filter(function (point) {
        return (!point.delete);
    });
}

let quadtree2 = new Quadtree(0, 0, 6);

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

let lockonPoint = emptyPlanet();


function changeLockon(point) {
    lockonPoint = point;
    settings.lockedon = true;
    interactiveCanvas.enableMove = false;
    interactiveCanvas.enableZoom = false;
}

export { interactiveCanvas, pathCanvas, backGround, zeroMassCanvas, data, quadtree2, filterData, emptyPlanet, lockonPoint, changeLockon, imageData, dataI };