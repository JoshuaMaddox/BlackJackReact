import AppDispatcher from '../AppDispatcher'

const StartAction = {
  startGame(start) {
    AppDispatcher.dispatch({
      type: 'START_GAME',
      payload: { start }
    })
  }
}

export default StartAction