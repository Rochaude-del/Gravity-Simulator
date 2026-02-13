import { settings } from "./settings.js";
import { InteractiveCanvas } from "./InteractiveCanvas.js";
import { Quadtree } from "./Quadtree.js";

const color = settings.color;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return (Math.random() * (max - min)) + min;
}
function randomEqualDisk3(min, max) {
    let random = Math.random();
    random = (Math.sqrt(random * (max ** 2 - min ** 2) + min ** 2) - min) / (max - min);
    return random * (max - min) + min;


}
function generateDisk(centerMass, xPos, yPos, minRadius, maxRadius, minMass, maxMass, number) {
    let data = [];
    data.push({
        x: xPos,
        y: yPos,
        xVel: 0,
        yVel: 0,
        xAccel: 0,
        yAccel: 0,
        mass: centerMass,
        size: Quadtree.cubeRootMass(centerMass),
        color: color,
        delete: false
    });

    for (let i = 0; i < number; i++) {
        const radius = randomEqualDisk3(minRadius, maxRadius);
        const shellMass = number * ((maxMass + minMass) / 2) * (radius - minRadius) / (maxRadius - minRadius); // using shell theorem to get rough total force on point including from other orbiting bodies 
        const theta = 2 * Math.PI * Math.random();                                                         // so disk retains shape instead of contracting in
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        const mass = getRandomInt(minMass, maxMass);
        const vel = Math.sqrt(Quadtree.G * (Math.abs(centerMass + shellMass)) / radius);
        const xVel = vel * -Math.sin(theta);
        const yVel = vel * Math.cos(theta);




        data.push({
            x: x + xPos,
            y: y + yPos,
            xVel: xVel,
            yVel: yVel,
            xAccel: 0,
            yAccel: 0,
            mass: mass,
            size: Quadtree.cubeRootMass(mass),
            color: color,
            delete: false
        })
        let detect = 0;
        if (!(x < 0 || x >= 0)) {
            detect = 1;
        }








    }
}

function generateDiskWithVel(centerMass, xPos, yPos, centerXVel, centerYVel, minRadius, maxRadius, minMass, maxMass, number, spin) {
    let data = [];
    data.push({
        x: xPos,
        y: yPos,
        xVel: centerXVel,
        yVel: centerYVel,
        xAccel: 0,
        yAccel: 0,
        mass: centerMass,
        size: Quadtree.cubeRootMass(centerMass),
        color: color,
        delete: false
    });

    for (let i = 0; i < number; i++) {
        const radius = randomEqualDisk3(minRadius, maxRadius);
        const shellMass = number * ((maxMass + minMass) / 2) * (radius - minRadius) / (maxRadius - minRadius); // using shell theorem to get rough total force on point including from other orbiting bodies 
        const theta = 2 * Math.PI * Math.random();                                                         // so disk retains shape instead of contracting in
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        const mass = getRandomInt(minMass, maxMass);
        const vel = Math.sqrt(Quadtree.G * (Math.abs(centerMass + shellMass)) / radius);
        const xVel = vel * Math.sin(theta) * spin;
        const yVel = vel * -Math.cos(theta) * spin;

        data.push({
            x: x + xPos,
            y: y + yPos,
            xVel: xVel + centerXVel,
            yVel: yVel + centerYVel,
            xAccel: 0,
            yAccel: 0,
            mass: mass,
            size: Quadtree.cubeRootMass(mass),
            color: color,
            delete: false
        })
    }

    return data;

}

function generateRandomAssortment(xPos, yPos, radius, minMass, maxMass, minVel, maxVel, number) {
    let data = [];
    for (let i = 0; i < number; i++) {
        const randomRadius = randomEqualDisk3(0, radius);
        const theta = 2 * Math.PI * Math.random();
        const x = randomRadius * Math.cos(theta);
        const y = randomRadius * Math.sin(theta);
        const mass = getRandomInt(minMass, maxMass);
        const xVel = getRandomInt(minVel, maxVel);
        const yVel = getRandomInt(minVel, maxVel);

        data.push({
            x: x + xPos,
            y: y + yPos,
            xVel: xVel,
            yVel: yVel,
            xAccel: 0,
            yAccel: 0,
            mass: mass,
            size: Quadtree.cubeRootMass(mass),
            color: color,
            delete: false
        })


    }
    return data;

}

function centripitalVel( x, y, mass) {

    const radius = Math.sqrt(x ** 2 + y ** 2);
    const vel = Math.sqrt(Quadtree.G * (Math.abs(mass)) / radius);
    const xVel = vel * -y / radius;
    const yVel = vel * x / radius;
    return [xVel,yVel];
}

let disk = generateDisk(300000, 0, 0, 20, 2000, 1, 1, 5000);

export { generateDisk, generateDiskWithVel, generateRandomAssortment, disk, centripitalVel, getRandomInt };