import React, { Component } from 'react'
import DeckStore from '../stores/DeckStore'
import Player from './Player' 

// DELETE TO HERE

export default class GameBoard extends Component {

  // constructor(props){
  //     super(props)
  //     this.state = {
  //       deck: DeckStore.getDeck()
  //     }
  //     this._onChange = this._onChange.bind(this)
  //   }

  // componentWillMount(){
  //   DeckStore.startListening(this._onChange)
  // }

  //  componentWillUnmount(){
  //   DeckStore.stopListening(this._onChange)
  // }

  // _onChange(){
  //   this.setState({
  //     deck: DeckStore.getDeck()
  //   })
  // }

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

