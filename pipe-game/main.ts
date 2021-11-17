{
  class Queue {
    _a: any[]

    constructor() {
      this._a = []
    }

    push(q) {
      this._a.push(q)
    }

    pop() {
      if (this._a.length > 0) {
        return this._a.pop()
      } else {
        return null
      }
    }

    size(): number {
      return this._a.length
    }
  }

  let l_pipe = [
  " | |_"+"\n"+
  " |___"+"\n"+
  "     "
  ,
  "  ___"+"\n"+
  " |  _"+"\n"+
  " | | "
  ,
  "___  "+"\n"+
  "_  | "+"\n"+
  " | | "
  ,
  "_| | "+"\n"+
  "___| "+"\n"+
  "     "
  ]
  let i_pipe = [
  " | | "+"\n"+
  " | | "+"\n"+
  " | | "
  ,
  "_____"+"\n"+
  "_____"+"\n"+
  "     "
  ]
  let t_pipe = [
  " | |_"+"\n"+
  " |  _"+"\n"+
  " | | "
  ,
  "_____"+"\n"+
  "_   _"+"\n"+
  " | | "
  ,
  "_| | "+"\n"+
  "_  | "+"\n"+
  " | | "
  ,
  "_| |_"+"\n"+
  "_____"+"\n"+
  "     "]
  let none_pipe = [" "]
  let pipes = {"1": l_pipe, "2": i_pipe, "3": t_pipe, "4": none_pipe}

  let l_pipe_connect = [[[-1, 0], [0, 1]], [[0, 1], [1, 0]], [[1, 0], [0, -1]], [[-1, 0], [0, -1]]]
  let i_pipe_connect = [[[-1, 0], [1, 0]], [[0, 1], [0, -1]]]
  let t_pipe_connect = [[[-1, 0], [0, 1], [1, 0]], [[0, 1], [1, 0], [0, -1]],
                        [[-1, 0], [1, 0], [0, -1]], [[-1, 0], [0, 1], [0, -1]]]
  let none_pipe_connect = [[]]

  let pipe_connects = {
    "1": l_pipe_connect,
    "2": i_pipe_connect,
    "3": t_pipe_connect,
    "4": none_pipe_connect
  }

  class Pipe {
    pipe: {"pipe-type": string, "pipe-index": string, "pipe-pos": number[]}

    constructor(pt: string, pi: string, pp: number[]) {
      this.pipe = {
        "pipe-type": pt,
        "pipe-index": pi,
        "pipe-pos": pp
      }
    }

    get type() {
      return this.pipe["pipe-type"]
    }

    set type(pt) {
      this.pipe["pipe-type"] = pt
    }

    get index() {
      return this.pipe["pipe-index"]
    }

    set index(pi) {
      this.pipe["pipe-index"] = pi
    }

    get pos() {
      return this.pipe["pipe-pos"]
    }

    get shape() {
      return pipes[this.type][parseInt(this.index)]
    }

    rotate() {
      let pi_num = (parseInt(this.index)+1)%pipes[this.type].length
      let pi = pi_num.toString()
      this.index = pi
      return this
    }

    get connects(): number[][] {
      return pipe_connects[this.type][this.index]
    }
  }

  class Board {
    pipes: Pipe[][]

    constructor(bps: Pipe[][] | null) {
    this.pipes = [new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)]
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          if (bps[i][j] == null) {
            let type = Math.floor(Math.random() * 3 + 1).toString()
            let index = Math.floor(Math.random() * pipes[type].length).toString()
            this.pipes[i][j] = new Pipe(type, index, [i, j])
          } else {
            this.pipes[i][j] = new Pipe(bps[i][j][0], bps[i][j][1], bps[i][j][2])
          }
        }
      }
    }

    // [c, r]のパイプとつながっているパイプ
    connected_pipes(c, r) {
      let p = []
      for (const connect of this.pipes[c][r].connects) {
        if (this.#is_mutual_connect(c, r, connect)) {
          let cv = connect
          p.push([c+cv[0], r+cv[1]])
        }
      }
      return p
    }

    // 全体で入口からつながっているパイプを返す
    connecting_pipes(): [boolean[][], boolean] {
      let q = new Queue()
      let pos = [0, 0] // [col, row]
      let c = pos[0], r = pos[1]
      let pipe = board.pipes[c][r]

      let bfs: boolean[][] = [new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)]
      pipe.connects.forEach(connect => {
        if (this.#array_equal(connect, [0, -1])) {
          bfs[c][r] = true
          q.push([c, r])
        }
      })

      while (q.size() > 0) {
        pos = q.pop()
        c = pos[0]; r = pos[1]
        pipe = this.pipes[c][r]
        for (const cp of this.connected_pipes(c, r)) {
          let cc = cp[0], cr = cp[1]
          if (bfs[cc][cr] != null) continue
          bfs[cc][cr] = true
          q.push(cp)
        }
      }

      let goal = false
      if (bfs[4][4] == true) {
        for (const c of this.pipes[4][4].connects) {
          if (this.#array_equal(c, [0, 1])) goal = true
        }
      }

      return [bfs, goal]
    }

    can_clear() {
      let self = this
      function dfs(c, r) {
        let pipe = self.pipes[c][r]
        // console.log([c, r], [pipe.type, pipe.index])
        let [dfs, _] = this.connecting_pipes()
        if (c == 4 && r == 4) {
          if (dfs[4][4] == true) {
            for (const c of pipe.connects) {
              if (this.#array_equal(c, [0, 1])) return true
            }
          }
        }

        for (let i = 0; i < pipes[pipe.type].length; i++) {
          self.pipes[c][r].index = i.toString()
          for (const cp of self.connected_pipes(c, r)) {
            let [cpc, cpr] = cp
            let nxtc = c+cpc, nxtr = r+cpr
            if (self.#is_in_board(nxtc, nxtr)) {
              return dfs(nxtc, nxtr)
            }
          }
        }
      }
      return dfs(0, 0)
    }

    #is_in_board(c, r)
    {
      return 0 <= c && c < 5 && 0 <= r && r < 5
    }

    // [c, r]のパイプがdirの方向と相互接続しているか
    #is_mutual_connect(c, r, dir) {
      if (!this.#is_in_board(c+dir[0], r+dir[1])) return false
      for (const cnt of this.pipes[c+dir[0]][r+dir[1]].connects) {
        if (this.#array_equal([cnt[0]+dir[0], cnt[1]+dir[1]], [0, 0])) return true
      }
      return false
    }

    #array_equal(a: number[], b: number[]): boolean {
      if (a.length != b.length) return false
      for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) {
          return false
        }
      }
      return true
    }
  }

  let board = new Board([new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)])

  let game = $("#game")
  for (const [i, g] of game.children().get().entries()) {
    for (const [j, h] of g.childNodes.entries()) {
      if (j == 0 || j == 6) continue
      let pipe = board.pipes[i][j-1]
      let b = h.childNodes[0]

      $(b).attr("id", `pipe-${i}-${j-1}`)
      $(b).attr("col", i)
      $(b).attr("row", j-1)
      $(b).attr("pipe-type", pipe.type)
      $(b).attr("pipe-index", pipe.index)
      $(b).text(pipes[pipe.type][pipe.index])
      $(b).css("user-select", "none")

      $(b).on("click", function() {
        const c = parseInt($(this).attr("col")), r = parseInt($(this).attr("row"))

        for (let i = 0; i < board.pipes.length; i++) {
          for (let j = 0; j < board.pipes[0].length; j++) {
            $(`#pipe-${i}-${j}`).css("color", "white")
          }
        }
        board.pipes[c][r] = board.pipes[c][r].rotate()
        $(this).text(board.pipes[c][r].shape)

        let [cps, goal] = board.connecting_pipes()
        for (let k = 0; k < cps.length; k++) {
          for (let l = 0; l < cps[0].length; l++) {
            if (cps[k][l] == true) {
              $(`#pipe-${k}-${l}`).css("color", "#0f0")
            }
          }
        }
        if (goal) {
          $("#result").text("congratulations!!")
        } else {
          $("#result").text("let's go!!")
        }
      })
    }
  }

  let [cps, goal] = board.connecting_pipes()
  for (let i = 0; i < cps.length; i++) {
    for (let j = 0; j < cps[0].length; j++) {
      if (cps[i][j] == true) {
        $(`#pipe-${i}-${j}`).css("color", "#0f0")
      }
    }
  }

  if (goal) {
    $("#result").text("congratulations!!")
  } else {
    $("#result").text("let's go!!")
  }

  $("#reload").on("click", function() {
    board = new Board([new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)])
    for (const [i, g] of game.children().get().entries()) {
      for (const [j, h] of g.childNodes.entries()) {
        if (j == 0 || j == 6) continue
        let b = h.childNodes[0]
        let pipe = board.pipes[i][j-1]
        $(b).attr("pipe-type", pipe.type)
        $(b).attr("pipe-index", pipe.index)
        $(b).text(pipes[pipe.type][pipe.index])
        $(b).css("user-select", "none")
      }
    }
    for (let i = 0; i < board.pipes.length; i++) {
      for (let j = 0; j < board.pipes[0].length; j++) {
        $(`#pipe-${i}-${j}`).css("color", "white")
      }
    }

    let [cps, goal] = board.connecting_pipes()
    for (let i = 0; i < cps.length; i++) {
      for (let j = 0; j < cps[0].length; j++) {
        if (cps[i][j] == true) {
          $(`#pipe-${i}-${j}`).css("color", "#0f0")
        }
      }
    }

    if (goal) {
      $("#result").text("congratulations!!")
    } else {
      $("#result").text("let's go!!")
    }
  })
}