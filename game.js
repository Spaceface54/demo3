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
        this.needle = this.matter.add.image(50, 50, "needleimg");
        this.cannon = this.add.rectangle(this.w*0.1, this.h*0.5, this.w*0.05, this.h*0.05);
        this.cannon.setFillStyle(0xFFFFFF);
        
        //this.add.image(this.cannon.x, this.cannon.y, "needleimg");
        this.needle.setFriction(0.05);
        this.needle.setFrictionAir(0.0005);
        this.needle.setBounce(0.9);
        this.needle.angle = 0;
        this.cannon.depth = 1;
        //console.log(this.needle);
        //this.needle.disableBody(true, true);
        this.input.on('pointerup',() =>{
            this.needle.x = this.cannon.x;
            this.needle.y = this.cannon.y;
            this.needle.angle = this.cannon.angle;
            this.needle.setVelocity(0, 0);
            this.matter.applyForceFromAngle(this.needle.body, 0.05, this.cannon.rotation);
            //console.log(this.needle.x);
        });
    }

    update() {
        let {x,y,isDown} = this.input.activePointer;
        this.cannon.rotation = Phaser.Math.Angle.BetweenPoints(this.cannon, this.input.activePointer);
        let ang = this.needle.body.velocity;
        //this.needle.setAngularVelocity(10);
        //console.log(this.needle.body.velocity.y);
        this.needle.rotation = new Phaser.Math.Vector2(ang.x, ang.y).angle()+(Math.PI/2);
        
    }
}
const config = {
    type: Phaser.AUTO,
    width: 1040,
    height: 612,
    physics: {
        default: 'matter',
        matter: {
            debug:true
        }
    },
    backgroundColor: 0xbbbbbb,
    scene: playscene
};
const game = new Phaser.Game(config);