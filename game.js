class playscene extends Phaser.Scene {
    init(data) {
        this.levelnum = data.levelnum;
    }

    constructor(){
        super("playscene");
        this.cannon;
        this.needle;
        this.w;
        this.h;
        this.s;
        //this.power = 0.05
    }
    preload(){
        this.w = this.game.config.width;
        this.h = this.game.config.height;
        this.s = this.game.config.width * 0.01;
        this.load.image("needleimg", "needle.png");
        this.load.image("ballon", "ballon.png");
        this.load.image("box","box.png");

    }

    create() {
        this.needle = this.matter.add.image(0, this.h, "needleimg");
        this.cannon = this.add.rectangle(this.w*0.1, this.h*0.7, this.w*0.05, this.h*0.05);
        this.cannon.setFillStyle(0xFFFFFF);
        
        //this.add.image(this.cannon.x, this.cannon.y, "needleimg");
        this.needle.setFriction(0.05);
        this.needle.setFrictionAir(0.0005);
        this.needle.setBounce(0.9);
        this.needle.angle = 0;
        this.cannon.depth = 1;
        //console.log(this.needle);
        //this.needle.disableBody(true, true);
        this.input.on('pointerup',(pointer) =>{
            this.needle.x = this.cannon.x;
            this.needle.y = this.cannon.y;
            this.needle.angle = this.cannon.angle;
            this.needle.setVelocity(0, 0);
            let a = Math.abs(this.cannon.x - pointer.x);
            let b = Math.abs(this.cannon.y - pointer.y);
            this.matter.applyForceFromAngle(this.needle.body, 0.05/(((this.w*0.7))/(Math.sqrt(a*a + b+b)+(this.w*0.2))), this.cannon.rotation);
            //console.log(this.needle.x);
        });

        //level 1

        let box = this.matter.add.image(this.w*0.5, this.h*0.7, "box", null, {isStatic: true});
        let ballon = this.matter.add.image(this.w*0.7, this.h*0.3, "ballon", null, {isStatic: true, shape:"circle"});
        this.matter.world.on('collisionstart', (event, bodyA, bodyB) =>
        {
            if(bodyA == ballon.body || bodyB == ballon.body){
                this.scene.start("winscreen", {
                    levelnum:2
                });
            }

        });
        box.setScale(1, 3.6);

        this.tweens.add({
            targets: ballon,
            alpha:1,
            y:this.h*0.5,
            duration: 2000,
            ease: "Sine.easeOut",
            repeat: -1,
            yoyo:true
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

class winscreen extends Phaser.Scene {
    init(data) {
        this.levelnum = data.levelnum;
    }
    constructor() {
        super('winscreen');
    }
    create() {

        this.add.text(50, 50, "Congradulations on beating level 1!").setFontSize(40);
        this.add.text(50, 100, "Click anywhere to continue").setFontSize(20);
        this.input.on('pointerdown', () => {
            this.scene.start("playscene", {
                levelnum:this.levelnum
            });
        });
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
    scene: [playscene,winscreen]
};
const game = new Phaser.Game(config);