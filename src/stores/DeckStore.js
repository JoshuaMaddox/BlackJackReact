import AppDispatcher from '../AppDispatcher'
import { EventEmitter } from 'events'
import cards from "cards" 

let _startObj = {
  gameStarted: false
}
let _playerStand = false
let _winnerMessage = ''
let _deck = new cards.PokerDeck()
let _playersHand = []
let _dealersHand = []
let _playersScore = 0
let _dealersScore = 0
let _aceHandlerObj = { index: 0, value: 0, trigger: false } 
let _isAce
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
          _startObj = start
          this.emit('CHANGE')
          break;
        case 'END_GAME':
        this._dealerScore()
        this._getWinner() 
        this.emit('CHANGE')
        break;

      }
    })
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

  // delete to here

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
     _winnerMessage = 'You Busted Moron.'
  }
  return
  }

  _getWinner(){
    if(_playersScore === _dealersScore){
      _winnerMessage = "All that for a push. Dealer's Score: " + _dealersScore + " Your Score: " + _playersScore 
    } else if(_playersScore > _dealersScore){
      _winnerMessage = "You Win! Dealer's Score: " + _dealersScore + " Your Score: " + _playersScore
    } else {
      _winnerMessage = "Dealer Wins. Dealer's Score: " + _dealersScore + " Your Score: " + _playersScore
    }
  }


  _dealerScore() {
    let _cardValue = 0
    let score = _dealersHand.forEach((c) => {
      if(c.value === 'J' || c.value === 'Q' || c.value === 'K'){
        _cardValue +=10
      } else if (c.value === 'A' && _cardValue < 11){
        _cardValue += 11
      } else if (c.value === 'A' && _cardValue > 10){
        _cardValue += 1
      } else {
        _cardValue += parseInt(c.value)
      }
    })
    _dealersScore = _cardValue
    this._playerStoodDown()
  }


// let _cardValue = 0
//     for(let i = 0; i < _dealersHand.length; i++){
//       if (_dealersHand[i].value === 'J' || _dealersHand[i].value === 'Q' || _dealersHand[i].value === 'K' ){
//       _cardValue += 10
//     } else if {
      
//     }
//     } 
//     if(dealers)
//     if(_dealersScore > 16 && _dealersScore < 21){
//       console.log('dealer stands')
//     }




  // delete to here

  _playerStoodDown(){
    if(_playerStand === true) {
      this._dealerScore()
    }
    if(_dealersScore > 16){
      return
    }
    if(_dealersScore > 21){
      return _winnerMessage = 'Dealer BUSTS'
    }
    if(_dealersScore < 17){
     this._getDealerCards()
     this._dealerScore() 
    }
  }

  _hitMe() {
    this._getPlayerCards()
    this._playerScoreLogic() 
  }

  _placeAce(){
    let pos = _aceHandlerObj.index
    _playersHand[pos].value = _aceHandlerObj.value
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



// [{ucode: 'U+1F0A1', value: 'ace', sym: 'U+2664', url: '', type: 'Ace of Spades'},
// {ucode: 'U+1F0B1', value: 'ace', sym: 'U+2661', url: '', type: 'Ace of Hearts'},
// {ucode: 'U+1F0C1', value: 'ace', sym: 'U+2662', url: '', type: 'Ace of Diamonds'},
// {ucode: 'U+1F0D1', value: 'ace', sym: 'U+2667', url: '', type: 'Ace of Clubs'},
// {ucode: 'U+1F0A2', value: 2, sym: 'U+2664', url: '', type: 'Two of Spades'},       
// {ucode: 'U+1F0B2', value: 2, sym: 'U+2661', url: '', type: 'Two of Hearts'},    
// {ucode: 'U+1F0C2', value: 2, sym: 'U+2662', url: '', type: 'Two of Diamonds'}, 
// {ucode: 'U+1F0D2', value: 2, sym: 'U+2667', url: '', type: 'Two of Clubs'},      
// {ucode: 'U+1F0A3', value: 3, sym: 'U+2664', url: '', type: 'Three of Spades'},    
// {ucode: 'U+1F0B3', value: 3, sym: 'U+2661', url: '', type: 'Three of Hearts'},  
// {ucode: 'U+1F0C3', value: 3, sym: 'U+2662', url: '', type: 'Three of Diamonds'},  
// {ucode: 'U+1F0D3', value: 3, sym: 'U+2667', url: '', type: 'Three of Clubs'},   
// {ucode: 'U+1F0A4', value: 4, sym: 'U+2664', url: '', type: 'Four of Spades'},    
// {ucode: 'U+1F0B4', value: 4, sym: 'U+2661', url: '', type: 'Four of Hearts'},  
// {ucode: 'U+1F0C4', value: 4, sym: 'U+2662', url: '', type: 'Four of Diamonds'},  
// {ucode: 'U+1F0D4', value: 4, sym: 'U+2667', url: '', type: 'Four of Clubs'},    
// {ucode: 'U+1F0A5', value: 5, sym: 'U+2664', url: '', type: 'Five of Spades'},     
// {ucode: 'U+1F0B5', value: 5, sym: 'U+2661', url: '', type: 'Five of Hearts'},   
// {ucode: 'U+1F0C5', value: 5, sym: 'U+2662', url: '', type: 'Five of Diamonds'},   
// {ucode: 'U+1F0D5', value: 5, sym: 'U+2667', url: '', type: 'Five of Clubs'},    
// {ucode: 'U+1F0A6', value: 6, sym: 'U+2664', url: '', type: 'Six of Spades'},    
// {ucode: 'U+1F0B6', value: 6, sym: 'U+2661', url: '', type: 'Six of Hearts'},  
// {ucode: 'U+1F0C6', value: 6, sym: 'U+2662', url: '', type: 'Six of Diamonds'},  
// {ucode: 'U+1F0D6', value: 6, sym: 'U+2667', url: '', type: 'Six of Clubs'},  
// {ucode: 'U+1F0A7', value: 7, sym: 'U+2664', url: '', type: 'Seven of Spades'},    
// {ucode: 'U+1F0B7', value: 7, sym: 'U+2661', url: '', type: 'Seven of Hearts'},  
// {ucode: 'U+1F0C7', value: 7, sym: 'U+2662', url: '', type: 'Seven of Diamonds'},  
// {ucode: 'U+1F0D7', value: 7, sym: 'U+2667', url: '', type: 'Seven of Clubs'},  
// {ucode: 'U+1F0A8', value: 8, sym: 'U+2664', url: '', type: 'Eight of Spades'},    
// {ucode: 'U+1F0B8', value: 8, sym: 'U+2661', url: '', type: 'Eight of Hearts'},  
// {ucode: 'U+1F0C8', value: 8, sym: 'U+2662', url: '', type: 'Eight of Diamonds'},  
// {ucode: 'U+1F0D8', value: 8, sym: 'U+2667', url: '', type: 'Eight of Clubs'}, 
// {ucode: 'U+1F0A9', value: 9, sym: 'U+2664', url: '', type: 'Nine of Spades'},    
// {ucode: 'U+1F0B9', value: 9, sym: 'U+2661', url: '', type: 'Nine of Hearts'},  
// {ucode: 'U+1F0C9', value: 9, sym: 'U+2662', url: '', type: 'Nine of Diamonds'},  
// {ucode: 'U+1F0D9', value: 9, sym: 'U+2667', url: '', type: 'Nine of Clubs'}, 
// {ucode: 'U+1F0AA', value: 10, sym: 'U+2664', url: '', type: 'Ten of Spades'},    
// {ucode: 'U+1F0BA', value: 10, sym: 'U+2661', url: '', type: 'Ten of Hearts'},  
// {ucode: 'U+1F0CA', value: 10, sym: 'U+2662', url: '', type: 'Ten of Diamonds'},  
// {ucode: 'U+1F0DA', value: 10, sym: 'U+2667', url: '', type: 'Ten of Clubs'},  
// {ucode: 'U+1F0AB', value: 10, sym: 'U+2664', url: '', type: 'Jack of Spades'},    
// {ucode: 'U+1F0BB', value: 10, sym: 'U+2661', url: '', type: 'Jack of Hearts'},  
// {ucode: 'U+1F0CB', value: 10, sym: 'U+2662', url: '', type: 'Jack of Diamonds'},  
// {ucode: 'U+1F0DB', value: 10, sym: 'U+2667', url: '', type: 'Jack of Clubs'}, 
// {ucode: 'U+1F0AC', value: 10, sym: 'U+2664', url: '', type: 'Knight of Spades'}, 
// {ucode: 'U+1F0BC', value: 10, sym: 'U+2661', url: '', type: 'Knight of Hearts'}, 
// {ucode: 'U+1F0CC', value: 10, sym: 'U+2662', url: '', type: 'Knight of Diamonds'}, 
// {ucode: 'U+1F0DC', value: 10, sym: 'U+2667', url: '', type: 'Knight of Clubs'},
// {ucode: 'U+1F0AD', value: 10, sym: 'U+2664', url: '', type: 'Queen of Spades'},    
// {ucode: 'U+1F0BD', value: 10, sym: 'U+2661', url: '', type: 'Queen of Hearts'},  
// {ucode: 'U+1F0CD', value: 10, sym: 'U+2662', url: '', type: 'Queen of Diamonds'},  
// {ucode: 'U+1F0DD', value: 10, sym: 'U+2667', url: '', type: 'Queen of Clubs'},  
// {ucode: 'U+1F0AE', value: 10, sym: 'U+2664', url: '', type: 'King of Spades'},    
// {ucode: 'U+1F0BE', value: 10, sym: 'U+2661', url: '', type: 'King of Hearts'},  
// {ucode: 'U+1F0CE', value: 10, sym: 'U+2662', url: '', type: 'King of Diamonds'},  
// {ucode: 'U+1F0DE', value: 10, sym: 'U+2667', url: '', type: 'King of Clubs'}]  








