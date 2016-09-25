import AppDispatcher from '../AppDispatcher'

const EndAction = {
  endGame(){
    AppDispatcher.dispatch({
      type: 'END_GAME'
    })
  }
}

export default EndAction