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
import Header from "./Layout/Header";
import DeleteCategory from "./Views/DeleteCategory";

function App() {
    return (
        <div className="App">
            <Router>
                <Header/>
                <Container maxWidth="md" style={{marginTop:'20px'}}>
                    <Switch>
                        <Route path="/edit-category">
                            <CategoryEdit/>
                        </Route>
                        <Route path="/delete-category">
                            <DeleteCategory/>
                        </Route>
                        <Route exact path="/">
                            <Home/>
                        </Route>
                    </Switch>
                </Container>
            </Router>
        </div>
    );
}

export default App;
