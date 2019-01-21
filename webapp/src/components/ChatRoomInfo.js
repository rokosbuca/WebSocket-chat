import React, { Component } from 'react';
import { Redirect, withRouter, Route } from 'react-router-dom';
import { Button, Input } from 'antd';
import axios from 'axios';
import openSocket from 'socket.io-client';

// resh api endpoint
const urlChatrooms = 'http://localhost:3001/api/chatrooms';

// socket
const socket = openSocket('http://localhost:3001');

class ChatroomInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enteredPassword: '',
            passwordInputPlaceholder: 'Password',
            passwordCorrect: this.props.chatroom.password === '',
            redirect: false,
            redirectLink: ''
        }
        console.log(this.props.chatroom.chatroom + ' PROPS:', this.props.chatroom);
    }

    updateEnteredPassword = (e) => {
        this.setState({
            enteredPassword: e.target.value,
            passwordCorrect: e.target.value === this.props.chatroom.password
        });
    }

    renderPassword = () => {
        if (this.props.chatroom.password === '') {
            return (
                <i>&emsp;&emsp;&emsp;no password&emsp;&emsp;&nbsp;&nbsp;&nbsp;</i>
            );
        } else {
            return (
                <Input
                    placeholder={ this.state.passwordInputPlaceholder }
                    size="large"
                    onChange={ this.updateEnteredPassword }
                    value={ this.state.enteredPassword }
                />
            );
        }
    }

    isPasswordCorrect = () => {
        return new Promise((resolve, reject) => {
            axios.get(urlChatrooms + '/' + this.props.chatroom.chatroom)
            .then((res) => {
                if (res.data.chatroom.password === '') {
                    resolve(true);
                } if (this.state.enteredPassword === res.data.chatroom.password) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch((responseObject) => {
                console.log('Error while calling GET api/chatrooms/' + this.props.chatroom.chatroom);
                reject(responseObject);
            });
        });
    }

    tryJoinChatroom = (chatroomId) => {
        this.isPasswordCorrect()
        .then((passwordCorrect) => {
            if (passwordCorrect) {
                
            } else {
                this.setState({
                    enteredPassword: '',
                    passwordInputPlaceholder: 'Wrong Password'
                });
            }
        })
        .catch((error) => {
            console.log('Error while checking if the password was correct. Error message:', error);
        })
    }

    renderJoinButton = withRouter(({ history }) => (
        <Button
            onClick={ () => { history.push('/join/' + this.props.chatroom.chatroom) } }
        >
            Join    
        </Button>
    ))

    render() {
        if (this.state.redirect) {
            console.log('Redirecting to', this.state.redirectLink);
            return <Redirect to={ this.state.redirectLink } />
        }

        return (
            <div>
                { this.props.chatroom.chatroom }&emsp;&emsp;
                <Route render={({ history }) => (
                    <Button
                        disabled={ !this.state.passwordCorrect }
                        onClick={ () => { history.push('/join/' + this.props.chatroom.chatroom) } }>
                        &emsp;Join&emsp;
                    </Button>
                )} />&emsp;
                { this.renderPassword() }&emsp;&emsp;
                {/*}users:&nbsp;{ this.props.chatroom.nUsers }&emsp;{*/}
                messages:&nbsp;{ this.props.chatroom.nMessages }&emsp;
                &emsp;
                &emsp;
                admin:&nbsp;"{ this.props.chatroom.createdBy }"&emsp;&emsp;
                [{ this.props.chatroom.createdAt }]
            </div>
        );
    }
}
 
export default ChatroomInfo;