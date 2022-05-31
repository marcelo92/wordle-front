import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { hints } from './hints';

function WordCell(props) {
  let classnames = 'word-cell'
  if (props.check) {
    let validate = ' gray';
    if (props.word[props.index] == props.value) {
      validate = 'red';
      hints.included.add(props.value)
    } else if (props.word.includes(props.value)) {
      validate = 'blue'
      hints.included.add(props.value)
    } else {
      hints.excluded.add(props.value)
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
    return (<td key={key} onClick={() => props.onClick(val)}>{val}</td>)
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
    this.loadWord();
    this.state = {
      clickedLetters: [],
      currentIndex: 0,
      needsCheck: false,
      currentRow: 0,
      word: null,
      showHints: false,
      hints: []
    }
  }

  loadWord() {
    fetch('http://localhost:8080/word')
      .then(response => response.text())
      .then(result => this.setState({word: result.toUpperCase()}))
      .catch(error => console.error(error));
  }

  handleClick(letter) {
    if (this.state.needsCheck) {
      return;
    }
    this.state.clickedLetters.push(letter);
    this.setState({
      needsCheck: this.state.clickedLetters.length % 5 == 0
    })
  }

  check() {
    if (this.state.clickedLetters.length % 5 != 0) {
      return;
    }
    const currentTry = this.state.clickedLetters.slice(this.state.currentRow*5,(this.state.currentRow*5)+5).join("")
    fetch('http://localhost:8080/word/'+currentTry.toLowerCase()+'/validate')
      .then(response => response.text())
      .then(result => { 
        if (result === 'true') {
          this.setState({
            currentRow: this.state.currentRow + 1,
            needsCheck: false
          });
        this.getHints()
        } else {
          window.alert("invalid word");
        }
      }).catch(error => console.log(error));
  }

  backspace() {
    if (this.state.clickedLetters.length - this.state.currentRow * 5 <= 0) {
      return
    }
    this.setState({
      clickedLetters: this.state.clickedLetters.slice(0,-1),
      needsCheck: this.state.clickedLetters.length % 5 == 0
    })
  }

  async getHints() {
    const included = 'included='+[...hints.included].join("").toLowerCase()
    const excluded = '&excluded='+[...hints.excluded].join("").toLowerCase()
    fetch('http://localhost:8080/filter?'+included+excluded)
      .then(response => response.json())
      .then(result => {this.setState({hints: result}) })
      .catch(error => console.log(error));
  }

  render() {
    let gridProps = {
      clickedLetters: this.state.clickedLetters,
      word: this.state.word,
      checkRows: this.state.currentRow - 1
    }
    return (
      <div>
        <Grid {...gridProps} />
        <Keyboard onClick={(i) => this.handleClick(i)}/>
        <div className="check">
          <button className='check' onClick={() => this.check()}>Check</button>
          <button className='undo' onClick={() => this.backspace()}>
            <img width="15px" src="https://www.pngall.com/wp-content/uploads/4/Undo-PNG-Free-Download.png"/>
          </button>
          <div>
            <button className="hints-button" onClick={() => this.setState({showHints: !this.state.showHints})}>
              Hints
            </button>
          </div>
          <div hidden={this.state.showHints}>
            <div className="hints">{this.state.hints.join(" ")}</div>
          </div>
        </div>
      </div>
    )
  }
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Game />);
reportWebVitals();