import React, { Component } from 'react';
import axios from 'axios';

class Home extends Component {
    state = {  }

    CreateRoom = () => {
        var username = document.getElementById('username');
        if(username != null && username.value.trim() != ''){
            axios.post('GET/createRoom', {name: username.value.trim()})
                .then(res => {
                    this.setState({roomId: res.data});
                    this.props.history.push({pathname: `room/${this.state.roomId}`, 
                                                state: {username: username.value.trim()}});
                })
                .catch(err => {
                    console.log(err);
                })
        }else{
                username.parentElement.nextSibling.style.color = 'rgb(228, 76, 76)'
        }
    }
    
    popUp = e => {
        var username = document.getElementById('username');
        if(username != null && username.value.trim() != ''){
            var popUpWindow = e.target.nextSibling;
            var layer = document.getElementById('layer');
            layer.addEventListener('click', () => {
                popUpWindow.style.display = 'none';
                layer.style.display = 'none';
            })
            layer.style.display = 'block';
            popUpWindow.style.display = 'flex';
        }else{
            username.parentElement.nextSibling.style.color = 'rgb(228, 76, 76)'
        }
    }

    hideWarning = e => {
        var warn = document.getElementsByClassName('warning');
        if(warn[e] !== null){
            warn[e].style.color = 'rgb(250, 247, 241)';
        }
    }
    
    Join = e => {
        var target = e.target;
        axios.post('GET/isRoomExist', {roomId: target.previousSibling.previousSibling.value})
        .then(res => {
            if(res.data === false){
                    target.previousSibling.style.color = 'rgb(228, 76, 76)'
                }else{
                    var username = document.getElementById('username');
                    var layer = document.getElementById('layer');
                    layer.style.display = 'none';
                    this.props.history.push({pathname: `room/${target.previousSibling.previousSibling.value}`, 
                                                state: {username: username.value.trim()}});
                }
            })
    }

    render() { 
        return (
                <div className = 'home-container'>
                    <p>Online Whiteboard</p>
                    <div className = 'home-name' onClick = {() => this.hideWarning(0)}>
                        <input id = 'username' type = 'text' placeholder = ' '></input>  
                        <span >NickName</span>
                    </div>
                    <span className = 'warning'>Please enter your nickname</span>
                    <div className = 'home-btn'>
                        <div id = 'createRoom-btn' onClick = {this.CreateRoom}>Create Room</div>
                        <div id = 'joinRoom-btn' onClick = {this.popUp}>Join Room</div>
                        <div className = 'popup-window' style = {{display: 'none'}}>
                            <p>Room id :</p>
                            <input type = 'text' onClick = {() => this.hideWarning(1)}></input>
                            <span className = 'warning'>Room not found</span>
                            <div onClick = {this.Join}>Join</div>
                        </div>
                    </div>
                </div>
         );
    }
}
 
export default Home;