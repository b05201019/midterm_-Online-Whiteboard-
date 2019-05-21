import React, { Component } from 'react';
import Nav from './Nav';
import ChatBox from '../components/ChatBox'
import DrawingField from '../components/DrawingField'
import io from 'socket.io-client';

var socket = io('http://localhost:3001');

class Room extends Component {
    constructor(props){
        super(props);

        this.state = {};
        // socket.room = this.props.match.params.id;
        socket.emit('getAllMessage', {roomId: this.props.match.params.id})
        socket.on(`initAllMessage/${this.props.match.params.id}`, data => {
            this.setState({chat: data.chat});
        })
        // socket.emit('addRoom', {roomId: this.props.match.params.id})
    }

    state = {  }

    render() { 
        return ( 
            <React.Fragment>
                <Nav roomId = {this.props.match.params.id}></Nav>
                <div className = 'room'>
                    <ChatBox socket = {socket} roomId = {this.props.match.params.id} name = {this.props.location.state === undefined?'userUnknown':this.props.location.state.username} chat = {this.state.chat}/>
                    <DrawingField socket = {socket} roomId = {this.props.match.params.id} />
                </div>
            </React.Fragment>
         );
    }
}
 
export default Room;