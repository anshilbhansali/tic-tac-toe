import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Function component; only a function that takes in props and returns a rendering
function Square(props){
  return (
      <button className="square" onClick={props.onClick} style={{backgroundColor: props.color}}>
        {props.value}
      </button>
    );
}


// React component
class Board extends React.Component {
  renderSquare(i, color) {
    return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          color={color}
        />
      );
  }

  render() {
    const green = '#06f980';
    const white = '#fff';
    const orange = '#f1a907';

    let colorMap = {
      0: white,
      1: white,
      2: white,
      3: white,
      4: white,
      5: white,
      6: white,
      7: white,
      8: white
    };
    if (this.props.winningLine!=null){
      for (let i of this.props.winningLine){
        colorMap[i] = green;
      }
    }

    if (this.props.isDraw){
      for (let i in colorMap){
        colorMap[i] = orange;
      }
    }
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0, colorMap[0])}
          {this.renderSquare(1, colorMap[1])}
          {this.renderSquare(2, colorMap[2])}
        </div>
        <div className="board-row">
          {this.renderSquare(3, colorMap[3])}
          {this.renderSquare(4, colorMap[4])}
          {this.renderSquare(5, colorMap[5])}
        </div>
        <div className="board-row">
          {this.renderSquare(6, colorMap[6])}
          {this.renderSquare(7, colorMap[7])}
          {this.renderSquare(8, colorMap[8])}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0
    };
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const squares = history[history.length - 1].squares.slice(); // use .slice() to create a copy

    // if there is already a winner or this square is filled
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const new_history = history.slice();
    new_history.push({
      squares: squares
    });

    this.setState({
      history: new_history,
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((curr_squares, i) => {
      const description = i ? 'Go to move #' + i : 'Go to game start';
      return (
          <li key={i}>
            <button onClick={() => this.jumpTo(i)}>{description}</button>
          </li>
        );
    });

    let status = '';
    if (winner.winner){
      status = 'Winner: ' + winner.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    if (winner.isDraw){
      status = 'Its a draw!';
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningLine={winner.line}
            isDraw={winner.isDraw}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  let boardIsFull = false;
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let no_nulls = true;
  for (const i of squares){
    if (i == null){
      no_nulls = false;
      break
    }
  }
  if (no_nulls){
    boardIsFull = true
  }


  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: [a, b, c],
        isDraw: false
      }
    }
  }
  return {
    winner: null,
    line: null,
    isDraw: boardIsFull
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
