var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Board_instances, _Board_is_in_board, _Board_is_mutual_connect, _Board_array_equal;
{
    class Queue {
        constructor() {
            this._a = [];
        }
        push(q) {
            this._a.push(q);
        }
        pop() {
            if (this._a.length > 0) {
                return this._a.pop();
            }
            else {
                return null;
            }
        }
        size() {
            return this._a.length;
        }
    }
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
    let l_pipe_connect = [[[-1, 0], [0, 1]], [[0, 1], [1, 0]], [[1, 0], [0, -1]], [[-1, 0], [0, -1]]];
    let i_pipe_connect = [[[-1, 0], [1, 0]], [[0, 1], [0, -1]]];
    let t_pipe_connect = [[[-1, 0], [0, 1], [1, 0]], [[0, 1], [1, 0], [0, -1]],
        [[-1, 0], [1, 0], [0, -1]], [[-1, 0], [0, 1], [0, -1]]];
    let none_pipe_connect = [[]];
    let pipe_connects = {
        "1": l_pipe_connect,
        "2": i_pipe_connect,
        "3": t_pipe_connect,
        "4": none_pipe_connect
    };
    class Pipe {
        constructor(pt, pi, pp) {
            this.pipe = {
                "pipe-type": pt,
                "pipe-index": pi,
                "pipe-pos": pp
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
        get pos() {
            return this.pipe["pipe-pos"];
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
                        this.pipes[i][j] = new Pipe(type, index, [i, j]);
                    }
                    else {
                        this.pipes[i][j] = new Pipe(bps[i][j][0], bps[i][j][1], bps[i][j][2]);
                    }
                }
            }
        }
        // [c, r]のパイプとつながっているパイプの座標
        connected_pipes(c, r) {
            let p = [];
            for (const connect of this.pipes[c][r].connects) {
                if (__classPrivateFieldGet(this, _Board_instances, "m", _Board_is_mutual_connect).call(this, c, r, connect)) {
                    p.push([c + connect[0], r + connect[1]]);
                }
            }
            return p;
        }
        // 全体で入口からつながっているパイプを返す
        connecting_pipes() {
            let q = new Queue();
            let pos = [0, 0]; // [col, row]
            let c = pos[0], r = pos[1];
            let pipe = board.pipes[c][r];
            let bfs = [new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)];
            pipe.connects.forEach(connect => {
                if (__classPrivateFieldGet(this, _Board_instances, "m", _Board_array_equal).call(this, connect, [0, -1])) {
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
                    if (__classPrivateFieldGet(this, _Board_instances, "m", _Board_array_equal).call(this, c, [0, 1]))
                        goal = true;
                }
            }
            return [bfs, goal];
        }
        can_clear() {
            let self = this;
            let used = [];
            for (let i = 0; i < 5; i++)
                used.push(new Array(5).fill(false));
            function dfs(c, r, prec, prer) {
                let pipe = self.pipes[c][r];
                used[c][r] = true;
                for (let i = 0; i < pipes[pipe.type].length; i++) {
                    let is_ok = false;
                    for (const pc of pipe_connects[pipe.type][i]) {
                        if (__classPrivateFieldGet(self, _Board_instances, "m", _Board_array_equal).call(self, pc, [prec - c, prer - r])) {
                            is_ok = true;
                        }
                    }
                    if (!is_ok)
                        continue;
                    if (c == 4 && r == 4) {
                        for (const pc of pipe_connects[pipe.type][i]) {
                            if (__classPrivateFieldGet(self, _Board_instances, "m", _Board_array_equal).call(self, pc, [0, 1])) {
                                self.pipes[c][r].index = i.toString();
                                return [used, true];
                            }
                        }
                    }
                    self.pipes[c][r].index = i.toString();
                    for (const cp of pipe.connects) {
                        let [cpc, cpr] = cp;
                        let nxtc = cpc + c, nxtr = cpr + r;
                        if (__classPrivateFieldGet(self, _Board_instances, "m", _Board_is_in_board).call(self, nxtc, nxtr) && !used[nxtc][nxtr]) {
                            console.log(used);
                            if (dfs(nxtc, nxtr, c, r)[1])
                                return [used, true];
                        }
                    }
                }
                used[c][r] = false;
                return [used, false];
            }
            return dfs(0, 0, 0, -1);
        }
    }
    _Board_instances = new WeakSet(), _Board_is_in_board = function _Board_is_in_board(c, r) {
        return 0 <= c && c < 5 && 0 <= r && r < 5;
    }, _Board_is_mutual_connect = function _Board_is_mutual_connect(c, r, dir) {
        if (!__classPrivateFieldGet(this, _Board_instances, "m", _Board_is_in_board).call(this, c + dir[0], r + dir[1]))
            return false;
        for (const cnt of this.pipes[c + dir[0]][r + dir[1]].connects) {
            if (__classPrivateFieldGet(this, _Board_instances, "m", _Board_array_equal).call(this, [cnt[0] + dir[0], cnt[1] + dir[1]], [0, 0]))
                return true;
        }
        return false;
    }, _Board_array_equal = function _Board_array_equal(a, b) {
        if (a.length != b.length)
            return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] != b[i]) {
                return false;
            }
        }
        return true;
    };
    let board = new Board([new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)]);
    let game = $("#game");
    for (const [i, g] of game.children().get().entries()) {
        for (const [j, h] of g.childNodes.entries()) {
            if (j == 0 || j == 6)
                continue;
            let pipe = board.pipes[i][j - 1];
            let b = h.childNodes[0];
            $(b).attr("id", `pipe-${i}-${j - 1}`);
            $(b).attr("col", i);
            $(b).attr("row", j - 1);
            $(b).attr("pipe-type", pipe.type);
            $(b).attr("pipe-index", pipe.index);
            $(b).text(pipes[pipe.type][pipe.index]);
            $(b).css("user-select", "none");
            $(b).on("click", function () {
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
                            $(`#pipe-${k}-${l}`).css("color", "#0f0");
                        }
                    }
                }
                if (goal) {
                    $("#result").text("congratulations!!");
                }
                else {
                    $("#result").text("let's go!!");
                }
            });
        }
    }
    let [cps, goal] = board.connecting_pipes();
    for (let i = 0; i < cps.length; i++) {
        for (let j = 0; j < cps[0].length; j++) {
            if (cps[i][j] == true) {
                $(`#pipe-${i}-${j}`).css("color", "#0f0");
            }
        }
    }
    if (goal) {
        $("#result").text("congratulations!!");
    }
    else {
        $("#result").text("let's go!!");
    }
    $("#reload").on("click", function () {
        board = new Board([new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)]);
        for (const [i, g] of game.children().get().entries()) {
            for (const [j, h] of g.childNodes.entries()) {
                if (j == 0 || j == 6)
                    continue;
                let b = h.childNodes[0];
                let pipe = board.pipes[i][j - 1];
                $(b).attr("pipe-type", pipe.type);
                $(b).attr("pipe-index", pipe.index);
                $(b).text(pipes[pipe.type][pipe.index]);
                $(b).css("user-select", "none");
            }
        }
        for (let i = 0; i < board.pipes.length; i++) {
            for (let j = 0; j < board.pipes[0].length; j++) {
                $(`#pipe-${i}-${j}`).css("color", "white");
            }
        }
        let [cps, goal] = board.connecting_pipes();
        for (let i = 0; i < cps.length; i++) {
            for (let j = 0; j < cps[0].length; j++) {
                if (cps[i][j] == true) {
                    $(`#pipe-${i}-${j}`).css("color", "#0f0");
                }
            }
        }
        if (goal) {
            $("#result").text("congratulations!!");
        }
        else {
            $("#result").text("let's go!!");
        }
    });
    $("#can-clear").on("click", function () {
        for (let i = 0; i < board.pipes.length; i++) {
            for (let j = 0; j < board.pipes[0].length; j++) {
                $(`#pipe-${i}-${j}`).css("color", "white");
            }
        }
        let [used, _] = board.can_clear();
        let [cps, goal] = board.connecting_pipes();
        for (let i = 0; i < cps.length; i++) {
            for (let j = 0; j < cps[0].length; j++) {
                $(`#pipe-${i}-${j}`).text(board.pipes[i][j].shape);
                if (cps[i][j] == true) {
                    $(`#pipe-${i}-${j}`).css("color", "#0f0");
                }
                if (used[i][j] == true) {
                    $(`#pipe-${i}-${j}`).css("color", "#00f");
                }
            }
        }
        if (goal) {
            $("#result").text("I can clear it.");
        }
        else {
            $("#result").text("I can't clear it.");
        }
    });
}
