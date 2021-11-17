var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Board_instances, _Board_is_in_board, _Board_upper_pipe, _Board_right_pipe, _Board_lower_pipe, _Board_left_pipe, _Board_is_mutual_connect, _Board_connects_vec;
import $ from 'jQuery';
{
    function Stack() {
        this.__a = new Array();
    }
    Stack.prototype.push = function (o) {
        this.__a.push(o);
    };
    Stack.prototype.pop = function () {
        if (this.__a.length > 0) {
            return this.__a.pop();
        }
        return null;
    };
    Stack.prototype.size = function () {
        return this.__a.length;
    };
    let l_pipe = [
        " | |_" + "\n" +
            " |___" + "\n" +
            "     ",
        "  ___" + "\n" +
            " |  _" + "\n" +
            " | | ",
        "___  " + "\n" +
            "_  | " + "\n" +
            " | | ",
        "_| | " + "\n" +
            "___| " + "\n" +
            "     "
    ];
    let i_pipe = [
        " | | " + "\n" +
            " | | " + "\n" +
            " | | ",
        "_____" + "\n" +
            "_____" + "\n" +
            "     "
    ];
    let t_pipe = [
        " | |_" + "\n" +
            " |  _" + "\n" +
            " | | ",
        "_____" + "\n" +
            "_   _" + "\n" +
            " | | ",
        "_| | " + "\n" +
            "_  | " + "\n" +
            " | | ",
        "_| |_" + "\n" +
            "_____" + "\n" +
            "     "
    ];
    let none_pipe = [" "];
    let pipes = { "1": l_pipe, "2": i_pipe, "3": t_pipe, "4": none_pipe };
    let l_pipe_connect = [["u", "r"], ["r", "lw"], ["lw", "l"], ["u", "l"]];
    let i_pipe_connect = [["u", "lw"], ["r", "l"]];
    let t_pipe_connect = [["u", "r", "lw"], ["r", "lw", "l"],
        ["u", "lw", "l"], ["u", "r", "l"]];
    let none_pipe_connect = [[]];
    let pipe_connects = {
        "1": l_pipe_connect,
        "2": i_pipe_connect,
        "3": t_pipe_connect,
        "4": none_pipe_connect
    };
    class Pipe {
        constructor(pt, pi) {
            this.pipe = {
                "pipe-type": pt,
                "pipe-index": pi
            };
        }
        get type() {
            return this.pipe["pipe-type"];
        }
        set type(pt) {
            this.pipe["pipe-type"] = pt;
        }
        get index() {
            return this.pipe["pipe-index"];
        }
        set index(pi) {
            this.pipe["pipe-index"] = pi;
        }
        get shape() {
            return pipes[this.type][parseInt(this.index)];
        }
        rotate() {
            let pi_num = (parseInt(this.index) + 1) % pipes[this.type].length;
            let pi = pi_num.toString();
            this.index = pi;
            return this;
        }
        get connects() {
            return pipe_connects[this.type][this.index];
        }
    }
    class Board {
        constructor(bps) {
            _Board_instances.add(this);
            this.pipes = [new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)];
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    if (bps[i][j] == null) {
                        let type = Math.floor(Math.random() * 3 + 1).toString();
                        let index = Math.floor(Math.random() * pipes[type].length).toString();
                        this.pipes[i][j] = new Pipe(type, index);
                    }
                    else {
                        this.pipes[i][j] = new Pipe(bps[i][j][0], bps[i][j][1]);
                    }
                }
            }
        }
        // [c, r]のパイプとつながっているパイプ
        connected_pipes(c, r) {
            if (this.pipes[c][r].type == "4")
                return [];
            let p = [];
            for (const connect of this.pipes[c][r].connects) {
                if (__classPrivateFieldGet(this, _Board_instances, "m", _Board_is_mutual_connect).call(this, c, r, connect)) {
                    let cv = __classPrivateFieldGet(this, _Board_instances, "m", _Board_connects_vec).call(this, connect);
                    p.push([c + cv[0], r + cv[1]]);
                }
            }
            return p;
        }
        // 全体で入口からつながっているパイプを返す
        connecting_pipes() {
            let q = new Stack();
            let pos = [0, 0]; // [col, row]
            let c = pos[0], r = pos[1];
            let pipe = board.pipes[c][r];
            let bfs = [new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)];
            pipe.connects.forEach(connect => {
                if (connect == "l") {
                    bfs[c][r] = true;
                    q.push([c, r]);
                }
            });
            while (q.size() > 0) {
                pos = q.pop();
                c = pos[0];
                r = pos[1];
                pipe = this.pipes[c][r];
                for (const cp of this.connected_pipes(c, r)) {
                    let cc = cp[0], cr = cp[1];
                    if (bfs[cc][cr] != null)
                        continue;
                    bfs[cc][cr] = true;
                    q.push(cp);
                }
            }
            let goal = false;
            if (bfs[4][4] == true) {
                for (const c of this.pipes[4][4].connects) {
                    if (c == "r")
                        goal = true;
                }
            }
            return [bfs, goal];
        }
        can_clear() {
            let self = this;
            function dfs(c, r) {
                let pipe = self.pipes[c][r];
                // console.log([c, r], [pipe.type, pipe.index])
                let [dfs, _] = this.connecting_pipes();
                if (c == 4 && r == 4) {
                    if (dfs[4][4] == true) {
                        for (const c of pipe.connects) {
                            if (c == "r")
                                return true;
                        }
                    }
                }
                for (let i = 0; i < pipes[pipe.type].length; i++) {
                    self.pipes[c][r].index = i.toString();
                    for (const cp of self.connected_pipes(c, r)) {
                        let [cpc, cpr] = cp;
                        let nxtc = c + cpc, nxtr = r + cpr;
                        if (__classPrivateFieldGet(self, _Board_instances, "m", _Board_is_in_board).call(self, nxtc, nxtr)) {
                            return dfs(nxtc, nxtr);
                        }
                    }
                }
            }
            return dfs(0, 0);
        }
    }
    _Board_instances = new WeakSet(), _Board_is_in_board = function _Board_is_in_board(c, r) {
        return 0 <= c && c < 5 && 0 <= r && r < 5;
    }, _Board_upper_pipe = function _Board_upper_pipe(c, r) {
        let up = this.pipes[c - 1][r];
        return up;
    }, _Board_right_pipe = function _Board_right_pipe(c, r) {
        let rp = this.pipes[c][r + 1];
        return rp;
    }, _Board_lower_pipe = function _Board_lower_pipe(c, r) {
        let lwp = this.pipes[c + 1][r];
        return lwp;
    }, _Board_left_pipe = function _Board_left_pipe(c, r) {
        let lp = this.pipes[c][r - 1];
        return lp;
    }, _Board_is_mutual_connect = function _Board_is_mutual_connect(c, r, dir) {
        if (dir == "u" && __classPrivateFieldGet(this, _Board_instances, "m", _Board_is_in_board).call(this, c - 1, r)) {
            // if (this.#upper_pipe(c, r).type == "4") return false
            for (const cnt of __classPrivateFieldGet(this, _Board_instances, "m", _Board_upper_pipe).call(this, c, r).connects) {
                if (cnt == "lw")
                    return true;
            }
        }
        else if (dir == "r" && __classPrivateFieldGet(this, _Board_instances, "m", _Board_is_in_board).call(this, c, r + 1)) {
            // if (this.#right_pipe(c, r).type == "4") return false
            for (const cnt of __classPrivateFieldGet(this, _Board_instances, "m", _Board_right_pipe).call(this, c, r).connects) {
                if (cnt == "l")
                    return true;
            }
        }
        else if (dir == "lw" && __classPrivateFieldGet(this, _Board_instances, "m", _Board_is_in_board).call(this, c + 1, r)) {
            // if (this.#lower_pipe(c, r).type == "4") return false
            for (const cnt of __classPrivateFieldGet(this, _Board_instances, "m", _Board_lower_pipe).call(this, c, r).connects) {
                if (cnt == "u")
                    return true;
            }
        }
        else if (dir == "l" && __classPrivateFieldGet(this, _Board_instances, "m", _Board_is_in_board).call(this, c, r - 1)) {
            // if (this.#left_pipe(c, r).type == "4") return false
            for (const cnt of __classPrivateFieldGet(this, _Board_instances, "m", _Board_left_pipe).call(this, c, r).connects) {
                if (cnt == "r")
                    return true;
            }
        }
        return false;
    }, _Board_connects_vec = function _Board_connects_vec(c) {
        if (c == "u")
            return [-1, 0];
        else if (c == "r")
            return [0, 1];
        else if (c == "lw")
            return [1, 0];
        else if (c == "l")
            return [0, -1];
    };
    // let board = new Board([[["3", "0"],["2", "0"],,,], new Array(5), new Array(5), new Array(5), new Array(5)])
    let board = new Board([new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)]);
    let game = $("#game");
    game.children().each(function (i, g) {
        $.each(g.children, function (j, h) {
            if (j != 0 && j != 6) {
                let pipe = board.pipes[i][j - 1];
                $(h).attr("id", `pipe-${i}-${j - 1}`);
                $(h).attr("col", i);
                $(h).attr("row", j - 1);
                $(h).attr("pipe-type", pipe.type);
                $(h).attr("pipe-index", pipe.index);
                $(h).text(pipes[pipe.type][pipe.index]);
                $(h).css("user-select", "none");
                $(h).on("click", function () {
                    const c = parseInt($(this).attr("col")), r = parseInt($(this).attr("row"));
                    for (let i = 0; i < board.pipes.length; i++) {
                        for (let j = 0; j < board.pipes[0].length; j++) {
                            $(`#pipe-${i}-${j}`).css("color", "white");
                        }
                    }
                    board.pipes[c][r] = board.pipes[c][r].rotate();
                    $(this).text(board.pipes[c][r].shape);
                    let [cps, goal] = board.connecting_pipes();
                    for (let k = 0; k < cps.length; k++) {
                        for (let l = 0; l < cps[0].length; l++) {
                            if (cps[k][l] == true) {
                                $(`#pipe-${k}-${l}`).css("color", "green");
                            }
                        }
                    }
                    if (goal) {
                        $("#result").text("clear!!");
                    }
                    else {
                        $("#result").text("let's go!!");
                    }
                });
            }
        });
    });
    let [cps, goal] = board.connecting_pipes();
    for (let i = 0; i < cps.length; i++) {
        for (let j = 0; j < cps[0].length; j++) {
            if (cps[i][j] == true) {
                $(`#pipe-${i}-${j}`).css("color", "green");
            }
        }
    }
    if (goal) {
        $("#result").text("clear!!");
    }
    else {
        $("#result").text("let's go!!");
    }
    $("#reload").on("click", function () {
        board = new Board([new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)]);
        game.children().each(function (i, g) {
            $(g).children().each(function (j, h) {
                if (j != 0 && j != 6) {
                    let pipe = board.pipes[i][j - 1];
                    $(h).attr("pipe-type", pipe.type);
                    $(h).attr("pipe-index", pipe.index);
                    $(h).text(pipes[pipe.type][pipe.index]);
                    $(h).css("user-select", "none");
                }
            });
        });
        for (let i = 0; i < board.pipes.length; i++) {
            for (let j = 0; j < board.pipes[0].length; j++) {
                $(`#pipe-${i}-${j}`).css("color", "white");
            }
        }
        let [cps, goal] = board.connecting_pipes();
        for (let i = 0; i < cps.length; i++) {
            for (let j = 0; j < cps[0].length; j++) {
                if (cps[i][j] == true) {
                    $(`#pipe-${i}-${j}`).css("color", "green");
                }
            }
        }
        if (goal) {
            $("#result").text("clear!!");
        }
        else {
            $("#result").text("let's go!!");
        }
    });
}
