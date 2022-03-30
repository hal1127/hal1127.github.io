class Canvas {
  private stage: createjs.Stage = new createjs.Stage("view")
  private container: createjs.Container = new createjs.Container()

  private circles: Array<createjs.Shape> = []
  private circle: createjs.Shape = new createjs.Shape()
  private circles_v: Array<Array<number>> = []
  private circles_life: Array<number> = []
  private circles_size: Array<number> = []

  private count: number = 0

  private pos: Array<number> = [0, 0]

  private width: number = document.documentElement.clientWidth * devicePixelRatio
  private height: number = document.documentElement.clientHeight * devicePixelRatio

  constructor()
  {
    this.stage.addChild(this.container)
    createjs.Ticker.timingMode = createjs.Ticker.RAF

    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('view')
    canvas.width = this.width
    canvas.height = this.height

    canvas.style.width = String(canvas.width / devicePixelRatio) + "px"
    canvas.style.height = String(canvas.height / devicePixelRatio) + "px"

    // タッチ操作をサポートしているブラウザーならば
    if (createjs.Touch.isSupported() == true) {
      // タッチ操作を有効にします。
      createjs.Touch.enable(this.stage)
    }
    window.onload = () => {
      this.init()
    }
  }

  private init()
  {
    this.event()

    this.update()
  }

  private update()
  {
    createjs.Ticker.addEventListener('tick', () => {
      this.pos[0] = this.stage.mouseX
      this.pos[1] = this.stage.mouseY
      // this.pos[0] = this.width / 2
      // this.pos[1] = this.height / 2

      this.emit_circles()
      this.update_circles()

      this.stage.update()
    })
  }

  private event()
  {

  }

  private emit_circles()
  {
    // if (Math.random() < 0.5) return
    for (let i = 0; i < 1; i++) {
      let circle_v = [0, 0]
      let circle = new createjs.Shape()
      let circle_life = 150
      let max_size = 50*720/this.width;
      let circle_size = Math.random()*max_size
      if (circle_size >= max_size*0.995) circle_size *= 3

      if (Math.random() < 0.7) {
        circle.graphics
        .beginFill(createjs.Graphics.getHSL(this.count, 50, 50))
        .drawCircle(0, 0, circle_size)
        // 一定の確率でブラーをかける
        if (Math.random() < 0.2) {
          let blurFilter = new createjs.BlurFilter(2*circle_size, 2*circle_size, 2)
          circle.filters = [blurFilter]
          circle.cache(-1*circle_size, -1*circle_size, circle_size*2, circle_size*2)
        }
      } else {
        circle.graphics
        .beginStroke(createjs.Graphics.getHSL(this.count, 50, 50))
        .setStrokeStyle(1.5)
        .drawCircle(0, 0, circle_size)
      }
      circle.x = this.pos[0]
      circle.y = this.pos[1]
      circle.compositeOperation = "lighter"

      let angle = Math.random() * 2 * Math.PI
      circle_v[0] = Math.cos(angle)*Math.random()*2
      circle_v[1] = Math.sin(angle)*Math.random()*2

      this.count++

      this.circles_size.push(circle_size)
      this.circles_life.push(circle_life)
      this.circles_v.push(circle_v)
      this.circles.push(circle)
      this.container.addChild(circle)
    }
  }

  private update_circles()
  {
    for (let i = 0; i < this.circles.length; i++) {
      // 浮力
      this.circles_v[i][1] -= 0.05

      this.circles[i].x += this.circles_v[i][0]
      this.circles[i].y += this.circles_v[i][1]

      this.circles_life[i] -= 1

      if (this.circles_life[i] <= 10) {
        this.circles[i].alpha = this.circles_life[i] / 10

      }

      // if (this.circles[i].y > this.height - this.circles_size[i]) {
      //   this.circles[i].y = this.height - this.circles_size[i]
      //   this.circles_v[i][1] *= -0.7
      // }

      if (this.circles_life[i] <= 0 ||
        this.circles[i].y < 0 - this.circles_size[i]) {
        this.container.removeChild(this.circles[i])
        this.circles.splice(i, 1)
        this.circles_v.splice(i, 1)
        this.circles_life.splice(i, 1)
        this.circles_size.splice(i, 1)
      }
    }
  }
}

let canvas = new Canvas()
