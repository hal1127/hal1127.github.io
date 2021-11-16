function Stack() {
  this.__a = new Array();
}

Stack.prototype.push = function(o) {
  this.__a.push(o);
}

Stack.prototype.pop = function() {
  if( this.__a.length > 0 ) {
    return this.__a.pop();
  }
  return null;
}

Stack.prototype.size = function() {
  return this.__a.length;
}

Stack.prototype.toString = function() {
  return '[' + this.__a.join(',') + ']';
}


let l_pipe = ["┗", "┏", "┓", "┛"]
let i_pipe = ["┃", "━"]
let t_pipe = ["┣", "┳", "┫", "┻"]
let pipes = {"1": l_pipe, "2": i_pipe, "3": t_pipe}

let l_pipe_connect = [["t", "r"], ["r", "b"], ["b", "l"], ["t", "l"]]
let i_pipe_connect = [["t", "b"], ["r", "l"]]
let t_pipe_connect = [["t", "r", "b"], ["r", "b", "l"],
                      ["t", "b", "l"], ["t", "r", "l"]]
let pipe_connects = {
  "1": l_pipe_connect,
  "2": i_pipe_connect,
  "3": t_pipe_connect
}

let game_board = [new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)]

function is_in_board(c, r)
{
  return 0 <= c && c < 5 && 0 <= r && r < 5
}

function connected_pipes(c, r)
{
  let c_dir = []
  let pipe = game_board[c][r]
  pipe_connects[pipe["pipe-type"]][parseInt(pipe["pipe-index"])].forEach(connect => {
    if (connect == "t" && is_in_board(c-1, r)) {
      let cnt_pipe = game_board[c-1][r]
      pipe_connects[cnt_pipe["pipe-type"]][parseInt(cnt_pipe["pipe-index"])].forEach(cnt => {
        if (cnt == "b") c_dir.push("t")
      })
    } else if (connect == "r" && is_in_board(c, r+1)) {
      let cnt_pipe = game_board[c][r+1]
      pipe_connects[cnt_pipe["pipe-type"]][parseInt(cnt_pipe["pipe-index"])].forEach(cnt => {
        if (cnt == "l") c_dir.push("r")
      })
    } else if (connect == "b" && is_in_board(c+1, r)) {
      let cnt_pipe = game_board[c+1][r]
      pipe_connects[cnt_pipe["pipe-type"]][parseInt(cnt_pipe["pipe-index"])].forEach(cnt => {
        if (cnt == "t") c_dir.push("b")
      })
    } else if (connect == "l" && is_in_board(c, r-1)) {
      let cnt_pipe = game_board[c][r-1]
      pipe_connects[cnt_pipe["pipe-type"]][parseInt(cnt_pipe["pipe-index"])].forEach(cnt => {
        if (cnt == "r") c_dir.push("l")
      })
    }
  })
  return c_dir
}

function connecting()
{
  let q = new Stack()
  let pos = [0, 0] // [col, row]
  let c = pos[0], r = pos[1]
  let pipe = game_board[c][r]

  let is_start_connect = false
  pipe_connects[pipe["pipe-type"]][parseInt(pipe["pipe-index"])].forEach(connect => {
    if (connect == "l") is_start_connect = true
  })
  if (!is_start_connect) return

  $(`#pipe-${c}-${r}`).css("color", "green")
  connected_pipes(c, r).forEach(cp => {
      if (cp == "t" && is_in_board(c-1, r)) {
        q.push([c-1, r])
        $(`#pipe-${c-1}-${r}`).css("color", "green")
      } else if (cp == "r" && is_in_board(c, r+1)) {
        q.push([c, r+1])
        $(`#pipe-${c}-${r+1}`).css("color", "green")
      } else if (cp == "b" && is_in_board(c+1, r)) {
        q.push([c+1, r])
        $(`#pipe-${c+1}-${r}`).css("color", "green")
      } else if (cp == "l" && is_in_board(c, r-1)) {
        q.push([c, r-1])
        $(`#pipe-${c}-${r-1}`).css("color", "green")
      }
    })
  let cnt = 0
  let bfs = [new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)]
  while (q.size() > 0) {
    pos = q.pop()
    c = pos[0]; r = pos[1]
    if (bfs[c][r] != null) continue
    bfs[c][r] = 1
    console.log(c, r)
    connected_pipes(c, r).forEach(cp => {
      if (cp == "t" && is_in_board(c-1, r)) {
        q.push([c-1, r])
        $(`#pipe-${c-1}-${r}`).css("color", "green")
      } else if (cp == "r" && is_in_board(c, r+1)) {
        q.push([c, r+1])
        $(`#pipe-${c}-${r+1}`).css("color", "green")
      } else if (cp == "b" && is_in_board(c+1, r)) {
        q.push([c+1, r])
        $(`#pipe-${c+1}-${r}`).css("color", "green")
      } else if (cp == "l" && is_in_board(c, r-1)) {
        q.push([c, r-1])
        $(`#pipe-${c}-${r-1}`).css("color", "green")
      }
    })
  }
}

function connect_color(dom, dir)
{
  let connects = pipe_connects[dom.attr("pipe-type")]
  let c = connects[parseInt(dom.attr("pipe-index"))]
  let is_connect = false
  c.forEach(e => {
    if (e == dir) {
      is_connect = true
    }
  })
  if (is_connect) dom.css("color", "green")
  else dom.css("color", "black")
}

let game = $("#game")
game.children().each(function(i, g) {
  $.each(g.children, function(j, h) {
    game_board[i][j] = {"pipe-type": "1", "pipe-index": "1"}
    $(h).attr("id", `pipe-${i}-${j}`)
    $(h).attr("row", i)
    $(h).attr("col", j)
    $(h).attr("pipe-type", "1")
    $(h).attr("pipe-index", "1")
    $(h).text(pipes[$(h).attr("pipe-type")][$(h).attr("pipe-index")])
    $(h).css("user-select", "none")

    $(h).on("click", function(e) {
      game.children().each(function(i, g) {
        $.each(g.children, function(j, h) {
          $(h).css("color", "black")
        })
      })

      let row = parseInt($(this).attr("row"))
      let col = parseInt($(this).attr("col"))
      let pipe_index = (parseInt($(h).attr("pipe-index"))+1)%l_pipe.length
      game_board[row][col]["pipe-index"] = pipe_index
      $(h).attr("pipe-index", pipe_index)
      $(h).text(l_pipe[pipe_index]);

      if ($(this).attr("row") == "0" && $(this).attr("col") == "0") {
        connect_color($(this), "l")
      }
      connecting()
    })
  })
})