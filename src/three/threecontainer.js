import React from 'react';
import ThreeLoader, { TestClass, functionCall } from './threeloader';
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

        //functionCall("TEST");
        //const testo = new TestClass("SEX");

        const evento = this.props;

        console.log("container mounted")
        this.something = ThreeLoader(this.threeRootElement);

        const threecontainer = document.getElementById("threecontainer");
        threecontainer.addEventListener("objectSelected",function(event){
            console.log("catch event from scene");
            evento.eventHandler(event);
        })
    }

    componentDidUpdate() {
        if(this.props.messageHandler.for !== "SCENE") return;

        console.log("threejs component update");

        //console.log(this.props.messageHandler);
        //console.log(this.something);
        
        this.something( this.props.messageHandler );
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