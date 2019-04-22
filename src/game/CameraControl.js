import Phaser from 'phaser'

const maxZoom = 2
const minZoom = 0.5
const xMargin = 64
const yMargin = 64

export default class CameraControl extends Phaser.Cameras.Controls.FixedKeyControl {
  constructor(scene, camera, visibleWidth, visibleHeight, mapWidth, mapHeight) {
    scene.mouseWheelToUpDown = scene.plugins.get('rexMouseWheelToUpDown').add(scene)
    var cursorKeys = scene.mouseWheelToUpDown.createCursorKeys()
    var cursors = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT
    })
    var controlConfig = {
      camera: camera,

      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      zoomIn: cursorKeys.down,
      zoomOut: cursorKeys.up,
      zoomSpeed: 0.1,
      speed: {
        x: 0.5,
        y: 0.5
      }
    }

    super(controlConfig)

    this.scene = scene
    this.visibleWidth = visibleWidth
    this.visibleHeight = visibleHeight
    this.mapWidth = mapWidth
    this.mapHeight = mapHeight
    this.origDragPoint = null
  }

  init() {
    this.setInitialZoom()
    this.resizeCameraViewport()
    this.resizeBounds()
    this.camera.centerOn(this.mapWidth / 2, this.mapHeight / 2)
  }

  setInitialZoom() {
    let zoom = 1
    if (zoom * (this.mapWidth + 2 * xMargin) > this.visibleWidth) {
      zoom = this.visibleWidth / (this.mapWidth + 2 * xMargin)
    }
    if (zoom * (this.mapHeight + 2 * yMargin) > this.visibleHeight) {
      zoom = this.visibleHeight / (this.mapHeight + 2 * yMargin)
    }
    zoom = Math.max(zoom, minZoom)
    this.camera.setZoom(zoom)
  }

  setVisibleSize(visibleWidth, visibleHeight) {
    if (visibleWidth !== this.visibleWidth || visibleHeight !== this.visibleHeight) {
      this.visibleWidth = visibleWidth
      this.visibleHeight = visibleHeight
      this.resizeCameraViewport()
      this.resizeBounds()
    }
  }

  setMapSize(mapWidth, mapHeight) {
    if (mapWidth !== this.mapWidth || mapHeight !== this.mapHeight) {
      this.mapWidth = mapWidth
      this.mapHeight = mapHeight
      this.resizeBounds()
    }
  }

  updateDrag(delta) {
    let cam = this.camera
    let activePointer = this.scene.input.activePointer
    if (activePointer.isDown) {
      if (this.origDragPoint) { // move the camera by the amount the mouse has moved since last update
        cam.scrollX += (this.origDragPoint.x - activePointer.position.x) / cam.zoom
        cam.scrollY += (this.origDragPoint.y - activePointer.position.y) / cam.zoom
      } // set new drag origin to current position
      this.origDragPoint = activePointer.position.clone()
    } else {
      this.origDragPoint = null
    }
  }

  resizeCameraViewport() {
    this.camera.setViewport(0, 0, this.visibleWidth, this.visibleHeight)
  }

  resizeBounds() {
    let camera = this.camera

    let mapWidth = this.mapWidth
    let mapHeight = this.mapHeight
    let minWidth = mapWidth + 2 * xMargin
    let minHeight = mapHeight + 2 * yMargin
    let width
    let height
    let x
    let y

    if (camera.zoom * minWidth < this.visibleWidth) {
      x = -((this.visibleWidth / camera.zoom) - mapWidth) / 2
      width = this.visibleWidth / camera.zoom
    } else {
      x = -xMargin
      width = minWidth
    }

    if (camera.zoom * minHeight < this.visibleHeight) {
      y = -((this.visibleHeight / camera.zoom) - mapHeight) / 2
      height = this.visibleHeight / camera.zoom
    } else {
      y = -yMargin
      height = minHeight
    }
    camera.setBounds(x, y, width, height)
  }

  update(delta) {
    this.updateDrag(delta)
    if (!this.active) {
      return
    }

    if (delta === undefined) {
      delta = 1
    }

    let cam = this.camera

    if (this.up && this.up.isDown) {
      cam.scrollY -= ((this.speedY * delta) | 0)
    } else if (this.down && this.down.isDown) {
      cam.scrollY += ((this.speedY * delta) | 0)
    }

    if (this.left && this.left.isDown) {
      cam.scrollX -= ((this.speedX * delta) | 0)
    } else if (this.right && this.right.isDown) {
      cam.scrollX += ((this.speedX * delta) | 0)
    }

    //  Camera zoom

    let zoom = cam.zoom
    if (this.zoomIn && this.zoomIn.isDown) {
      zoom -= this.zoomSpeed

      if (zoom < minZoom) {
        zoom = minZoom
      }
    } else if (this.zoomOut && this.zoomOut.isDown) {
      zoom += this.zoomSpeed
      if (zoom > maxZoom) {
        zoom = maxZoom
      }
    }

    if (Math.abs(zoom - 1) < this.zoomSpeed / 2) {
      zoom = 1
    }

    let zoomChanged = cam.zoom !== zoom

    if (zoomChanged) {
      cam.zoomTo(zoom, 100, Phaser.Math.Easing.Linear.Linear, false, (cam, progress) => {
        this.resizeBounds()
      }, this)
    }
  }
}