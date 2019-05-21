import React from 'react';

export default ({msg}) => {
    return (
        <li>
            <span className = 'chatDisplayName'>{msg.name}: </span>
            <br></br>
            <span className = 'chatDisplayMessage' style = {{paddingLeft: '0.7em'}}>{msg.message}</span>
            <hr></hr>
        </li>
    )
}