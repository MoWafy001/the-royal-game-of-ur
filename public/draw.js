// const BOARD_WIDTH = 2* WIDTH/3;
const BOARD_WIDTH = WIDTH-40;
const board = new Board(WIDTH/2-BOARD_WIDTH/2, 20, BOARD_WIDTH);

socket.on("new-move", (from, index, m)=>{
    p1_turn = !white;
    moves = m;
    if(from != -1)
    board.move(from, index);
    p1_turn = white;
    if(roseta) p1_turn = !white;
})

draw = ()=>{
    background(30, 39, 73);   
    board.show();

    // pieces
    noStroke();
    
}