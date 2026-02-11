import { InteractiveCanvas } from "./InteractiveCanvas.js";
import { Quadtree } from "./Quadtree.js";
import { settings } from "./settings.js";

const interactiveCanvas = new InteractiveCanvas();

const pathCanvas = new InteractiveCanvas();
const backGround = new InteractiveCanvas();

interactiveCanvas.helperCanvases.push(pathCanvas);
interactiveCanvas.helperCanvases.push(backGround);

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

export { interactiveCanvas, pathCanvas, backGround, data, quadtree2, filterData, emptyPlanet};