import React, {useState, useEffect} from 'react'
import {connect, useSelector, useDispatch} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {useFirestoreConnect} from 'react-redux-firebase'
import {getGameThunk} from '../store/preGame'

const Rejoin = () => {
  const [gameCode, setGameCode] = useState('2TTOdSkPHiApJqey8FjX')
  const [redirectNow, setRedirectNow] = useState(false)
  const dispatch = useDispatch()

  function handleChange(event) {
    setGameCode(event.target.value)
  }
  async function handleClick() {
    await dispatch(getGameThunk(gameCode))
    setRedirectNow(true)
  }

  if (redirectNow) {
    return <Redirect to="/loading" />
  }

  return (
    <div className="welcome">
      <div>
        <h2>Please reenter your game code to rejoin your game</h2>
      </div>
      <div>
        <input type="text" value={gameCode} onChange={handleChange} />
        <button type="button" onClick={handleClick}>
          Rejoin
        </button>
      </div>
    </div>
  )
}

export default Rejoin
