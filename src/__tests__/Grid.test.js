/**
 * @jest-environment jsdom
 */
import "./setupTests"
import React from "react";
import { createRoot } from 'react-dom/client';
import { act } from "react-dom/test-utils";
import Grid from '../Grid'

let gridProps = {
    checkRows: -1,
    clickedLetters: [[],[],[],[],[],[]],
    word: 'irate' 
}

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

it('generates the table for 30 word cells', () => {
    const root = createRoot(container);
    act(() => {
        root.render(<Grid {...gridProps} />)
    });
    expect(container.querySelectorAll('td')).toHaveLength(30);
});