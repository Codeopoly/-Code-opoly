import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import {createArray} from '../../utility/preGame'
import {create} from 'react-test-renderer'

// This file might seem odd at first. Lots of thunks, only 1 action.
// That's because the only thing we want in state preGame is the Game document.

// Action Types:
const GOT_GAME = 'GOT_GAME'

// Action Creators:
const gotGame = (theGame, gameCode, player, playerId) => {
  return {
    type: GOT_GAME,
    theGame,
    gameCode,
    player,
    playerId
  }
}

// Thunk Creators:
// Used when a player presses JOIN GAME or CREATE GAME on choose character page
export const createPlayerThunk = (
  gameCode,
  startupName,
  characterImg,
  isHost
) => {
  return async (dispatch, getState, {getFirebase}) => {
    console.log('createPlayerThunk is running')
    try {
      // First make a player:
      console.log('if this ran, a player was made!')
      const newPlayerDR = await getFirebase()
        .firestore()
        .collection('players')
        .add({
          startupName: startupName,
          image: characterImg,
          game_id: gameCode,
          seedMoney: 500,
          location: 1,
          hasFrontend: 'none',
          hasBackend: 'none',
          hasUI: 'none',
          hasMiddleware: 'none',
          hasAlgorithm: 'none'
        })
      console.log('newPlayerDR:', newPlayerDR)

      // Coolio, we made a new player, but we want to add the reference to the game.
      if (isHost) {
        await getFirebase()
          .firestore()
          .collection('games')
          .doc(gameCode)
          .update({
            host: newPlayerDR.path
          })
      }
      // Let's add the player reference to the players array
      await getFirebase()
        .firestore()
        .collection('games')
        .doc(gameCode)
        .update({
          // I am updating the specific game, arrayUnion
          playersArray: firebase.firestore.FieldValue.arrayUnion(
            newPlayerDR.path
          )
        })

      // Here we do not dispatch an action creator;
      // I'm dispatching another thunk (trying to keep this thunk lightweight)
      dispatch(getGameThunk(gameCode, newPlayerDR.id))
    } catch (error) {
      console.log(error)
    }
  }
}

// Used when a player presses JOIN GAME on choose character page
export const getGameThunk = (gameCode, playerId) => {
  return async (dispatch, getState, {getFirebase}) => {
    // Grab the game, now containing the newly created player
    try {
      //Grab the new player
      console.log('if this ran, current player was read from Firestore!')
      const currPlayer = await getFirebase()
        .firestore()
        .collection('players')
        .doc(playerId)
        .get()
      console.log(currPlayer.data())
      //add currPlayer.data() to gotGame or make new action creator
      // dispatch(gotPlayer(currPlayer.data(), playerId))
      console.log('if this ran, a game was read from Firestore!')
      const theGame = await getFirebase()
        .firestore()
        .collection('games')
        .doc(gameCode)
        .get()
      if (!theGame.exists) {
        console.log('invalid game code!!!')
      } else {
        console.log('dispatching gotGame', theGame.data())
        dispatch(gotGame(theGame.data(), gameCode, currPlayer.data(), playerId))
      }
    } catch (error) {
      console.log(error)
    }
  }
}

// Used on "join game" button on home page
export const getNewGameThunk = gameCode => {
  return async (dispatch, getState, {getFirebase}) => {
    // Grab the game, now containing the newly created player
    try {
      console.log('if this ran, a game was read from Firestore!')
      const theGame = await getFirebase()
        .firestore()
        .collection('games')
        .doc(gameCode)
        .get()
      if (!theGame.exists) {
        console.log('invalid game code!!!')
      } else {
        console.log('dispatching gotGame', theGame.data())
        dispatch(gotGame(theGame.data(), gameCode))
      }
    } catch (error) {
      console.log(error)
    }
  }
}

// Used when the CREATE GAME button is clicked on home page
export const createGameThunk = () => {
  return async (dispatch, getState, {getFirebase}) => {
    try {
      console.log('createGameThunk try block')
      // .add() returns a DocumentReference object
      const newGameDR = await getFirebase()
        .firestore()
        .collection('games')
        .add({
          completed: false,
          deckFrontend: createArray(0, 20),
          deckBackend: createArray(21, 40),
          deckUI: createArray(41, 60),
          deckMiddleware: createArray(61, 80),
          deckAlgorithm: createArray(81, 100),
          currentPlayer: null,
          host: null,
          playersArray: [] // Host is in here too
        })
      // await newGameDR.get() is how you use a DocumentReference object to get the newly created document
      const newGame = await newGameDR.get()
      dispatch(gotGame(newGame.data(), newGameDR.id))
    } catch (error) {
      console.log(error)
    }
  }
}

// Reducer:
export default function(state = {game: {}, state: {}}, action) {
  console.log('the reducer is being accessed!')
  switch (action.type) {
    case GOT_GAME:
      console.log('theGame inside the reducer', action.theGame)
      const newState = {game: action.theGame, player: action.player}
      // Since theGame document doesn't come with its id (go figure), add a property to hold its id:
      newState.gameCode = action.gameCode
      newState.playerId = action.playerId
      return newState
    default:
      return state
  }
}
