import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.isWinnerLine ? 'win square' : 'square'} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return(
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinnerLine={this.props.winnerLine ? this.props.winnerLine.indexOf(i) > -1 : false}
      />
    ); 
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      selectedList: null,
      isReversed: false,
      putPoints: Array(9).fill(null),
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const putPoints = this.state.putPoints.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    putPoints[history.length] = '(' + i % 3 + ',' + (i - i % 3) / 3 + ')';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      putPoints: putPoints,
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      selectedList: null,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      selectedList: step,
    });
  }

  toggleListOrder() {
    this.setState({
      isReversed: !this.state.isReversed,
    });
  }

  render() {
    const isReversed = this.state.isReversed;
    let history = this.state.history;
    const putPoints = this.state.putPoints;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const winnerLine = calculateWinner(current.squares, true);
    if(isReversed) {
      history = [...history].reverse();
    }
    const moves = history.map((step, move) => {
      if(isReversed) {
        move = history.length - move - 1;
      }
      const desc = move ?
      'Go to move #' + move + ' ' + putPoints[move] :
      'Go to game start';
      return (
        <li key={move} className={this.state.selectedList === move ? 'selected' : ''}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winnerLine={winnerLine}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleListOrder()}>{isReversed ? 'desc ▼' : 'asc ▲'}</button>
          <ol reversed={isReversed}>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares, returnArrayFlag) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      if(returnArrayFlag) {
        return lines[i];
      } else {
        return squares[a];
      }
    }
  }
  return null;
}


// 1. Display the location for each move in the format (col, row) in the move history list.
// 2. Bold the currently selected item in the move list.
// 3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
// 4. Add a toggle button that lets you sort the moves in either ascending or descending order.
// 5. When someone wins, highlight the three squares that caused the win.
// 6. When no one wins, display a message about the result being a draw.
