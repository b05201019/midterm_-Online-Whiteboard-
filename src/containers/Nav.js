import React, { Component } from 'react';
import {Link} from "react-router-dom";

class Nav extends Component {
    state = {  }
    render() { 
        return ( 
            <nav className = 'Nav'>
                <Link to = '/'>Online Whiteboard</Link>
                <span>#{this.props.roomId}</span>
            </nav>
         );
    }
}
 
export default Nav;