import React, { useState } from 'react';
//import logo from './logo.svg';
//import './App.css';
import Clock from './utils';
import ThreeContainer from './three/threecontainer';
import ControlPanel from './controlpanel/control';

function App() {

  //const [ sMsg, procMsg ] = useState({});
  const [ sMessage, procMessage ] = useState({});
  
  const myHandler = (...args) => {
    console.log("event from control panel");
    if(args.length === 0) return;
    // pass as is
    procMessage(args[0]);
  }

  const eventFromScene = (...args) => {
    console.log("event from threejs");
    if(args.length === 0) return;
    // procMsg(args[0]);
    //console.log( args[0] );
    //procMsg( args[0] )
    procMessage(args[0].detail);
  }

  return (
    <React.Fragment>
      <ThreeContainer eventHandler={ eventFromScene} messageHandler={ sMessage } />
      <Clock />
      <ControlPanel eventHandler={ myHandler } messageHandler={ sMessage } />
    </React.Fragment>
  );
}

export default App;
