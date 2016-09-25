import AppDispatcher from '../AppDispatcher'

const StartAction = {
  startGame(start) {
    console.log('I am in the startaction: ', start.gameStarted)
    AppDispatcher.dispatch({
      type: 'START_GAME',
      payload: { start }
    })
  }
}

export default StartAction