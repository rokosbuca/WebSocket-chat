import React, { Component } from 'react';

import { Button } from 'antd';

class Chatroom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            created: false
        }
    }

    renderCreatingNewChatroom = () => {
        return (
            <Button onClick={ () => { this.setState({ created: true }); } }>
                Create
            </Button>
        );
    }

    renderChatroom = () => {
        return (
            <div>chatroom</div>
        );
    }

    render() { 
        return ( this.state.created ?
            this.renderCreatingNewChatroom()
            :
            this.renderChatroom()
        );
    }
}

export default Chatroom;