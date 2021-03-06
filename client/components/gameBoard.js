import Phaser from 'phaser'
import React, {useEffect} from 'react'
import config from '../../config/gameConfig'
// import {EventEmitter} from 'events'

// export const newGame = new EventEmitter()

const GameBoard = () => {
  let game
  useEffect(() => {
    console.log('Window.innerWidth inside game.js', window.innerWidth)
    if (document.getElementById('theGame')) {
      game = new Phaser.Game(config) // game creation after componentDidMount (hook-style)
    }
    return function cleanup() {
      console.log('cleanup ran!', game) // acts as componentWillUnmount
      game.destroy(true)
    }
  })

  return <div id="insideTheGame" />
}

export default GameBoard
