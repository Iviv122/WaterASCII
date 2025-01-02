const height = window.innerHeight;
const width = window.innerWidth;

const fontsize = 12;

const charWidth = Math.floor(width/(fontsize * 0.6));
const charHeight = Math.floor(height/(fontsize*1.2));

const Water = document.querySelector("#water");

Water.style.color = "white";
Water.style.fontSize = `${fontsize}px`;
Water.style.lineHeight = "1.2"; 

var WaterChars = " '.,`^:;~*+-_=*#&8%@$";

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
var isMouseDown = false;
var isRightMouseDown = false;



function ClickHandle(e) {
        if(!isRightMouseDown){
        console.log("ee");
        
        let x = Math.floor(pos[0] / (fontsize * 0.6)); 
        let y = Math.floor((height - pos[1]) / (fontsize * 1.2)); 
        for(let i =-1;i<=1;i++){
        for(let j=-1;j<=1;j++){
        let ni = x + i;
        let nj = y + j;

        if (ni >= 1 && ni < charWidth - 1 && nj >= 1 && nj < charHeight - 1) {
            matrix[nj][ni] = WaterChars.length - 1;
        }

        }}}

    else{
        console.log("bb");
        
            let x = Math.floor(pos[0] / (fontsize * 0.6)); 
        let y = Math.floor((height - pos[1]) / (fontsize * 1.2)); 
        for(let i =-1;i<=1;i++){
        for(let j=-1;j<=1;j++){
        let ni = x + i;
        let nj = y + j;

        if (ni >= 1 && ni < charWidth - 1 && nj >= 1 && nj < charHeight - 1) {
            matrix[nj][ni] = 0;
        }
    }}}
}

function MousePos(event) {
    pos = [event.clientX, event.clientY]; 
    if (isMouseDown) {
        ClickHandle(event); 
    }
}
function MouseDown(event) {
    isMouseDown = true;
    if(event.button == 2){
        isRightMouseDown = true;
    } 
    MousePos(event); 

updateString();
updateWater();
}

function MouseUp() {
    isMouseDown = false;
    isRightMouseDown = false;

}

document.addEventListener("mousedown", MouseDown);
document.addEventListener("mousemove", MousePos);
document.addEventListener("mouseup", MouseUp);
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

function updateWater() {
    let newMatrix = JSON.parse(JSON.stringify(matrix));

    for (let i = 0; i < charHeight; i++) {
        for (let j = 0; j < charWidth; j++) {
            if (matrix[i][j] > 0) {
                let spreadAmount = Math.floor(matrix[i][j] / 4); 

                if (i + 1 < charHeight && spreadAmount > 0) {
                    newMatrix[i + 1][j] += spreadAmount;
                    if(newMatrix[i + 1][j] > WaterChars.length-1){
                        newMatrix[i + 1][j] = WaterChars.length-1;
                    }
                    newMatrix[i][j] -= spreadAmount;
                }
                if (i - 1 >= 0 && spreadAmount > 0) {
                    
                    newMatrix[i - 1][j] += spreadAmount;
                   
                    if(newMatrix[i - 1][j] > WaterChars.length-1){
                        newMatrix[i - 1][j] = WaterChars.length-1;
                    }

                    newMatrix[i][j] -= spreadAmount;
                }
                if (j + 1 < charWidth && spreadAmount > 0) {
                    newMatrix[i][j + 1] += spreadAmount;
                    
                    if(newMatrix[i][j + 1] > WaterChars.length-1){
                        newMatrix[i][j + 1] = WaterChars.length-1;
                    }
                    
                    newMatrix[i][j] -= spreadAmount;
                }
                if (j - 1 >= 0 && spreadAmount > 0) {
                    newMatrix[i][j - 1] += spreadAmount;
                    if(newMatrix[i][j - 1] > WaterChars.length-1){
                        newMatrix[i][j - 1] = WaterChars.length-1;
                    }
                    newMatrix[i][j] -= spreadAmount;
                }

                if (newMatrix[i][j] < 0) {
                    newMatrix[i][j] = 0; 
                }
            }
        }
    }

    matrix = newMatrix;

    updateString();

    setTimeout(updateWater, 10);
}

