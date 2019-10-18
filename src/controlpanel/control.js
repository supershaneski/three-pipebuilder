import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import 'bootstrap/dist/css/bootstrap.min.css';

const styles = {
    button: {
        minWidth: `100px`,
    },
    toggleButton: {
        minWidth: `100px`,
        borderRadius: `4px`,
        cursor: `pointer`,
    },
    buttonGroup: {
        margin: `1px 0px`,
    }
}

export default ( props ) => {
    
    console.log("render control panel");

    const [selectedText, setSelected] = useState("Top");

    const handleSelect = (evt) => {
        console.log("handleselect", evt)
        
        const n = parseInt(evt);
        switch(n) {
            case 1:
                setSelected("Top");
                break;
            case 2:
                setSelected("Front");
                break;
            case 3:
                setSelected("Left");
                break;
            case 4:
                setSelected("Right");
                break;
            default:
                // do nothing
        }

        props.eventHandler({
            for: `SCENE`,
            name: `SET_VIEW`,
            value: n,
        });
    }
    
    const handleAddNew = () => {
        console.log("click add new")
        props.eventHandler({
            for: `SCENE`,
            name: `ADD_NEW`,
            value: null,
        });
    }

    const handleAddJoint = (n = 0) => {
        console.log("click add joint")
        props.eventHandler({
            for: `SCENE`,
            name: `ADD_JOINT`,
            value: n,
        });
    }
    
    const msg = props.messageHandler;
    console.log("CONTROL MSG HANDLER");
    console.dir(msg);

    var itemNotSelected = true;
    if(msg.for === "CONTROL") {
        if(msg.name === "ITEM_SELECTED") {
            itemNotSelected = msg.value ? false:true;
        }
    } else if(msg.for === "SCENE") {
        
    }
    
    return (
        <ButtonGroup vertical style={{
            backgroundColor: '#dedeaa',
            position: `absolute`,
            left: `0px`,
            top: `0px`,
            zIndex: '3',
            margin: '8px'
        }}>

            <ButtonGroup style={ styles.buttonGroup } vertical>
                <DropdownButton onSelect={handleSelect} as={ButtonGroup} title={selectedText} id="bg-vertical-dropdown-1">
                    <Dropdown.Item eventKey={1}>Top View</Dropdown.Item>
                    <Dropdown.Item eventKey={2}>Front View</Dropdown.Item>
                    <Dropdown.Item eventKey={3}>Left View</Dropdown.Item>
                    <Dropdown.Item eventKey={4}>Right View</Dropdown.Item>
                </DropdownButton>
                <Button onClick={() => handleSelect(0) } style={ styles.button } variant="secondary">Reset</Button>
            </ButtonGroup>

            <ToggleButtonGroup style={ styles.buttonGroup } type="checkbox" defaultValue={[1]}>
                <ToggleButton style={ styles.toggleButton } value={1}>Snap</ToggleButton>
            </ToggleButtonGroup>

            <ButtonGroup style={ styles.buttonGroup } vertical>
                <Button onClick={ handleAddNew } style={ styles.button } variant="primary">New</Button>
                <Button onClick={ () => handleAddJoint(0) } style={ styles.button } variant="primary" disabled={itemNotSelected}>Add H</Button>
                <Button onClick={ () => handleAddJoint(1) } style={ styles.button } variant="primary" disabled={itemNotSelected}>Add V</Button>
                <Button style={ styles.button } variant="primary" disabled={itemNotSelected}>Delete</Button>
            </ButtonGroup>
        
        </ButtonGroup>
    )
}
  