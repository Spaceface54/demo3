class playscene extends Phaser.Scene {
    init(data) {
        this.levelnum = data.levelnum || 3;
    }

    constructor(){
        super("playscene");
        this.cannon;
        this.needle = [];
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
        
        this.cannon = this.add.rectangle(this.w*0.1, this.h*0.7, this.w*0.05, this.h*0.05);
        this.cannon.setFillStyle(0xFFFFFF);
        
        //this.add.image(this.cannon.x, this.cannon.y, "needleimg");
        this.cannon.depth = 1;
        //console.log(this.needle);
        //this.needle.disableBody(true, true);
        this.time.addEvent({
            delay: 100,
            loop: false,
            callback: () =>{
                this.input.on('pointerdown',(pointer) =>{
                    let tempneedle = this.matter.add.image(0, this.h, "needleimg");
                    tempneedle.setFriction(0.05);
                    tempneedle.setFrictionAir(0.0005);
                    tempneedle.setBounce(0.9);
                    tempneedle.angle = 0;
                    tempneedle.x = this.cannon.x;
                    tempneedle.y = this.cannon.y;
                    tempneedle.angle = this.cannon.angle;
                    tempneedle.setVelocity(0, 0);
                    let a = Math.abs(this.cannon.x - pointer.x);
                    let b = Math.abs(this.cannon.y - pointer.y);
                    this.matter.applyForceFromAngle(tempneedle.body, 0.05/(((this.w*0.7))/(Math.sqrt(a*a + b*b)+(this.w*0.2))), this.cannon.rotation);
                    this.needle.push(tempneedle);
                    this.time.addEvent({
                        delay: 5000,
                        loop: false,
                        callback: () =>{
                            this.needle.splice(this.needle.indexOf(tempneedle), 1);
                            tempneedle.destroy()
                        }
                    });
                });
            }
        });

        //level 1
        if(this.levelnum == 1){
            let box = this.matter.add.image(this.w*0.5, this.h*0.7, "box", null, {isStatic: true});
            let ballon = this.matter.add.image(this.w*0.7, this.h*0.3, "ballon", null, {isStatic: true, shape:"circle"});
            this.matter.world.on('collisionstart', (event, bodyA, bodyB) =>
            {
                if(bodyA == ballon.body || bodyB == ballon.body){
                    this.needle = [];
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
        //level 2
        if(this.levelnum == 2){
            let box1 = this.matter.add.image(this.w*0.5, this.h*0.3, "box", null, {isStatic: true});
            let box2 = this.matter.add.image(this.w*0.5, this.h*0.7, "box", null, {isStatic: true});

            let ballon1 = this.matter.add.image(this.w*0.4, this.h*0.2, "ballon", null, {isStatic: true, shape:"circle"});
            let ballon2 = this.matter.add.image(this.w*0.8, this.h*0.4, "ballon", null, {isStatic: true, shape:"circle"});


            box1.setScale(0.4, 3.2);
            box2.setScale(0.4, 3.3);
            box1.angle = 45;
            box2.angle = 45;

            let wincounter = 0;
            this.matter.world.on('collisionstart', (event, bodyA, bodyB) =>
            {
                if(bodyA == ballon1.body || bodyB == ballon1.body){
                    wincounter++;
                    ballon1.destroy()
                }
                if(bodyA == ballon2.body || bodyB == ballon2.body){
                    wincounter++;
                    ballon2.destroy();
                }
                if(wincounter == 2){
                    this.needle = [];
                    wincounter++;
                    this.scene.start("winscreen", {
                        levelnum:3
                    });
                }

            });
        }

        //level 3

        if(this.levelnum == 3){
            
            let magnet1 = this.matter.add.image(this.w*0.5, this.h*0.5, "ballon", null, {
                isStatic: true, 
                shape:"circle",
                plugin: {
                    attractors: [
                        (bodyA, bodyB) => ({
                            x: ((bodyA.position.x - bodyB.position.x)* (this.dist(bodyA.position.x, bodyB.position.x, bodyA.position.y, bodyB.position.y)> (this.w*0.15) ? 0 : 1)) * 0.00003,
                            y: ((bodyA.position.y - bodyB.position.y)* (this.dist(bodyA.position.x, bodyB.position.x, bodyA.position.y, bodyB.position.y)> (this.w*0.15) ? 0 : 1)) * 0.00003
                        })
                    ]
                }
            });
            magnet1.setScale(0.1, 0.1);

            magnet1.setTint(0x000000);

        }
        


    }

    update() {
        //let {x,y,isDown} = this.input.activePointer;
        this.cannon.rotation = Phaser.Math.Angle.BetweenPoints(this.cannon, this.input.activePointer);
        if(this.needle[0] != undefined && this.needle[0].scene != undefined){
            //console.log(this.needle.length);
            for(let i = 0; i<this.needle.length; i++){
                let ang = this.needle[i].body.velocity;
                this.needle[i].rotation = new Phaser.Math.Vector2(ang.x, ang.y).angle()+(Math.PI/2);
            }
        }
    }
    dist(x1, x2, y1, y2){
        let a = Math.abs(x1 - x2);
        let b = Math.abs(y1 - y2);
        return Math.sqrt(a*a + b*b);
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

        this.add.text(50, 50, "Congradulations on beating level "+ (this.levelnum-1) +"!").setFontSize(40);
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
            debug:true,
            plugins: {
                attractors:true
            }
        }
    },
    backgroundColor: 0xbbbbbb,
    scene: [playscene,winscreen]
};
const game = new Phaser.Game(config);