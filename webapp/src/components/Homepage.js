import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Button, List } from 'antd';
import axios from 'axios';

import ChatroomInfo from './ChatroomInfo';

const urlChatrooms = 'http://localhost:3001/api/chatrooms';

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            chatroomList: []
        }
    }

    componentDidMount = () => {
        this.getChatrooms();
    }

    parseChatroomList = (chatrooms) => {
        const chatroomList = [];

        chatrooms.forEach((chatroom) => {
            const chatroomString = chatroom.chatroom 
                + ':\tpassword: ' + chatroom.password
                + '\tusers: ' + chatroom.nUsers
                + '\tmessages: ' + chatroom.nMessages
                + '\tadmin: ' + chatroom.createdBy
                + '\tcreated: [' + chatroom.createdAt + ']';

            chatroomList.push(chatroomString);
        });

        return chatroomList;
    }

    getChatrooms = () => {
        axios.get(urlChatrooms)
        .then((res) => {
            this.setState({
                loading: false,
                chatroomList: res.data.chatrooms
            });
        })
        .catch((responseObject) => {
            console.log('Caught an error - responseObject:', responseObject);
            this.setState({
                loading: false,
                chatroomList: []
            });
        });
    }

    render() { 
        return (
            <div style={{ marginLeft: 32 }}>
                <h1>Chatroom Homepage</h1>
                <br /><br />
                <h3>List of Chat Rooms:</h3>
                <List
                size="default"
                    title="List of Chat Rooms:"
                    header={
                        <Link to={ '/new' }>
                            <Button>
                                Create New Chatroom
                            </Button>
                        </Link>
                    }
                    bordered={ true }
                    loading={ this.state.loading }
                    dataSource={ this.state.chatroomList }
                    renderItem={ item => (<List.Item><ChatroomInfo chatroom={ item }/></List.Item>) }
                />
            </div>
        );
    }
}
 
export default Homepage;