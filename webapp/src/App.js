import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'

import Homepage from './components/Homepage';
import Chatroom from './components/Chatroom';
import ChatroomCreate from './components/ChatroomCreate';
import ChatroomJoin from './components/ChatroomJoin';

class App extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/' component={ Homepage } />
                <Route exact path='/new' component={ ChatroomCreate } />
                <Route exact path='/join/:chatroom' component={ ChatroomJoin } />
                <Route exact path='/chatrooms/:chatroom/:user' component={ Chatroom } />
            </Switch>
        );
    }
}

export default App;
