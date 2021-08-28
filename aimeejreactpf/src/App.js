import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from './pages/Home';
import About from './pages/About';
import Nav from './components/Nav';
// import express from 'express';


function App() {
  return (
    <div className="App">
      <main>
        <Router>
        <Nav />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
          </Switch>
        </Router>
      </main>
      
    </div>
  );
}

export default App;
