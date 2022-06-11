import renderer from 'react-test-renderer';
import WordCell from '../WordCell';

let wordCellProps = {}

beforeEach(() => {
    wordCellProps = {
        value: '',
        word: "irate",
        check: true,
        index: 0
    }
});
  

it('Return <td> with no validation class', () => {
    wordCellProps.check = false;
    const component = renderer.create(<WordCell {...wordCellProps} />);
    let td = component.toJSON();
    expect(td).toMatchSnapshot()
});

it('Return <td> with gray classname for no match', () => {
    wordCellProps.value = 'f';
    const component = renderer.create(<WordCell {...wordCellProps} />);
    let td = component.toJSON();
    expect(td).toMatchSnapshot()
});

it('Return <td> with blue classname for letter in wrong index', () => {
    wordCellProps.value = 'e';
    const component = renderer.create(<WordCell {...wordCellProps} />);
    let td = component.toJSON();
    expect(td).toMatchSnapshot()
});

it('Return <td> with red classname for letter in wrong index', () => {
    wordCellProps.value = 'i';
    const component = renderer.create(<WordCell {...wordCellProps} />);
    let td = component.toJSON();
    expect(td).toMatchSnapshot()
});