import React, { Component } from 'react';
import './Card.css'
import spade from './imgs/spade.png'
import heart from './imgs/heart.png'
import diamond from './imgs/diamond.png'
import club from './imgs/club.png'


export default class Card extends Component {
    state = {
    }
    render() {
        if (this.props.inPlay === 0) {
            return(
                <div className = "cardOuter">
                    <div>{this.props.player}</div>
                    <div style = {{boxShadow:glowmap[this.props.glow]}} className = "cardStyle">
                        <div className = "cardInfoStructure">
                            <img src = {suitmap[this.props.suit]} alt = "suit" className = "cardSuit"/>
    
                            <div style={{color:colormap[this.props.suit]}} className = "cardInfo">
                                {rankmap[this.props.rank]}
                            </div>
                        </div>
                     </div>
                </div>
            );
        } else {
            return(
                <div className = "cardOuter">
                    <div>{this.props.player}</div>
                    <div style = {{boxShadow:glowmap[this.props.glow]}} className = "faceDown"></div>
                </div>
            );
        }
    }
}

const glowmap = {0: "none", 1: "0px 0px 0.75vmin 0.75vmin #2ab15d", 2: "0px 0px 0.75vmin 0.5vmin #f1d63e"}
const colormap = {1 : "black", 2 : "red", 3 : "red", 4 : "black"}
const suitmap = {1 : club, 2 : diamond, 3 : heart, 4 : spade}
const rankmap = {1 : "2", 2 : "3", 3 : "4", 4 : "5", 5 : "6", 6 : "7", 7 : "8", 8 : "9", 9 : "10", 10 : "J", 11 : "Q", 12 : "K", 13 : "A"}

