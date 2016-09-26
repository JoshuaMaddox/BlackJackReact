import AppDispatcher from '../AppDispatcher'
import { EventEmitter } from 'events'
import cards from "cards" 

let _startObj = {
  gameStarted: false
}
let _playerStand = false
let _gameEnded = false
let _winnerMessage = ''
let _deck = new cards.PokerDeck()
let _playersHand = []
let _dealersHand = []
let _playersScore = 0
let _dealersScore = 0
let _aceHandlerObj = { index: 0, value: 0, trigger: false } 
_deck.shuffleAll() 

class DeckStore extends EventEmitter {

  constructor(deck) {
    super()
    AppDispatcher.register(action => {
      switch(action.type) {
        case 'CARD_CREATE':
          this.emit('CHANGE')
          break;
        case 'ACE_CHOICE':
          let { ace } = action.payload;
          this._placeAce()
          this._deleteAceEquals(ace)
          this.emit('CHANGE')
          break;
        case 'START_GAME':
          let { start } = action.payload;
          this._resetGame()
          this._startGame()
          _startObj = start
          this.emit('CHANGE')
          break;
        case 'END_GAME':
          _playerStand = true
          this._dealerScore()
          this._getWinner() 
          this.emit('CHANGE')
        break;

      }
    })
  }

  _resetGame() {
    _startObj = {
     gameStarted: false
    }
    _playerStand = false
    _gameEnded = false
    _winnerMessage = ''
    _deck = new cards.PokerDeck()
    _playersHand = []
    _dealersHand = []
    _playersScore = 0
    _dealersScore = 0
    _aceHandlerObj = { index: 0, value: 0, trigger: false } 
    _deck.shuffleAll()
  }

  //Draw a single card from the deck for the player
  _getPlayerCards(){
    let newCard = _deck.draw()
    _playersHand.push(newCard)
    return _playersHand
  }
  //Draw a single card from the deck for the dealer
  _getDealerCards(){
    let newCard = _deck.draw()
    _dealersHand.push(newCard)
    return _dealersHand
  }

  _aceLogic(i){
    _aceHandlerObj = { index: i, value: 0, trigger: true }
  }

  _aceGet(){
    return _aceHandlerObj 
  }

  _deleteAceEquals(ace){
    _aceHandlerObj = ace
  }

  //Iterates through the _playersHand array checking against card types
  //If the card is an ace then the function runs _aceLogic then returns
  //otherwis it adds all values to _cardCalue which later sets the _playerScore
  //finall calls
 _playerScoreLogic() {
  let _cardValue = 0
  for(let i = 0; i < _playersHand.length; i++) {
    if (_playersHand[i].value === 'J' || _playersHand[i].value === 'Q' || _playersHand[i].value === 'K' ){
      _cardValue += 10
    } else if (_playersHand[i].value === 'A'){
      return this._aceLogic(i)
    } else { 
      _cardValue += parseInt(_playersHand[i].value)
    } 
  }
  _playersScore = _cardValue
  if(_playersScore > 21){
     _winnerMessage = 'You Busted. Dealer Wins'
     this._gameEnded()
  }
  return
  }

  _getWinner(){
    if(_playersScore === _dealersScore){
      _winnerMessage = "All that for a push?  " + _dealersScore + " vs. " + _playersScore 
    } else if (_playersScore > _dealersScore && _playersScore < 22){
      _winnerMessage = "You Win!   " + _playersScore + " vs. " + _dealersScore
    } else if (_dealersScore > _playersScore && _dealersScore < 22) {
      _winnerMessage = "Dealer Wins.   " + _dealersScore + " vs. " + _playersScore
    }
  }

  _dealerScore() {
    let _cardValue = 0
    let score = _dealersHand.forEach((c) => {
      if(c.value === 'J' || c.value === 'Q' || c.value === 'K'){
        _cardValue += 10
      } else if (c.value === 'A' && _cardValue < 11){
        _cardValue += 11
      } else if (c.value === 'A' && _cardValue > 10){
        _cardValue += 1
      } else {
        _cardValue += parseInt(c.value)
      }
    })
    _dealersScore = _cardValue
    if(_dealersScore > 21){
      _winnerMessage = "Dealer Busts. You Win!"
    }
    this._playerStoodDown()
  }

  _playerStoodDown(){
    document.getElementById("coverCard").className = ""
    if(_dealersScore > 16){
      return
    }
    if(_dealersScore > 21){
      _winnerMessage = 'Dealer BUSTS'
      this._gameEnded()
    }
    if(_dealersScore < 17){
     this._getDealerCards()
     this._dealerScore() 
    }
  }

  //Deals player another card and runs _playerScoreLogic
  _hitMe() {
    this._getPlayerCards()
    this._playerScoreLogic() 
  }

  _placeAce(){
    let pos = _aceHandlerObj.index 
    _playersHand[pos].value = _aceHandlerObj.value
    _playersHand[pos].suit = "Ace of " + _playersHand[pos].suit + 's'
    this._playerScoreLogic()
  }

  _getPlayerScore(){
    return _playersScore
  }

  _getDealerScore(){
    return _dealersScore
  }

  _getDealerHand(){
    return _dealersHand
  }

  _getPlayerHand(){
    return _playersHand
  }

  _getStartGame(){
    return _startObj
  }
  _getMessage(){
    return _winnerMessage
  }

  _gameEnded() {
    _playerStand = true
    this._getWinner()
  }
  
  _didPlayerStand(){
    return _playerStand
  }

   _startGame(){
    this._getDealerCards()
    this._getPlayerCards()
    this._getDealerCards()
    this._getPlayerCards()
    this._playerScoreLogic()
  }

  startListening(cb) {
    this.on('CHANGE', cb)
  }

  stopListening(cb) {
    this.removeListener('CHANGE', callback)
  }

  getDeck() {
    return _deck
  }
}

export default new DeckStore
