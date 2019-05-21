import React, {Component} from 'react';

var color = ['black', 'brown', 'red', 'pink', 'orange', 'yellow', 'green', 'chartreuse', 'aqua', 'blue', 'purple'];

class ToolSetup extends Component {
    constructor(props){
        super(props);
    }

    state = {  }

    componentDidMount(){
        document.getElementById('width').addEventListener('change', e => {this.props.changeWidth(e.target.value)})
    }

    static getDerivedStateFromProps(nextProps, prevState){
        var widthBar = document.getElementById('width');
        if(widthBar != null){
            widthBar.value = nextProps.widthValue;
        }
        return null;
    }
    
    render() { 
        return ( 
            <div className = 'tool-Setup' style = {this.props.style}>
                <ul>
                {color.map( e => {return(<li className = 'color' style = {{backgroundColor: e, cursor: 'pointer'}} onClick = {() => this.props.changeColor(e)}></li>)})}
                </ul>
                <input id="width" type = 'range' min = '1' max = '60' step = '1' defaultValue = '1'></input>
            </div>
        );
    }
}
 
export default ToolSetup;