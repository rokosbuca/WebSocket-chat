/**
 * 
 * @author rsb
 */

import React, { Component } from 'react';
import { List } from 'antd';
import axios from 'axios';

import { subscribeToTimer } from '../socket/timer';
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3001');

const urlChatrooms = 'http://localhost:3001/api/chatrooms';

class Chatroom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatroomId: this.props.match.params.chatroom,
            chatroomData: {},
            timestamp: 'no timestamp yet'
        }

        subscribeToTimer((err, timestamp) => {
            this.setState({ 
                timestamp: timestamp
            });
        });
    }

    componentDidMount = () => {
        axios.get(urlChatrooms + '/' + this.state.chatroomId)
        .then((res) => {
            console.log('GET ' + urlChatrooms + '/' + this.state.chatroomId + ':');
            console.log(res.data.chatroom);
            this.setState({
                chatroomData: res.data.chatroom
            });

            socket.emit('user connected to chatroom', { userId: 'uusseerr', chatroomId: 'cchhaattrroooomm' });
        })
        .catch((responseObject) => {
            console.log('Error. responseObject', responseObject);
        });
    }

    render() { 
        return (
            <div>
                new { this.props.match.params.chatroom }
                <br /><br />
                <List
                    size="default"
                    title="List of Chat Rooms:"
                    header={ this.state.timestamp }
                    bordered={ true }
                    loading={ this.state.loading }
                    dataSource={ this.state.chatroomData.messages }
                    renderItem={ item => (<List.Item>{ item }</List.Item>) }
                />
                
            </div>
        );
    }
}

export default Chatroom;
