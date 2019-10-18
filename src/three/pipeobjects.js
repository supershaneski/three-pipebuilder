import * as THREE from 'three';

const PIPEBUILDER_JOINTCOLOR_DEFAULT = 0x222222; //0x156289;
const PIPEBUILDER_JOINTCOLOR_SELECTED = 0x990000;

const PIPEBUILDER_PIPECOLOR_DEFAULT = 0x666666; //0x896251;
const PIPEBUILDER_PIPECOLOR_EMISSIVE = 0x222222; //0x072534

export function PipeBuilderJoint( parameters ){
    var position = parameters.position || new THREE.Vector3( 0, 0, 0 );
    var pipeRadiusScale = parameters.radiusScale || 1;
    var pipeColor = parameters.color || PIPEBUILDER_PIPECOLOR_DEFAULT;

    //var geometry = new THREE.BoxGeometry( 20, 20, 20 );
    //var geometry = new THREE.SphereGeometry( 6, 24, 24 );
    var geometry = new THREE.SphereBufferGeometry( 5, 24, 24 );
    //var material = new THREE.MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true } );
    //var material = new THREE.MeshPhongMaterial( { color: 0x896251, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true } );
    var material = new THREE.MeshPhongMaterial( { color: PIPEBUILDER_JOINTCOLOR_DEFAULT, side: THREE.DoubleSide, flatShading: true } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.copy( position );
    if (pipeRadiusScale !== 1){
        mesh.scale.x = pipeRadiusScale;
        mesh.scale.y = pipeRadiusScale;
        mesh.scale.z = pipeRadiusScale;
    }

    if(typeof mesh.sibling === "undefined"){
        mesh.sibling = [];
    }
    if(typeof mesh.itemType === "undefined"){
        mesh.itemType = "joint";
    }
    if(typeof mesh.pipes === "undefined"){
        mesh.pipes = [];
    }
    if(typeof mesh.index === "undefined"){
        mesh.index = -1;
    }
    if(typeof mesh.groupId === "undefined"){
        mesh.groupId = -1;
    }
    if(typeof mesh.pipeRadiusScale === "undefined") {
        mesh.pipeRadiusScale = pipeRadiusScale;
    }
    if(typeof mesh.pipeColor === "undefined") {
        mesh.pipeColor = pipeColor;
    }

    return mesh;
};

export function PipeBuilderPipe( parameters ) {
    var pointA = parameters.from;
    var pointB = parameters.to;
    var pipeRadiusScale = parameters.radiusScale || 1;
    var pipeColor = parameters.color || PIPEBUILDER_PIPECOLOR_DEFAULT;

    var deltaVector = new THREE.Vector3().subVectors(pointB, pointA);
    var arrow = new THREE.ArrowHelper(
        deltaVector.clone().normalize(),
        pointA
    );
    
    var radialSegments = 24;

    // var material = new THREE.MeshPhongMaterial( { color: 0x896251, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true } );
    //var material = new THREE.MeshPhongMaterial( { color: pipeColor, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true } );
    //var material = new THREE.MeshPhongMaterial( { color: pipeColor, emissive: PIPEBUILDER_PIPECOLOR_EMISSIVE, side: THREE.DoubleSide, flatShading: true } );
    var material = new THREE.MeshPhongMaterial( { color: pipeColor, flatShading: true } );
    //var geometry = new THREE.CylinderGeometry(
    var geometry = new THREE.CylinderBufferGeometry(
        3, //piperadius
        3, //piperadius
        deltaVector.length(),
        radialSegments, //10,
        4,
        true
    );
        
    var mesh = new THREE.Mesh( geometry, material );
    mesh.rotation.setFromQuaternion( arrow.quaternion );
    mesh.position.addVectors( pointA, deltaVector.multiplyScalar(0.5) );
    if (pipeRadiusScale !== 1) {
        mesh.scale.x = pipeRadiusScale;
        mesh.scale.z = pipeRadiusScale;
    }
    mesh.updateMatrix();

    if(typeof mesh.itemType === "undefined"){
        mesh.itemType = "pipe";
    }
    if(typeof mesh.joints === "undefined"){
        mesh.joints = [];
    }
    if(typeof mesh.index === "undefined"){
        mesh.index = -1;
    }
    if(typeof mesh.groupId === "undefined"){
        mesh.groupId = -1;
    }
    if(typeof mesh.pipeRadiusScale === "undefined") {
        mesh.pipeRadiusScale = 1;
    }
    if(typeof mesh.pipeColor === "undefined") {
        mesh.pipeColor = 0x896251;
    }

    return mesh;
};