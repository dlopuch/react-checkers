import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { reducers } from './reducers';
import './index.css';
import App from './App';


// Init redux store
let store = createStore(
  reducers,
);

if (process.env.NODE_ENV !== 'production') {
  window.store = store;
}


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store} >
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
