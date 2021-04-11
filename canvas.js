let canvas;
let ctx;
let gBArrayHeight=18;
let gBArrayWidth=12;
let startX=4;
let startY=0;
let score=0;
let level=1;
let countForLevel=0;
let nextLevel=30;
let winOrLose="Playing...";
let coordinateArray= [...Array(gBArrayHeight)].map(e=>Array(gBArrayWidth).fill(0))
let curTetromino=[[1,0],[0,1],[1,1],[2,1]]

let tetrominos=[];
let tetrominoColors=["purple","cyan","blue","yellow","orange","green","red"];
let curTetrominoColor;
let dir;
let gameBoardArray= [...Array(gBArrayHeight)].map(e=>Array(gBArrayWidth).fill(0));

let stoppedShapeArray= [...Array(gBArrayHeight)].map(e=>Array(gBArrayWidth).fill(0));

let DIRECTION={
    IDLE:0,
    DOWN:1,
    LEFT:2,
    RIGHT:3
}



class Coordinates{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
}
const SetupCanvas=()=>{
    canvas=document.getElementById("my-canvas");
    ctx=canvas.getContext("2d");
    canvas.width=480;
    canvas.height=435;

    ctx.scale(1,1);

    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle="white";
    ctx.strokeRect(8, 8 ,280,415);

    
    ctx.font="30px Times New Roman";
    ctx.fillStyle="violet";
    ctx.fillText("TETRIS",325,25);

    ctx.fillStyle="white";
    ctx.font="21px Arial";
    
    ctx.fillText("SCORE",300,55);

    ctx.strokeRect(300,67,161,24)

    ctx.fillText(`${score.toString()}/${nextLevel}`,310,87);

    ctx.fillText("LEVEL",300,117);

    ctx.strokeRect(300,131,161,24);

    ctx.fillText(level.toString(),310,150);

    ctx.fillText("WIN / LOSE",300,181)
    ctx.fillStyle="green";
    ctx.fillText(winOrLose,310,221)
    ctx.fillStyle="white";
    ctx.strokeRect(300,192,161,45);
    ctx.fillText("RECORD",300,260)
    ctx.strokeRect(300,265,161,25);
    ctx.strokeRect(300,265,161,25);
    ctx.fillText("CONTROLS",300,314);
    ctx.strokeRect(300,321,161,104);
    ctx.font="19px Arial";
    ctx.fillText("J : Move Left",310,343)
    ctx.fillText("L : Move Right",310,368)
    ctx.fillText("K : Move Down",310,393)
    ctx.fillText("X : Rotate",310,418)
    
    document.addEventListener("keydown",HandleKeyPress);
    document.querySelector("#left").addEventListener("click",HandleKeyPress);
    document.querySelector("#right").addEventListener("click",HandleKeyPress);
    document.querySelector("#down").addEventListener("click",HandleKeyPress);
    document.querySelector("#rotate").addEventListener("click",HandleKeyPress);
    CreateTetrominos();
    CreateTetromino();

    CreateCoordArray();
    DrawTetromino();
}


document.addEventListener("DOMContentLoaded", SetupCanvas);

const CreateCoordArray=()=>{
    let i=0, j=0;
    for (let y = 9;  y<= 446; y+=23) {
        for (let x = 11; x <=264; x+=23) {
            coordinateArray[i][j]=new Coordinates(x,y);
            i++;            
        }
        j++;    
        i=0;    
    }
}



const DrawTetromino=()=>{
    for (let i =0;i < curTetromino.length;i++) {
        let x=curTetromino[i][0] + startX;
        let y=curTetromino[i][1] + startY;
        gameBoardArray[x][y]=1;
        let coorX=coordinateArray[x][y].x;
        let coorY=coordinateArray[x][y].y;
        ctx.fillStyle=curTetrominoColor;
        ctx.fillRect(coorX,coorY,21,21)
         
    }
}
const HandleKeyPress=(key)=>{
    if(winOrLose==="Game Over") return;
    if(key.keyCode===74||key.target.id==="left"){
        dir=DIRECTION.LEFT;
        if(!HittingTheWall() && !CheckForHorizontalCollision()){
            DeleteTetromino();
            startX--;
            DrawTetromino()
        }       
    }else if(key.keyCode===76||key.target.id==="right"){
        dir=DIRECTION.RIGHT;
        if(!HittingTheWall() && !CheckForHorizontalCollision()){
            DeleteTetromino();
            startX++;
            DrawTetromino()
        }        
    }else if(key.keyCode===75||key.target.id==="down"){
        MoveTetrominoDown()
    }else if(key.keyCode===88||key.target.id==="rotate"){
        RotateTetromino();
    }
}

const MoveTetrominoDown=()=>{
    dir=DIRECTION.DOWN;
    if(!CheckForVerticalCollision()){
        DeleteTetromino();
        startY++;
        DrawTetromino();
    }    
}
const DeleteTetromino=()=>{
    for(let i=0;i < curTetromino.length;i++){
        let x=curTetromino[i][0] + startX;
        let y=curTetromino[i][1] + startY;
        gameBoardArray[x][y]=0;
        let coorX=coordinateArray[x][y].x;
        let coorY=coordinateArray[x][y].y;
        ctx.fillStyle="black";
        ctx.fillRect(coorX,coorY,21,21);
    }
}

const CreateTetrominos=()=>{
    //T
    tetrominos.push([[1,0],[0,1],[1,1],[2,1]]);
    //I
    tetrominos.push([[0,0],[1,0],[2,0],[3,0]]);
    //J
    tetrominos.push([[0,0],[0,1],[1,1],[2,1]]);
    //Square
    tetrominos.push([[0,0],[1,0],[0,1],[1,1]]);
    //L
    tetrominos.push([[2,0],[0,1],[1,1],[2,1]]);
    //S
    tetrominos.push([[1,0],[2,0],[0,1],[1,1]]);
    //Z
    tetrominos.push([[0,0],[1,0],[1,1],[2,1]]);
}

const CreateTetromino=()=>{
    let randomTetromino=Math.floor(Math.random() * tetrominos.length)
    curTetromino=tetrominos[randomTetromino]
    curTetrominoColor=tetrominoColors[randomTetromino]
}

const HittingTheWall=()=>{
    for (let i = 0; i < curTetromino.length; i++) {
        let newX=curTetromino[i][0] + startX;
        if(newX<=0&&dir===DIRECTION.LEFT){
            return true;
        }else if(newX >=11 && dir===DIRECTION.RIGHT){
            return true;
        }
    }
    return false;
}
const CheckForVerticalCollision=()=>{
    let tetrominoCopy=curTetromino;
    let collision=false;
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square=tetrominoCopy[i];
        let x=square[0]+ startX;
        let y=square[1]+ startY;
        if(dir===DIRECTION.DOWN){
            y++;
        }
        if(gameBoardArray[x][y+1]===1){
            if(typeof stoppedShapeArray[x][y+1]==="string"){
                DeleteTetromino();
                startY++;
                DrawTetromino();
                collision=true;
            }
        }
        if(y>=18){
            collision=true;
        }      
        if(collision){
            if(startY<=2){
                winOrLose="Game Over";
                ctx.fillStyle="black";
                ctx.fillRect(310,202,140,30)
                ctx.fillStyle="red";
                ctx.fillText(winOrLose,310,221)
            }else{
                for (let i = 0; i < tetrominoCopy.length; i++) {
                    let square=tetrominoCopy[i]   
                    let x =square[0] + startX;
                    let y =square[1] + startY;
                    stoppedShapeArray[x][y]=curTetrominoColor;
                }
                CheckForCompletedRows();
                CreateTetromino()
                dir=DIRECTION.IDLE;
                startX=4;
                startY=0;
                DrawTetromino()
                break;               
                
            }
        }
    }
}
const CheckForHorizontalCollision=()=>{
    let tetrominoCopy=curTetromino;
    let collision=false;
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square=tetrominoCopy[i]   
        let x =square[0] + startX;
        let y =square[1] + startY;
        
        if(dir===DIRECTION.LEFT){
            x--;
        }else if(dir===DIRECTION.RIGHT){
            x++;
        }
        var stoppedShapeVal=stoppedShapeArray[x][y];
        if(typeof stoppedShapeVal==="string"){
            collision=true;
            break;
        }
    }
    return collision;
}
const CheckForCompletedRows=()=>{
    let rowsToDelete=0;
    let startOfDeletion=0;
    for (let y = 0; y < gBArrayHeight; y++) {
        let completed=true;
        for (let x = 0; x < gBArrayWidth; x++) {
            let square=stoppedShapeArray[x][y];
            if(square===0 || (typeof square ==="undefined")){
                completed=false;
                break;
            }
        }
        if(completed){
            if(startOfDeletion===0) startOfDeletion=y;
            rowsToDelete++;
            for (let i = 0; i < gBArrayWidth; i++) {
                stoppedShapeArray[i][y]=0;
                gameBoardArray[i][y]=0;
                let coorX=coordinateArray[i][y].x;
                let coorY=coordinateArray[i][y].y;
                ctx.fillStyle="black";
                ctx.fillRect(coorX,coorY,21,21);                
            }
        }
    }
    if(rowsToDelete>0){
        score+=10;
        countForLevel+=1;
        ctx.fillStyle="black";
        ctx.fillRect(310,70,140,19)
        ctx.fillStyle="white";
        ctx.fillText(`${score.toString()}/${nextLevel}`,310,87);
        MoveAllRowsDown(rowsToDelete,startOfDeletion);
        if(countForLevel===3){
            level++;
            nextLevel+=30;
            ctx.fillStyle="black";
            ctx.fillRect(310,69,140,19)
            ctx.fillRect(310,135,140,19)
            ctx.fillStyle="white";
            ctx.font="21px Arial";
            ctx.fillText(`${score.toString()}/${nextLevel}`,310,87);
            ctx.fillText(level.toString(),310,150);
            countForLevel=0;
        }
    }
}

const MoveAllRowsDown=(rowsToDelete,startOfDeletion)=>{
    for (var i = startOfDeletion-1; i >=0; i--) {
        for (var x = 0; x < gBArrayWidth; x++) {
            var y2= i + rowsToDelete;
            var square=stoppedShapeArray[x][i];
            var nextSquare=stoppedShapeArray[x][y2];
            if(typeof square==="string"){
                nextSquare=square;
                gameBoardArray[x][y2]=1;
                stoppedShapeArray[x][y2]=square;
                let coorX=coordinateArray[x][y2].x
                let coorY=coordinateArray[x][y2].y
                ctx.fillStyle=nextSquare;
                ctx.fillRect(coorX,coorY,21,21);

                square=0;
                gameBoardArray[x][i]=0;
                stoppedShapeArray[x][i]=0;

                coorX=coordinateArray[x][i].x
                coorY=coordinateArray[x][i].y
                ctx.fillStyle="black";
                ctx.fillRect(coorX,coorY,21,21);
            }
        }
        
    }
}

const RotateTetromino=()=>{
    let newRotation=[];
    let tetrominoCopy=curTetromino;
    let curTetrominoBU;
    for (let i = 0; i < tetrominoCopy.length; i++) {
        curTetrominoBU=[...curTetromino];
        let x =tetrominoCopy[i][0];
        let y =tetrominoCopy[i][1];
        let newX=(GetLastSquareX() - y);
        let newY=x;
        newRotation.push([newX,newY]);        
    }
    DeleteTetromino();
    try{
        curTetromino=newRotation;
        DrawTetromino()
    }
    catch(e){
        if(e instanceof TypeError){
            curTetromino=curTetrominoBU;
            DeleteTetromino();
            DrawTetromino()
        }
    }
}
const GetLastSquareX=()=>{
     let lastX=0;
     for (let i = 0; i < curTetromino.length; i++) {
         let square = curTetromino[i];
         if(square[0]>lastX)
            lastX=square[0];   
     }
     return lastX;
}
window.setInterval(()=>{
    if(winOrLose!=="Game Over"){
        MoveTetrominoDown();
    }
},500)
