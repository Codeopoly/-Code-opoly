import AlignGrid from '../../utility/alignGrid'

export default class SceneMain extends Phaser.Scene {
  constructor() {
    super('SceneMain')
  }
  preload() {
    this.load.image('background', 'assets/tilemaps/background.png')
    this.load.tilemapTiledJSON('board', 'assets/tilemaps/tile_board.json')
  }
  create() {
    var gridConfig = {
      scene: this,
      cols: 12,
      rows: 12
    }

    this.aGrid = new AlignGrid(gridConfig, this.game)
    this.aGrid.showNumbers()

    const arr = []

    // this.center = this.add.image(
    //   this.game.config.width / 2, // where the center of the image is placed on the x-axis
    //   this.game.config.height / 2, // y-axis
    //   'center'
    // )

    // //scale the center
    // this.center.displayWidth = this.game.config.width * 0.665
    // this.center.scaleY = this.center.scaleX

    // const backgroundImage = this.add.image(
    //   this.game.config.width / 2,
    //   this.game.config.height / 2,
    //   'background'
    // )
    // .setOrigin(0, 0)
    // backgroundImage.setScale(2, 0.8)
    // const board = this.make.tilemap({key: 'board'})
    let board = this.make.tilemap({key: 'board'})
    // let boardData = board.addTilesetImage('board')
    console.log('board is added')
    const tileset = board.addTilesetImage('all tiles', 'background')
    console.log('tileset added')
    const layer = board.createStaticLayer('Tile Layer 1', tileset, 16, 16, 0, 0)
    console.log('layer added')

    //place the face on the grid
    //this.aGrid.placeAtIndex(65.5, this.center);
  }
  update() {}
}
