import React, { Component } from 'react'
import DeckAction from '../actions/DeckAction'
import DeckStore from '../stores/DeckStore'

export default class StartGame extends Component {

  constructor(props){
      super(props)
      this._startGame = this._startGame.bind(this)
      this.state = {
        gameStarted: false
      }
  }

  

  render(){
    return(
   
    )
  }
}