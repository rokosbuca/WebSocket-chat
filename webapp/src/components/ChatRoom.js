/**
 * 
 * @author rsb
 */

import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { List, Input, Button } from 'antd';
import axios from 'axios';

import { subscribeToTimer } from '../socket/timer';
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3001');

const urlChatrooms = 'http://localhost:3001/api/chatrooms';
const urlChatroom = 'http://localhost:3001/api/chatrooms/';

class Chatroom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatroomId: this.props.match.params.chatroom,
            userId: this.props.match.params.user,
            chatroomData: {},
            timestamp: 'no timestamp yet',
            message: ''
        }

        subscribeToTimer((err, timestamp) => {
            this.setState({ 
                timestamp: timestamp
            });
        });

        socket.on('update messages in chatroom ' + this.state.chatroomId, this.handleMessagesUpdate);
    }

    handleMessagesUpdate = (chatroomData) => {
        this.setState({
            chatroomData: chatroomData
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

            socket.emit('user connected to chatroom', { userId: this.state.user, chatroomId: this.state.chatroomId });
            socket.emit('update messages in chatroom', { chatroom: this.state.chatroomId, user:this.state.userId });
        })
        .catch((responseObject) => {
            console.log('Error. responseObject', responseObject);
        });
    }

    updateMessage = (e) => {
        this.setState({
            message: e.target.value
        });
    }

    handleSend = () => {
        // 1) send new message to be saved
        const newMessageData = {
            chatroom: {
                chatroom: this.state.chatroomId,
                user: this.state.userId,
                message: this.state.message   
            }
        }
        axios.put(urlChatroom + this.state.chatroomId, newMessageData)
        .then((res) => {
            console.log('Sent message:', this.state.message);
            // 2) notify homepage to update itself
            socket.emit('update homepage', this.state.chatroomId);
            // 3) notify chatroom to update messages
            socket.emit('update messages in chatroom', { chatroom: this.state.chatroomId, user:this.state.userId });

            // reset input field
            /*
            this.setState({
                message: ''
            });
            */
        })
        .catch((responseObject) => {
            console.log('Error. responseObject', responseObject);
        });
    }

    render() { 
        return (
            <div>
                <h1>Chatroom { this.props.match.params.chatroom }</h1>
                <br />
                <Route render={({ history }) => (
                    <Button
                        onClick={ () => {
                                // handle disconnect
                                const disconnectData = {
                                    chatroom: {
                                        chatroom: this.state.chatroomId,
                                        user: this.state.userId
                                    }
                                }
                                axios.delete(urlChatroom + this.state.chatroomId, disconnectData)
                                .then(() => {
                                    // 1) notify chatroom via websocket
                                    socket.emit('new message in chatroom', this.state.chatroom);
                                    // 2) notify homepage to update itself
                                    socket.emit('update homepage', this.state.chatroom);
                                    history.push('/');
                                    // 3) update chatroom messages for everybody
                                    socket.emit('update messages in chatroom', { chatroom: this.state.chatroomId, user:this.state.userId });
                                })
                                .catch((responseObject) => {
                                    console.log('Error while disconnection. reponseObject:', responseObject);
                                });
                            }
                        }
                    >
                        &emsp;Disconnect&emsp;
                    </Button>
                )} />&emsp;
                <Input
                    placeholder="Message"
                    size="large"
                    onChange={ this.updateMessage }
                />&nbsp;
                <Button onClick={ this.handleSend }>
                    Send
                </Button>
                <br /><br />
                <List
                    size="default"
                    title="List of Chat Rooms:"
                    header={ 'server time: ' + this.state.timestamp }
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
