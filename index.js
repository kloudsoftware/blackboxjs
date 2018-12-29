export const directions = {up: {x: 0, y:1}, down: {x:0, y:-1}, left: {x: -1, y: 0}, right: {x: 1, y: 0}, block:0xc0debabe, nothing: {x: 0, y: 0}};

export class Atom {
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

    apply(x, y, direction) {
        let dir = checkDeflectionLeft() === directions.nothing ? checkDeflectionRight() : direction.left;
        return {
            x: direction.x + dir.x,
            y: direction.y + dir.y
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

    checkBlocked(x, y) {
        return this.x === x && this.y === y;
    }
}

export class Beam {
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

    transverse(direction) {
        this.currentX += direction.x;
        this.currentY += direction.y;
        this.path.push({x: currentX, y: currentY});
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
        start:
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

export const revealBeam = (x, y) => {
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


const calcBeam = (x, y, initalDirection) => {
    let direction = initalDirection;
    let beam = new Beam(x, y, direction, 0);
    while(true) {
        if(checkBlocks(beam.currentX, beam.currentY)) {
            beam.finalX = beam.currentX;
            beam.finalY = beam.currentY;
            break;
        }

        direction = calcDirection(beam.currentX, beam.currentY, direction);
        beam.tansverse(direction);

        if(checkEnded(beam, direction)) {
            beam.finalX = beam.currentX;
            beam.finalY = beam.currentY;
            break;
        }
    }
};

const checkEnded = (beam, direction) => {
    if (direction === directions.up) {
        return beam.currentY === 0;
    }

    if(direction === directions.down) {
        return beam.currentY === playgroundSize - 1;
    }

    if(direction === directions.left) {
        return beam.currentX === 0;
    }

    if(direction === directions.right) {
        return beam.currentX === playgroundSize - 1;
    }

    console.log("ILLEGAL POSITION FOR BEAM");
    return false;
};

const calcDirection = (x, y, direction) => {
    atoms.forEach(atom => direction = atom.apply(x, y, direction));
};

const checkBlocks = (x, y) => {
    atoms.filter(atom => atom.checkBlocked(x, y));
    return atoms.length > 0;
};

console.log(renderPlayground());
