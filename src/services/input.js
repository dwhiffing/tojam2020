export default class InputService {
  constructor(scene) {
    this.scene = scene
    const DISTX = 50
    const DISTY = 70
    const { height, width } = this.scene.cameras.main
    this.jump = this.jump.bind(this)
    this.restart = this.restart.bind(this)
    this.keyUp = this.keyUp.bind(this)
    this.leftDown = this.leftDown.bind(this)
    this.rightDown = this.rightDown.bind(this)
    this.cleanup = this.cleanup.bind(this)
    this.update = this.update.bind(this)
    this.upDown = this.upDown.bind(this)
    this.downDown = this.downDown.bind(this)
    this.direction = 0
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const makeButton = (x, y, key, callback, scale = 0.7) => {
      const image = this.scene.add.image(x, y, key)
      image
        .setScale(scale)
        .setInteractive()
        .setScrollFactor(0)
        .setDepth(10)
        .on('pointerdown', callback)
      return image
    }
    if (isMobile) {
      this.leftTouch = makeButton(DISTX, height - DISTY, 'left', this.leftDown)
      this.upTouch = makeButton(
        DISTX * 1.75,
        height - DISTY * 1.6,
        'up',
        this.upDown,
      )
      this.downTouch = makeButton(
        DISTX * 1.75,
        height - DISTY + DISTY * 0.6,
        'down',
        this.downDown,
      )
      this.rightTouch = makeButton(
        DISTX * 2.5,
        height - DISTY,
        'right',
        this.rightDown,
      )
      this.leftTouch.on('pointerup', this.keyUp)
      this.downTouch.on('pointerup', this.keyUp)
      this.upTouch.on('pointerup', this.keyUp)
      this.rightTouch.on('pointerup', this.keyUp)
      makeButton(width - DISTX, height - DISTY, 'jump', this.jump)
      makeButton(width - DISTX * 2.5, height - DISTY, 'swap', this.scene.swap)
      makeButton(width - DISTX / 1.5, DISTY / 2, 'restart', this.restart, 0.5)
    }
    makeButton(DISTX / 1.5, DISTY / 2, 'exit', this.exit)
    this.cursors = this.scene.input.keyboard.createCursorKeys()
    this.spaceKey = this.scene.input.keyboard.addKey('SPACE')
    this.zKey = this.scene.input.keyboard.addKey('Z')
    this.xKey = this.scene.input.keyboard.addKey('X')
    this.rKey = this.scene.input.keyboard.addKey('R')
    this.lastKey = this.scene.input.keyboard.addKey('N')
    this.nextKey = this.scene.input.keyboard.addKey('M')
    this.cursors.up.addListener('down', this.upDown)
    this.cursors.left.addListener('down', this.leftDown)
    this.cursors.right.addListener('down', this.rightDown)
    this.cursors.down.addListener('down', this.downDown)
    this.cursors.down.addListener('up', this.keyUp)
    this.cursors.up.addListener('up', this.keyUp)
    this.cursors.left.addListener('up', this.keyUp)
    this.cursors.right.addListener('up', this.keyUp)
    this.zKey.addListener('down', this.jump)
    this.spaceKey.addListener('down', this.jump)
    this.xKey.addListener('down', this.scene.swap)
    this.lastKey.addListener('down', this.scene.prevLevel)
    this.nextKey.addListener('down', this.scene.nextLevel)
    this.rKey.addListener('down', this.restart)
  }

  leftDown() {
    this.direction = -1
  }

  rightDown() {
    this.direction = 1
  }

  upDown() {
    this.direction = 2
  }

  downDown() {
    this.direction = 3
  }

  keyUp() {
    this.direction = 0
  }

  jump() {
    this.scene.activePlayer.action()
  }

  restart() {
    this.scene.scene.start('Game', { levelNumber: this.scene.levelNumber })
  }

  exit() {
    this.scene.scene.start('Menu')
  }

  cleanup() {
    this.cursors.up.removeListener('down')
    this.cursors.left.removeListener('down')
    this.cursors.right.removeListener('down')
    this.cursors.down.removeListener('down')
    this.cursors.down.removeListener('up')
    this.cursors.up.removeListener('up')
    this.cursors.left.removeListener('up')
    this.cursors.right.removeListener('up')
    this.zKey.removeListener('down')
    this.spaceKey.removeListener('down')
    this.xKey.removeListener('down')
    this.lastKey.removeListener('down')
    this.nextKey.removeListener('down')
    this.rKey.removeListener('down')
  }

  update() {
    if (this.direction > 1) {
      this.scene.activePlayer.climb(this.direction)
    } else if (this.direction !== 0) {
      this.scene.activePlayer.walk(this.direction)
    } else {
      this.scene.activePlayer.stop()
    }
  }
}
