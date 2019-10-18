import React, { useState } from 'react';
import ThreeContainer from './three/threecontainer';
import ControlPanel from './controlpanel/control';
import Clock from './utils';

function App() {

  const [ sMessage, procMessage ] = useState({});
  
  const eventFromControl = (...args) => {
    if(args.length === 0) return;
    procMessage(args[0]);
  }

  const eventFromScene = (...args) => {
    if(args.length === 0) return;
    procMessage(args[0].detail);
  }

  return (
    <React.Fragment>
      <ThreeContainer eventHandler={ eventFromScene } messageHandler={ sMessage } />
      <Clock />
      <ControlPanel eventHandler={ eventFromControl } messageHandler={ sMessage } />
    </React.Fragment>
  );
}

export default App;
