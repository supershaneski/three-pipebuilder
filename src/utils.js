import React from 'react';
class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            datetime: new Date(),
        }
        this.timer = null;
    }
    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({
                datetime: new Date()
            })
        }, 1000)
    }
    render() {
        return (
            <div style={{
                position: `absolute`,
                left: `0px`,
                bottom: `10px`,
                color: `#999`,
                fontSize: `0.8em`,
                zIndex: `2`
            }}>
            { this.state.datetime.toLocaleTimeString() }
            </div>
        )
    }
}
export default Clock;