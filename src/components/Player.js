import React, { Component } from 'react' 
import DeckStore from '../stores/DeckStore'
import StartAction from '../actions/StartAction'
import DeckAction from '../actions/DeckAction'
import AceAction from '../actions/AceAction'
import EndAction from '../actions/EndAction'

export default class Player extends Component {
  constructor(props){
    super(props)
    this.state = {
      gameStarted: false,
      playerHand: DeckStore._getPlayerHand(),
      dealerHand: DeckStore._getDealerHand(),
      playerScore: DeckStore._getPlayerScore(),
      dealerScore: DeckStore._getPlayerScore(),
      aceHandler: DeckStore._aceGet(),
      winnerMessage: DeckStore._getMessage()
    }
    this._onChange = this._onChange.bind(this)
  }

  componentWillMount(){
    DeckStore.startListening(this._onChange)
  }

  componentWillUnmount(){
    DeckStore.stopListening(this._onChange)
  }

  _onChange(){
    console.log(DeckStore._getStartGame())
      this.setState({
        gameStarted: DeckStore._getStartGame(),
        playerHand: DeckStore._getPlayerHand(),
        dealerHand: DeckStore._getDealerHand(),
        playerScore: DeckStore._getPlayerScore(),
        dealerScore: DeckStore._getPlayerScore(),
        aceHandler: DeckStore._aceGet(),
        winnerMessage: DeckStore._getMessage()
    })
  }

  _triggerStartGame(e){
    e.preventDefault()
    let start = {
      gameStarted: true
    }
    DeckStore._startGame()
    StartAction.startGame(start)
  }

  _playerStand(){
    DeckStore._dealerScore()
    EndAction.endGame()
  }

  _setAceValue(e){
    let aceObj = DeckStore._aceGet() // { index: i, value: 0, trigger: true }
    e.preventDefault()
    aceObj.value = e.target.value
    aceObj.trigger = false
    AceAction.choice(aceObj) 
  }

  _hitMe(){
    DeckStore._hitMe()
    DeckAction.create()
  }

  //delete to here

  render(){
    let { playerHand, dealerHand, aceHandler, gameStarted, winnerMessage } = this.state;
    return(
    <div>
      <div>
        {!this.state.winnerMessage ? <h1>Lame Ass Black Jack Game: </h1> : <h1>{this.state.winnerMessage}</h1> }
        {!this.state.gameStarted ? <button onClick={this._triggerStartGame}>Start Game</button> : <div></div>}
      </div>
      <div className='playerCards'> 
        <h3>Player</h3>
        <div className="playersScore">
          <h5>{this.state.playerScore}</h5>
        </div>
        {this.state.aceHandler.trigger ? 
          <div className="aceChoice">
            <button onClick={this._setAceValue} value='1'>Ace = 1</button>
            <button onClick={this._setAceValue} value='11'>Ace = 11</button>
          </div> : <div></div>}
        <button onClick={this._hitMe}>HIT</button>
        <button onClick={this._playerStand}>STAND</button>
        {this.state.playerHand.length ? this.state.playerHand.map((card, num) => {
          return (<p key={num}>{card.value}  {card.suit}</p>)}) : <div></div>}
      </div>
      <div className='dealerCards'> 
        <h3>Dealer</h3>
        <div className="dealersScore">
         {/* <h5>{this.state.dealerScore}</h5>*/}
        </div>
        {this.state.dealerHand.length ? this.state.dealerHand.map((card, num) => {
          return (<p key={num}>{card.value}  {card.suit}</p>)}) : <div></div>}
      </div>
    </div>
    )
  }
}