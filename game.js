class playscene extends Phaser.Scene {
    constructor(){
        super("playscene");
        this.cannon;
        this.needle;
        this.w;
        this.h;
        this.s;
    }
    preload(){
        this.w = this.game.config.width;
        this.h = this.game.config.height;
        this.s = this.game.config.width * 0.01;
        this.load.image("needleimg", "needle.png");

    }

    create() {
        this.cannon = this.add.rectangle(this.w*0.2, this.h*0.5, this.w*0.1, this.h*0.1);
        this.cannon.setFillStyle(0xFFFFFF);
        this.needle = this.physics.add.sprite(this.cannon.x, this.cannon.y, "needleimg");
        this.needle.angle = 90;
        this.cannon.depth = 1;
        console.log(this.needle);
        this.needle.disableBody(true, true);
        this.input.on('pointerup',() =>{
            this.needle.enableBody(true, this.cannon.x, this.cannon.y, true, true);
            this.physics.velocityFromAngle(this.cannon.angle, 600, this.needle.body.velocity);
        });
    }

    update() {
        let {x,y,isDown} = this.input.activePointer;

    }
}
const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 512,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }
        }
    },
    backgroundColor: 0x000000,
    scene: playscene
};
const game = new Phaser.Game(config);