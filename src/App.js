import React, { Component } from 'react';
import './App.css';
import Card from './components/Card.js'
import Hand from './components/Hand.js'

class App extends Component {
  state = {
    /*** An array of objects containing a player number and card count */
    hands : [],

    /*** An array of arrays containing the cards in play for any given turn/tie. */
    table : [],

    playercount : 2,

    sleepTime : 50

  }


  render() {
    const{
      hands,
      table,
      playercount
    } = this.state
    return (
      <div className="App">
  
        <header className="App-header">
          <div className ="App-title">
            <b style = {{paddingRight: "1vw"}}>Auto-War with</b>
            <input className="Input-players" onChange={(event) => this.updatePlayers(event)} value={playercount}></input>
            <b style = {{paddingLeft: "1vw"}}>players:</b>
          </div>
          <button className="Start-button" onClick={() => this.playGame()}> Begin </button>
        </header>
  
        <div className="Hand-table">
          <div className="Hand-text">Hands:</div> 
          {
            hands.map((hand, idx) => {
              return (
                <Hand key={idx} player={hand.player} count={hand.hand.length}/>
              )
            })
          }
        </div>
  
        <div className="Main-table">
        {
            table.map((arr, idx) => {
              return (
                <div className="Sub-table">
                {
                arr.map((elem, idx) => {
                  return (
                    <Card key={idx} inPlay={elem.card.inPlay} glow={elem.card.glow} suit={elem.card.suit} rank={elem.card.rank}/>
                  )
                })
                }
                </div>
              )
            })
          }
          
        </div>
  
      </div>
    );
  }

  componentDidMount = () => {
    const input = document.querySelector(".Input-players")
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.playGame()
      }
    })
  }

  updatePlayers = (event) => {
    let {value} = event.target

    if (value === "" || value === "1") {
      this.setState({
        playercount: value
      })
      return;
    }

    value = parseInt(value)
    if (value >= 0 && value <= 52) {
      this.setState({
        playercount: value
      })
    }
  }

  playGame = async () => {
    const {
      playercount
    } = this.state

    await this.setState({
      table : [],
      hands : []
    }, async () => {await sleep(1000)})

    let count = playercount;

    if (count === "" || count === "1") {
      count = 0;
    }

    const deck = [];

    for (let i = 1; i < 5; i++) {
      for (let j = 1; j < 14; j++) {
        deck.push({suit : i, rank : j, glow : 0, inPlay : 0});
      }
    }

    shuffle(deck);

    const deals = [];
    const handsize = Math.floor(52/count);

    for (let i = 0; i < count; i++) {
      deals.push({
        hand : deck.slice(handsize*i, handsize*(i + 1)),
        player : (i+1),
      })
    }
    

    this.setState({
      hands : deals
    })
    

    while (this.state.hands.length > 1) {
      await this.playTurn(this.state.hands, 1);
      const newHands = this.state.hands.filter((handElem) => (handElem.hand.length > 0))
      this.setState({
        hands : newHands
      })
      // await sleep(this.state.sleepTime)
    }

  }

  playTurn = async (tiePlayers, stakes) => {
    const {
      hands,
      table,
    } = this.state

    const currTable = [];

    

    tiePlayers.forEach((elem, idx) => {
      hands.forEach((handElem, idx) => {
        if (elem.player === handElem.player) {
          for (let i = 0; i < stakes; i++) {
            if (!(handElem.hand === undefined || handElem.hand.length === 0)) {
              const cardToPush = handElem.hand.pop()
              cardToPush.inPlay = i;
              currTable.push({card : cardToPush, player : handElem.player});
            }
          }
        }
      })
    })

    let max = -1;
    let tied = [];

    currTable.forEach((contestant, idx) => {
      if (contestant.card.inPlay === 0) {
        if (contestant.card.rank > max) {
          max = contestant.card.rank;
          tied = [];
          tied.push(contestant);
        } else if (contestant.card.rank === max) {
          tied.push(contestant);
        }
      }
    })

    this.setState({
      table : [...table, currTable],
      hands
    })

    await sleep(2 * this.state.sleepTime);

    let winner = {player : -1, card : {rank: -1, suit : -1}};

    if (tied.length === 1) {
      winner = tied.pop();
    } else if (tied.length > 1) {
      let specialCase = true;
      tied.forEach((contender, idx) => {
        let playerValue = contender.player;
        hands.forEach((handElem, idx) => {
          if (handElem.player === playerValue && handElem.hand.length > 0) {
            specialCase = false;
          }
        })
      })

      tied.forEach((tiedElem, idx) => {
        currTable.forEach((tableElem, idx) => {
          if (tableElem.player === tiedElem.player) {
            tableElem.card.glow = 2;
          }
        })
      })

      this.setState({
        table : [...table.slice(0, table.length), currTable]
      })

      await sleep(this.state.sleepTime)

      if (specialCase) {
        let max = -1;
        tied.forEach((tiePlay, idx) => {
          if (tiePlay.card.suit > max) {
            winner = tiePlay;
          }
        })
      } else {
        
        winner = await this.playTurn(tied, 2);
      }
    }

    currTable.forEach((tableElem, idx) => {
      if (tableElem.player === winner.player) {
        tableElem.card.glow = 1;
      } else {
        tableElem.card.glow = 0;
      }
    })

    this.setState({
      table : [...table.slice(0, table.length), currTable]
    })

    await sleep(2 * this.state.sleepTime)

    currTable.forEach((tableElem, idx) => {
      tableElem.card.glow = 0;
    })

    shuffle(currTable);

    const tableCards = currTable.map((tableElem, idx) => {
      return(tableElem.card)
    })

    let winnerIdx = 0
    let newHand = []

    this.state.hands.forEach((handElem, idx) => {
      if (handElem.player === winner.player) {
        newHand = tableCards.concat(handElem.hand);
        winnerIdx = idx;
      }
    })

    const updated_elem = {
      hand : newHand,
      player : winner.player
    }

    await sleep(this.state.sleepTime);

    this.setState({
      hands : [...hands.slice(0, winnerIdx), updated_elem, ...hands.slice(winnerIdx + 1)],
      table : table.slice(0, table.length)
    })

    return winner;

  }

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


export default App;
