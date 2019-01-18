import React, { Component } from 'react';
import { Button } from 'antd';

class MyButton extends Component {
    constructor(props) {
        super(props);
        this.state = { counter: 0 }
    }
    render() { 
        return (  
            <Button onClick={() => { this.setState({ counter:this.state.counter + 1} )} }>
                { this.state.counter }
            </Button>
        );
    }
}
 
export default MyButton;