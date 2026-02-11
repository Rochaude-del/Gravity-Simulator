
import { interactiveCanvas, data, quadtree2, filterData ,pathCanvas,backGround} from "./declarations.js";
import { Quadtree } from "./Quadtree.js";
import { FunctionCanvas } from "./functionCanvas.js";
import { settings } from "./settings.js";
import { taskbar } from "./UI.js";
import { animateDiskPlacement } from "./diskCreation.js";
import { animatePlanetPlacement } from "./planetCreation.js";
import { changeLockon, lockonPoint } from "./lockon.js";

let color = settings.color;



const simulator = document.querySelector("#gravity-simulator");

simulator.appendChild(taskbar);

simulator.appendChild(interactiveCanvas);




function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return (Math.random() * (max - min)) + min;
}


let s = 1;
let k = 1000;
let n = 5000;

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

function collisions3(points, quad) {  //works with 0 masses because bounding box includes them, probably.
    for (const point of points) {
        if (!point.delete) {
            let array = quad.findColliders3(point);
            if (array.length > 0) {

                quad.deletePoint(point);

                let newMass = point.mass;
                let newX = point.x * newMass;
                let newY = point.y * newMass;
                let newVX = point.xVel * newMass;
                let newVY = point.yVel * newMass;


                for (const i of array) {
                    newMass += i.mass;
                    newX += i.mass * i.x;
                    newY += i.mass * i.y;
                    newVX += i.mass * i.xVel;
                    newVY += i.mass * i.yVel;
                    quad.deletePoint(i);
                }
                newX /= newMass;
                newY /= newMass;
                newVX /= newMass;
                newVY /= newMass;

                point.x = newX;
                point.y = newY;
                point.xVel = newVX;
                point.yVel = newVY;
                point.mass = newMass;
                point.size = Math.cbrt(point.mass) * s;

                quad.addPoint(point);

            }
        }

    }
    //for(const point of points){
    //    if(point.delete){
    //       quad.deletePoint(point);
    //   }
    //}



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
    xMin = points[0].x;
    xMax = points[0].x;
    yMin = points[0].y;
    yMax = points[0].y;
    for (const point of points) {
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
    xMin -= 3;
    xMax += 3;
    yMin -= 3;
    yMax += 3;
    length = Math.max(xMax - xMin, yMax - yMin);
}

function leapfrogIntergrate(points) {
    for (const point of points) {
        if (!point.delete) {
            point.xVel += point.xAccel * deltaT;
            point.yVel += point.yAccel * deltaT;
            point.x += point.xVel * deltaT;
            point.y += point.yVel * deltaT;
            point.xAccel = 0;
            point.yAccel = 0;
        }

    }

}

const deltaT = 0.01;


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




function draw() {
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


function finalDraw() {

    if (data.length) findBoundingBox(data);

    quadtree2.reset(xMin, yMin, length);

    for (const point of data) {
        if (point.mass != 0) {
            quadtree2.addPoint2(point);
        }
    }

    collisions4(data, quadtree2); //quadtree3 needs collisions3 or 4

    //quadtree2.pruneChildren(); //only needed by original quadtree 

    quadtree2.calculateCentersOfMasses(); //not needed by quadtree3 if using original addpoint

    //drawCenterOfMasses(quadtree2);

    //drawQuadPoints(quadtree2);

    //backGround.clear(); //interactable background

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

            else {
                //let color = "rgb(255 0 255 / 100%)"
                //interactiveCanvas.drawCircle(point.x, point.y, point.size, color);
            }


        }

    }
    interactiveCanvas.ctx.drawImage(staticBackground, interactiveCanvas.xOfWindowToCanvas(0), interactiveCanvas.yOfWindowToCanvas(0), interactiveCanvas.width / interactiveCanvas.scale, interactiveCanvas.height / interactiveCanvas.scale);
    if (settings.paths) interactiveCanvas.ctx.drawImage(pathCanvas, interactiveCanvas.xOfWindowToCanvas(0), interactiveCanvas.yOfWindowToCanvas(0), interactiveCanvas.width / interactiveCanvas.scale, interactiveCanvas.height / interactiveCanvas.scale);

    for (const point of data) {
        if (!point.delete) {
            let color = (point.mass < 0) ? "magenta" : settings.color;
            const size = (point.mass === 0) ? 1 : point.size;
            interactiveCanvas.drawCircle(point.x, point.y, size, color);

        }

        else {
            //let color = "rgb(255 0 255 / 100%)"
            //interactiveCanvas.drawCircle(point.x, point.y, point.size, color);
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

    for (const point of data) {
        if (!point.delete) {
            quadtree2.calculateForce(point);
        }

    }

    filterData();

    leapfrogIntergrate(data);

    if (settings.createPlanetVisually) animatePlanetPlacement(interactiveCanvas);
    if (settings.createDiskVisually) animateDiskPlacement(interactiveCanvas);



}

export { findLargestMassPoint };

interactiveCanvas.drawFunction = finalDraw;
interactiveCanvas.animate();