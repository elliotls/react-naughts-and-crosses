/**
 * Basic tutorial from React docs
 * https://reactjs.org/tutorial/tutorial.html
 * 
 * https://reactjs.org/tutorial/tutorial.html#showing-the-past-moves
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
  return (
    <button className="square" onClick={props.onSquareClick}>
      {props.value}
    </button>
  );
}

function calculateWinner(squares) {
  // console.log('calc winner: ' + squares)
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winningLines.length; i++) {
    const [a, b, c] = winningLines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

class Board extends React.Component { 
  renderSquare(i) {
    return <Square
      value = { this.props.squares[i] }
      onSquareClick = { () => this.props.onClick(i) }
    />;
  }

  createBoard() {
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
  
  render() {
    return this.createBoard();
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
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const currentState = history[history.length - 1];
    const squares = currentState.squares.slice();
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  resetGame() {
    this.setState({
      stepNumber: 0,
      xIsNext: true,
      history: [{
        squares: Array(9).fill(null),
      }],
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const currentState = history[this.state.stepNumber];
    const winner = calculateWinner(currentState.squares);
    
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button className="text" onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    let reset;
    if (winner) {
      status = (this.state.xIsNext ? 'O' : 'X') + ' wins the game';
      reset = <button className="text play-again" onClick={() => this.resetGame()}>Play again</button>;
    } else if (this.state.stepNumber === 9) {
      status = 'Draw';
      reset = <button className="text play-again" onClick={() => this.resetGame()}>Play again</button>;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">

        <div className="react-logo">
          <img src="logo192.png" alt="React logo"></img>
        </div>

        <div className="game-board">
        <div className="reset">
          <div className="status">{status}</div>
        </div>
          <Board
            squares = { currentState.squares }
            onClick = { (i) => this.handleClick(i) }
          />
          <div className="reset">{reset}</div>
        </div>

        <div className="game-info">
          <ul>{moves}</ul>
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
