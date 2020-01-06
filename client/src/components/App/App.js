import {Route} from 'react-router-dom'
import React, {Component} from 'react';

const App = ({children}) => (
  <Route

    render={(props) => {
      return (
          <main className="body-content">
              <div className="ms-content-wrapper">
                    {children}
              </div>
          </main>

      );
    }}
  />
);

export default App;
