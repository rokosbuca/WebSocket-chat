import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Input, Button } from 'antd';
import axios from 'axios';
import openSocket from 'socket.io-client';

// resh api endpoint
const urlChatrooms = 'http://localhost:3001/api/chatrooms';

// socket
const socket = openSocket('http://localhost:3001');

class ChatroomCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatroom: '',
            password: '',
            user: '',
            redirect: false,
            newChatroomRedirect: ''
        };
    }

    getCurrentTime = () => {
        return new Date().toLocaleString();
    }

    createChatroom = () => {
        if (this.state.chatroom === '') {
            return;
        }
        if (this.state.user === '') {
            return;
        }

        // check if chatroom name is unique
        axios.get(urlChatrooms)
        .then((res) => {
            const chatrooms = res.data.chatrooms;

            let unique = true;
            chatrooms.forEach((chatroom) => {
                if (chatroom.chatroom === this.state.chatroom) {
                    console.log('Chatroom name not unique.');
                    unique = false;
                }
            });

            if (!unique) {
                return;
            }

            console.log('creating chatroom...');
            console.log('\tchatroom:', this.state.chatroom);
            console.log('\tpassword:', (this.state.password !== '' ? this.state.password : '"empty password"'));
            console.log('\tuser:', this.state.user);
            const newChatroom = {
                chatroom: {
                    chatroom: this.state.chatroom,
                    password: (this.state.password ? this.state.password : ''),
                    createdAt: this.getCurrentTime(),
                    createdBy: this.state.user
                }
            }
            axios.post(urlChatrooms, newChatroom)
            .then((res) => {
                console.log('Initial chatroom messages:\n\t'
                    + res.data.chatroom.initMessages[0]
                    + '\n\t' + res.data.chatroom.initMessages[1]);
                    
                const linkChatroom = '/chatrooms/' + res.data.chatroom.chatroom;
                this.setState({
                    redirect: true,
                    newChatroomRedirect: linkChatroom
                });

                // new chatroom was created
                // notify all users watching the homepage
                // send chatroom's id (chatroom's name) to server
                console.log('Emitting ' + res.data.chatroom.chatroom);
                socket.emit('newChatroomCreated', res.data.chatroom.chatroom);
            })
            .catch((responseObject) => {
                console.log('Error. Response object:', responseObject);
            });
        })
        .catch((responseObject) => {
            console.log('Error while calling GET api/chatrooms. responseObject:', responseObject);
        })
    }

    updateChatroom = (e) => {
        this.setState({
            chatroom: e.target.value
        });
    }

    updatePassword = (e) => {
        this.setState({
            password: e.target.value
        });
    }

    updateUser = (e) => {
        this.setState({
            user: e.target.value
        });
    }

    render() {
        if (this.state.redirect) {
            console.log('Redirecting to', this.state.newChatroomRedirect);
            return <Redirect to={ this.state.newChatroomRedirect } />
        }
        return (
            <div style={{ marginLeft: 32 }}>
                <h1>
                    Create New Chat Room
                </h1>
                <br /><br /><br />
                <Input
                    placeholder="Chatroom name"
                    size="large"
                    onChange={ this.updateChatroom }
                /><br />
                <Input
                    placeholder="Password"
                    size="large"
                    onChange={ this.updatePassword }
                /><br />
                <Input
                    placeholder="Your username"
                    size="large"
                    onChange={ this.updateUser }
                /><br /><br />
                <Button onClick={ this.createChatroom } >
                    Create Chatroom
                </Button>
            </div>
        );
    }
}
 
export default ChatroomCreate;