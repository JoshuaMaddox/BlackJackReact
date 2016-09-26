  import AppDispatcher from '../AppDispatcher'

const AceAction = {
  choice(ace) {
    AppDispatcher.dispatch({
      type: 'ACE_CHOICE',
      payload: { ace }
    })
  }
}

export default AceAction