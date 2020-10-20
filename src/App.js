import React from 'react';

import './App.css';
import Home from "./Views/Home";
import CategoryEdit from "./Views/CategoryEdit";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Container from '@material-ui/core/Container';

function App() {
  return (
    <div className="App">
      <Router>
        <Container maxWidth="md">
          <div className="headline" >
            TekStream Content Process Automation Category Management
          </div>

          <Switch>
            <Route path="/edit-category">
              <CategoryEdit/>
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </Container>
      </Router>
    </div>
  );
}

export default App;
