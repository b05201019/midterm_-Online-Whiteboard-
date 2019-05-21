import React, { Component } from 'react';
import ToolSetup from './ToolSetup';

class DrawingField extends Component {
    constructor(props){
        super(props);

        this.state = { currentTool: 'pen', currentMethod: 'draw', currentStyle: {color: 'black', width: '1',  operation: 'source-over'},
            toolStyle: {pen:{color: 'black', width: '1', operation: 'source-over'}, eraser:{color: 'rgba(255,0,0,0.5)', width: '1', operation: 'destination-out'}, highlighter:{color: 'yellow', width: '1', operation: 'destination-over'}},
            value: '1', toolSetupDisplay: {display: 'none'}, eraserBarDisplay: {display: 'none'},
            toolIconselected: {pen: {filter: 'invert(0)'}, eraser: {filter: 'invert(0.5)'}, highlighter: {filter: 'invert(0.5)'}}}
    }

    componentDidMount(){
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');

        canvas.addEventListener('mousedown', e => mouseDown(e))
        canvas.addEventListener('mouseup', () => {canvas.removeEventListener('mousemove', mouseMove, false)});
        canvas.addEventListener('touchstart', e => touchStart(e));
        canvas.addEventListener('touchend', () => {canvas.removeEventListener('touchemove', touchMove, false)});

        var getMousePos = e => {
            var rect = canvas.getBoundingClientRect();
            
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            }
        }

         var mouseDown = e => {
            var mousePos = getMousePos(e);

            e.preventDefault();
            ctx.strokeStyle = this.state.currentStyle.color;
            ctx.lineWidth = this.state.currentStyle.width;
            ctx.globalCompositeOperation = this.state.currentStyle.operation;
            ctx.beginPath();
            ctx.moveTo(mousePos.x, mousePos.y);

            canvas.addEventListener('mousemove', mouseMove, false);
            
            var toolSet = {x: mousePos.x, y: mousePos.y, color: ctx.strokeStyle, width: ctx.lineWidth, operation: ctx.globalCompositeOperation};
            this.props.socket.emit('sendMouseData', {roomId: this.props.roomId, toolSet: toolSet});
        }
        
        var mouseMove = e => {
            var mousePos = getMousePos(e);

            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();

            this.props.socket.emit('drawing', {roomId: this.props.roomId, x: mousePos.x, y: mousePos.y});
        }

        var getTouchPos = e => {
            var rect = canvas.getBoundingClientRect();
        
            return {
                x: e.changedTouches[0].clientX - rect.left,
                y: e.changedTouches[0].clientY - rect.top
            };
        }

        var touchStart = e => {
            var touchPos = getTouchPos(e);

            e.preventDefault();
            ctx.strokeStyle = this.state.currentStyle.color;
            ctx.lineWidth = this.state.currentStyle.width;
            ctx.globalCompositeOperation = this.state.currentStyle.operation;
            ctx.beginPath();
            ctx.moveTo(touchPos.x, touchPos.y);

            canvas.addEventListener('touchmove', touchMove, false);

            var toolSet = {x: touchPos.x, y: touchPos.y, color: ctx.strokeStyle, width: ctx.lineWidth, operation: ctx.globalCompositeOperation};
            this.props.socket.emit('sendMouseData', {roomId: this.props.roomId, toolSet: toolSet});
        }

        var touchMove = e => {
            var touchPos = getTouchPos(e);
        
            ctx.lineTo(touchPos.x, touchPos.y);
            ctx.stroke();

            this.props.socket.emit('drawing', {roomId: this.props.roomId, x: touchPos.x, y: touchPos.y});
        }

        this.props.socket.on(`setMouseData/${this.props.roomId}`, data => {
            ctx.strokeStyle = data.color;
            ctx.lineWidth = data.width;
            ctx.globalCompositeOperation = data.operation;
            ctx.beginPath();
            ctx.moveTo(data.x, data.y);
        })

        this.props.socket.on(`uploadCanvas/${this.props.roomId}`, data => {
            ctx.lineTo(data.x, data.y);
            ctx.stroke();
        });

        this.props.socket.on(`doClearCanvas/${this.props.roomId}`, () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        })

        document.getElementById('eraser-widthBar').addEventListener('change', e => {
            this.changeWidth(e.target.value);
        })
    }

    componentDidUpdate(){
        switch(this.state.currentTool){
            case('pen'):
                if(this.compareObj(this.state.currentStyle, this.state.toolStyle.pen)){
                    break;
                }
                this.setState({currentStyle: this.state.toolStyle.pen, 
                    toolIconselected: {pen: {filter: 'invert(0)'}, eraser: {filter: 'invert(0.5)'}, highlighter: {filter: 'invert(0.5)'}}});
                break;
            case('eraser'):
                if(this.compareObj(this.state.currentStyle, this.state.toolStyle.eraser)){
                    break;
                }
                this.setState({currentStyle: this.state.toolStyle.eraser,
                    toolIconselected: {pen: {filter: 'invert(0.5)'}, eraser: {filter: 'invert(0)'}, highlighter: {filter: 'invert(0.5)'}}})
                break;
            case('highlighter'):
                if(this.compareObj(this.state.currentStyle, this.state.toolStyle.highlighter)){
                    break;
                }
                this.setState({currentStyle: this.state.toolStyle.highlighter,
                    toolIconselected: {pen: {filter: 'invert(0.5)'}, eraser: {filter: 'invert(0.5)'}, highlighter: {filter: 'invert(0)'}}})
                break;
        }
    }

    compareObj = (a, b) => {
        return a.color === b.color && a.width === b.width;
    }

    changeColor = e => {
        var style = this.state.toolStyle;
        switch(this.state.currentTool){
            case('pen'):
                style.pen.color = e;
                break;
            case('highlighter'):
                style.highlighter.color = e;
                break;
            }
        this.setState({toolStyle: style});
        this.setState({display: {toolList: '', colorList: 'none', widthBar: 'none'}})
    }

    usePen = () => {
        if(this.state.currentTool !== 'pen'){
            this.setState({currentTool: 'pen', toolSetupDisplay: {display: 'none'}, eraserBarDisplay: {display: 'none'}});
         }else{
             var display = (this.state.toolSetupDisplay.display === '')? 'none':'';
             this.setState({toolSetupDisplay: {display: display}});
         }
    }
    
    useEraser = () => {
        if(this.state.currentTool !== 'eraser'){
            this.setState({currentTool: 'eraser', toolSetupDisplay: {display: 'none'}});
        }else{
            var display = (this.state.eraserBarDisplay.display === '')? 'none':'';
            this.setState({eraserBarDisplay: {display: display}});
        }
    }

    useHighlighter = () => {
        if(this.state.currentTool !== 'highlighter'){
            this.setState({currentTool: 'highlighter', toolSetupDisplay: {display: 'none'}, eraserBarDisplay: {display: 'none'}});
        }else{
            var display = (this.state.toolSetupDisplay.display === '')? 'none':'';
            this.setState({toolSetupDisplay: {display: display}});
        }
    }

    changeWidth = e => {
        var style = this.state.toolStyle;
        switch(this.state.currentTool){
            case('pen'):
                style.pen.width = e;
                break;
            case('eraser'):
                style.eraser.width = e;
                break;
            case('highlighter'):
                style.highlighter.width = e;
                break;
            }
        this.setState({toolStyle: style});
    }

    cleanCanvas = () => {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.props.socket.emit('sendClearCanvas', {roomId: this.props.roomId});
    }

    render() {
        return ( 
            <div className = 'drawing-field'>
                <canvas id = 'canvas' height = '796' width = '1040'></canvas>
                <ul className = "Tools">
                    <li><i className ="fas fa-pen fa-3x" style = {this.state.toolIconselected.pen} onClick = {this.usePen}></i></li>
                    <li><i className ="fas fa-highlighter fa-3x" style = {this.state.toolIconselected.highlighter} onClick = {this.useHighlighter}></i></li>
                    <li><i className ="fas fa-eraser fa-3x" style = {this.state.toolIconselected.eraser} onClick = {this.useEraser}></i></li>
                    <li><i className ="fas fa-trash fa-3x" style = {{filter: 'invert(0.5)'}} onClick = {this.cleanCanvas}></i></li>
                </ul>
                <ToolSetup style = {this.state.toolSetupDisplay} changeColor = {this.changeColor} changeWidth = {this.changeWidth} widthValue = {this.state.currentStyle.width}/>
                <div className = 'eraser-widthBar' style = {this.state.eraserBarDisplay}>
                    <input id = 'eraser-widthBar' type = 'range' min = '1' max = '60' step = '1' defaultValue = '1'></input>
                </div>
            </div>
        );
    }
}
 
export default DrawingField;