import React, { Component } from 'react';
import { Button, Input } from 'antd';

class ChatroomInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enteredPassword: ''
        }
        console.log(this.props.chatroom.chatroom + ' PROPS:', this.props.chatroom);
    }

    updateEnteredPassword = (e) => {
        this.setState({
            enteredPassword: e.target.value
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
                    placeholder="Password"
                    size="large"
                    onChange={ this.updateEnteredPassword }
                />
            );
        }
    }

    joinChatroom = (chatroomId) => {
        
    }

    render() { 
        return (
            <div>
                { this.props.chatroom.chatroom }&emsp;&emsp;
                <Button onClick={ this.joinChatroom } >
                    &emsp;Join&emsp;
                </Button>&emsp;
                { this.renderPassword() }&emsp;&emsp;
                users: { this.props.chatroom.nUsers }
                -&emsp;-
            </div>
        );
    }
}
 
export default ChatroomInfo;