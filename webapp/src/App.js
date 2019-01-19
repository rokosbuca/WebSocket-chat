import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'

import Homepage from './components/Homepage';
import Chatroom from './components/Chatroom';
import ChatroomCreate from './components/ChatroomCreate';

class App extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/' component={ Homepage } />
                <Route exact path='/new' component={ ChatroomCreate } />
                <Route path='/chatrooms/:chatroom' component={ Chatroom } />
            </Switch>
        );
    }
}

export default App;
