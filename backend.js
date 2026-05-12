const N = 8;

let board = empty(),
    humanBoard = null,
    humanCost = Infinity,
    aiBestSolution = null,
    aiBestCost = Infinity,
    isAIRunning = false;

const $ = id => document.getElementById(id);
const UI = {
    board: $("chessboard"),
    queenCount: $("queenCountDisplay"),
    humanCost: $("humanCostDisplay"),
    aiCost: $("aiCostDisplay"),
    winner: $("winnerDisplay"),
    runAI: $("runSABtn"),
    runSlow: $("runSlowBtn"),
    reset: $("startGameBtn"),
    compare: $("compareBtn"),
    toast: $("toast")
};

//utils
function empty() {
    return Array.from({ length: N }, () => Array(N).fill(0));
}
const count = () => board.flat().filter(Boolean).length;
const sleep = ms => new Promise(r => setTimeout(r, ms));

function showToast(msg, type="success"){
    UI.toast.className = `toast ${type} show`;
    UI.toast.innerHTML = (type==="success"?"✅":"⚠️")+msg;
    setTimeout(()=>UI.toast.classList.remove("show"),3000);
}
//cost
function calculateCost(b){
    const q=[];
    b.forEach((row,r)=>row.forEach((v,c)=>v&&q.push([r,c])));
    let a=0;
    for(let i=0;i<q.length;i++)
        for(let j=i+1;j<q.length;j++){
            const [r1,c1]=q[i],[r2,c2]=q[j];
            if(r1===r2||c1===c2||Math.abs(r1-r2)===Math.abs(c1-c2)) a++;
        }
    return a;
}
// humanworks
function clearHuman(){
    humanBoard=null; humanCost=Infinity;
    UI.humanCost.innerText="—";
}

function saveHumanSolution(){
    if(count()!==N) return clearHuman();
    humanBoard=board.map(r=>[...r]);
    humanCost=calculateCost(board);
    UI.humanCost.innerText=humanCost;
}


function renderBoard(){
    UI.board.innerHTML="";
    board.forEach((row,r)=>row.forEach((v,c)=>{
        const d=document.createElement("div");
        d.className=`cell ${(r+c)%2?"dark":""} ${v?"queen":""}`;
        d.onclick=()=>handleClick(r,c);
        UI.board.appendChild(d);
    }));

    const c=count();
    UI.queenCount.innerText=`${c} / ${N}`;
    if(c===N&&!humanBoard) saveHumanSolution();
    highlightAttacks();
}

//attacks
function highlightAttacks(){
    const cells=UI.board.children,q=[];
    board.forEach((row,r)=>row.forEach((v,c)=>v&&q.push({r,c,i:r*N+c})));

    for(let i=0;i<q.length;i++)
        for(let j=i+1;j<q.length;j++){
            const a=q[i],b=q[j];
            if(a.r===b.r||a.c===b.c||Math.abs(a.r-b.r)===Math.abs(a.c-b.c)){
                cells[a.i].classList.add("attacking");
                cells[b.i].classList.add("attacking");
            }
        }
}

//user
function handleClick(r,c){
    if(isAIRunning) return showToast("AI is running...","error");

    const q=count();
    if(board[r][c]) board[r][c]=0;
    else if(q<N) board[r][c]=1;
    else return showToast("Max 8 queens!","error");

    if(q!==N) clearHuman();
    renderBoard();
}

//SA
function randomState(){
    return Array.from({length:N},()=>Math.floor(Math.random()*N));
}

function costFromRows(r){
    let a=0;
    for(let i=0;i<N;i++)
        for(let j=i+1;j<N;j++)
            if(r[i]===r[j]||Math.abs(r[i]-r[j])===Math.abs(i-j)) a++;
    return a;
}

function getNeighbor(r){
    const n=[...r],c=Math.floor(Math.random()*N);
    let nr; do nr=Math.floor(Math.random()*N);
    while(nr===n[c]);
    n[c]=nr; return n;
}

function rowsToBoard(r){
    const b=empty();
    r.forEach((row,c)=>b[row][c]=1);
    return b;
}

async function runSimulatedAnnealing(slow=false){
    if(isAIRunning) return;

    isAIRunning=true; toggle(true);

    let T=500,rows=randomState(),
        cost=costFromRows(rows),
        best=[...rows],bestCost=cost,
        it=slow?5000:20000;

    for(let i=0;i<it&&T>0.01;i++){
        const n=getNeighbor(rows),
              nc=costFromRows(n),
              d=nc-cost;

        if(d<0||Math.random()<Math.exp(-d/T)){
            rows=n; cost=nc;
            if(cost<bestCost){bestCost=cost; best=[...rows];}

            if(slow){
                board=rowsToBoard(rows);
                renderBoard();
                await sleep(100);
            }
        }
        T*=0.997;
    }

    aiBestSolution=rowsToBoard(best);
    aiBestCost=bestCost;
    board=aiBestSolution.map(r=>[...r]);

    UI.aiCost.innerText=bestCost;
    renderBoard();

    isAIRunning=false; toggle(false);
    showToast(`AI finished (cost ${bestCost})`);
}

// game
function compare(){
    if(!humanBoard) return showToast("Place 8 queens first","error");
    if(!aiBestSolution) return showToast("Run AI first","error");

    let r = humanCost<aiBestCost?"🏆 HUMAN WINS":
            aiBestCost<humanCost?"🤖 AI WINS":"🤝 TIE";

    if(!humanCost&&!aiBestCost) r="✨ DOUBLE PERFECT";

    UI.winner.innerHTML=`${r}<br>Human: ${humanCost} | AI: ${aiBestCost}`;
}

function resetGame(){
    if(isAIRunning) return;
    board=empty(); aiBestSolution=null;
    clearHuman(); UI.aiCost.innerText="—";
    renderBoard();
}
function toggle(d){
    UI.runAI.disabled=d;
    UI.runSlow.disabled=d;
    UI.reset.disabled=d;
    UI.compare.disabled=d;
}
UI.runAI.onclick=()=>runSimulatedAnnealing(false);
UI.runSlow.onclick=()=>runSimulatedAnnealing(true);
UI.reset.onclick=resetGame;
UI.compare.onclick=compare;
renderBoard();