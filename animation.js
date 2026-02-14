
import { interactiveCanvas, data, quadtree2, filterData, pathCanvas, backGround, zeroMassCanvas, lockonPoint, changeLockon, imageData, dataI } from "./declarations.js";
import { Quadtree } from "./Quadtree.js";
import { FunctionCanvas } from "./functionCanvas.js";
import { settings } from "./settings.js";
import { taskbar, animationControls } from "./UI.js";
import { animateDiskPlacement } from "./diskCreation.js";
import { animatePlanetPlacement } from "./planetCreation.js";
import { deleteClick } from "./lockon.js";
import { physicsSettings } from "./physicsSettings.js";

let color = settings.color;

physicsSettings.parent = taskbar;

interactiveCanvas.addEventListener("click", deleteClick);

let s = 1;

function drawQuadtree(quad, color) {
    interactiveCanvas.ctx.strokeStyle = color;
    interactiveCanvas.ctx.lineWidth = 1;
    //if (quad.isLeafNode) {
    interactiveCanvas.ctx.strokeRect(quad.xTopR, quad.yTopR, quad.size, quad.size);
    //}
    //else {
    if (quad.tlChild) drawQuadtree(quad.tlChild);
    if (quad.trChild) drawQuadtree(quad.trChild);
    if (quad.brChild) drawQuadtree(quad.brChild);
    if (quad.blChild) drawQuadtree(quad.blChild);
    //}
}

function drawCenterOfMasses(quad) {

    interactiveCanvas.drawCircle(quad.centerOfMass.x, quad.centerOfMass.y, Math.cbrt(quad.centerOfMass.mass), "pink");
    if (quad.tlChild) drawCenterOfMasses(quad.tlChild);
    if (quad.trChild) drawCenterOfMasses(quad.trChild);
    if (quad.brChild) drawCenterOfMasses(quad.brChild);
    if (quad.blChild) drawCenterOfMasses(quad.blChild);

}

function drawQuadPoints(quad) {
    if (quad.isLeafNode) {
        if (quad.point) {
            let color = "rgb(255 255 0 / 50%)"
            interactiveCanvas.drawCircle(quad.point.x, quad.point.y, Math.cbrt(quad.point.mass), color);

        }
    }
    else {
        if (quad.tlChild) drawQuadPoints(quad.tlChild);
        if (quad.trChild) drawQuadPoints(quad.trChild);
        if (quad.brChild) drawQuadPoints(quad.brChild);
        if (quad.blChild) drawQuadPoints(quad.blChild);


    }

}


function findLargestMassPoint(points) {
    let largestMass = 0;
    let largestPoint;
    for (const point of points) {
        if (Math.abs(point.mass) > Math.abs(largestMass)) {
            largestMass = point.mass;
            largestPoint = point;
        }
    }
    return largestPoint;
}

function collisions4(points, quad) {
    for (const point of points) {
        if (!point.delete) {
            let array = quad.findColliders3(point);
            if (array.length > 0) {

                collisionOccurence = true;

                let pointToKeep = findLargestMassPoint(array);
                if (Math.abs(point.mass) > Math.abs(pointToKeep.mass)) {
                    pointToKeep = point;
                }
                else {
                    point.delete = true;
                    pointToKeep.delete = false;
                }
                quad.deletePoint(point);

                let newMass = point.mass;                        //when combining negative and positive masses the new postion
                let newX = point.x * newMass;          //is calculated based on the absolute value of mass to avoid infinities
                let newY = point.y * newMass;          //and positions approaching it with similar maginitude oposite masses combining
                let newVX = point.xVel * newMass;
                let newVY = point.yVel * newMass;

                let focused = (point === lockonPoint);

                // could make it so equal opposite masses erase each other to represent infinite displacement
                for (const i of array) {
                    newMass += i.mass;
                    newX += i.mass * i.x;
                    newY += i.mass * i.y;
                    newVX += i.mass * i.xVel;
                    newVY += i.mass * i.yVel;
                    quad.deletePoint(i);
                    if (i === lockonPoint) {
                        focused = true;
                    }
                }

                if (newMass === 0) {
                    pointToKeep.delete = true;
                    if (focused) {
                        settings.lockedon = false;
                        interactiveCanvas.enableMove = true;
                        interactiveCanvas.enableZoom = true;
                    }
                    return;
                }
                newX /= newMass;
                newY /= newMass;
                newVX /= newMass;
                newVY /= newMass;

                pointToKeep.x = newX;
                pointToKeep.y = newY;
                pointToKeep.xVel = newVX;
                pointToKeep.yVel = newVY;
                pointToKeep.mass = newMass;
                pointToKeep.size = Quadtree.cubeRootMass(pointToKeep.mass) * s;

                if (focused) changeLockon(pointToKeep);

                quad.addPoint2(pointToKeep);

            }
        }

    }
}

let xMin, xMax, yMin, yMax, length;



function findBoundingBox(points) {
    xMin = 0;
    xMax = 0;
    yMin = 0;
    yMax = 0;
    for (const point of points) {
        if (Math.abs(point.x - windowCenterToCanvasX) > settings.distanceLimit || Math.abs(point.y - windowCenterToCanvasY) > settings.distanceLimit) {
            point.delete = true;
            exceedsBounds = true;
        }
        else if (point.mass != 0) {
            if (point.x > xMax) {
                xMax = point.x;

            }
            else if (point.x < xMin) {
                xMin = point.x;

            }
            if (point.y > yMax) {
                yMax = point.y;

            }
            else if (point.y < yMin) {
                yMin = point.y;

            }
        }
    }
    xMin -= 3;
    xMax += 3;
    yMin -= 3;
    yMax += 3;
    length = Math.max(xMax - xMin, yMax - yMin);
}

function leapfrogIntergrate(points) {
    const timeStep = deltaT * settings.speed;
    for (const point of points) {
        if (!point.delete) {
            point.xVel += point.xAccel * timeStep;
            point.yVel += point.yAccel * timeStep;
            point.x += point.xVel * timeStep;
            point.y += point.yVel * timeStep;
            point.xAccel = 0;
            point.yAccel = 0;
        }

    }

}

function realStatic() {


    let width = window.innerWidth;
    let height = window.innerHeight;
    staticCanvas.width = width;
    staticCanvas.height = height;
    let xCenter = width / 2;
    let yCenter = height / 2;
    staticCanvas.ctx.translate(xCenter, yCenter);
    //let count = 0;
    staticCanvas.ctx.fillStyle = "black";
    staticCanvas.ctx.fillRect(-xCenter, -yCenter, width, height);
    staticCanvas.ctx.scale(100 / s, 100 / s);

}

const staticBackground = new FunctionCanvas();
staticBackground.width = window.innerWidth;
staticBackground.width = window.innerHeight;
staticBackground.ctx.fillStyle = "black";
staticBackground.ctx.fillRect(0, 0, staticBackground.width, staticBackground.height);
export { staticBackground };

function setPixel(data, width, x, y, r, g, b, a) {
    const index = (y * width + x) * 4; // 4 bytes per pixel
    data[index] = r;     // Red channel
    data[index + 1] = g; // Green channel
    data[index + 2] = b; // Blue channel
    data[index + 3] = a; // Alpha channel (0 = transparent, 255 = opaque)
}

function setPixel2(data, width, x, y, a) { //this is a more optimized version of setPixel for drawing white pixels on a black background for zero mass points, since the color doesn't need to be changed
    const index = (y * width + x) * 4; // 4 bytes per pixel
    data[index + 3] = a; // Alpha channel (0 = transparent, 255 = opaque)
}

function draw() { //useful for debugging
    for (const point of data) {
        if (!point.delete) {
            let color = point.color;
            interactiveCanvas.drawCircle(point.x, point.y, point.size, color);

        }

        else {
            //let color = "rgb(255 0 255 / 100%)"
            //interactiveCanvas.drawCircle(point.x, point.y, point.size, color);
        }


    }
}

//const imageData = zeroMassCanvas.ctx.getImageData(0, 0, interactiveCanvas.width, interactiveCanvas.height); //used for drawing zero mass points as pixels on a separate canvas to improve performance when there are many of them, then drawn onto the main canvas as an image each frame, then cleared by 
//const dataI = imageData.data;
const xInterval = interactiveCanvas.width;
const yInterval = interactiveCanvas.height;
let collisionOccurence = false;
let zeroMassExists = false;
let exceedsBounds = false;
const deltaT = 0.01;
let windowCenterToCanvasX, windowCenterToCanvasY;

function finalDraw() {

    windowCenterToCanvasX = interactiveCanvas.xOfWindowToCanvas(interactiveCanvas.width / 2);
    windowCenterToCanvasY = interactiveCanvas.yOfWindowToCanvas(interactiveCanvas.height / 2);

    collisionOccurence = false;
    zeroMassExists = false;
    exceedsBounds = false;

    if (!settings.paused) {

        if (data.length) findBoundingBox(data);

        quadtree2.reset(xMin, yMin, length);

    }

    for (const point of data) {

        if (!point.delete) {
            if (point.mass != 0) {
                if (!settings.paused) quadtree2.addPoint2(point);
            }
            else {
                zeroMassExists = true;
            }
        }

    }

    if (!settings.paused) {
        if (settings.collisions) collisions4(data, quadtree2); //quadtree3 needs collisions3 or 4

        if (collisionOccurence || exceedsBounds) filterData();

        quadtree2.calculateCentersOfMasses(); //not needed by quadtree3 if using original addpoint
    }



    if (settings.paths) {
        pathCanvas.clearFade(0.01);
        for (const point of data) {
            if (!point.delete) {
                let color = "rgb(255 255 255 / 1.0)"
                //pathCanvas.drawCircle(point.x, point.y, 1, color);
                let rectSize = 2;
                pathCanvas.ctx.fillStyle = color;
                pathCanvas.ctx.fillRect(point.x - rectSize / 2, point.y - rectSize / 2, rectSize, rectSize);

            }


        }

    }
    interactiveCanvas.ctx.drawImage(staticBackground, interactiveCanvas.xOfWindowToCanvas(0), interactiveCanvas.yOfWindowToCanvas(0), interactiveCanvas.width / interactiveCanvas.scale, interactiveCanvas.height / interactiveCanvas.scale);
    if (settings.paths) interactiveCanvas.ctx.drawImage(pathCanvas, interactiveCanvas.xOfWindowToCanvas(0), interactiveCanvas.yOfWindowToCanvas(0), interactiveCanvas.width / interactiveCanvas.scale, interactiveCanvas.height / interactiveCanvas.scale);



    /*
        if (zeroMassExists) {
            for (const point of data) {
    
                if (point.mass === 0) {
                    const x = Math.trunc(interactiveCanvas.xOfCanvasToWindow(point.x));
                    const y = Math.trunc(interactiveCanvas.yOfCanvasToWindow(point.y));
                    if ((x > 0 && x < xInterval) && (y > 0 && y < yInterval)) {
                        setPixel(dataI, xInterval, x, y, 255, 255, 255, 255);
                    }
                }
            }
    
            zeroMassCanvas.ctx.putImageData(imageData, 0, 0);
            interactiveCanvas.ctx.drawImage(zeroMassCanvas, interactiveCanvas.xOfWindowToCanvas(0), interactiveCanvas.yOfWindowToCanvas(0), interactiveCanvas.width / interactiveCanvas.scale, interactiveCanvas.height / interactiveCanvas.scale);
            for (const point of data) {
                if (point.mass === 0) {
                    const x = Math.trunc(interactiveCanvas.xOfCanvasToWindow(point.x));
                    const y = Math.trunc(interactiveCanvas.yOfCanvasToWindow(point.y));
                    if ((x > 0 && x < xInterval) && (y > 0 && y < yInterval)) {
                        setPixel(dataI, xInterval, x, y, 0, 0, 0, 0);
                    }
                }
            }
        }
    */
    if (zeroMassExists) {
        for (const point of data) {

            if (point.mass === 0) {
                const x = Math.trunc(interactiveCanvas.xOfCanvasToWindow(point.x));
                const y = Math.trunc(interactiveCanvas.yOfCanvasToWindow(point.y));
                if ((x > 0 && x < xInterval) && (y > 0 && y < yInterval)) {
                    setPixel2(dataI, xInterval, x, y, 255);
                }
            }
        }

        zeroMassCanvas.ctx.putImageData(imageData, 0, 0);
        interactiveCanvas.ctx.drawImage(zeroMassCanvas, interactiveCanvas.xOfWindowToCanvas(0), interactiveCanvas.yOfWindowToCanvas(0), interactiveCanvas.width / interactiveCanvas.scale, interactiveCanvas.height / interactiveCanvas.scale);
        for (const point of data) {
            if (point.mass === 0) {
                const x = Math.trunc(interactiveCanvas.xOfCanvasToWindow(point.x));
                const y = Math.trunc(interactiveCanvas.yOfCanvasToWindow(point.y));
                if ((x > 0 && x < xInterval) && (y > 0 && y < yInterval)) {
                    setPixel2(dataI, xInterval, x, y, 0);
                }
            }
        }
    }


    for (const point of data) {

        if (!point.delete && point.mass != 0) {
            let color = (point.mass < 0) ? "magenta" : settings.color;
            const size = (point.mass === 0) ? 1 : point.size;
            interactiveCanvas.drawCircle(point.x, point.y, size, color);

        }


    }



    if (settings.lockedon) {
        const x = lockonPoint.x;
        const y = lockonPoint.y;
        const color = (lockonPoint.mass < 0) ? "BlueViolet" : "DeepSkyBlue";
        interactiveCanvas.drawCircle(x, y, lockonPoint.size, color);
        interactiveCanvas.centerOnPoint(x, y);

    }

    if (settings.drawQuadtree) drawQuadtree(quadtree2, "green");

    if (!settings.paused) {
        for (const point of data) {
            if (!point.delete) {
                quadtree2.calculateForce(point);
            }

        }

        leapfrogIntergrate(data);
    }

    if (settings.createPlanetVisually) animatePlanetPlacement(interactiveCanvas);
    if (settings.createDiskVisually) animateDiskPlacement(interactiveCanvas);



}

export { findLargestMassPoint, finalDraw };

