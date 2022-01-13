import { MeshBasicMaterial, BoxGeometry, Mesh, Vector3, MeshPhongMaterial } from 'three'
import { isNumber } from 'util'

export default class Brick {
    public static height = 0.3
    public static width = 3

    public mesh: Mesh
    public width: number;

    private geometry = new BoxGeometry(Brick.width, Brick.height, 1)
    private material = new MeshPhongMaterial({ color: 0x92AA83 })

    constructor(position: Vector3, width: number = Brick.width) {
        this.width = width;
        this.mesh = new Mesh(this.geometry, this.material)
        this.mesh.position.copy(position)
    }
}