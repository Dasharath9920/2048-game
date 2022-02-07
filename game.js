const matrix = document.getElementById('Cmatrix');
const background = document.getElementById('matrix');
const btn = document.getElementById('btn');
const score = document.getElementById("score");
const best = document.getElementById("bestScore");
const Status = document.getElementById("status");

let arr = new Array(16).fill(0);
const colors = ["rgb(105, 101, 101);","rgb(247, 245, 238)","rgb(231,226,207)","rgb(248,195,140)","rgb(248,172,140)","rgb(237,126,100)","rgb(242,86,74)","rgb(222,202,140)","rgb(241,212,126)","rgb(201,225,152)","rgb(213,243,119)","rgb(174,220,143)"];
const idStore = {};
let id = 0, game_over = false, max_cell = 0;
let curr_score = 0,levelUp = true;

// fill the background grid with empty cells
for(let i = 0; i < 16; i++){
   background.innerHTML += `<div class="temp"><div/>`; 
   idStore[i] = '-1';  
}

// storing best scores in local storage
if(localStorage.getItem("best_score")==null)
   localStorage.setItem("best_score",0);
else
   best.textContent = JSON.parse(localStorage.getItem("best_score"));

let prevBestScore = JSON.parse(localStorage.getItem("best_score"));

// function that triggers the initiation
startGame = () => {
   addNewCell();
   addNewCell();
   document.onkeydown = checkKey;
};

// function for keyboard input
checkKey = (e) => {
   e = e || window.event;
   if(parseInt(e.keyCode)>=49 && parseInt(e.keyCode)<=52){
      if(e.keyCode == '49'){
         leftMove();
      }else if(e.keyCode == '51'){
         topMove();
      }else if(e.keyCode == '50'){
         rightMove();
      }else if(e.keyCode == '52'){
         bottomMove();
      }
      // when no more cells left, gameOver function will be invoked
      if(game_over){
         gameOver();
      }
   }
};

// function when key '1' pressed to move left
leftMove = () => {
   console.log("left key pressed");
   let isMovePossible = false;

   // Checking each row
   for(let i = 0; i < 4; i++){
      let cells = [],isMergePossible = false,n = 0; // cells array for storing all movable cells in each row
      for(let j = 0; j < 4; j++){
         let pos = i*4+j;
         if(arr[pos]){
            n++;
            cells.push(pos);
            if(n>1 && arr[cells[n-1]]==arr[cells[n-2]])
               isMergePossible = true;
         }
      }
      if((isMergePossible) || (cells.length > 0 && cells.length<4)){
         for(let j = 0,ind = 0,id2 = 0; j < 4; j++){
            let pos = i*4+j;
            // moving cells to left when an empty space is found
            if(ind<cells.length && arr[pos]==0){
               isMovePossible = true;
               arr[pos] = arr[cells[ind]];
               arr[cells[ind]] = 0;
               idStore[pos] = idStore[cells[ind]];
            }
            // fill remaining cells as empty
            if(ind>=cells.length){
               arr[pos] = 0;
               idStore[pos] = '-1';
            }
            else
               ind++;
            
            // merging cells
            if(arr[pos]!=0 && j>id2 && arr[pos]==arr[pos-1]){
               isMovePossible = true;
               curr_score += arr[pos]*2;
               animateCell(pos-1);
               arr[pos-1] *= 2;
               max_cell = Math.max(max_cell,arr[pos-1]);
               arr[pos] = 0;
               matrix.removeChild(document.getElementById(idStore[pos]));
               idStore[pos] = '-1';
               id2 = j--;
            }
         }
      }
   }
   if(isMovePossible){
      addNewCell();
   }
};

rightMove = () => {
   console.log("right key pressed");
   let isPossible = false;
   // checking each row
   for(let i = 3; i >= 0; i--){
      let cells = [],isMergePossible = false,n = 0;  // cells array for storing all movable cells in each row
      for(let j = 3; j >= 0; j--){
         let pos = i*4+j;
         if(arr[pos]){
            n++;
            cells.push(pos);
            if(n>1 && arr[cells[n-1]]==arr[cells[n-2]])
               isMergePossible = true;
         }
      }
      if((isMergePossible) || (cells.length > 0 && cells.length<4)){
         for(let j = 3,ind = 0,id2 = 3; j >= 0; j--){
            let pos = i*4+j;
            // moving cells to right when an empty space is found
            if(ind<cells.length && arr[pos]==0){
               isPossible = true;
               arr[pos] = arr[cells[ind]];
               arr[cells[ind]] = 0;
               idStore[pos] = idStore[cells[ind]];
            }
            // fill remaining cells as empty
            if(ind>=cells.length){
               arr[pos] = 0;
               idStore[pos] = '-1';
            }
            else
               ind++;
            // merging cells
            if(arr[pos]!=0 && j<id2 && arr[pos]==arr[pos+1]){
               isPossible = true;
               animateCell(pos+1);
               curr_score += arr[pos]*2;
               arr[pos+1] *= 2;
               max_cell = Math.max(max_cell,arr[pos+1]);
               arr[pos] = 0;
               matrix.removeChild(document.getElementById(idStore[pos]));
               idStore[pos] = '-1';
               id2 = j++;
            }
         }
      }
   }
   if(isPossible){
      addNewCell();
   }
};

topMove = () => {
   console.log("top key pressed");
   let isPossible = false;
   // checking each column
   for(let j = 0; j < 4; j++){
      let cells = [],isMergePossible = false,n = 0; // cells array for storing all movable cells in each row
      for(let i = 0; i < 4; i++){
         let pos = i*4+j;
         if(arr[pos]){
            n++;
            cells.push(pos);
            if(n>1 && arr[cells[n-1]]==arr[cells[n-2]])
               isMergePossible = true;
         }
      }
      if((isMergePossible) || (cells.length > 0 && cells.length<4)){
         for(let i = 0,ind = 0,id2 = 0; i < 4; i++){
            let pos = i*4+j;
            // moving cells to top when an empty space is found
            if(ind<cells.length && arr[pos]==0){
               isPossible = true;
               arr[pos] = arr[cells[ind]];
               arr[cells[ind]] = 0;
               idStore[pos] = idStore[cells[ind]];
            }
            // fill remaining cells as empty
            if(ind>=cells.length){
               arr[pos] = 0;
               idStore[pos] = '-1';
            }
            else
               ind++;
            // merging cells
            if(arr[pos]!=0 && i>id2 && arr[pos]==arr[pos-4]){
               isPossible = true;
               curr_score += arr[pos]*2;
               animateCell(pos-4);
               arr[pos-4] *= 2;
               max_cell = Math.max(max_cell,arr[pos-4]);
               arr[pos] = 0;
               matrix.removeChild(document.getElementById(idStore[pos]));
               idStore[pos] = '-1';
               id2 = i--;
            }
         }
      }
   }
   if(isPossible){
      addNewCell();
   }
};

bottomMove = () => {
   console.log("bottom key pressed");
   let isPossible = false;
   // checking each column
   for(let j = 0; j < 4; j++){
      let cells = [],isMergePossible = false,n = 0; // cells array for storing all movable cells in each row
      for(let i = 3; i >= 0; i--){
         let pos = i*4+j;
         if(arr[pos]){
            n++;
            cells.push(pos);
            if(n>1 && arr[cells[n-1]]==arr[cells[n-2]])
               isMergePossible = true;
         }
      }
      if((isMergePossible) || (cells.length > 0 && cells.length<4)){
         for(let i = 3,ind = 0,id2 = 3; i >= 0; i--){
            let pos = i*4+j;
            // moving cells to bottom when an empty space is found
            if(ind<cells.length && arr[pos]==0){
               isPossible = true;
               arr[pos] = arr[cells[ind]];
               arr[cells[ind]] = 0;
               idStore[pos] = idStore[cells[ind]];
            }
            // fill remaining cells as empty
            if(ind>=cells.length){
               arr[pos] = 0;
               idStore[pos] = '-1';
            }
            else
               ind++;
            // merging cells
            if(arr[pos]!=0 && i<id2 && arr[pos]==arr[pos+4]){
               isPossible = true;
               curr_score += arr[pos]*2;
               arr[pos+4] *= 2;
               max_cell = Math.max(max_cell,arr[pos+4]);
               animateCell(pos+4);
               arr[pos] = 0;
               matrix.removeChild(document.getElementById(idStore[pos]));
               idStore[pos] = '-1';
               id2 = i++;
            }
         }
      }
   }
   if(isPossible){
      addNewCell();
   }
};

resetGame = () => {
   for(let i = 0; i < 16; i++){
      if(idStore[i]!='-1'){
         matrix.removeChild(document.getElementById(idStore[i])); // remove all cells
         idStore[i] = '-1';
      }
   }
   game_over = false;
   arr.fill(0);
   id = 0;
   updateMatrix();
   curr_score = 0;
};

const addNewCell = () => {
   let pos = getRandomPosition();
   if(game_over){
      gameOver();
      return;
   }
   console.log(`new cell position: (${(Math.floor)(pos/4)+1},${pos%4+1})`);
   arr[pos] = (Math.floor)(Math.random()*10)<1? 4: 2; // generating new value with probablity of (9:1) for 2 and 4
   matrix.innerHTML += `<div class="temp2" id = "${id}"><div/>`;
   idStore[pos] = String(id);
   animateCell(pos,'newBorn'); // animation for new cell
   id++;
   updateMatrix();
};

const updateMatrix = () => {
   for(let i = 0; i < 16; i++){
      if(arr[i]){
         let t = document.getElementById(idStore[i]);
         setTimeout(() => {
            t.style.left = `${122*(i%4)+6}px`;
            t.style.top = `${122*(Math.floor)(i/4)+6}px`;
            t.textContent = arr[i];
            t.style.backgroundColor = colors[Math.log2(arr[i])]; // color of cell based on value
         },0); 
      }
      score.textContent = curr_score;
      // if current score is greater than best score, update it
      if(prevBestScore<curr_score){
         best.textContent = curr_score;
         localStorage.setItem("best_score",JSON.stringify(curr_score));

         if(levelUp){
            Status.style.display = "flex";
            document.querySelector('.gameover').textContent = "Fantastic !!!";
            document.querySelector('.status1').textContent = "You Beat Your High Score";
            setTimeout(() => {
               Status.style.display = "none";
            },1000);
            levelUp = false;
         }
      }
      // when one of the cell reaches 2048
      if(max_cell>=2048){ 
         document.querySelector('.gameover').textContent = "Congratulations";
         document.querySelector('.status1').textContent = "You Nailed It";
         document.querySelector('.status2').textContent = `Your Score: ${curr_score}`;
         game_over = true;
      }
   }
};

const getRandomPosition = () => {
   let pos = (Math.floor)(Math.random()*16);
   let cnt = 0;
   while(arr[pos]!=0 && (++cnt)<=16)
      pos = (pos+5)%16;
   if(cnt==17)
      game_over = true;
   return pos;
};

// animation for cell merging
function animateCell(pos,animate = 'animate'){
   let t = document.getElementById(idStore[pos]);
   t.style.animation = `${animate} .3s 1`;  
   setTimeout(() =>{
      document.getElementById(idStore[pos]).style.animation = '';
   },300);
   
};

function gameOver(){
   Status.style.display = "flex";
   document.querySelector('.status1').textContent = `Score: ${curr_score}`;
   document.querySelector('.status2').textContent = `High Score: ${JSON.parse(localStorage.getItem('best_score'))}`;
};

btn.addEventListener("click",function(){
   resetGame();  // reset data before starting new game
   startGame();
});
