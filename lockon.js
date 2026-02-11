
import { interactiveCanvas, quadtree2, emptyPlanet } from "./declarations.js";
import { settings } from "./settings.js";
import { findLargestMassPoint } from "./script.js";
import { shiftPressed } from "./UI.js";



let lockonPoint = emptyPlanet();



function findChosenPlanet(quad, x, y) {
    const searchPoint = { x: x, y: y, size: 0 };
    const array = quad.findTouching(searchPoint);
    if (array.length > 0) {
        return findLargestMassPoint(array);
    }
    else {
        return 0;
    }


}

function changeLockon(point) {
    lockonPoint = point;
    settings.lockedon = true;
    interactiveCanvas.enableMove = false;
    interactiveCanvas.enableZoom = false;
}

interactiveCanvas.addEventListener("dblclick", (e) => {
    if (!settings.createDiskVisually && !settings.createPlanetVisually) {
        const x = interactiveCanvas.xOfWindowToCanvas(interactiveCanvas.mouseX);
        const y = interactiveCanvas.yOfWindowToCanvas(interactiveCanvas.mouseY);
        const chosenPlanet = findChosenPlanet(quadtree2, x, y);
        if (chosenPlanet) {
            lockonPoint = chosenPlanet;
            settings.lockedon = true;
            interactiveCanvas.enableMove = false;
            interactiveCanvas.enableZoom = false;
        }
        else {
            lockonPoint = emptyPlanet();
            settings.lockedon = false;
            interactiveCanvas.enableMove = true;
            interactiveCanvas.enableZoom = true;
        }
        console.log(lockonPoint);
        console.log(settings.lockedon);
    }
});

interactiveCanvas.addEventListener("click", (e) => {

    if (shiftPressed) {
        const x = interactiveCanvas.xOfWindowToCanvas(interactiveCanvas.mouseX);
        const y = interactiveCanvas.yOfWindowToCanvas(interactiveCanvas.mouseY);
        const chosenPlanet = findChosenPlanet(quadtree2, x, y);
        if (chosenPlanet) {
            chosenPlanet.delete = true;
            if(chosenPlanet === lockonPoint){
                lockonPoint = emptyPlanet();
                settings.lockedon = false;
                interactiveCanvas.enableMove = true;
                interactiveCanvas.enableZoom = true;
            }
        }

    }

});

interactiveCanvas.addEventListener("wheel", (e) => {
    if (settings.lockedon) {
        if (e.deltaY < 0) {
            interactiveCanvas.xCenter = interactiveCanvas.width / 2 + (interactiveCanvas.xCenter - interactiveCanvas.width / 2) * interactiveCanvas.scaleFactor;
            interactiveCanvas.yCenter = interactiveCanvas.height / 2 + (interactiveCanvas.yCenter - interactiveCanvas.height / 2) * interactiveCanvas.scaleFactor;
            interactiveCanvas.scale *= interactiveCanvas.scaleFactor;
            interactiveCanvas.ctx.setTransform(interactiveCanvas.scale, 0, 0, interactiveCanvas.scale, interactiveCanvas.xCenter, interactiveCanvas.yCenter);
            interactiveCanvas.fullClear();
            for (const i of interactiveCanvas.helperCanvases) {
                i.xCenter = interactiveCanvas.width / 2 + (i.xCenter - interactiveCanvas.width / 2) * interactiveCanvas.scaleFactor;
                i.yCenter = interactiveCanvas.height / 2 + (i.yCenter - interactiveCanvas.height / 2) * interactiveCanvas.scaleFactor;
                i.scale *= interactiveCanvas.scaleFactor;
                i.ctx.setTransform(interactiveCanvas.scale, 0, 0, interactiveCanvas.scale, interactiveCanvas.xCenter, interactiveCanvas.yCenter);
                i.fullClear();
            }
        }
        else {
            interactiveCanvas.xCenter = interactiveCanvas.width / 2 + (interactiveCanvas.xCenter - interactiveCanvas.width / 2) / interactiveCanvas.scaleFactor;
            interactiveCanvas.yCenter = interactiveCanvas.height / 2 + (interactiveCanvas.yCenter - interactiveCanvas.height / 2) / interactiveCanvas.scaleFactor;
            interactiveCanvas.scale /= interactiveCanvas.scaleFactor;
            interactiveCanvas.ctx.setTransform(interactiveCanvas.scale, 0, 0, interactiveCanvas.scale, interactiveCanvas.xCenter, interactiveCanvas.yCenter);
            interactiveCanvas.fullClear();
            for (const i of interactiveCanvas.helperCanvases) {
                i.xCenter = interactiveCanvas.width / 2 + (i.xCenter - interactiveCanvas.width / 2) / interactiveCanvas.scaleFactor;
                i.yCenter = interactiveCanvas.height / 2 + (i.yCenter - interactiveCanvas.height / 2) / interactiveCanvas.scaleFactor;
                i.scale /= interactiveCanvas.scaleFactor;
                i.ctx.setTransform(interactiveCanvas.scale, 0, 0, interactiveCanvas.scale, interactiveCanvas.xCenter, interactiveCanvas.yCenter);
                i.fullClear();
            }

        }
    }

});

export { lockonPoint, changeLockon };