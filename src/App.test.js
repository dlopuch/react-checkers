import React from 'react';
import { render } from '@testing-library/react';
import {createStore} from "redux";
import {reducers} from "./reducers";
import App from './App';
import {Provider} from "react-redux";
import { TestBackend } from "react-dnd-test-backend";
import {DndProvider} from "react-dnd";

let store = createStore(
  reducers,
);


test('App can mount', () => {
  const { getByText } = render(
    <Provider store={store} >
      <DndProvider backend={TestBackend}>
        <App />
      </DndProvider>
    </Provider>
  );

  const linkElement = getByText(/checkers, by dan lopuch/i);
  expect(linkElement).toBeInTheDocument();
});
