import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Button, List } from 'antd';
import axios from 'axios';

import ChatRoomInfo from './ChatroomInfo';

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
            const chatroomString = chatroom.chatroom + ';' + chatroom.password + ';' + chatroom.createdAt + ';' + chatroom.createdBy;
            chatroomList.push(chatroomString);
        });

        return chatroomList;
    }

    getChatrooms = () => {
        axios.get(urlChatrooms)
        .then((res) => {
            this.setState({
                loading: false,
                chatroomList: this.parseChatroomList(res.data.chatrooms)
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

    createNewChatroom = () => {
        const chatroom = {
            chatroom: "ch2",
            password: "",
            createdAt: "21:07:13",
            createdBy: "mega admin"
        }
        axios.post(urlChatrooms, { chatroom })
        .then((res) => {
            console.log(res);
            this.addChatroomToList('new chatroom'/*res.data.chatroom.chatroom*/);
        })
        .catch((responseObject) => {
            console.log('Error. Response object:', responseObject);
        })
    }

    addChatroomToList = (chatroom) => {
        const newChatroomList = this.state.chatroomList;
        newChatroomList.push(chatroom);

        this.setState({ chatroomList: newChatroomList });
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
                    renderItem={ item => (<List.Item>{item}</List.Item>) }
                />
            </div>
        );
    }
}
 
export default Homepage;