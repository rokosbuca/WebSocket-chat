import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'

import Homepage from './components/Homepage';
import Chatroom from './components/Chatroom';
import ChatroomJoin from './components/ChatroomJoin';
import ChatroomCreate from './components/ChatroomCreate';

class App extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/' component={ Homepage } />
                <Route path='/join' component={ ChatroomJoin } />
                <Route path='/new' component={ ChatroomCreate } />
                <Route path='/room/:roomId' component={ Chatroom } />
            </Switch>
        );
    }
}

export default App;
