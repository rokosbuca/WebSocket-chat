import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Input, Button } from 'antd';
import axios from 'axios';

const urlChatRooms = 'http://localhost:3001/api/chatrooms';

class ChatroomCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatroom: '',
            password: '',
            user: ''
        };
    }

    getCurrentTime = () => {
        return new Date().toLocaleString();
    }

    createChatroom = () => {
        console.log('creating chatroom...');
        console.log('\tchatroom:', this.state.chatroom);
        console.log('\tpassword:', (this.state.password ? this.state.password : 'empty password'));
        console.log('\tuser:', this.state.user);
        if (this.state.chatroom === '') {
            return;
        }
        if (this.state.user === '') {
            return;
        }

        // check if chatroom name is unique
        axios.get(urlChatRooms)
        .then((res) => {
            const chatrooms = res.data.chatrooms;

            chatrooms.forEach((chatroom) => {
                if (chatroom.name === this.state.chatroom) {
                    return;
                } else {
                    const newChatroom = {
                        chatroom: {
                            chatroom: this.state.chatroom,
                            password: (this.state.password ? this.state.password : ''),
                            createdAt: this.getCurrentTime(),
                            createdBy: this.state.user
                        }
                    }
                    axios.post(urlChatRooms, newChatroom)
                    .then((res) => {
                        const link = '/chatrooms/' + res.chatroom.chatroom;
                        return <Redirect push to={ link } />
                    })
                    .catch((responseObject) => {
                        console.log('Error. Response object:', responseObject);
                    })
                }
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
                    onChange={ this.password }
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