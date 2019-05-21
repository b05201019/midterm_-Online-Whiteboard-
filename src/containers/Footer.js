import React, { Component } from 'react';

class Footer extends Component {
    state = { display: '' }

    closeAd = () => {
        this.setState({display: 'none'});
    }

    render() { 
        return (
            <div className = 'Footer' style = {{'display': this.state.display}}>
                <button id = 'x' onClick = {this.closeAd}>✖</button>
                <a href = 'https://www.facebook.com/2019-%E6%95%B8%E5%AD%B8%E4%B9%8B%E5%A4%9C-Infinity-336848270370980/'>
                   <img className = 'ad' src = {require('../img/infinity-ad.jpg')}></img>
                </a>
            </div>
         );
    }
}
 
export default Footer;