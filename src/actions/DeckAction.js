import AppDispatcher from '../AppDispatcher'

const DeckAction = {
  create() {
    AppDispatcher.dispatch({
      type: 'CARD_CREATE',
    })
  }
}

export default DeckAction
