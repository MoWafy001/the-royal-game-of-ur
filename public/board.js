class Board {
    width;
    blockSize;
    x; y;

    onBoard = [];
    constructor(x, y, width) {
        this.width = width;
        this.blockSize = width / 8;
        this.x = x; this.y = y;
    }
    isPossible(position) {
        const to = position + moves;
        if (to > 15) return false;

        if (si) console.log(to);

        for (const piece of this.onBoard) {
            if (to >= 5 && to <= 12) {
                if ((to == piece[0] && to == 8) || (to == piece[0] && p1_turn == piece[1])) return false;
            } else if (to < 15) {
                if (to == piece[0] && p1_turn == piece[1]) return false;
            }
        }
        return true;
    }

    displayScore() {
        document.getElementById("p1-score").textContent = "Player 1 : " + p1_end;
        document.getElementById("p2-score").textContent = "Player 2 : " + p2_end;
        document.getElementById("turn").textContent = `player ${!p1_turn ? 1 : 2}'s turn`;

        if (p1_end == 7 || p2_end == 7) {
            document.querySelector("canvas").classList.add("end")
            document.querySelector("#winner").style.zIndex = "999";
            document.querySelector("#winner").style.opacity = "1";
            if (p1_end == 7)
                document.querySelector("#winner").textContent = "Player 1";
            if (p2_end == 7)
                document.querySelector("#winner").textContent = "Player 2";
        }

    }

    isThereMoves() {
        if (!waiting) return true;
        for (const piece of this.onBoard) {
            if (this.isPossible(piece[0]) && piece[1] == p1_turn) {
                return true;
            }
        }

        if (p1_turn) {
            if (p1_pieces) {
                if (this.isPossible(0)) {
                    return true;
                }
            }
        } else {
            if (p2_pieces) {
                if (this.isPossible(0)) {
                    return true;
                }
            }
        }


        console.log("no possible moves");
        waiting = false;
        if (p1_turn == white) {
            socket.emit("move", -1, null, moves);
        }
        this.displayScore();
        p1_turn = !p1_turn;
        return false;
    }

    move(from, index = null) {
        if (p1_turn == white) {
            socket.emit("move", from, index, moves);
        }
        if (p1_turn) {
            if (from == 0)
                p1_pieces--;
            if (p1_pieces < 0) p1_pieces = 0;

        } else {
            if (from == 0)
                p2_pieces--;
            if (p2_pieces < 0) p2_pieces = 0;
        }

        const to = from + moves;

        if (from == 0)
            this.onBoard.push([to, p1_turn]);
        else
            this.onBoard[index][0] += moves;

        if (to >= 5 && to <= 12)
            for (const piece of this.onBoard) {
                if (to == piece[0] && p1_turn != piece[1]) {
                    this.onBoard = this.onBoard.filter((i) => !(i[0] == piece[0] && i[1] == piece[1]));
                    console.log("killed something", piece[0], (p1_turn) ? "black" : "white");
                    if (p1_turn)
                        p2_pieces++;
                    else
                        p1_pieces++;

                    break;
                }
            }


        // 4 8 14
        if ((to == 4 || to == 8 || to == 14) && moves != 0) {
            waiting == true;
            roseta = true;
            p1_turn = !p1_turn;
        } else {
            roseta = false;
        }

        if (to == 15) {
            this.onBoard = this.onBoard.filter((i) => !(i[0] == to && i[1] != p1_turn));
            if (p1_turn) {
                p1_end++;
            }
            else {
                p2_end++;
            }
        }
        this.displayScore();
    }

    show() {
        noFill();
        stroke(255);
        strokeWeight(1);

        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 8; c++) {
                const blockX = this.x + c * this.blockSize;
                const blockY = this.y + r * this.blockSize;

                if (!(r % 2 == 0 && (c == 4 || c == 5))) {

                    if (
                        mouseX >= blockX &&
                        mouseX <= blockX + this.blockSize &&
                        mouseY >= blockY &&
                        mouseY <= blockY + this.blockSize
                    ) {
                        fill(241, 242, 216);
                    }

                    rect(blockX, blockY, this.blockSize, this.blockSize);

                    // roseta
                    if ((r == 0 && c == 0) ||
                        (r == 2 && c == 0) ||
                        (r == 1 && c == 3) ||
                        (r == 0 && c == 6) ||
                        (r == 2 && c == 6)) {
                        textSize(this.blockSize)
                        text("x", blockX + this.blockSize / 5, blockY + this.blockSize * 0.77);
                    }

                    noFill();
                }

                // The ones outside ready to enter
                else if (c == 4) {
                    if ((p1_pieces && !r) || (p2_pieces && r)) {
                        fill(r ? 0 : 255);
                        if (
                            mouseX >= blockX &&
                            mouseX <= blockX + this.blockSize &&
                            mouseY >= blockY &&
                            mouseY <= blockY + this.blockSize
                        ) {
                            const possible = this.isPossible(0)
                            if (this.isThereMoves() && mouseIsPressed && waiting && !r == p1_turn && possible) {
                                waiting = false;
                                this.move(0);
                                p1_turn = !p1_turn;
                            }
                            fill(255, 200, 0)
                        }
                        textSize(10);
                        noStroke();
                        if (p1_turn == !r && waiting) {
                            strokeWeight(2);
                            stroke(255, 200, 0);
                            document.getElementById("turn").textContent = `player ${p1_turn ? 1 : 2}'s turn`;
                        }
                        ellipse(this.x + this.blockSize / 2 + c * this.blockSize,
                            this.y + this.blockSize / 2 + r * this.blockSize,
                            this.blockSize / 2,
                            this.blockSize / 2);
                        strokeWeight(1);

                        ((p1_pieces > 1 && !r) || (p2_pieces > 1 && r)) &&
                            text(`x${r ? p2_pieces : p1_pieces}`,
                                this.x + this.blockSize / 2 + this.blockSize / 3 + c * this.blockSize,
                                this.y + 5 + this.blockSize / 2 + r * this.blockSize)

                        noFill();
                        stroke(255);
                    }
                }

            }
        }

        // reder the pieces on the board
        for (const thing of this.onBoard) {
            fill(thing[1] ? 255 : 0);
            noStroke();

            if (thing[0] >= 5 && thing[0] <= 12) {
                const X = this.x + (thing[0] - 5) * this.blockSize;
                const Y = this.y + this.blockSize;
                ellipse(X + this.blockSize / 2,
                    Y + this.blockSize / 2,
                    this.blockSize / 2);

                const possible = this.isPossible(thing[0])
                if (
                    this.isThereMoves() &&
                    mouseIsPressed && waiting && thing[1] == p1_turn &&
                    mouseX >= X &&
                    mouseX <= X + this.blockSize &&
                    mouseY >= Y &&
                    mouseY <= Y + this.blockSize &&
                    possible
                ) {
                    waiting = false;
                    this.move(thing[0], this.onBoard.indexOf(thing));
                    p1_turn = !p1_turn;
                }

            }
            else if (thing[0] < 5) {
                const X = this.x + (4 - thing[0]) * this.blockSize;
                const Y = this.y + (thing[1] ? 0 : 2) * this.blockSize;
                ellipse(X + this.blockSize / 2,
                    Y + this.blockSize / 2,
                    this.blockSize / 2);

                const possible = this.isPossible(thing[0])
                if (
                    this.isThereMoves() &&
                    mouseIsPressed && waiting && thing[1] == p1_turn &&
                    mouseX >= X &&
                    mouseX <= X + this.blockSize &&
                    mouseY >= Y &&
                    mouseY <= Y + this.blockSize &&
                    possible
                ) {
                    waiting = false;
                    this.move(thing[0], this.onBoard.indexOf(thing));
                    p1_turn = !p1_turn;
                }
            }
            else if (thing[0] > 12 && thing[0] <= 14) {
                const X = this.x + (20 - thing[0]) * this.blockSize;
                const Y = this.y + (thing[1] ? 0 : 2) * this.blockSize;
                ellipse(X + this.blockSize / 2,
                    Y + this.blockSize / 2,
                    this.blockSize / 2);

                const possible = this.isPossible(thing[0])
                if (
                    this.isThereMoves() &&
                    mouseIsPressed && waiting && thing[1] == p1_turn &&
                    mouseX >= X &&
                    mouseX <= X + this.blockSize &&
                    mouseY >= Y &&
                    mouseY <= Y + this.blockSize &&
                    possible
                ) {
                    waiting = false;
                    this.move(thing[0], this.onBoard.indexOf(thing));
                    p1_turn = !p1_turn;
                }
            }
            // else if (thing[0] == 15) {
            //     const X = this.x + 5 * this.blockSize;
            //     const Y = this.y + (thing[1] ? 0 : 2) * this.blockSize;
            //     ellipse(X + this.blockSize / 2,
            //         Y + this.blockSize / 2,
            //         this.blockSize / 2);
            // }
        }

        for (let i = 0; i < p1_end; i++) {
            const X = this.x + 5 * this.blockSize;
            const Y = this.y;
            fill(255)
            stroke(0)
            strokeWeight(1)
            ellipse(X + 2 * i + this.blockSize / 3,
                Y + 2 * i + this.blockSize / 3,
                this.blockSize / 2);
            noStroke()
        }
        for (let i = 0; i < p2_end; i++) {
            const X = this.x + 5 * this.blockSize;
            const Y = this.y + 2 * this.blockSize;
            fill(0)
            stroke(255)
            strokeWeight(1)
            ellipse(X + 2 * i + this.blockSize / 3,
                Y + 2 * i + this.blockSize / 3,
                this.blockSize / 2);
            noStroke();
        }


    }
}