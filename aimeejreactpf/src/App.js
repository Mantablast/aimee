import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from './pages/Home';
import Skillset from './pages/Skillset';
import About from './pages/About';
import Nav from './components/Nav';
import Contact from './pages/Contact'
import Resume from './pages/Resume'
import GivingThanks from './pages/GivingThanks';
// import express from 'express';

function App() {

  
  return (
    <div className="App">
      <main>
        <Router>
        <Nav />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/skillset" component={Skillset} />
            <Route exact path="/about" component={About} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/resume" component={Resume} />
            <Route exact path="/givingthanks" component={GivingThanks} />
          </Switch>
        </Router>
      </main>
      
    </div>
  );
}

export default App;
