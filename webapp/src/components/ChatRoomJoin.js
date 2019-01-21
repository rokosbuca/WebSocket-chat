import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Input, Button } from 'antd';
import axios from 'axios';
import openSocket from 'socket.io-client';

// resh api endpoint
const urlChatrooms = 'http://localhost:3001/api/chatrooms';
const urlChatroom = 'http://localhost:3001/api/chatrooms/';

// socket
const socket = openSocket('http://localhost:3001');

class ChatroomJoin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatroom: this.props.match.params.chatroom,
            user: '',
            redirect: false,
            joinChatroomRedirect: ''
        };
    }

    getCurrentTime = () => {
        return new Date().toLocaleString();
    }

    joinChatroom = () => {
        if (this.state.user === '') {
            return;
        }

        // check if user name is unique to the chatroom
        axios.get(urlChatroom + this.state.chatroom)
        .then((res) => {
            // res = {}
            //  - chatroom
            //  - password
            //  - createdAt
            //  - createdBy
            //  - nUsers
            //  - users
            //  - nMessages
            //  - messages
            const chatroom = res.data.chatroom;

            let unique = true;
            chatroom.users.forEach((user) => {
                if (user === this.state.user) {
                    console.log('User name not unique.');
                    unique = false;
                }
            });

            if (!unique) {
                return;
            }

            console.log('Joining chatroom...');
            console.log('\tchatroom:', this.state.chatroom);
            console.log('\tuser:', this.state.user);

            const joinChatroomData = {
                chatroom: {
                    chatroom: this.state.chatroom,
                    user: this.state.user
                }
            }
            
            axios.post(urlChatroom + this.state.chatroom, joinChatroomData)
            .then((res) => {
                const linkChatroom = '/chatrooms/' + this.state.chatroom + '/' + this.state.user;
                this.setState({
                    redirect: true,
                    joinChatroomRedirect: linkChatroom
                });

                // user joined chatroom
                // 1) notify chatroom via websocket
                socket.emit('new message in chatroom', this.state.chatroom);
                // 2) notify homepage to update itself
                socket.emit('update homepage', this.state.chatroom);
            })
            .catch((responseObject) => {
                console.log('Error. Response object:', responseObject);
            });
        })
        .catch((responseObject) => {
            console.log('Error while calling GET api/chatrooms/. responseObject:', responseObject);
        })
    }

    updateUser = (e) => {
        this.setState({
            user: e.target.value
        });
    }

    render() {
        if (this.state.redirect) {
            console.log('Redirecting to', this.state.newChatroomRedirect);
            return <Redirect to={ this.state.joinChatroomRedirect } />
        }
        return (
            <div style={{ marginLeft: 32 }}>
                <h1>
                    Join chatroom { this.state.chatroom }
                </h1>
                <br /><br /><br />
                <Input
                    placeholder="Your username"
                    size="large"
                    onChange={ this.updateUser }
                /><br /><br />
                <Button onClick={ this.joinChatroom } >
                    Join Chatroom
                </Button>
            </div>
        );
    }
}
 
export default ChatroomJoin;