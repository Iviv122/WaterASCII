const height = window.innerHeight;
const width = window.innerWidth;

const fontsize = 12;

const charWidth = Math.floor(width/(fontsize * 0.6));
const charHeight = Math.floor(height/(fontsize*1.25));

const Water = document.querySelector("#water");

Water.style.color = "white";
Water.style.fontSize = `${fontsize}px`;
Water.style.lineHeight = "1.25"; 

var WaterChars = " '..,,`^^:;!!llii~~*+-_?ttffjjrtrnnxxuyvrczwqpdkbhao=*#&8%@$$$$";

var matrix = new Array(charHeight);
for(let i=0;i<charHeight;i++){
    matrix[i] = new Array(charWidth);
    for(let j=0;j<charWidth;j++){
    matrix[i][j] = 0;
    }
}

function updateString(){

    var WaterString = "";

    for(let i=charHeight-1;i>=0;--i){
        for(let j=0;j<charWidth;j++){
            WaterString += WaterChars[matrix[i][j]];
        }
        WaterString += "\n";
    }

	Water.innerHTML = `<pre>${WaterString}</pre>`;
}

var pos = null;
var isMouseDown = false; // Flag to track if mouse is held down

function ClickHandle() {
    if (pos !== null) {
        let x = Math.floor(pos[0] / (fontsize * 0.6)); // Convert to grid position
        let y = Math.floor((height - pos[1]) / (fontsize * 1.25)); // Convert to grid position

        let ni = x + 0;
        let nj = y + 0;

        if (ni >= 1 && ni < charWidth - 1 && nj >= 1 && nj < charHeight - 1) {
            matrix[nj][ni] = WaterChars.length - 1;
        }
    }
}

function MousePos(event) {
    pos = [event.clientX, event.clientY]; // Store mouse position
    if (isMouseDown) {
        ClickHandle(); // Update the grid based on mouse position when button is held down
    }
}
function MouseDown(event) {
    isMouseDown = true; // Set flag to true when mouse button is pressed
    MousePos(event); // Call MousePos to update on mouse down

updateString();
updateWater();
}

function MouseUp() {
    isMouseDown = false; // Set flag to false when mouse button is released
}

document.addEventListener("mousedown", MouseDown);
document.addEventListener("mousemove", MousePos);
document.addEventListener("mouseup", MouseUp);


function updateWater() {
    // Deep copy the matrix to avoid directly modifying the original
    let newMatrix = JSON.parse(JSON.stringify(matrix));

    // Iterate over each cell in the matrix
    for (let i = 0; i < charHeight; i++) {
        for (let j = 0; j < charWidth; j++) {
            // Process only non-zero cells
            if (matrix[i][j] > 0) {
                let spreadAmount = Math.floor(matrix[i][j] / 4); // Equal amount to spread to neighbors

                // Spread water to neighboring cells, ensuring bounds are not exceeded
                if (i + 1 < charHeight && spreadAmount > 0) {
                    newMatrix[i + 1][j] += spreadAmount;
                }
                if (i - 1 >= 0 && spreadAmount > 0) {
                    newMatrix[i - 1][j] += spreadAmount;
                }
                if (j + 1 < charWidth && spreadAmount > 0) {
                    newMatrix[i][j + 1] += spreadAmount;
                }
                if (j - 1 >= 0 && spreadAmount > 0) {
                    newMatrix[i][j - 1] += spreadAmount;
                }

                // Reduce the current cell's water level by the total spread amount
                newMatrix[i][j] -= spreadAmount * 4;
                if (newMatrix[i][j] < 0) {
                    newMatrix[i][j] = 0; // Prevent negative values
                }
            }
        }
    }

    // Update the global matrix with the new state
    matrix = newMatrix;

    // Refresh the string representation
    updateString();

    // Recursively call the function with a delay
    setTimeout(updateWater, 5);
}

