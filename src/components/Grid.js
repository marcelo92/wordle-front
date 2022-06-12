import React from 'react';
import WordCell from './WordCell';

export default class Grid extends React.Component {
    render() {
      const rows = [];
      for (let i = 0; i < 6; i++) {
        rows.push([])
        for (let j = 0; j < 5; j++) {
          let wordCellProps = {
            value: this.props.clickedLetters[i][j] || "",
            word: this.props.word,
            check: this.props.checkRows >= i,
            index: j
          }
          rows[i].push(<WordCell key={i + j} {...wordCellProps} />)
        };
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
  