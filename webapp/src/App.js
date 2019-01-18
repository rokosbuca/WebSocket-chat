import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'

import Homepage from './components/Homepage';
import ChatRoom from './components/ChatRoom';
import ChatRoomJoin from './components/ChatRoomJoin';
import ChatRoomCreate from './components/ChatRoomCreate';

class App extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/' component={ Homepage } />
                <Route path='/join' component={ ChatRoomJoin } />
                <Route path='/create' component={ ChatRoomCreate } />
                <Route path='/room/:roomId' component={ ChatRoom } />
            </Switch>
        );
    }
}

export default App;
