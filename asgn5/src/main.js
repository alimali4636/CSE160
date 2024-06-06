// Import THREE from a module CDN
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from 'three/addons/OBJLoader.js';
import {MTLLoader} from 'three/addons/MTLLoader.js';
function main() {
    // Ask three.js to draw into our canvas
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Camera
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;  // the canvas default
    const near = 0.1;
    const far = 15;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 3;

    // Create scene
    const scene = new THREE.Scene();

    const bgloader = new THREE.CubeTextureLoader();
    const bgTexture = bgloader.load([
        '../lib/px.png',  // right
        '../lib/nx.png',  // left
        '../lib/py.png',  // top
        '../lib/ny.png',  // bottom
        '../lib/pz.png',  // front
        '../lib/nz.png'   // back
    ]);
    scene.background = bgTexture;
    
    // Create light
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight( color, intensity );
    light.position.set( - 1, 2, 4 );
    scene.add( light );

    // Create sky and ground light
    const skyColor = 0xFFC300;
    const groundColor = 0xA020F0;
    const hemLight = new THREE.HemisphereLight(skyColor, groundColor, 1);
    scene.add( hemLight );


    // Create box geometry
    const boxWidth = 4;
    const boxHeight = 4;
    const boxDepth = 4;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    
    // Function for making new cubes set to a color (MODIFY THIS TO WORK WITH ANY SHAPE)
    function makeInstance( geometry, color, x, y, z) {
        // Create material
        const material = new THREE.MeshPhongMaterial( { color } );
        // Create cube with geometry and material
        const cube = new THREE.Mesh(geometry, material);
        // Add cube
        scene.add( cube );
        cube.position.set(x, y, z);

        return cube;

    }

    // Custom textured cube (gojo)
    const loader = new THREE.TextureLoader();
    const texture = loader.load( '../lib/hollowpurple.png' );
    texture.colorSpace = THREE.SRGBColorSpace;
    
    const material = new THREE.MeshPhongMaterial({
    color: 0xFFFFFF,
    map: texture,
    });
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    cube.position.x = 0;
    cube.position.y = -3;
    cube.position.z = 5;

    // Second textured cube (toji)
    const texture2 = loader.load('../lib/toji.png');
    texture2.colorSpace = THREE.SRGBColorSpace;

    const material2 = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        map: texture2,
    });
    const cube2 = new THREE.Mesh(geometry, material2);
    scene.add(cube2);
    cube2.position.set(0, -3, 30);

    // PILLARS ----------------------------------------------------------------------------------------------------------
    const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 15, 16);
    const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0x5C4033 });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    scene.add(cylinder);
    cylinder.position.x = -6;
    cylinder.position.y = -3;
    cylinder.position.z = 5;

    const cylinder2 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    scene.add(cylinder2);
    cylinder2.position.x = -6;
    cylinder2.position.y = -3;
    cylinder2.position.z = 12;

    const cylinder3 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    scene.add(cylinder3);
    cylinder3.position.x = -6;
    cylinder3.position.y = -3;
    cylinder3.position.z = 19;

    const cylinder4 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    scene.add(cylinder4);
    cylinder4.position.x = -6;
    cylinder4.position.y = -3;
    cylinder4.position.z = 26;

    const cylinder5 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    scene.add(cylinder5);
    cylinder5.position.x = -6;
    cylinder5.position.y = -3;
    cylinder5.position.z = 33;

    const cylinder6 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    scene.add(cylinder6);
    cylinder6.position.x = 6;
    cylinder6.position.y = -3;
    cylinder6.position.z = 5;

    const cylinder7 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    scene.add(cylinder7);
    cylinder7.position.x = 6;
    cylinder7.position.y = -3;
    cylinder7.position.z = 12;

    const cylinder8 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    scene.add(cylinder8);
    cylinder8.position.x = 6;
    cylinder8.position.y = -3;
    cylinder8.position.z = 19;

    const cylinder9 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    scene.add(cylinder9);
    cylinder9.position.x = 6;
    cylinder9.position.y = -3;
    cylinder9.position.z = 26;

    const cylinder0 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    scene.add(cylinder0);
    cylinder0.position.x = 6;
    cylinder0.position.y = -3;
    cylinder0.position.z = 33;

    // Spheres -----------------------------------------------------------------------------------------------------------

    // Blue
    const sphereGeometry = new THREE.SphereGeometry(.5, 30, 30);
    const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x1E2F97 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    sphere.position.x = -3;
    sphere.position.y = -3;
    sphere.position.z = 5;

    // Red
    const sphere2Geometry = new THREE.SphereGeometry(.5, 30, 30);
    const sphere2Material = new THREE.MeshPhongMaterial({ color: 0xBE1600 });
    const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
    scene.add(sphere2);
    sphere2.position.x = 3;
    sphere2.position.y = -3;
    sphere2.position.z = 5;

    // Purple
    const sphere3Geometry = new THREE.SphereGeometry(.5, 30, 30);
    const sphere3Material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const sphere3 = new THREE.Mesh(sphere3Geometry, sphere3Material);
    scene.add(sphere3);
    sphere3.position.x = 0;
    sphere3.position.y = -3;
    sphere3.position.z = 20;

    // Purple specks
    const speckGeometry = new THREE.BoxGeometry(.5, .5, .5);
    const speck1 = makeInstance(speckGeometry, 0xA020F0, 1, -3, 20);
    const speck2 = makeInstance(speckGeometry, 0xA020F0, -1, -3, 20);
    const speck3 = makeInstance(speckGeometry, 0xA020F0, 0, -4, 20);
    const speck4 = makeInstance(speckGeometry, 0xA020F0, 0, -2, 20);
    const speck5 = makeInstance(speckGeometry, 0xA020F0, 0, -3, 21);
    const speck6 = makeInstance(speckGeometry, 0xA020F0, 0, -3, 19);
    scene.add(speck1);
    scene.add(speck2);
    scene.add(speck3);
    scene.add(speck4);
    scene.add(speck5);
    scene.add(speck6);

    const groundGeometry = new THREE.BoxGeometry(10, 20, 50);
    const groundobj = makeInstance(groundGeometry, 0x5C4033, 0, -15, 20);
    scene.add(groundobj);
    const grassGeometry = new THREE.BoxGeometry(700, 19.9, 50);
    const grassobj = makeInstance(grassGeometry, 0x87cf44, 0, -15, 20);
    scene.add(grassobj);
    const cementGeometry = new THREE.BoxGeometry(700, 19.8, 500);
    const cementobj = makeInstance(cementGeometry, 0x7d8077, 0, -15, 20);
    scene.add(cementobj);
    


    // Our shapes
    const shapes = [
        // cube,
        // cylinder,
        sphere,
        sphere2,
        speck1,
        speck2,
        speck3,
        speck4,
        speck5,
        speck6,
    ];
    
    function loadColorTexture( path ) {
    const texture = loader.load( path );
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
    }

    // Rotate
    function render( time ) {

        time *= 0.001; // convert time to seconds

        shapes.forEach( ( shape, ndx ) => {

            const speed = 1 + ndx * .1;
            const rot = time * speed;
            shape.rotation.x = rot;
            shape.rotation.y = rot;

        } );

        renderer.render( scene, camera );

        requestAnimationFrame( render );

    }

    requestAnimationFrame( render );


    const treePositions = [
        { x: 0, y: -5, z: -2 },
        { x: 5, y: -5, z: -3 },
        { x: -5, y: -5, z: -1 },
        { x: 15, y: -5, z: -2 },
        { x: -15, y: -5, z: -1 },
        { x: 25, y: -5, z: -4 },
        { x: -25, y: -5, z: -4 },
        { x: 5, y: -5, z: -10 },
        { x: -5, y: -5, z: -10 },
        { x: 15, y: -5, z: -8 },
        { x: -15, y: -5, z: -8 },
        { x: 25, y: -5, z: -8 },
        { x: -25, y: -5, z: -8 },
        { x: 35, y: -5, z: -12 },
        { x: -35, y: -5, z: -12 },
        { x: 0, y: -5, z: -16 },
        { x: 5, y: -5, z: -16 },
        { x: -5, y: -5, z: -16 },
        { x: 15, y: -5, z: -16 },
        { x: -15, y: -5, z: -16 },
        { x: 25, y: -5, z: -16 },
        { x: -25, y: -5, z: -16 },
        { x: 35, y: -5, z: -16 },
        { x: -35, y: -5, z: -16 },
        { x: 45, y: -5, z: -16 },
        { x: -45, y: -5, z: -16 }
    ];

    // Load object
    const mtlLoader = new MTLLoader();
    mtlLoader.load('../lib/Lowpoly_tree_sample.mtl', (mtl) => {
        mtl.preload();

        // check if materials exist
        // if (mtl.materials.Material) {
        //     mtl.materials.Material.side = THREE.DoubleSide;
        // }
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);

        for (let i = 0; i < treePositions.length; i++) {
            const pos = treePositions[i];
            objLoader.load('../lib/Lowpoly_tree_sample.obj', (root) => {
                scene.add(root);
                root.position.set(pos.x, pos.y, pos.z);
                // compute the box that contains all the stuff
                // from root and below
                const box = new THREE.Box3().setFromObject(root);
                const boxSize = box.getSize(new THREE.Vector3()).length();
                const boxCenter = box.getCenter(new THREE.Vector3());

                frameArea(boxSize * 1.2, boxSize, boxCenter, camera);

                root.rotation.y = -Math.PI / i+1;
            });
        }
    });

    const mtlLoaderTemple = new MTLLoader();
    mtlLoaderTemple.load('../lib/Japanese_Temple.mtl', (mtl) => {
        mtl.preload();
        const objLoaderTemple = new OBJLoader();
        objLoaderTemple.setMaterials(mtl);
        objLoaderTemple.load('../lib/Japanese_Temple.obj', (root) => {
            scene.add(root);
            root.position.set(0, -5.2, 60);
            root.rotation.y = Math.PI;
        });
    });

    const orbControls = new OrbitControls(camera, renderer.domElement);
    orbControls.target.set(0,0,0);
    orbControls.update();

}

// Function that adjusts camera to fit objects
function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
    
    // compute a unit vector that points in the direction the camera is now
    // from the center of the box
    const direction = (new THREE.Vector3()).subVectors(camera.position, boxCenter).normalize();
    
    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
    
    // pick some near and far values for the frustum that
    // will contain the box.
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;
    
    camera.updateProjectionMatrix();
    
    // point the camera to look at the center of the box
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}


main();