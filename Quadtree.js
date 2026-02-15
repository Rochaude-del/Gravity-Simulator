import { settings } from "./settings.js";

function quadCollisionCheck(point, quad) {
    const m = point.size;
    return (
        point.x - m < quad.xTopR + quad.size &&
        point.x - m + m * 2 > quad.xTopR &&
        point.y - m < quad.yTopR + quad.size &&
        point.y - m + m * 2 > quad.yTopR
    );

}

function circleCollisionCheck(point1, point2) {
    const distX = point1.x - point2.x;
    const distY = point1.y - point2.y;
    const distSqrd = distX ** 2 + distY ** 2;
    return ((point1.size + point2.size) ** 2 > distSqrd);

}

//this quadtree calculates center of masses as points are added or removed
//thereby not requiring the calculatecentersofmasses method along with the prunechildren one

//topR is acutally top left?
class Quadtree {
    static G = 6.6743 * 3;
    //static theta = 0.9; //the smaller this is, the more accurate the forces will be but the longer it will take to calculate them. 
    static cubeRootMass(mass) {
        return Math.cbrt(Math.abs(mass));
    }
    constructor(xTopR, yTopR, size) {
        this.xTopR = xTopR;
        this.yTopR = yTopR;
        this.size = size;
        this.tlChild = null;
        this.trChild = null;
        this.brChild = null;
        this.blChild = null;
        this.point = null;
        this.isLeafNode = true;
        this.centerOfMass = {
            x: 0,
            y: 0,
            mass: 0
        };

    }
    split() {
        const newSize = this.size / 2;
        this.tlChild = new Quadtree(this.xTopR, this.yTopR, newSize);
        this.trChild = new Quadtree(this.xTopR + newSize, this.yTopR, newSize);
        this.brChild = new Quadtree(this.xTopR + newSize, this.yTopR + newSize, newSize);
        this.blChild = new Quadtree(this.xTopR, this.yTopR + newSize, newSize);
        this.isLeafNode = false;
    }
    addPoint(point) {
        this.centerOfMass.x *= this.centerOfMass.mass;
        this.centerOfMass.x += point.x * point.mass;
        this.centerOfMass.y *= this.centerOfMass.mass;
        this.centerOfMass.y += point.y * point.mass;
        this.centerOfMass.mass += point.mass;
        this.centerOfMass.x /= this.centerOfMass.mass;
        this.centerOfMass.y /= this.centerOfMass.mass;

        if (this.isLeafNode) {
            if (this.point) {
                //this.split();

                this.findQuadforPoint(point);
                this.isLeafNode = false;
                this.findQuadforPoint(this.point);
                this.point = null;

            }
            else {
                this.point = point;

            }

        }
        else this.findQuadforPoint(point);

    }
    addPoint2(point) {
        if (this.isLeafNode) {
            if (this.point) {
                //this.split();
                if (point.x === this.point.x && point.y === this.point.y) {  //check if added point takes same position as existing one
                    const diff = point.x - this.xTopR;
                    const shift = Math.min(diff / 100, 0.001);
                    if (point.mass > this.point.mass) {
                        this.point.x -= shift;
                    }
                    else {
                        point.x -= shift;
                    }
                }
                this.findQuadforPoint(point);
                this.isLeafNode = false;
                this.findQuadforPoint(this.point);
                this.point = null;

            }
            else {
                this.point = point;

            }

        }
        else this.findQuadforPoint(point);
    }


    hasChild() {
        return (((this.tlChild || this.trChild) || this.brChild) || this.blChild);
    }
    findQuadforPoint(point) { //you need to change which addPoint this uses if you change which addpoint is used
        const newSize = this.size / 2;
        if (point.x - this.xTopR <= newSize) {
            if (point.y - this.yTopR <= newSize) {
                if (this.tlChild) this.tlChild.addPoint2(point);
                else {
                    this.tlChild = new Quadtree(this.xTopR, this.yTopR, newSize);
                    this.tlChild.addPoint2(point);
                }
            }
            else {
                if (this.blChild) this.blChild.addPoint2(point);
                else {
                    this.blChild = new Quadtree(this.xTopR, this.yTopR + newSize, newSize);
                    this.blChild.addPoint2(point);
                }

            };

        }
        else {
            if (point.y - this.yTopR <= newSize) {
                if (this.trChild) this.trChild.addPoint2(point);
                else {
                    this.trChild = new Quadtree(this.xTopR + newSize, this.yTopR, newSize);
                    this.trChild.addPoint2(point);
                }
            }
            else {
                if (this.brChild) this.brChild.addPoint2(point);
                else {
                    this.brChild = new Quadtree(this.xTopR + newSize, this.yTopR + newSize, newSize);
                    this.brChild.addPoint2(point);

                }
            }


        }
    }


    findColliders2(point) {
        let array = [];
        if (this.isLeafNode) {
            if (this.point) {
                if (!(this.point === point) && circleCollisionCheck(point, this.point)) {
                    this.point.delete = true;
                    array.push(this.point);
                    this.point = null;
                }
            }
        }
        else {
            if (this.tlChild && quadCollisionCheck(point, this.tlChild)) {
                array = array.concat(this.tlChild.findColliders2(point));
                if (this.tlChild.isLeafNode && !(this.tlChild.point)) {
                    this.tlChild = null;

                }

            }
            if (this.trChild && quadCollisionCheck(point, this.trChild)) {
                array = array.concat(this.trChild.findColliders2(point));
                if (this.trChild.isLeafNode && !(this.trChild.point)) {
                    this.trChild = null;

                }
            }
            if (this.brChild && quadCollisionCheck(point, this.brChild)) {
                array = array.concat(this.brChild.findColliders2(point));
                if (this.brChild.isLeafNode && !(this.brChild.point)) {
                    this.brChild = null;

                }

            }
            if (this.blChild && quadCollisionCheck(point, this.blChild)) {
                array = array.concat(this.blChild.findColliders2(point));
                if (this.blChild.isLeafNode && !(this.blChild.point)) {
                    this.blChild = null;

                }
            }

            if (!this.hasChild()) this.isLeafNode = true;
        }
        return array;
    }

    findColliders3(point) {   //don't need to prune empty nodes since that heppens when points are deleted.
        let array = [];
        if (this.isLeafNode) {
            if (this.point && !this.point.delete) {
                if (!(this.point === point) && circleCollisionCheck(point, this.point)) {
                    this.point.delete = true;
                    array.push(this.point);
                }
            }
        }
        else {
            if (this.tlChild && quadCollisionCheck(point, this.tlChild)) {
                const colliders = this.tlChild.findColliders3(point);
                if (colliders.length > 0) {
                    array = array.concat(colliders);
                }
            }
            if (this.trChild && quadCollisionCheck(point, this.trChild)) {

                const colliders = this.trChild.findColliders3(point);
                if (colliders.length > 0) {
                    array = array.concat(colliders);
                }
            }
            if (this.brChild && quadCollisionCheck(point, this.brChild)) {
                const colliders = this.brChild.findColliders3(point);
                if (colliders.length > 0) {
                    array = array.concat(colliders);
                }
            }
            if (this.blChild && quadCollisionCheck(point, this.blChild)) {
                const colliders = this.blChild.findColliders3(point);
                if (colliders.length > 0) {
                    array = array.concat(colliders);
                }
            }
        }
        return array;
    }

    findTouching(point) {
        let array = [];
        if (this.isLeafNode) {
            if (this.point && !this.point.delete) {
                if (!(this.point === point) && circleCollisionCheck(point, this.point)) {
                    array.push(this.point);
                }
            }
        }
        else {
            if (this.tlChild && quadCollisionCheck(point, this.tlChild)) {
                array = array.concat(this.tlChild.findTouching(point));
            }
            if (this.trChild && quadCollisionCheck(point, this.trChild)) {
                array = array.concat(this.trChild.findTouching(point));
            }
            if (this.brChild && quadCollisionCheck(point, this.brChild)) {
                array = array.concat(this.brChild.findTouching(point));
            }
            if (this.blChild && quadCollisionCheck(point, this.blChild)) {
                array = array.concat(this.blChild.findTouching(point));
            }
        }
        return array;
    }


    pruneChildren() {

        if (this.tlChild) {
            if (this.tlChild.isLeafNode && !(this.tlChild.point)) {
                this.tlChild = null;

            }

            else {
                this.tlChild.pruneChildren();
            }
        }
        if (this.trChild) {
            if (this.trChild.isLeafNode && !(this.trChild.point)) {
                this.trChild = null;

            }

            else {
                this.trChild.pruneChildren();
            }
        }
        if (this.brChild) {
            if (this.brChild.isLeafNode && !(this.brChild.point)) {
                this.brChild = null;

            }

            else {
                this.brChild.pruneChildren();
            }
        } if (this.blChild) {
            if (this.blChild.isLeafNode && !(this.blChild.point)) {
                this.blChild = null;

            }

            else {
                this.blChild.pruneChildren();
            }
        }


    }
    //in isolation may be better to do this as points are added to the tree but doing that makes calculating it after removing a point difficult.
    calculateCentersOfMasses() {
        if (this.isLeafNode && this.point) {
            const m = this.point.mass;
            const x = this.point.x;
            const y = this.point.y;
            this.centerOfMass = {
                x: x,
                y: y,
                mass: m
            }


        }
        else {
            let x = 0;
            let y = 0;
            let mass = 0;
            if (this.tlChild) {
                this.tlChild.calculateCentersOfMasses();
                const newMass = mass + this.tlChild.centerOfMass.mass;
                if (newMass === 0) {
                    x += 0;
                    y += 0;
                }
                else {
                    x = (x * mass + this.tlChild.centerOfMass.x * this.tlChild.centerOfMass.mass) / (mass + this.tlChild.centerOfMass.mass);
                    y = (y * mass + this.tlChild.centerOfMass.y * this.tlChild.centerOfMass.mass) / (mass + this.tlChild.centerOfMass.mass);
                }
                mass = mass + this.tlChild.centerOfMass.mass;
            }
            if (this.trChild) {
                this.trChild.calculateCentersOfMasses();
                const newMass = mass + this.trChild.centerOfMass.mass;
                if (newMass === 0) {
                    x += 0;
                    y += 0;
                }

                else {
                    x = (x * mass + this.trChild.centerOfMass.x * this.trChild.centerOfMass.mass) / (mass + this.trChild.centerOfMass.mass);
                    y = (y * mass + this.trChild.centerOfMass.y * this.trChild.centerOfMass.mass) / (mass + this.trChild.centerOfMass.mass);
                }
                mass = mass + this.trChild.centerOfMass.mass;
            }
            if (this.brChild) {
                this.brChild.calculateCentersOfMasses();
                const newMass = mass + this.brChild.centerOfMass.mass;
                if (newMass === 0) {
                    x += 0;
                    y += 0;
                }

                else {
                    x = (x * mass + this.brChild.centerOfMass.x * this.brChild.centerOfMass.mass) / (mass + this.brChild.centerOfMass.mass);
                    y = (y * mass + this.brChild.centerOfMass.y * this.brChild.centerOfMass.mass) / (mass + this.brChild.centerOfMass.mass);
                }
                mass = mass + this.brChild.centerOfMass.mass;
            }
            if (this.blChild) {
                this.blChild.calculateCentersOfMasses();
                const newMass = mass + this.blChild.centerOfMass.mass;
                if (newMass === 0) {
                    x += 0;
                    y += 0;
                }

                else {
                    x = (x * mass + this.blChild.centerOfMass.x * this.blChild.centerOfMass.mass) / (mass + this.blChild.centerOfMass.mass);
                    y = (y * mass + this.blChild.centerOfMass.y * this.blChild.centerOfMass.mass) / (mass + this.blChild.centerOfMass.mass);
                }
                mass = mass + this.blChild.centerOfMass.mass;
            }
            this.centerOfMass = {
                x: x,
                y: y,
                mass: mass
            }
            //console.log(this.centerOfMass);
        }
    }
    calculateForce(point) {


        let accel;
        const distX = point.x - this.centerOfMass.x;
        const distY = point.y - this.centerOfMass.y;

        if (this.size / Math.abs(distX) < settings.theta || this.size / Math.abs(distY) < settings.theta) { //if the node is far enough away, treat it as a point mass
            const distSqrd = distX ** 2 + distY ** 2;
            const dist = Math.sqrt(distSqrd);
            if (distSqrd < 1) {

                point.xAccel += 0;  //avoids scattering from objects getting too close due to timestep limitations
                point.yAccel += 0;
            }
            else {
                accel = Quadtree.G * this.centerOfMass.mass / (distSqrd);
                point.xAccel += -distX / dist * accel;
                point.yAccel += -distY / dist * accel;
            }


        }
        else if (this.isLeafNode) {
            if (this.point != point) {
                const distSqrd = distX ** 2 + distY ** 2;
                const dist = Math.sqrt(distSqrd);
                if (distSqrd < 1) {

                    point.xAccel += 0;  //avoids scattering from objects getting too close due to timestep limitations
                    point.yAccel += 0;
                }
                else {
                    accel = Quadtree.G * this.centerOfMass.mass / (distSqrd);
                    point.xAccel += -distX / dist * accel;
                    point.yAccel += -distY / dist * accel;
                }

            }
        }
        else {
            if (this.tlChild) {
                this.tlChild.calculateForce(point);
            };
            if (this.trChild) {
                this.trChild.calculateForce(point);
            };
            if (this.brChild) {
                this.brChild.calculateForce(point);
            };
            if (this.blChild) {
                this.blChild.calculateForce(point);
            };
        }



    }

    deletePoint2(point) {
        if (this.isLeafNode) {
            if (this.point === point) {
                this.point = null;

            }
        }
        else {

            const newSize = this.size / 2;
            if (point.x - this.xTopR <= newSize) {
                if (point.y - this.yTopR <= newSize) {
                    //if (this.tlChild) { //remove unnecessary checks?
                    this.tlChild.deletePoint(point);
                    if (this.tlChild.isLeafNode && !(this.tlChild.point)) {
                        this.tlChild = null;

                    }
                    //}
                }
                else {
                    //if (this.blChild) {
                    this.blChild.deletePoint(point);
                    if (this.blChild.isLeafNode && !(this.blChild.point)) {
                        this.blChild = null;

                    }
                    //}
                }

            }
            else {
                if (point.y - this.yTopR <= newSize) {
                    //if (this.trChild) {
                    this.trChild.deletePoint(point);
                    if (this.trChild.isLeafNode && !(this.trChild.point)) {
                        this.trChild = null;


                    }
                    //}
                }
                else {
                    //if (this.brChild) {
                    this.brChild.deletePoint(point);
                    if (this.brChild.isLeafNode && !(this.brChild.point)) {
                        this.brChild = null;

                    }
                    //}
                }



            }
            if (!this.hasChild()) this.isLeafNode = true;


        }

    }
    deletePoint(point) {
        if (this.isLeafNode) {
            if (this.point === point) {
                this.point = null;
                this.centerOfMass.x = 0;
                this.centerOfMass.y = 0;
                this.centerOfMass.mass = 0;
            }
        }
        else {
            this.centerOfMass.x *= this.centerOfMass.mass;
            this.centerOfMass.x -= point.x * point.mass;
            this.centerOfMass.y *= this.centerOfMass.mass;
            this.centerOfMass.y -= point.y * point.mass;
            this.centerOfMass.mass -= point.mass;
            this.centerOfMass.x /= this.centerOfMass.mass;
            this.centerOfMass.y /= this.centerOfMass.mass;
            const newSize = this.size / 2;
            if (point.x - this.xTopR <= newSize) {
                if (point.y - this.yTopR <= newSize) {
                    //if (this.tlChild) { //remove unnecessary checks?
                    this.tlChild.deletePoint(point);
                    if (this.tlChild.isLeafNode && !(this.tlChild.point)) {
                        this.tlChild = null;

                    }
                    //}
                }
                else {
                    //if (this.blChild) {
                    this.blChild.deletePoint(point);
                    if (this.blChild.isLeafNode && !(this.blChild.point)) {
                        this.blChild = null;

                    }
                    //}
                }

            }
            else {
                if (point.y - this.yTopR <= newSize) {
                    //if (this.trChild) {
                    this.trChild.deletePoint(point);
                    if (this.trChild.isLeafNode && !(this.trChild.point)) {
                        this.trChild = null;


                    }
                    //}
                }
                else {
                    //if (this.brChild) {
                    this.brChild.deletePoint(point);
                    if (this.brChild.isLeafNode && !(this.brChild.point)) {
                        this.brChild = null;

                    }
                    //}
                }



            }
            if (!this.hasChild()) this.isLeafNode = true;


        }
    }

    softDeletePoint(point) {
        if (this.isLeafNode) {
            if (this.point === point) {
                this.point = null;
                this.centerOfMass.x = 0;
                this.centerOfMass.y = 0;
                this.centerOfMass.mass = 0;
            }
        }
        else {
            this.centerOfMass.x *= this.centerOfMass.mass;
            this.centerOfMass.x -= point.x * point.mass;
            this.centerOfMass.y *= this.centerOfMass.mass;
            this.centerOfMass.y -= point.y * point.mass;
            this.centerOfMass.mass -= point.mass;
            this.centerOfMass.x /= this.centerOfMass.mass;
            this.centerOfMass.y /= this.centerOfMass.mass;
            const newSize = this.size / 2;
            if (point.x - this.xTopR <= newSize) {
                if (point.y - this.yTopR <= newSize) {
                    if (this.tlChild) {
                        this.tlChild.deletePoint(point);

                    }
                }
                else {
                    if (this.blChild) {
                        this.blChild.deletePoint(point);

                    }
                }

            }
            else {
                if (point.y - this.yTopR <= newSize) {
                    if (this.trChild) {
                        this.trChild.deletePoint(point);

                    }
                }
                else {
                    if (this.brChild) {
                        this.brChild.deletePoint(point);

                    }
                }



            }

        }

    }

    reset(xTopR, yTopR, size) {
        this.xTopR = xTopR;
        this.yTopR = yTopR;
        this.size = size;
        this.tlChild = null;
        this.trChild = null;
        this.brChild = null;
        this.blChild = null;
        this.point = null;
        this.isLeafNode = true;
        this.centerOfMass = {
            x: 0,
            y: 0,
            mass: 0
        };
    }

}

export { Quadtree };