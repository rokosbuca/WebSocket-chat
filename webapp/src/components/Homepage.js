import React, { Component } from 'react';
import { Button, List } from 'antd';
import axios from 'axios';

import ChatRoomInfo from './ChatRoomInfo';

const urlChatRooms = 'http://localhost:3001/api/chatrooms';

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

    getChatrooms = () => {
        axios.get(urlChatRooms)
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

    createNewChatroom = () => {
        const chatroom = {
            chatroom: "ch2",
            password: "",
            createdAt: "21:07:13",
            createdBy: "mega admin"
        }
        axios.post(urlChatRooms, { chatroom })
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
                        <Button onClick={ this.createNewChatroom }
                        >
                            Create New Chat Room
                        </Button>
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