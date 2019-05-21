import React, { Component } from 'react';
import ChatTag from './ChatTag';

class ChatBox extends Component {
    constructor(props){
        super(props);

        this.props.socket.on(`addMessage/${this.props.roomId}`, msg => this.addMessage(msg));
    }

    state = { chatList: [] }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.chat !== undefined){
            return {chatList: nextProps.chat}
        }
    }

    componentDidMount(){
        document.getElementById('chatInput').addEventListener('keyup', e => {
            if(e.keyCode === 13 && e.target.value.trim() !== ''){
                this.props.socket.emit('sendMessage', {
                    roomId: this.props.roomId, message: e.target.value.trim(), name: this.props.name});
                    e.target.value = '';
            }
        });
    }

    addMessage = obj => {
        var chatList = this.state.chatList;
        chatList.push(obj);
        this.setState({chatList: chatList});
    }

    render() { 
        return ( 
            <div className = 'chat-box'>
                <div className = 'chat-window'>
                    <ul>
                        {this.state.chatList.map(msg => <ChatTag msg = {msg}/>)}
                        {/* {this.state.chatList.map(e => {
                            return(<li> {e.name}: {e.message} </li>);
                        })} */}
                    </ul>
                </div>
                <div className = 'chat-input'>
                    <span>{this.props.name} :</span>
                    <input id = 'chatInput' type = 'text'></input>
                </div>
            </div>
         );
    }
}
 
export default ChatBox;