

const settings = {
    paths: false,
    create: false,
    color: "white",
    createPlanetVisually: false,
    createDiskVisually: false,
    drawQuadtree: false,
    lockedon: false,
    collisions: true,
    createInOrbitPlanet: false,
    createInOrbitDisk: false,
    paused: false,
    speed: 1,
    distanceLimit: 1000000, //the distance from the canvas center, not drawing context, at which planets will be deleted if the setting is enabled, to prevent lag from too many planets orbiting far away and not being drawn
    theta: 0.9, //the smaller this is, the more accurate the forces will be but the longer it will take to calculate them. This is used in the Barnes-Hut algorithm to determine when to treat a group of particles as a single point mass.
    diskSpiralsIn: false
}


export {settings};