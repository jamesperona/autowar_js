import React, { Component } from 'react';
import './Hand.css'


export default class Hand extends Component {
    state = {
    }
    render() {

        return(
            <div className = "handStyle">
                <div className = "handInfoStructure">
                    <div className = "handInfo">
                        Player {this.props.player}
                    </div>
                    <div className = "handInfo">
                        {this.props.count === 1 ? `${this.props.count} Card` : `${this.props.count} Cards`}
                    </div>
                </div>
            </div>
        );
    }
}