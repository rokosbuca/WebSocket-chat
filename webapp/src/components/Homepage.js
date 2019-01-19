import React, { Component } from 'react';
import { List } from 'antd';
import axios from 'axios';

import ChatRoomInfo from './ChatRoomInfo';

const data = [
    'chatroom 1',
    'ChatRoom 2',
    'Chat room 3',
    'Chat Room 4'
]

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatRoomList: []
        }
    }

    componentDidMount = () => {
        axios.get('http://localhost:3001/api/rooms')
        .then((res) => {
            console.log('res:', res);
        })
        .catch((responseObject) => {
            console.log('Caught an error - responseObject:', responseObject);
        });
    }

    render() { 
        return (
            <div style={{ marginLeft: 32 }}>
                <h1>ChatRoom Homepage</h1>
                <br /><br />
                <h3>List of ChatRooms:</h3>
                <List
                size="default"
                    header={<div>Header</div>}
                    footer={<div>Footer</div>}
                    bordered
                    dataSource={data}
                    renderItem={item => (<List.Item>{item}</List.Item>)}
                />
            </div>
        );
    }
}
 
export default Homepage;