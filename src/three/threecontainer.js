import React from 'react';
import ThreeLoader from './threeloader';

const styles = {
    threecontainer: {
        backgroundColor: `#ffffff`,
        position: `absolute`,
        left: `0px`,
        top: `0px`,
        width: `100%`,
        height: `100%`,
        zIndex: 1,
    }
}

class ThreeContainer extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        
        const evento = this.props;
        this.sendMessage = ThreeLoader(this.threeRootElement);

        const threecontainer = document.getElementById("threecontainer");
        threecontainer.addEventListener("objectSelected",function(event){
            evento.eventHandler(event);
        })
    }

    componentDidUpdate() {
        if(this.props.messageHandler.for !== "SCENE") return;
        this.sendMessage( this.props.messageHandler );
    }
    
    render() {
        return (
            <div id="threecontainer" 
                style={styles.threecontainer }
                ref={element => this.threeRootElement = element} 
            />
        )
    }
}

export default ThreeContainer;