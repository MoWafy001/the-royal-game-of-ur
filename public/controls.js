const roll=()=>{
    const display = document.getElementById("chance");
    const chance = Math.round(Math.random()*16);
    let res;
    if (chance<=5)
        res = 2;
    else if (chance<=9)
        res = 1;
    else if (chance<=13)
        res = 3;
    else if (chance<=14)
        res = 0;
    else
        res = 4;
    
    display.textContent = res;
    return res;
}

const play = ()=>{
    if (waiting) return;
    if(p1_turn!=white) return;
    moves = roll();

    waiting = true;
    if (moves==0) {
        if(p1_turn==white){
            socket.emit("move", -1, null, moves);
        }
        waiting = false;p1_turn= !p1_turn;
    }
}