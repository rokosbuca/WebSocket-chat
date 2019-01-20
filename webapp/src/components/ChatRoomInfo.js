import React, { Component } from 'react';
import { Redirect, withRouter, Route } from 'react-router-dom';
import { Button, Input } from 'antd';

class ChatroomInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enteredPassword: '',
            passwordInputPlaceholder: 'Password',
            redirect: false,
            redirectLink: ''
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
                    placeholder={ this.state.passwordInputPlaceholder }
                    size="large"
                    onChange={ this.updateEnteredPassword }
                    value={ this.state.enteredPassword }
                />
            );
        }
    }

    passwordIncorrect = () => {
        this.setState({
            enteredPassword: '',
            passwordInputPlaceholder: 'Incorrect password'
        });
    }

    passwordCorrect = () => {
        this.setState({
            redirect: true,
            redirectLink: '/chatrooms/' + this.props.chatroom.chatroom
        });
    }

    joinChatroom = (chatroomId) => {
        this.passwordCorrect();
    }

    renderJoinButton = withRouter(({ history }) => (
        <Button
            onClick={ () => { history.push('/chatrooms/'+this.props.chatroom.chatroom) } }
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
                    <Button onClick={ () => { history.push('/chatrooms/'+this.props.chatroom.chatroom)} }>
                        &emsp;Join&emsp;
                    </Button>
                )} />&emsp;
                { this.renderPassword() }&emsp;&emsp;
                users:&nbsp;{ this.props.chatroom.nUsers }&emsp;
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