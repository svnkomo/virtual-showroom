import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Color } from 'three'

/* 
Loaders
*/
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()


/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/* 
Update all materials
*/
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMap = environmentMap
            child.material.envMapIntensity = 1
            child.castShadow = true
            child.receiveShadow = true
            
        }
    })
}

/* 
Environment Map
*/
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/4/px.png',
    '/textures/environmentMaps/4/nx.png',
    '/textures/environmentMaps/4/py.png',
    '/textures/environmentMaps/4/ny.png',
    '/textures/environmentMaps/4/pz.png',
    '/textures/environmentMaps/4/nz.png'
])
environmentMap.encoding = THREE.sRGBEncoding
// scene.background = environmentMap
scene.environment = environmentMap

/* 
Model(s)
*/
gltfLoader.load(
    '/models/LeatherChair/Cupa Saddle Leather Swivel Base Chair_Cycles.gltf',
    (gltf) => {
        gltf.scene.scale.set(10, 10, 10)
        gltf.scene.position.set(-0.75, -4, 0)
        gltf.scene.rotation.y = Math.PI * 0.6
        gltf.scene.children[1].material.roughness = 0.425
        
        scene.add(gltf.scene)

        console.log(gltf);

        // gui.add(gltf.scene.rotation, 'y',
        //  -Math.PI,
        //   Math.PI, 0.001).name('modelRotation')

          updateAllMaterials()
    }

)

const floorMesh = new THREE.Mesh(
 new THREE.CircleGeometry(5, 64),
 new THREE.MeshStandardMaterial( {color: 'white'})
)
floorMesh.rotation.x = -Math.PI * 0.5
floorMesh.position.set(-0.5, -4, 0)
scene.add(floorMesh)

/* 
Lights
*/

const directionalLight = new THREE.DirectionalLight('white', 2)
directionalLight.position.set(0.25, 3, -2.25)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 10
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.02
scene.add(directionalLight)

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

// gui.add(directionalLight, 'intensity', 0, 10, 0.001).name('lightIntensity')
// gui.add(directionalLight.position, 'x', -5, 5, 0.001).name('lightX')
// gui.add(directionalLight.position, 'y', -5, 5, 0.001).name('lightY')
// gui.add(directionalLight.position, 'z', -5, 5, 0.001).name('lightZ')


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(28, 2, -10)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = true
controls.minDistance = 9
controls.maxDistance = 15
controls.maxPolarAngle = Math.PI * 0.5


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

// gui.add(renderer, 'toneMapping', {
//     No: THREE.NoToneMapping,
//     Linear: THREE.LinearToneMapping,
//     Reinhard: THREE.ReinhardToneMapping,
//     Cineon: THREE.CineonToneMapping,
//     ACESFilmic: THREE.ACESFilmicToneMapping
// })


/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()