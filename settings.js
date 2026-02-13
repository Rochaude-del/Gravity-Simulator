

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
    distanceLimit: 1000000 //the distance from the canvas center, not drawing context, at which planets will be deleted if the setting is enabled, to prevent lag from too many planets orbiting far away and not being drawn

}


export {settings};