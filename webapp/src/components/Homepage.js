import React, { Component } from 'react';
import { List } from 'antd';
import axios from 'axios';

import ChatRoomInfo from './ChatRoomInfo';

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatRoomList: []
        }
    }

    componentDidMount = () => {
        axios.get('http://localhost:3001/api/chatrooms')
        .then((res) => {
            this.setState({ chatRoomList: res.data.chatrooms });
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
                    header={ <div>Header</div> }
                    bordered
                    dataSource={ this.state.chatRoomList }
                    renderItem={ item => (<List.Item>{item}</List.Item>) }
                />
            </div>
        );
    }
}
 
export default Homepage;