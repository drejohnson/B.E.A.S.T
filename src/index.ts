import { html, render } from 'lit-html/lib/lit-extended';
import { litProgram } from './lib/beast-lit-html';

type Model = {
  readonly counter: number;
};

type Decrement = {
  type: 'Decrement';
};

type Increment = {
  type: 'Increment';
};

type Msg = Decrement | Increment;

const CounterProgram = {
  init: () => ({
    counter: 0
  }),

  update: (model: Model, msg: Msg) => {
    const value = 1;
    switch (msg.type) {
      case 'Decrement':
        return { ...model, counter: model.counter - value };

      case 'Increment':
        return { ...model, counter: model.counter + value };
    }
  },

  view: (model: Model, dispatch: Dispatch<Msg>) =>
    html`
      <div>
        <h1>Counter: ${model.counter}</h1>
        <button on-click="${() => dispatch({ type: 'Decrement' })}">-</button>
        <button on-click="${() => dispatch({ type: 'Increment' })}">+</button>
      </div>`
};

litProgram(CounterProgram, document.getElementById('app') as HTMLElement);
