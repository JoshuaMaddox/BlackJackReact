import React, { Component } from 'react' 
import DeckStore from '../stores/DeckStore'
import StartAction from '../actions/StartAction'
import DeckAction from '../actions/DeckAction'
import AceAction from '../actions/AceAction'
import EndAction from '../actions/EndAction'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'

export default class Player extends Component {
  constructor(props){
    super(props)
    this.state = {
      gameStarted: false,
      playerStood: DeckStore._didPlayerStand(),
      gameEnded: false,
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
      this.setState({
        playerStood: DeckStore._didPlayerStand(),
        gameStarted: DeckStore._getStartGame(),
        playerHand: DeckStore._getPlayerHand(),
        dealerHand: DeckStore._getDealerHand(),
        playerScore: DeckStore._getPlayerScore(),
        dealerScore: DeckStore._getPlayerScore(),
        aceHandler: DeckStore._aceGet(),
        winnerMessage: DeckStore._getMessage()
    })
  }

  _whichButtonsToShow(){
    if(!this.state.playerStood && !this.state.aceHandler.trigger)
    return (
      <div className="row">
        <div className="playButtons text-center col-xs-12">
          <span className='hitMeBtn' onClick={this._hitMe}>HIT</span>
          <span className='standBtn' onClick={this._playerStand}>STAND</span>
        </div>
      </div>
    )
  }

  _triggerRestartGame(){
    window.location.reload() 
  }

  _triggerStartGame(e){
    e.preventDefault()
    let start = {
      gameStarted: true
    }
    StartAction.startGame(start)
  }

  _playerStand(){
    console.log('I am standing')
    EndAction.endGame()
  }

  _setAceValue(e){
    e.preventDefault()
    let aceObj = DeckStore._aceGet()
    aceObj.value = e.target.id
    console.log(aceObj.value)
    aceObj.trigger = false
    AceAction.choice(aceObj) 
  }

  _hitMe(){
    DeckStore._hitMe()
    DeckAction.create()
  }
  //delete to here

  render(){
    let { playerHand, dealerHand, aceHandler, gameStarted, winnerMessage, playerStood } = this.state;

    if(this.state.gameStarted === false){
      return (
      
        <div className="container">
          <div className="row text-center">
            <div className="col-xs-12 messageContainer text-center">
              <h1 className='winnerMessage'>Ye Ole' Black Jack Game</h1>
              <div className="startBtn" onClick={this._triggerStartGame}>
                <span className='' >Start Game</span>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
        return (
         <div> 
          <div className="container">
            <div className="row text-center">
              <div className="messageContainer text-center">
                {!this.state.winnerMessage ? <div className="winnerMessage">Your Score: {this.state.playerScore}</div> : <h1 className='winnerMessage'>{this.state.winnerMessage}</h1>}
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row text-center">
              <div className="col-xs-6 text-center">
                <div>
                  <h3>Your Cards</h3>
                   
                  <div className="playerCards">
                    {this.state.playerHand.length ? this.state.playerHand.map((card, num) => {
                      return (
                      <ReactCSSTransitionGroup 
                        transitionName="example" 
                        transitionAppear={true} 
                        transitionAppearTimeout={1500}>
                          <div className="playerCard" key={num}><span className='cardValue'>{card.value} </span><div className='suits'><span className='cardSuit'> {card.suit}</span></div><span className='cardValueTwo'>{card.value} </span></div>
                      </ReactCSSTransitionGroup>
                        )}) : <div></div>}
                  </div>
                  
                </div>
              </div>
              <div className="col-xs-6 text-center">
                <h3>Dealer's Cards</h3>
                <div className="dealerCards dealersFirstCard">
                <span id='coverCard' className="coverCard card"></span>
                    {this.state.dealerHand.length ? this.state.dealerHand.map((card, num) => {
                      return (
                        <ReactCSSTransitionGroup 
                        transitionName="example" 
                        transitionAppear={true} 
                        transitionAppearTimeout={1500}>
                          <div className="dealerCard" id={num} ref={num} key={num}><span className='cardValue'>{card.value} </span><div className='suits'><span className='cardSuit'> {card.suit}</span></div><span className='cardValueTwo'>{card.value} </span></div>
                        </ReactCSSTransitionGroup>
                          )}) : <div></div>}
                  </div>
              </div>
            </div>
          </div>
          {!this.state.playerStood ? 
              this._whichButtonsToShow() : 
              <div className="continer">
                <div className="row">
                  <div className="col-xs-12 rstContainer">
                    <span onClick={this._triggerRestartGame} className='restartButton'> Can You Handle More Awesome? Play Again!</span>
                  </div>
                </div>
              </div>
          }
          <div className="container">
            <div className="row">
              {this.state.aceHandler.trigger ? 
                <div className="aceChoice col-xs-6">
                  <span className='aceButtons' onClick={this._setAceValue} id='1'>Ace = 1</span>
                  <span className='aceButtons' onClick={this._setAceValue} id='11'>Ace = 11</span>
                </div> : <div></div>
              }
            </div>
          </div>
        </div>
    )

    }  
    
  }
}