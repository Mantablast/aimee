import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from './pages/Home'

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <main>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
          </Switch>
        </Router>
      </main>
      </header>
    </div>
  );
}

export default App;
