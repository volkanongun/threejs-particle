import * as THREE from 'three'
import * as dat from 'dat.gui'

const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

renderer.shadowMap.enabled = true
renderer.setClearColor(new THREE.Color('#21282a'), 1)

const loader = new THREE.TextureLoader()
const cross = loader.load('./assets/cross.png')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  45, 
  window.innerWidth/window.innerHeight,
  .01,
  10000
)
camera.position.z = 50;

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight)

const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
const material = new THREE.PointsMaterial( { 
  color: 0xffffff,
  size: .05
} );

const torus = new THREE.Points( geometry, material );
scene.add( torus );

const particleGeo = new THREE.BufferGeometry
const particleCount = 10000

const posArray = new Float32Array(5000 * 3).fill().map(() => THREE.MathUtils.randFloatSpread(100))

particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
const particleMaterial = new THREE.PointsMaterial( { 
  color: 0xffffff,
  size: .4,
  map: cross,
  transparent: true
} );
const particleMesh = new THREE.Points(particleGeo,particleMaterial)
scene.add(particleMesh)

// const geo = new THREE.BufferGeometry();
// const vertices = new Float32Array( [
// 	-1.0, -1.0,  1.0,
// 	 1.0, -1.0,  1.0,
// 	 1.0,  1.0,  1.0,

// 	 1.0,  1.0,  1.0,
// 	-1.0,  1.0,  1.0,
// 	-1.0, -1.0,  1.0
// ] );

// geo.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
// const mat = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
// const mesh = new THREE.Mesh( geo, mat );
// scene.add(mesh)

const gui = new dat.GUI()

const mousePosition = new THREE.Vector2()

window.addEventListener('mousemove', function(e){
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1
  mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1
})

const clock = new THREE.Clock()

function animate(){

  const elapsedTime = clock.getElapsedTime()

  torus.rotation.y = elapsedTime * .3

  particleMesh.rotation.y = mousePosition.x * (elapsedTime * .02)
  particleMesh.rotation.x = mousePosition.y * (elapsedTime * .02)
  
  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', function(){
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})