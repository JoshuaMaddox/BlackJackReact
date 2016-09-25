import React, { Component } from 'react'
import GameBoard from './GameBoard'

export default class Layout extends Component {

  render(){
    return(
      <div className="container">
        <GameBoard />
      </div>  
    )
  }
}