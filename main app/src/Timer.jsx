import {Component} from "react";


class Timer extends Component{

    constructor(){

        super();
        this.state = {
            time: 0,
            isActive: false
        };
        this.timerId = null;

    }

    toggleTimer = () => {

        if(this.state.isActive)
            clearInterval(this.timerId);
        else
            this.timerId = setInterval(() => {
                this.setState({time: this.state.time + 1});
            }, 1000);
        this.setState({isActive: !this.state.isActive});

    }

    reset = () => {

        if(this.state.isActive)
            clearInterval(this.timerId);
        this.setState({time: 0, isActive: false});

    }

    render(){

        return (
            <div className="timer-block">
                <span>{this.state.time}</span>
                <button onClick={this.toggleTimer}>{this.state.isActive ? "Stop" : "Start"}</button>
                <button onClick={this.reset}>Reset</button>

            </div>
        )

    }

}

export default Timer;