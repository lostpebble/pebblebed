import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import { Provider } from "react-fela";

// Your top level component
// import App from './App'
// import { getFelaRenderer } from "./fela/renderer";

import { PebbleTree } from "./PebbleTree";

// Export your top level component (for static rendering)
export default PebbleTree.getParentAppComponent();

/*

// Render your app
if (typeof document !== 'undefined') {
  const render = Comp => {
    const renderer = getFelaRenderer();

    ReactDOM.hydrate(
      <AppContainer>
        <Provider renderer={renderer}>
          <Comp />
        </Provider>
      </AppContainer>,
      document.getElementById('root'),
    )
  }

  // Render!
  render(App)

  // Hot Module Replacement
  if (module.hot) {
    module.hot.accept('./App', () => {
      render(require('./App').default)
    })
  }
}
*/
