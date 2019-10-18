import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
//import DragControls from 'three-dragcontrols';
import DragControls from './dragcontrols';
import Layout from './image/layout.png';

import { PipeBuilderJoint, PipeBuilderPipe,  } from './pipeobjects';




export function functionCall(canvas, options) {
    var testclass = new TestClass(options);
    //someFunction()
    return testclass.functionCall(canvas);
}

export class TestClass {
    constructor() {
        console.log("constructor...");
    }
    functionCall(s) {
        console.log(s);
    }
}

export default (containerElement) => {
    var objects = [];
    var selected = null;
    var origpos;
    var orgx, orgy, orgz;
    var groupIndex = 0;

    const getCameraView = (view = "DEFAULT") => {
        let px, py, pz;
        let rx, ry, rz;

        if (view.toUpperCase().indexOf("TOP") >= 0) {
            px = 0;
            py = 1000;
            pz = 0;
            rx = -1 * Math.PI / 2;
            ry = 0;
            rz = 0;
        } else if(view.toUpperCase().indexOf("FRONT") >= 0) {
            px = 0;
            py = 250;
            pz = 1000;
            rx = 0;
            ry = 0;
            rz = 0;
        } else if(view.toUpperCase().indexOf("LEFT") >= 0) {
            px = -1000;
            py = 250;
            pz = 0;
            rx = 0;
            ry = -1 * Math.PI / 2;
            rz = 0;
        } else if(view.toUpperCase().indexOf("RIGHT") >= 0) {
            px = 1000;
            py = 250;
            pz = 0
            rx = 0;
            ry = Math.PI / 2;
            rz = 0;
        } else {
            px = 500;
            py = 250;
            pz = 500;
            rx = -15 * Math.PI / 360;
            ry = 45 * Math.PI / 360;
            rz = 0;
        }

        return {
            position: { x: px, y: py, z: pz },
            rotation: { x: rx, y: ry, z: rz }
        };
    }

    console.log("start three");

    const width = containerElement.offsetWidth; // window.innerWidth;
    const height = containerElement.offsetHeight; // window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xefefff );

    // const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
    // camera.position.z = 5;
    // camera.lookAt(scene.position);

    const defcam = getCameraView();
    //var frustum = 600;
    //var aspect = width / height;
    var camwidth = width;
    var camheight = height;
    var camfov = 60;
    //const camera = new THREE.OrthographicCamera( camwidth / - 2, camwidth / 2, camheight / 2, camheight / - 2, 0.1, 10000 );
    const camera = new THREE.PerspectiveCamera( camfov, camwidth / camheight, 0.1, 10000 );
    camera.position.set( defcam.position.x, defcam.position.y, defcam.position.z );
    camera.rotation.x = defcam.rotation.x;
    camera.rotation.y = defcam.rotation.y;
    camera.rotation.z = defcam.rotation.z;
    
    camera.name = "Camera";
    scene.add( camera );
    
    // const renderer = new THREE.WebGLRenderer();
    // renderer.setSize(width, height);
    // document.body.appendChild(renderer.domElement);
    function createCanvas(document, container) {
        const canvas = document.createElement('canvas');
        canvas.id = "canvas1";
        container.appendChild(canvas);
        return canvas;
    }

    const canvas = createCanvas(document, containerElement);
    canvas.width = width;
    canvas.height = height;

    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true, 
        alpha: true 
    }); 
    
    const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
    renderer.setPixelRatio(DPR);
    renderer.setSize(width, height);
    renderer.gammaInput = true;
    renderer.gammaOutput = true; 

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    
    const dragControls = new DragControls(objects, camera, renderer.domElement);
    dragControls.snapGrid = true;
    
    dragControls.addEventListener( 'dragstart', function ( event ) {
        controls.enabled = false;
        
        if (event.object.itemType === "pipe") {

            var position = getObjectPosition(event.object);
            orgx = position.x;
            orgy = position.y;
            orgz = position.z;

            origpos = new THREE.Vector3();
            origpos.copy( position );

            return;
        }
        
        const PIPEBUILDER_JOINTCOLOR_DEFAULT = 0x222222;
        const PIPEBUILDER_JOINTCOLOR_SELECTED = 0x990000;
        const PIPEBUILDER_PIPECOLOR_DEFAULT = 0x666666;
        const PIPEBUILDER_PIPECOLOR_EMISSIVE = 0x222222;

        event.object.material.color.setHex( PIPEBUILDER_JOINTCOLOR_SELECTED );
        event.object.scale.x = event.object.pipeRadiusScale * 1.25;
        event.object.scale.y = event.object.pipeRadiusScale * 1.25;
        event.object.scale.z = event.object.pipeRadiusScale * 1.25;

        if (selected) {
            if (selected.index !== event.object.index) {
                selected.material.color.setHex( PIPEBUILDER_JOINTCOLOR_DEFAULT );
                selected.scale.x = selected.pipeRadiusScale * 1.0;
                selected.scale.y = selected.pipeRadiusScale * 1.0;
                selected.scale.z = selected.pipeRadiusScale * 1.0;
            }
        }

        selected = event.object;

        console.log("raise event from dragcontrols");
        var event = new CustomEvent(
            "objectSelected", 
            {
                detail: {
                    for: `CONTROL`,
                    name: `ITEM_SELECTED`,
                    value: true
                },
                bubbles: true,
                cancelable: true
            }
        );
        containerElement.dispatchEvent(event);

    });
    dragControls.addEventListener( 'drag', function ( event ) {
        
        if (event.object.itemType === "pipe") 
        {
            
            var position = getObjectPosition(event.object);

            var dx = position.x - origpos.x;
            var dy = position.y - origpos.y;
            var dz = position.z - origpos.z;

            origpos.copy( position );

            orgx = position.x;
            orgy = position.y;
            orgz = position.z;

            for(var i = 0; i < objects.length; i++)
            {
                if (typeof objects[i] === "undefined" || !objects[i].visible) continue;

                if (i === event.object.index || objects[i].groupId !== event.object.groupId) continue;

                objects[i].position.x += dx;
                objects[i].position.y += dy;
                objects[i].position.z += dz;
                
            }

            return;
        }

        var position = getObjectPosition(event.object);
        
        for(var i = 0; i < event.object.pipes.length; i++)
        {
            var lineindex = event.object.pipes[i];
            var p0 = objects[lineindex].joints[0];
            var p1 = objects[lineindex].joints[1];

            var obj0 = objects[p0];
            var obj1 = objects[p1];

            var pos = getObjectPosition(obj0);
            var px1 = pos.x;
            var py1 = pos.y;
            var pz1 = pos.z;

            pos = getObjectPosition(obj1);
            var px2 = pos.x;
            var py2 = pos.y;
            var pz2 = pos.z;

            var fromPoint = new THREE.Vector3( px1, py1, pz1 );
            var toPoint = new THREE.Vector3( px2, py2, pz2 );
            var deltaVector = new THREE.Vector3().subVectors(toPoint, fromPoint);
            var arrow = new THREE.ArrowHelper(
                deltaVector.clone().normalize(),
                fromPoint
            );

            objects[lineindex].scale.y = (deltaVector.length()/objects[lineindex].geometry.parameters.height);
            objects[lineindex].rotation.setFromQuaternion(arrow.quaternion);
            objects[lineindex].position.addVectors(fromPoint, deltaVector.multiplyScalar(0.5));
            objects[lineindex].updateMatrix();
        }

    });
    dragControls.addEventListener( 'dragend', function ( event ) {
        controls.enabled = true;

        if (event.object.itemType === "pipe") 
        {
            var position = getObjectPosition(event.object);

            var dx = position.x - origpos.x; //orgx;
            var dy = position.y - origpos.y; //orgy;
            var dz = position.z - origpos.z; //orgz;

            origpos.copy( position );

            orgx = position.x;
            orgy = position.y;
            orgz = position.z;

            for(var i = 0; i < objects.length; i++)
            {
                if (typeof objects[i] === "undefined" || !objects[i].visible) continue;

                if (i === event.object.index || objects[i].groupId !== event.object.groupId) continue;

                objects[i].position.x += dx;
                objects[i].position.y += dy;
                objects[i].position.z += dz;
                
            }

            return;
        }

        var position = getObjectPosition(event.object);
        
        for(var i = 0; i < event.object.pipes.length; i++)
        {
            var lineindex = event.object.pipes[i];
            var p0 = objects[lineindex].joints[0];
            var p1 = objects[lineindex].joints[1];

            var obj0 = objects[p0];
            var obj1 = objects[p1];

            var pos = getObjectPosition(obj0);
            var px1 = pos.x;
            var py1 = pos.y;
            var pz1 = pos.z;

            pos = getObjectPosition(obj1);
            var px2 = pos.x;
            var py2 = pos.y;
            var pz2 = pos.z;

            var fromPoint = new THREE.Vector3( px1, py1, pz1 );
            var toPoint = new THREE.Vector3( px2, py2, pz2 );
            var deltaVector = new THREE.Vector3().subVectors(toPoint, fromPoint);
            var arrow = new THREE.ArrowHelper(
                deltaVector.clone().normalize(),
                fromPoint
            );

            objects[lineindex].scale.y = (deltaVector.length()/objects[lineindex].geometry.parameters.height);
            objects[lineindex].rotation.setFromQuaternion(arrow.quaternion);
            objects[lineindex].position.addVectors(fromPoint, deltaVector.multiplyScalar(0.5));
            objects[lineindex].updateMatrix();
        }

    });
    
    var lights = [];
    lights[ 0 ] = new THREE.DirectionalLight( 0xffffff, 1 );
    lights[ 1 ] = new THREE.DirectionalLight( 0xffffff, 1 );
    lights[ 2 ] = new THREE.DirectionalLight( 0xffffff, 1 );

    lights[ 0 ].position.set( 1000, 1000, -1000 );
    lights[ 1 ].position.set( 1000, 1000, 1000 );
    lights[ 2 ].position.set( -1000, 1000, 0 );

    lights[ 0 ].name = "Light0";
    lights[ 1 ].name = "Light1";
    lights[ 2 ].name = "Light2";

    var lighthelper = new THREE.DirectionalLightHelper( lights[ 1 ], 5 );
    lighthelper.name = "LightHelper1";
    scene.add( lighthelper );

    var lighthelper2 = new THREE.DirectionalLightHelper( lights[ 2 ], 5 );
    lighthelper.name = "LightHelper2";
    scene.add( lighthelper2 );

    var lighthelper3 = new THREE.DirectionalLightHelper( lights[ 0 ], 5 );
    lighthelper.name = "LightHelper3";
    scene.add( lighthelper3 );

    scene.add( lights[ 0 ] );
    scene.add( lights[ 1 ] );
    scene.add( lights[ 2 ] );
    
    var grid = new THREE.GridHelper( 2000, 100 );
    grid.material.opacity = 0.25;
    grid.material.transparent = true;
    grid.name = "Grid";
    scene.add( grid );
    
    const group = new THREE.Group();

    var img = new Image();
    img.onload = function() {
        var planeGeometry = new THREE.PlaneBufferGeometry( this.width, this.height );
        planeGeometry.rotateX( - Math.PI / 2 );
        var texloader = new THREE.TextureLoader();
        var texture = texloader.load(Layout);
        var planeMaterial = new THREE.MeshBasicMaterial( { map: texture, opacity: 0.75, transparent: true } );
        var plane = new THREE.Mesh( planeGeometry, planeMaterial );
        plane.position.y = -0.1;
        scene.add( plane );
    }
    img.src = Layout;
    
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    // const material = new THREE.MeshBasicMaterial({ color: 0xddaabb });
    const material = new THREE.MeshNormalMaterial({ flatShading: true });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(-2, 0, 0);
    if(cube.update === undefined) {
        cube.update = function() {
            this.rotation.x += 0.01;
            this.rotation.y += 0.01;
        }
    }
    // scene.add(cube);
    group.add( cube );

    const sphere_geometry = new THREE.SphereGeometry( 2, 32, 32 );
    var sphere = new THREE.Mesh(sphere_geometry, material);
    sphere.position.set(2, 0, 0);
    if(sphere.update === undefined) {
        sphere.update = function() {
            this.rotation.x += 0.01;
            this.rotation.y += 0.01;
        }
    }
    //scene.add(sphere);
    group.add( sphere );
    
    if(group.update === undefined) {
        group.update = function() {
            // cube.update();
            // sphere.update();
            this.rotation.x += 0.005;
            this.rotation.y += 0.005;
        }
    }

    scene.add( group );

    window.addEventListener("load", function() {
        console.log("window onload inside react");

        // check if canvas1 exist
        var el = document.getElementById('canvas1');
        console.log(el.id);

    }, false);

    window.addEventListener("resize", function() {
        console.log("window resize inside react");
        
        const { offsetWidth, offsetHeight } = containerElement;
        camera.aspect = offsetWidth / offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( offsetWidth, offsetHeight );

    }, false);

    function render() {
        requestAnimationFrame(render);
        
        //group.update();

        renderer.render(scene, camera);
    }

    render();

    function testMe(...args) {
        
        const msg = args[0];
        //console.log("message value:", msg.value);
        // set view test
        
        if (msg.name === 'SET_VIEW') {
            setView( msg.value );
        } else if(msg.name === 'ADD_NEW') {
            addNew();
        } else if(msg.name === 'ADD_JOINT') {
            addJoint( msg.value );
        }

    }

    function getJointPosition( obj )
    {
        obj.geometry.computeBoundingBox();
        var boundingBox = obj.geometry.boundingBox;
        var position = new THREE.Vector3();
        position.subVectors( boundingBox.max, boundingBox.min );
        position.multiplyScalar( 0.5 );
        position.add( boundingBox.min );
        position.applyMatrix4( obj.matrixWorld );
        return position;
    }


    function getObjectPosition( object )
    {
        object.geometry.computeBoundingBox(); //
        var boundingBox = object.geometry.boundingBox;
        var position = new THREE.Vector3();
        position.subVectors( boundingBox.max, boundingBox.min );
        position.multiplyScalar( 0.5 );
        position.add( boundingBox.min );
        position.applyMatrix4( object.matrixWorld );
        return position;
    }

    function randomIntFromInterval(min,max) // min and max included
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    function addJoint( mode = 0) {
        if(!selected) return;

        var cube1 = selected;
        var index1 = cube1.index;
        var pos1 = getObjectPosition( selected );
        var groupId = cube1.groupId;

        var pipeRadius = cube1.pipeRadiusScale;
        var pipeColor = cube1.pipeColor;

        var chance = randomIntFromInterval(1,10);
        
        var x, y, z;
        if(mode > 0)
        {
            x = pos1.x;
            y = pos1.y + 200;
            z = pos1.z;
        } else {
            x = pos1.x + ((chance > 5) ? Math.round(200*Math.cos(45*Math.PI/360)) : Math.round(200*Math.sin(45*Math.PI/360)));
            y = pos1.y;
            z = pos1.z + ((chance > 5) ? Math.round(200*Math.sin(45*Math.PI/360)) : Math.round(200*Math.cos(45*Math.PI/360)));
        }
        
        var pos2 = new THREE.Vector3( x, y, z );
        var cube2 = new PipeBuilderJoint( { position: pos2, color: pipeColor, radiusScale: pipeRadius } );
        var index2 = objects.push( cube2 );
        index2--;
        cube2.index = index2;
        cube2.name = setFormatName("joint", index2);

        cube1.sibling.push( index1 );
        cube2.sibling.push( index2 );

        var pipe = new PipeBuilderPipe( { from: pos1, to: pos2, color: pipeColor, radiusScale: pipeRadius } );
        var index3 = objects.push( pipe );
        index3--;
        pipe.index = index3;
        pipe.name = setFormatName("pipe", index3);

        pipe.joints.push( index1 );
        pipe.joints.push( index2 );

        cube1.pipes.push( index3 );
        cube2.pipes.push( index3 );

        cube2.groupId = groupId;
        pipe.groupId = groupId;

        scene.add( pipe );
        scene.add( cube1 );
        scene.add( cube2 );

    }

    const setView = (value) => {
        console.log("change view");

        let view = "DEFAULT";
        switch(value) {
            case 1:
                view = "TOP";
                break;
            case 2:
                view = "FRONT";
                break;
            case 3:
                view = "LEFT";
                break;
            case 4:
                view = "RIGHT";
                break;
            default:
                view = "DEFAULT";
        }

        var cam = getCameraView( view );
        
        camera.position.set( cam.position.x, cam.position.y, cam.position.z );
        //camera.rotation.x = cam.rotation.x;
        //camera.rotation.y = cam.rotation.y;
        //camera.rotation.z = cam.rotation.z;
        camera.lookAt( scene.position );
        
        controls.position0.set( cam.position.x, cam.position.y, cam.position.z );
        controls.target0.set( scene.position.x, scene.position.y, scene.position.z );
        controls.reset();

        camera.updateProjectionMatrix();

    }
    
    function setFormatName(key, index){
        var name;
        if (index < 10){
            name = key + "00" + index;
        } else if(index >= 10 && index < 100){
            name = key + "0" + index;
        } else {
            name = key + index;
        }
        return name;
    }

    const addNew = () => {
        console.log("add new pipe in scene");

        var pos1 = new THREE.Vector3( 100, 50, 0 );
        var cube1 = new PipeBuilderJoint( { position: pos1 } );
        var index1 = objects.push( cube1 );
        index1--;
        cube1.index = index1;
        cube1.name = setFormatName("joint", index1);

        var pos2 = new THREE.Vector3( -100, 50, 0 );
        var cube2 = new PipeBuilderJoint( { position: pos2 } );
        var index2 = objects.push( cube2 );
        index2--;
        cube2.index = index2;
        cube2.name = setFormatName("joint", index2);

        cube1.sibling.push( index2 );
        cube2.sibling.push( index1 );

        var pipe = new PipeBuilderPipe( { from: pos1, to: pos2 } );
        var index3 = objects.push( pipe );
        index3--;
        pipe.index = index3;
        pipe.name = setFormatName("pipe", index3);

        pipe.joints.push( index1 );
        pipe.joints.push( index2 );

        cube1.pipes.push( index3 );
        cube2.pipes.push( index3 );

        cube1.groupId = groupIndex;
        cube2.groupId = groupIndex;
        pipe.groupId = groupIndex;
        groupIndex++;
        
        scene.add( pipe );
        scene.add( cube1 );
        scene.add( cube2 );
    }

    return (
        testMe
    )
}