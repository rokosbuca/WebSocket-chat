/**
 * 
 * @author rsb
 */

import React, { Component } from 'react';
import axios from 'axios';

const urlChatrooms = 'http://localhost:3001/api/chatrooms';

class Chatroom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatroomId: this.props.match.params.chatroom
        }
    }

    componentDidMount = () => {
        axios.get(urlChatrooms + '/' + this.state.chatroomId)
        .then((res) => {
            console.log(res.data);
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
                
            </div>
        );
    }
}

export default Chatroom;
