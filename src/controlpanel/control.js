import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import 'bootstrap/dist/css/bootstrap.min.css';

const styles = {
    root: {
        position: `absolute`,
        left: `0px`,
        top: `0px`,
        zIndex: '3',
        margin: '8px'
    },
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
    
    const [selectedText, setSelected] = useState("Default");

    const changeView = (evt) => {
        const index = parseInt(evt);
        switch(index) {
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
                setSelected("Default");
        }

        props.eventHandler({
            for: `SCENE`,
            name: `SET_VIEW`,
            value: index,
        });
    }
    
    const addNewPipe = () => {
        props.eventHandler({
            for: `SCENE`,
            name: `ADD_NEW`,
            value: null,
        });
    }

    const addNewJoint = (mode = 0) => {
        props.eventHandler({
            for: `SCENE`,
            name: `ADD_JOINT`,
            value: mode,
        });
    }

    // todo: must handle color toggle
    const setGridSnap = () => {
        props.eventHandler({
            for: `SCENE`,
            name: `GRID_SNAP`,
            value: null,
        });
    }
    
    // todo: this is not good
    const msg = props.messageHandler;
    var itemNotSelected = true;
    if(msg.for === "CONTROL") {
        if(msg.name === "ITEM_SELECTED") {
            itemNotSelected = msg.value ? false:true;
        }
    }
    
    return (
        <ButtonGroup vertical style={ styles.root }>

            <ButtonGroup style={ styles.buttonGroup } vertical>
                <DropdownButton onSelect={changeView} as={ButtonGroup} title={selectedText} id="bg-vertical-dropdown-1">
                    <Dropdown.Item eventKey={0}>Default View</Dropdown.Item>
                    <Dropdown.Item eventKey={1}>Top View</Dropdown.Item>
                    <Dropdown.Item eventKey={2}>Front View</Dropdown.Item>
                    <Dropdown.Item eventKey={3}>Left View</Dropdown.Item>
                    <Dropdown.Item eventKey={4}>Right View</Dropdown.Item>
                </DropdownButton>
                <Button onClick={() => changeView(0) } style={ styles.button } variant="secondary">Reset</Button>
            </ButtonGroup>

            <ToggleButtonGroup onChange={ setGridSnap } style={ styles.buttonGroup } type="checkbox" defaultValue={[1]}>
                <ToggleButton style={ styles.toggleButton } value={1}>Snap</ToggleButton>
            </ToggleButtonGroup>

            <ButtonGroup style={ styles.buttonGroup } vertical>
                <Button onClick={ addNewPipe } style={ styles.button } variant="primary">New</Button>
                <Button onClick={ () => addNewJoint(0) } style={ styles.button } variant="primary" disabled={itemNotSelected}>Add H</Button>
                <Button onClick={ () => addNewJoint(1) } style={ styles.button } variant="primary" disabled={itemNotSelected}>Add V</Button>
                <Button style={ styles.button } variant="primary" disabled={itemNotSelected}>Delete</Button>
            </ButtonGroup>
        
        </ButtonGroup>
    )
}
  