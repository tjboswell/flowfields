const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const p5 = require('p5');

const seed = random.getRandomSeed();
random.setSeed(seed);

const settings = {
    dimensions: [2048, 2048],
    p5: { p5 },
    scaleToView: true,
    pixelsPerInch: 300,
    suffix: `seed_${seed}`,
};

const margin = 0;

function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

// some seeds I like
// random.setSeed('817211');
// random.setSeed('191722');
// random.setSeed('553229');
// random.setSeed('202173');
// random.setSeed('459498');
// random.setSeed('308732');
// random.setSeed('198371');
// random.setSeed('601454');
// random.setSeed('392621');
// random.setSeed('456993');

const resolutionRatio = random.range(0.001, 0.005);

const xoffInc = random.range(0.005, 0.01);
const yoffInc = random.range(0.005, 0.01);

const stepSize = random.range(0, 0.01);

const numLines = random.range(1000, 2000);
const lineThickness = random.range(1, 5);
const lineLength = random.range(50, 150);

const addWeirdness = random.value() > 0.5;
const weirdFactor = random.range(0.001, 0.005);

const palettes = [
    ['rgb(60, 48, 76)', 'rgb(76, 154, 118)', 'rgb(255, 217, 191)', 'rgb(247, 118, 106)'],
    ['rgb(135, 249, 202)', 'rgb(35, 50, 68)', 'rgb(232, 118, 95)', 'rgb(250, 213, 205)'],
    ['rgb(11, 57, 110)', 'rgb(205, 222, 236)', 'rgb(255, 243, 182)', 'rgb(248, 185, 211)'],
    ['rgb(60, 60, 78)', 'rgb(119, 121, 155)', 'rgb(141, 164, 146)', 'rgb(199, 221, 230)'],
    ['rgb(66, 72, 108)', 'rgb(135, 142, 163)', 'rgb(117, 219, 172)', 'rgb(255, 210, 202)'],
    ['rgb(49, 39, 66)', 'rgb(245, 79, 46)', 'rgb(248, 178, 66)', 'rgb(247, 203, 194)'],
    ['rgb(40, 49, 69)', 'rgb(122, 146, 171)', 'rgb(254, 195, 185)', 'rgb(208, 215, 239)'],
    ['rgb(44, 71, 106)', 'rgb(172, 212, 224)', 'rgb(252, 208, 207)', 'rgb(247, 124, 71)'],
    ['rgb(232, 84, 43)', 'rgb(252, 208, 204)', 'rgb(253, 56, 174)', 'rgb(19, 52, 92)'],
    ['rgb(30, 34, 79)', 'rgb(41, 172, 248)', 'rgb(251, 194, 78)', 'rgb(249, 117, 105)'],
    ['rgb(40, 38, 65)', 'rgb(235, 81, 67)', 'rgb(253, 203, 201)', 'rgb(251, 190, 93)'],
    ['rgb(29, 57, 75)', 'rgb(255, 213, 48)', 'rgb(255, 92, 38)', 'rgb(71, 56, 80)'],
    ['rgb(55, 43, 59)', 'rgb(240, 179, 10)', 'rgb(253, 194, 189)', 'rgb(218, 84, 39)'],
    ['rgb(113, 123, 161)', 'rgb(200, 233, 240)', 'rgb(254, 205, 197)', 'rgb(252, 96, 79)'],
    ['rgb(51, 70, 112)', 'rgb(69, 133, 153)', 'rgb(250, 116, 112)', 'rgb(205, 56, 11)'],
    ['rgb(252, 118, 85)', 'rgb(254, 230, 120)', 'rgb(241, 163, 194)', 'rgb(209, 32, 150)'],
    ['rgb(214, 133, 33)', 'rgb(244, 198, 97)', 'rgb(248, 140, 128)', 'rgb(192, 55, 50)'],
    ['rgb(36, 60, 81)', 'rgb(212, 221, 226)', 'rgb(254, 212, 198)', 'rgb(224, 87, 74)'],
    ['rgb(30, 50, 84)', 'rgb(196, 229, 237)', 'rgb(252, 204, 193)', 'rgb(234, 127, 85)'],
    ['rgb(52, 54, 83)', 'rgb(85, 156, 200)', 'rgb(199, 234, 253)', 'rgb(244, 197, 196)'],
    ['rgb(107, 176, 132)', 'rgb(46, 64, 96)', 'rgb(255, 204, 194)', 'rgb(250, 114, 76)'],
    ['rgb(69, 65, 109)', 'rgb(245, 116, 87)', 'rgb(248, 235, 179)', 'rgb(243, 200, 196)'],
    ['rgb(241, 80, 22)', 'rgb(249, 202, 201)', 'rgb(200, 226, 247)', 'rgb(30, 50, 78)'],
    ['#fbd279', '#f57061', '#623c97', '#222544'],
    ['rgb(241, 100, 75)', 'rgb(137, 127, 169)', 'rgb(221, 228, 232)', 'rgb(37, 41, 65)'],
    ['rgb(253, 196, 195)', 'rgb(255, 116, 114)', 'rgb(121, 152, 155)', 'rgb(66, 53, 82)'],
    ['rgb(39, 40, 67)', 'rgb(127, 86, 196)', 'rgb(255, 211, 203)', 'rgb(254, 203, 64)'],
    ['rgb(21, 51, 82)', 'rgb(211, 223, 245)', 'rgb(255, 215, 196)', 'rgb(237, 164, 189)'],
    ['rgb(53, 59, 72)', 'rgb(177, 222, 224)', 'rgb(254, 116, 91)', 'rgb(252, 190, 45)'],
    ['rgb(249, 206, 193)', 'rgb(251, 116, 99)', 'rgb(86, 253, 178)', 'rgb(8, 51, 111)'],
    ['rgb(245, 37, 165)', 'rgb(224, 90, 28)', 'rgb(238, 204, 118)', 'rgb(247, 206, 194)'],
    ['rgb(31, 53, 81)', 'rgb(220, 199, 7)', 'rgb(255, 131, 112)', 'rgb(207, 74, 25)'],
    ['rgb(33, 35, 72)', 'rgb(204, 221, 228)', 'rgb(254, 200, 184)', 'rgb(202, 121, 29)'],
    ['rgb(55, 53, 91)', 'rgb(120, 116, 165)', 'rgb(154, 255, 201)', 'rgb(240, 218, 107)'],
    ['rgb(39, 57, 78)', 'rgb(67, 158, 200)', 'rgb(255, 204, 203)', 'rgb(246, 188, 70)'],
    ['rgb(44, 50, 61)', 'rgb(239, 150, 7)', 'rgb(255, 219, 197)', 'rgb(185, 43, 145)'],
    ['rgb(21, 43, 109)', 'rgb(252, 232, 159)', 'rgb(243, 112, 64)', 'rgb(253, 206, 205)'],
    ['rgb(249, 124, 117)', 'rgb(242, 222, 76)', 'rgb(39, 50, 80)', 'rgb(176, 207, 216)'],
    ['rgb(246, 121, 109)', 'rgb(251, 234, 164)', 'rgb(201, 235, 254)', 'rgb(52, 77, 105)'],
    ['rgb(60, 72, 129)', 'rgb(210, 108, 5)', 'rgb(241, 118, 116)', 'rgb(243, 198, 194)'],
    ['rgb(244, 122, 132)', 'rgb(240, 228, 61)', 'rgb(255, 212, 202)', 'rgb(36, 40, 71)'],
    ['rgb(48, 48, 90)', 'rgb(214, 229, 233)', 'rgb(255, 142, 122)', 'rgb(247, 196, 85)'],
    ['rgb(60, 157, 209)', 'rgb(40, 67, 104)', 'rgb(255, 110, 97)', 'rgb(254, 243, 180)'],
    ['rgb(63, 137, 149)', 'rgb(155, 200, 230)', 'rgb(253, 210, 117)', 'rgb(251, 69, 32)'],
    ['rgb(39, 48, 66)', 'rgb(82, 68, 182)', 'rgb(179, 216, 238)', 'rgb(249, 209, 207)'],
    ['rgb(56, 60, 83)', 'rgb(112, 152, 159)', 'rgb(244, 131, 118)', 'rgb(254, 250, 182)'],
    ['rgb(250, 244, 79)', 'rgb(35, 36, 68)', 'rgb(108, 53, 151)', 'rgb(161, 204, 239)'],
];

const colors = random.pick(palettes);

const backgroundColor = random.pick(colors);
const backgroundAlpha = random.range(50, 200);

const squareColor = random.pick(colors);
const squareAlpha = random.range(100, 255);

// optionally, using a white background (comment out square)
// const backgroundColor = 'white';
// const backgroundAlpha = 255;

console.table({
    resolutionRatio,
    xoffInc,
    yoffInc,
    stepSize,
    numLines,
    lineThickness,
    lineLength,
    addWeirdness,
    weirdFactor,
    colors,
    backgroundColor,
    backgroundAlpha,
    squareColor,
    squareAlpha,
});

canvasSketch(() => {
    return ({ p5, time, width, height }) => {
        const p5BackgroundColor = p5.color(backgroundColor);
        p5BackgroundColor.setAlpha(backgroundAlpha);

        // other good blend modes to try: p5.LIGHEST, p5.SCREEN, p5.MULTIPLY
        const blendMode = p5.BLEND;

        p5.blendMode(blendMode);
        p5.background(p5BackgroundColor);

        // optional, disable if you want a white or non-blended background
        const p5SquareColor = p5.color(squareColor);
        p5SquareColor.setAlpha(squareAlpha);
        p5.fill(p5SquareColor);
        p5.square(0, 0, width);

        const resolution = Math.round(width * resolutionRatio);
        const leftX = margin;
        const rightX = width - margin;
        const topY = margin;
        const bottomY = height - margin;
        const numX = Math.round((rightX - leftX) / resolution);
        const numY = Math.round((bottomY - topY) / resolution);

        let xoff = 0;
        let yoff = 0;

        function getCoords(coords) {
            return [getX(coords[0]), getY(coords[1])];
        }

        function getX(u) {
            return p5.map(u, 0, 1, margin, width - margin);
        }
        function getY(v) {
            return p5.map(v, 0, 1, margin, height - margin);
        }

        let points = make2DArray(numX, numY);

        for (let x = 0; x < numX; x++) {
            yoff = 0;
            for (let y = 0; y < numY; y++) {
                let u = x / (numX - 1);
                let v = y / (numY - 1);
                points[x][y] = {
                    coords: [u, v],
                    vector: p5.constructor.Vector.fromAngle(random.noise2D(xoff, yoff) * p5.TWO_PI),
                };
                yoff += yoffInc;
            }
            xoff += xoffInc;
        }

        const step = width * stepSize;

        p5.strokeWeight(lineThickness);
        p5.noFill();

        for (let a = 0; a < numLines; a++) {
            p5.beginShape();
            p5.stroke(colors[a % colors.length]);
            let x = random.range(leftX, rightX);
            let y = random.range(topY, bottomY);

            for (let i = 0; i < lineLength; i++) {
                const xOffset = x - leftX;
                const yOffset = y - topY;
                let col = Math.round(xOffset / resolution);
                let row = Math.round(yOffset / resolution);

                if (col <= 0 || row <= 0 || col >= numX || row >= numY) {
                    col = numX / 2;
                    row = numY / 2;
                    break;
                }
                const angle = points[col - 1][row - 1].vector.heading();

                p5.vertex(x, y);

                let xStep = step * Math.cos(angle * (addWeirdness ? random.noise1D(i * weirdFactor) : 1));
                let yStep = step * Math.sin(angle * (addWeirdness ? random.noise1D(i * weirdFactor) : 1));
                x += xStep;
                y += yStep;
            }
            p5.endShape();
        }
    };
}, settings);

console.log(random.getSeed());
