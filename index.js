 const directions = {up: {x: 0, y:1}, down: {x:0, y:-1}, left: {x: -1, y: 0}, right: {x: 1, y: 0}, block:0xc0debabe, nothing: {x: 0, y: 0}};

 class Atom {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.deflectLeft = {
            top: {
                x: this.x - 1, y: this.y + 1
            },
            bottom: {
                x: this.x - 1, y: this.y - 1
            }
        };
        this.deflectRight = {
            top: {
                x: this.x + 1, y: this.y + 1
            },
            bottom: {
                x: this.x + 1, y: this.y - 1
            }
        };
    }

     checkDeflectionLeft(x, y) {
         if(this.deflectLeft.top.x === x && this.deflectLeft.top.y === y) {
             return directions.left;
         }

         if(this.deflectLeft.bottom.x === x && this.deflectLeft.bottom.y === y) {
             return directions.left;
         }
         return directions.nothing;
     }

     checkDeflectionRight(x, y) {
         if(this.deflectRight.top.x === x && this.deflectRight.top.y === y) {
             return directions.left;
         }

         if(this.deflectRight.bottom.x === x && this.deflectRight.bottom.y === y) {
             return directions.left;
         }
         return directions.nothing;
     }

    apply(x, y, direction) {
        let dir = this.checkDeflectionLeft(x, y) === directions.nothing ? this.checkDeflectionRight(x, y) : directions.left;
        console.log("CALCULATED DIRECTION: " + dir);
        return {
            x: direction.x + dir.x,
            y: direction.y + dir.y
        };
    }



    checkBlocked(x, y) {
        return this.x === x && this.y === y;
    }
}

 class Beam {
    constructor(startX, startY, direction, color) {
        this.startX = startX;
        this.startY = startY;
        this.initialDirection = direction;
        this.direction = direction;
        this.finalX = 0;
        this.finalY = 0;
        this.blocked = false;
        this.color = color;
        this.currentX = startX;
        this.currentY = startY;
        this.path = [{x: startX,y: startY}];
    }

    transverse(dir) {
        this.currentX += dir.x;
        this.currentY += dir.y;
        this.path.push({x: this.currentX, y: this.currentY});
    }
}

const playgroundSize = 8;
const numAtoms = 5;
const atoms = [];
let wasInitialized = false;
const beams = [];

const create2DArray =(rows) => {
    let arr = [];

    for (var i=0;i<rows;i++) {
        arr[i] = [];
    }

    return arr;
};

const playground = create2DArray(8);

const prepareplaygound = () => {
    prepareAtoms();

    for (let x = 0; x < playgroundSize; x++) {
        for(let y = 0; y < playgroundSize; y++) {
            let foundAtom = atoms.filter(atom => atom.x === x && atom.y === y);
            if(foundAtom[0]) {
                playground[x][y] = 1;
            } else {
                playground[x][y] = 0;
            }
        }
    }
};

const prepareAtoms = () => {
    for(let i = 0; i < numAtoms; i++) {
        let atomX = Math.floor((Math.random() * 7));
        let atomY = Math.floor((Math.random() * 7));

        let obj = new Atom(atomX, atomY);

        if(atoms.includes(obj)) {
        }
        atoms.push(obj);
        console.log(obj);
        }
};

export const renderPlayground = () => {
    if(!wasInitialized) {
        prepareplaygound();
        wasInitialized = true;
    }

    return beams;
};


const checkBlocks = (x, y) => {
    let filteredAtoms = atoms.filter(atom => atom.checkBlocked(x, y));
    return filteredAtoms.length > 0;
};

const calcBeam = (x, y, initalDirection) => {
    let direction = initalDirection;
    let beam = new Beam(x, y, direction, 0);
    while(true) {
        if(checkBlocks(beam.currentX, beam.currentY)) {
            beam.finalX = beam.currentX;
            beam.finalY = beam.currentY;
            beam.blocked = true;
            console.log("Ended block");
            break;
        }

        direction = calcDirection(beam.currentX, beam.currentY, direction);

        if(checkEnded(beam, direction)) {
            beam.finalX = beam.currentX;
            beam.finalY = beam.currentY;
            break;
        }
        beam.transverse(direction);
    }
    return beam;
};

export const revealBeam = (x, y) => {;
    let direction;

    if(x === 0) {
        direction = directions.right;
    } else if(y === 0) {
        direction = directions.up;
    } else if(y === playgroundSize - 1) {
        direction = directions.down;
    } else {
        direction = directions.left;
    }

    let beam = calcBeam(x, y, direction);
    beams.push(beam);
};

const checkEnded = (beam, direction) => {
    if(compareDirection(direction, directions.up)) {
        return beam.currentY === playgroundSize - 1;
    }

    if(compareDirection(direction, directions.down)) {
        return beam.currentY === 0;
    }

    if(compareDirection(direction, directions.left)) {
        return beam.currentX === playgroundSize - 1;
    }

    if(compareDirection(direction, directions.right)) {
        return beam.currentX === 0;
    }

    if(compareDirection(direction, directions.nothing)) {
        return true;
    }

    if(beam.currentX < 0 || beam.currentY < 0) {
        console.log("Beam is on illegal pos:\n X: " + beam.currentX + " Y: " + beam.currentY);
        return true;
    }

    console.log("NOT A KNOWN DIRECTION");
    console.log(direction.x + " " + direction.y);
    return false;
};

const compareDirection = (dir1, dir2) => {
    return dir1.x === dir2.x && dir1.y === dir2.y;
};

const calcDirection = (x, y, direction) => {
    for (let atom of atoms) {
        direction = atom.apply(x, y, direction);
    }
    return direction;
};

if(!wasInitialized) {
    prepareplaygound();
    wasInitialized = true;
}
//revealBeam(0,0);
//console.log(renderPlayground());
