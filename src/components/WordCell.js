function WordCell(props) {
    let classnames = 'word-cell'
    if (props.check) {
      let validate = ' gray';
      if (props.word[props.index] === props.value) {
        validate = 'red';
      } else if (props.word.includes(props.value)) {
        validate = 'blue'
      }
      classnames += ' ' + validate
    }
    return (<td className={classnames}>{props.value}</td>)
  }

  export default WordCell;