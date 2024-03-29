import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className={`square ${props.isWinner ? "winner" : ""}`} onClick={() => props.onClick()}>
      {props.value &&
          <div className="square-content">
              {props.value}
          </div>
      }
    </button>
  );
}


class Board extends React.Component {
    renderSquare(i) {
        const squares = this.props.squares;
        const winning_squares = calculateWinningSquares(squares);
        return <Square value={squares[i]} onClick={() => this.props.onClick(i)} isWinner={winning_squares && winning_squares.indexOf(i) > -1} />;
    }

  render() {
    return (
      <div className="board">
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
    constructor() {
        super();

        this.handleClick = this.handleClick.bind(this);
        this.botMove = this.botMove.bind(this);
        this.state = {
            history: [{
              squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }
    handleClick(i) {

        if (this.state.xIsNext === false) return;
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
        setTimeout(() => {
            this.botMove();
        }, 500);
    }

    botMove() {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares)) {
            return;
        }


        let i = Math.floor(Math.random()*squares.length);
        while(squares[i] !== null) {
            i = Math.floor(Math.random()*squares.length);
        }


        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        history: step === 0 ? [{
            squares: Array(9).fill(null)
        }] : this.state.history,
        xIsNext: (step % 2) ? false : true,
      });
    }

  render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];

      const winner = calculateWinner(current.squares);
      let status;
      if (winner) {
          status = 'Winner: ' + winner;
      } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

    //   const moves = history.map((step, move) => {
    //       const desc = move ?
    //         'Move #' + move :
    //         'Reset Game';
    //       return (
    //          <li key={move}>
    //             <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
    //          </li>
    //      );
    //  });

    return (
      <div className="game">
        <div>
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <a href="#" onClick={() => this.jumpTo(0)}>Reset Game</a>
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


function calculateWinningSquares(squares) {
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
      return lines[i];
    }
  }
  return null;
}

function calculateWinner(squares) {
    let winning_squares = calculateWinningSquares(squares);
    if (winning_squares == null) {
        return null;
    }
    return squares[winning_squares[0]];
}
