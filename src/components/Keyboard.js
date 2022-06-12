export default function Keyboard(props) {
    const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i));
    const keys = letters.map((val, key) => {
      let className = ''
      if (props.checkedLetters.excluded.has(val)) {
        className = 'gray'
      } else if (props.checkedLetters.included.has(val)) {
        className = 'blue'
      }
      return (<td key={key} className={className} onClick={() => props.onClick(val)}>{val}</td>)
    });
    return (
      <table className="keyboard">
        <tbody>
          <tr>{keys}</tr>
        </tbody>
      </table>
    );
  }