import React, { Component } from 'react'
import DeckStore from '../stores/DeckStore'
import Player from './Player' 
import stylesheet from '../css/stylesheet.css'


export default class GameBoard extends Component {

  render(){
    return(
      <div className="container">
        <div className="row">
          <Player />
        </div>
      </div>
    )
  }
}

