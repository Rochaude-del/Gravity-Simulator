
import { interactiveCanvas, quadtree2, emptyPlanet,lockonPoint,changeLockon } from "./declarations.js";
import { settings } from "./settings.js";
import { findLargestMassPoint } from "./animation.js";
import { shiftPressed } from "./UI.js";
import { createInOrbitPlanet } from "./planetCreation.js";
import { createInOrbitDisk } from "./diskCreation.js";







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



interactiveCanvas.addEventListener("dblclick", (e) => {
    if (!settings.createDiskVisually && !settings.createPlanetVisually) {
        const x = interactiveCanvas.xOfWindowToCanvas(interactiveCanvas.mouseX);
        const y = interactiveCanvas.yOfWindowToCanvas(interactiveCanvas.mouseY);
        const chosenPlanet = findChosenPlanet(quadtree2, x, y);
        if (chosenPlanet) {
            changeLockon(chosenPlanet);
            settings.lockedon = true;
            createInOrbitDisk.disabled = false;
            createInOrbitPlanet.disabled = false;
            interactiveCanvas.enableMove = false;
            interactiveCanvas.enableZoom = false;
        }
        else {
            changeLockon(emptyPlanet());
            settings.lockedon = false;
            createInOrbitDisk.disabled = true;
            createInOrbitPlanet.disabled = true;
            //settings.createInOrbitPlanet = false;
            //settings.createInOrbitDisk = false;
            interactiveCanvas.enableMove = true;
            interactiveCanvas.enableZoom = true;
        
        }
  
    }
});



function deleteClick(){
    
    if (shiftPressed) {
        const x = interactiveCanvas.xOfWindowToCanvas(interactiveCanvas.mouseX);
        const y = interactiveCanvas.yOfWindowToCanvas(interactiveCanvas.mouseY);
        const chosenPlanet = findChosenPlanet(quadtree2, x, y);
        if (chosenPlanet) {
            chosenPlanet.delete = true;
            if(chosenPlanet === lockonPoint){
                changeLockon(emptyPlanet());
                settings.lockedon = false;
                interactiveCanvas.enableMove = true;
                interactiveCanvas.enableZoom = true;
                createInOrbitDisk.disabled = true;
                createInOrbitPlanet.disabled = true;
                createInOrbitDisk.classList.remove("toggle-button");
                createInOrbitPlanet.classList.remove("toggle-button");
                settings.createInOrbitPlanet = false;
                settings.createInOrbitDisk = false;
                
            }
        }

    }

}
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


export { deleteClick };