import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { AmbientLight, DirectionalLight, Light, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import TowerGame from './TowerGame'

function init() {
    const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100)

    camera.position.set(0, 2, 12)
    camera.lookAt(0, -3, 0)

    const scene = new Scene()

    const light1 = new DirectionalLight(0x404040, 1.6) // soft white light
    light1.position.set(5, 0, 5)
    light1.lookAt(0, 0, 0)
    light1.shadow.autoUpdate = true
    scene.add(light1)

    const light2 = new DirectionalLight(0x404040, 1.6) // soft white light
    light2.position.set(-5, 5, 5)
    light2.lookAt(0, 0, 0)
    light2.shadow.autoUpdate = true
    scene.add(light2)


    const game = new TowerGame(scene)

    const canvas = document.getElementById('canvas')
    const renderer = new WebGLRenderer({ antialias: true, canvas: canvas as HTMLCanvasElement })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setAnimationLoop((time) => animation(time, camera, scene, renderer, game, [light1, light2]))
}

function animation(time: number, camera: THREE.Camera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, game: TowerGame, lights: Light[]) {
    game.update(time)
    const yPos = game.currentHeight() + 5
    camera.position.y = yPos
    lights.forEach(light => {
        light.position.y = yPos + 2
    })
    camera.lookAt(game.lookAt())
    renderer.render(scene, camera)

}

init()