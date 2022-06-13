import React from 'react';
import Grid from './Grid'
import Keyboard from './Keyboard'

export default class Game extends React.Component {
    constructor(props) {
      super(props);
      this.loadWord();
      const checkedLetters = {
        included: new Set(),
        excluded: new Set(),
      }
      this.state = {
        clickedLetters: [[], [], [], [], [], [], []],
        canCheck: false,
        currentRow: 0,
        word: null,
        showHints: false,
        hints: [],
        checkedLetters: checkedLetters
      }
    }
  
    loadWord() {
      fetch('/words/new')
        .then(response => response.text())
        .then(result => this.setState({ word: result.toUpperCase() }))
        .catch(error => console.error(error));
    }
  
    handleClick(letter) {
      if (this.state.canCheck) {
        return;
      }
      this.state.clickedLetters[this.state.currentRow].push(letter);
      this.setState({
        canCheck: this.state.clickedLetters[this.state.currentRow].length % 5 === 0
      })
    }
  
    backspace() {
      if (this.state.clickedLetters[this.state.currentRow].length <= 0) {
        return
      }
      this.state.clickedLetters[this.state.currentRow] = this.state.clickedLetters[this.state.currentRow].slice(0, -1)
      this.setState({
        canCheck: false,
        
      })
    }
  
    check() {
      if (!this.state.canCheck) {
        return;
      }
      const currentRow = this.state.clickedLetters[this.state.currentRow];
      const currentWord = currentRow.join("");
      if (currentWord === this.state.word) {
        window.alert("Victory!");
      }
      currentRow.filter(letter => this.state.word.split("").includes(letter)).forEach(l => this.state.checkedLetters.included.add(l));
      currentRow.filter(letter => !this.state.word.split("").includes(letter)).forEach(l => this.state.checkedLetters.excluded.add(l));
      fetch('/words/' + currentWord.toLowerCase() + '/validate')
        .then(response => response.text())
        .then(result => {
          if (result === 'true') {
            this.state.clickedLetters.push([]);
            this.setState({
              currentRow: this.state.currentRow + 1,
              canCheck: false
            });
            this.getHints();
          } else {
            window.alert("invalid word");
          }
        }).catch(error => console.log(error));
    }
  
    async getHints() {
      const included = 'included=' + [...this.state.checkedLetters.included].join("").toLowerCase()
      const excluded = '&excluded=' + [...this.state.checkedLetters.excluded].join("").toLowerCase()
      fetch('/words/filter?' + included + excluded)
        .then(response => response.json())
        .then(result => { this.setState({ hints: result }) })
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
          <Keyboard onClick={(i) => this.handleClick(i)}
            checkedLetters={this.state.checkedLetters} />
          <div className="check">
            <button className='check' onClick={() => this.check()}>Check</button>
            <button className='undo' onClick={() => this.backspace()}>
              <img width="15px" alt="undo" src="https://www.pngall.com/wp-content/uploads/4/Undo-PNG-Free-Download.png" />
            </button>
            <div>
              <button className="hints-button" onClick={() => this.setState({ showHints: !this.state.showHints })}>
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