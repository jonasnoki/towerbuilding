import { Scene, Vector3 } from 'three'
import Brick from './Brick'
import { Tween, update as tweenUpdate } from '@tweenjs/tween.js'


export default class TowerGame {
    private static startPos = new Vector3(-5, 0, 0)
    private static standardDuration = 1000;

    private bricks: Brick[] = []
    private scene: Scene
    private tween: Tween<Vector3> = new Tween<Vector3>(TowerGame.startPos)


    constructor(scene: Scene) {
        this.scene = scene
        this.createBrick()
        document.addEventListener('keypress', (key) => this.keypress(key))
    }

    public currentBrick(): Brick{
        return this.bricks[this.bricks.length - 1];
    }

    private prevBrick(): Brick{
        return this.bricks[this.bricks.length - 2];
    }

    public lookAt(): Vector3{
        const y = this.bricks.length < 1 ? 0 : this.currentBrick().mesh.position.y;
        return new Vector3(0,y, 0);
    }
    public currentHeight(): number{
        return this.bricks.length < 1 ? 0 : this.currentBrick().mesh.position.y;
    }

    private keypress(key: KeyboardEvent) {
        const now = new Date();
        if (key.code === 'Space' && !key.repeat) {
            this.tween.stop()
            if(this.isValidBrickPosition()){
                this.createBrick()
            } else {
                this.bricks.forEach(brick => {
                    this.scene.remove(brick.mesh)
                })
                this.bricks = [];
            }
        }
    }

    private createBrick() {
        const newPos = TowerGame.startPos.clone()
        if(this.bricks.length > 0){
            newPos.y = this.currentBrick().mesh.position.y + Brick.height;
        } else {
            newPos.y = TowerGame.startPos.y;
        }
        const x = (Math.random() * 10) - 5;
        newPos.x = x;
        const currentBrick = new Brick(newPos)
        this.scene.add(currentBrick.mesh)

        const direction = Math.random() < 0.5 ? 1 : -1;

        const duration = (5 + (x * direction)) / 10 * TowerGame.standardDuration
        const tweenA = new Tween<Vector3>(currentBrick.mesh.position)
            .to({ x: -5 * direction }, duration)

        const tweenB = new Tween<Vector3>(currentBrick.mesh.position)
            .to({ x: 5 * direction }, TowerGame.standardDuration)
            .repeat(Infinity)
            .yoyo(true)

        this.tween = tweenA.chain(tweenB)
        this.tween.start();

        this.bricks.push(currentBrick)
    }

    private isValidBrickPosition(): boolean{
        if(this.bricks.length < 2) return true
        const prevWidth = this.currentBrick().width;

        const prevX = this.currentBrick().mesh.position.x
        const prevMinX = prevX - (prevWidth / 2);
        const prevMaxX = prevX + (prevWidth / 2);

        const currX = this.prevBrick().mesh.position.x
        const currMinX = currX - (prevWidth / 2);
        const currMaxX = currX + (prevWidth / 2);

        const leftIsIn = currMinX < prevMaxX && currMinX > prevMinX
        const rightIsIn = currMaxX < prevMaxX && currMaxX > prevMinX
        return leftIsIn || rightIsIn
    }

    update(time: number) {
        tweenUpdate(time)
    }
}