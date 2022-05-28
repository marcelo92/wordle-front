import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

function WordCell(props) {
  let classnames = 'word-cell'
  if (props.check) {
    let validate = ' gray';
    if (props.word[props.index] == props.value) {
      validate = 'red';
    } else if (props.word.includes(props.value)) {
      validate = 'blue'
    }
    classnames += ' ' + validate
  }
  return (<td className={classnames}>{props.value}</td>)
}

class Grid extends React.Component {
  render() {
    const rows = [];
    for (let i = 0; i < 7; i++) {
      rows.push(Array.from({ length: 5 }, (_, j) => i * 5 + j).map((val, key) => {
        let wordCellProps = {
          value: this.props.clickedLetters[key + i * 5],
          word: this.props.word,
          check: this.props.checkRows >= i,
          index: key
        }
        return (<WordCell key={key} {...wordCellProps} />)
      }));
    }
    return (
      <table className="words">
        <tbody>
          <tr>{rows[0]}</tr>
          <tr>{rows[1]}</tr>
          <tr>{rows[2]}</tr>
          <tr>{rows[3]}</tr>
          <tr>{rows[4]}</tr>
          <tr>{rows[5]}</tr>
        </tbody>
      </table>
    );
  }
}

function Keyboard(props) {
  const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i));
  const keys = letters.map((val, key) => {
    return (<button onClick={() => props.onClick(val)}><td key={key}>{val}</td></button>)
  });
  return (
    <table className="keyboard">
      <tbody>
        <tr>{keys}</tr>
      </tbody>
    </table>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clickedLetters: [],
      currentIndex: 0,
      needsCheck: false,
      rowsChecked: -1,
      word: 'IRATE'
    }
  }

  handleClick(letter) {
    if (this.state.needsCheck) {
      return;
    }
    this.state.clickedLetters.push(letter);
    const updatedIndex = this.state.currentIndex + 1
    this.setState({
      currentIndex: updatedIndex,
      needsCheck: updatedIndex % 5 == 0
    })
  }

  check() {
    this.setState({
      rowsChecked: this.state.rowsChecked + 1,
      needsCheck: false
    })
  }

  render() {

    let gridProps = {
      clickedLetters: this.state.clickedLetters,
      word: this.state.word,
      checkRows: this.state.rowsChecked
    }

    return (
      <div>
        <Grid {...gridProps} />
        <Keyboard onClick={(i) => this.handleClick(i)}/>
        <div className="check">
          <button onClick={() => this.check()}>Check</button>
        </div>
      </div>
    )
  }
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Game />);
reportWebVitals();
