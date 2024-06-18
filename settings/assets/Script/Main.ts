// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Scren from "./NewScript";

const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(cc.Slider)
    fre: cc.Slider = null;
    @property(cc.Slider)
    amp: cc.Slider = null;

    @property(cc.SpriteFrame)
    sp: cc.SpriteFrame = null;

    @property(cc.Node)
    contentHat: cc.Node = null;
    @property(cc.Node)
    contentSong: cc.Node = null;
    @property(cc.Node)
    contentDoThi: cc.Node = null;


    @property(cc.Toggle)
    graph: cc.Toggle = null;
    @property(cc.Toggle)
    play_tone: cc.Toggle = null;
    @property(cc.Toggle)
    waves: cc.Toggle = null;
    @property(cc.Toggle)
    particles: cc.Toggle = null;
    @property(cc.Toggle)
    both: cc.Toggle = null;


    @property(cc.Sprite)
    loa: cc.Sprite = null;
    @property([cc.SpriteFrame])
    spr_loa: cc.SpriteFrame[] = [];

    @property(Scren)
    scren: Scren = null;
    private static _instance: any;
    static listVong: any;
    speed: number = 1;
    public static get instance(): any {
        if (!Main._instance)
            Main._instance = new Main()
        return Main._instance;
    }
    public static set instance(value: any) {
        Main._instance = value;
    }
    protected start(): void {

    }
    onEnable() {
        this.cham.active = false;
        this.tron.active = false;
        this.vong.active = false;
        this.diem.active = false;
        // this.contentDoThi.parent.active = false;
        this.goc = cc.v2(-this.contentHat.x, -this.contentHat.y);
        this.fre.progress = 0;
        this.amp.progress = 0;

        Main.listVong = []
        Main.listDiem = []
        this.contentHat.removeAllChildren()
        this.contentSong.removeAllChildren()
        this.contentDoThi.removeAllChildren()
        // this.showSong()
        // this.showHat()
        // this.showDoThi()
        // this.showDoThiByFrequency()
        // this.showthuoc()
        this.graph.isChecked = false;
        this.play_tone.isChecked = false;
        this.waves.isChecked = false;
        this.particles.isChecked = false;
        this.both.isChecked = false;
        this.scheduleOnce(this.showSong, 0.2)
        this.scheduleOnce(this.showHat, 0.3)
        this.scheduleOnce(this.showDoThi, 0.4)
        this.scheduleOnce(this.run, 0.5)
        // cc.NativeCallJS(11)
        this.sound();
    }

    changeSpeed(evt, data) {
        this.speed = parseFloat(data);
        this.run();
    }

    delayVong = 1;


    @property(cc.Node)
    tron: cc.Node = null;
    @property(cc.Node)
    vong: cc.Node = null;
    listVong = [];


    showSong() {
        this.vong.scale = 1;
        let delta = 8;
        let trai = -Math.ceil(this.contentDoThi.width / delta * this.contentDoThi.anchorX);
        let phai = Math.ceil(this.contentDoThi.width / delta * (1 - this.contentDoThi.anchorX)) + 2;
        let length = (phai - trai) * 1.07;

        for (let ngang = length; ngang > 0; ngang--) {
            let vong = cc.instantiate(this.vong);
            vong.active = true;
            vong.color = new cc.Color(255 * ngang / length, 255 * ngang / length, 255 * ngang / length)
            Main.listVong = [{
                target: vong,
                color: new cc.Color(127, 127, 127),
                delta: ngang * delta,
                time: 0
            }].concat(Main.listVong)
            this.contentSong.addChild(vong);
            vong.width = ngang * 2 * delta;
            vong.height = ngang * 2 * delta;
        }
    }

    goc = cc.v2(0, 0);

    @property(cc.Node)
    cham: cc.Node = null;
    listCham = [];
    showHat() {
        let delta = 25;//25;
        let trai = -Math.floor(this.contentHat.parent.width / delta / 2);
        let phai = Math.ceil(this.contentHat.parent.width / delta / 2);
        let duoi = -Math.floor(this.contentHat.parent.height / delta / 2);
        let tren = Math.ceil(this.contentHat.parent.height / delta / 2);
        cc.log(trai, phai, tren, duoi)
        this.listCham = [];
        for (let ngang = trai; ngang < phai; ngang++) {
            for (let doc = duoi; doc < tren; doc++) {
                let cham = cc.instantiate(this.cham);
                let node = new cc.Node();
                node.angle = Math.atan((doc * delta + this.goc.y) / (ngang * delta + this.goc.x)) * 180 / Math.PI
                cham.active = true;
                node.addChild(cham);
                this.contentHat.addChild(node);
                let x = Math.sqrt(Math.pow((doc * delta + this.goc.y), 2) + Math.pow((ngang * delta + this.goc.x), 2));
                this.listCham.push({
                    target: cham,
                    position: cc.v3(x, 0),// doc * delta + this.goc.y),
                    position_song: cc.v3(x, 0),// doc * delta + this.goc.y),
                    delta: x,
                    time: 0
                })
                if (ngang % 4 == 0 && doc % 4 == 0) cham.color = cc.Color.RED
                cham.opacity = (ngang % 4 == 0 && doc % 4 == 0) ? 255 : 0
                cham.position = cc.v3(x, 0)// doc * delta + this.goc.y);
            }
        }
    }


    @property(cc.Node)
    diem: cc.Node = null;
    static listDiem = [];

    showDoThi() {
        this.contentDoThi.active = true;
        let delta = 2;
        let trai = -Math.ceil(this.contentDoThi.width / delta * this.contentDoThi.anchorX);
        let phai = Math.ceil(this.contentDoThi.width / delta * (1 - this.contentDoThi.anchorX));
        cc.log(this.contentDoThi.anchorX, trai, phai);

        for (let ngang = trai; ngang < phai; ngang++) {
            let diem = cc.instantiate(this.diem);
            diem.height = 5;
            diem.active = true;
            this.contentDoThi.addChild(diem);
            let y = this.amp.progress * 30 * Math.cos(-2 * Math.PI * (1 / 20 + (1 / 20 - 1 / 100) * this.fre.progress) * ngang);
            Main.listDiem.push({
                target: diem,
                position: cc.v3(ngang * delta, y),
                delta: ngang * delta,
                time: 0
            })
            diem.position = cc.v3(ngang * delta, y);
        }

    }

    exit() {
        this.scren.show()
        this.unscheduleAllCallbacks()
        this.cham.active = false;
        this.tron.active = false;
        this.vong.active = false;
        this.diem.active = false;
        this.goc = cc.v2(-this.contentHat.x, -this.contentHat.y);
        this.fre.progress = 0;
        this.amp.progress = 0;

        Main.listVong = []
        Main.listDiem = []
        this.contentHat.removeAllChildren()
        this.contentSong.removeAllChildren()
        this.contentDoThi.removeAllChildren()

        this.node.removeFromParent()
    }

    hatMove() {
        // if (this.particles.isChecked || this.both.isChecked)
        this.listCham.forEach(cham => {
            let time = 0.1 + 0.2 * Math.random();
            let x = cham.position_song.x //+ Math.random() * 10;
            let y = cham.position_song.y //+ Math.random() * 10;
            cc.tween(cham.target)
                .to(time * this.speed, {
                    position: cc.v3(x, y)
                })
                .start()
        })
    }

    action() {
        let delta = 2 * Math.PI * (1 / 60 * (1 + this.fre.progress))
        let amp = 60 * this.amp.progress + 2
        this.contentHat.opacity = 255// (this.particles.isChecked || this.both.isChecked) ? 255 : 0;
        // if (this.particles.isChecked || this.both.isChecked)
        this.listCham.forEach((diem, ind) => {
            diem.time += 0.2;
            diem.position_song = cc.v2(diem.delta + amp * Math.cos(2 * Math.PI * 1 * diem.time + (diem.delta % amp) * Math.PI), 0)
        })
        let AVong = this.amp.progress * 127
        this.contentSong.opacity = (this.waves.isChecked || this.both.isChecked) ? 255 : 0;
        // if (-128 + AVong * Math.cos(delta * Main.listVong[0].delta / 2 + Main.listVong[0].time) < -128)
        //     cc.log((-128 + AVong * Math.cos(delta * Main.listVong[0].delta / 2 + Main.listVong[0].time)).toFixed(1), new Date().getTime())
        if (this.waves.isChecked || this.both.isChecked)
            Main.listVong.forEach((diem, ind) => {
                diem.time -= 0.2;
                let color = -128 + AVong * Math.cos(delta * diem.delta / 2 + diem.time)
                diem.target.color = new cc.Color(color, color, color);
            })
        let ADiem = this.amp.progress * 30
        this.contentDoThi.parent.opacity = (this.graph.isChecked) ? 255 : 0;
        if (this.graph.isChecked)
            Main.listDiem.forEach((diem, ind) => {
                diem.time += -0.2// ind > 15 ? -0.2 : +0.2;
                diem.target.position = cc.v3(diem.position.x, ADiem * Math.cos(delta * diem.delta / 2 + diem.time));// (ind > 15 ? -diem.time : -diem.time - Math.PI * 1.8)));
            })
    }
    is_spr_loa = 0;
    actionLoa() {
        this.is_spr_loa = this.is_spr_loa == 2 ? 1 : 2;
        if (this.amp.progress < 0.01) this.is_spr_loa = 0;
        this.loa.spriteFrame = this.spr_loa[this.is_spr_loa];
        // cc.error("///////////////////", (1 / (1 + this.fre.progress)) / this.speed)
    }
    test() {
        // this.scheduleOnce()
        // cc.tween(this.node).repeat("".length, cc.sequence(cc.callFunc(() => {

        // }), cc.delayTime(0.2)))
    }

    actionPause(target: cc.Toggle) {
        cc.log(target)
        if (target.isChecked) {
            this.unschedule(this.actionLoa)
            this.unschedule(this.action)
            this.unschedule(this.hatMove)
        }
        else {
            this.loa.spriteFrame = this.spr_loa[0];
            this.schedule(this.actionLoa, 1300 / 1000 / this.speed / 2 / (1 + this.fre.progress))//1109-
            this.schedule(this.action, 0.02 / this.speed)
            this.schedule(this.hatMove, 0.2 / this.speed)
        }

    }

    run() {
        this.unschedule(this.actionLoa)
        this.loa.spriteFrame = this.spr_loa[0];
        this.schedule(this.actionLoa, 1300 / 1000 / this.speed / 2 / (1 + this.fre.progress))//1109-
        this.unschedule(this.action)
        this.schedule(this.action, 0.02 / this.speed)
        this.unschedule(this.hatMove)
        this.schedule(this.hatMove, 0.2 / this.speed)

        // this.unschedule(this.sound)
        // this.schedule(this.sound, (2 + this.fre.progress * 0.8));
    }

    sound() {
        // cc.log(new Date())
        // if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
        //     jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "phat", "(I)V", parseInt(frequency) || 0);
        // }
    }

    // frequency = 1 / 60;
    // showDoThiByFrequency() {
    //     this.contentDoThi.active = true;
    //     let delta = 2;
    //     let trai = -Math.ceil(this.contentDoThi.width / delta * this.contentDoThi.anchorX);
    //     let phai = Math.ceil(this.contentDoThi.width / delta * (1 - this.contentDoThi.anchorX));
    //     for (let ngang = trai; ngang < phai; ngang++) {
    //         let diem = cc.instantiate(this.diem);
    //         diem.active = true;
    //         diem.height = 0;
    //         this.contentDoThi.addChild(diem);
    //         Main.listDiem.push({
    //             target: diem,
    //             position: cc.v3(ngang * delta, 0),
    //             height: 0
    //         })
    //         diem.position = cc.v3(ngang * delta, 0);
    //     }
    // }



    @property(cc.Node)
    dong_ho: cc.Node = null;

    @property(cc.Button)
    reset_dong_ho: cc.Button = null;
    @property(cc.Label)
    time_dong_ho: cc.Label = null;
    @property(cc.Button)
    play_dong_ho: cc.Button = null;

    showDongHo() {
        this.dong_ho.active = true;
        let touch_start_dau_thuoc = (event: cc.Event.EventTouch) => { };
        let touch_move_dau_thuoc = (event: cc.Event.EventTouch) => {
            var pos = this.dong_ho.parent.position;
            pos.x += event.getDeltaX();
            pos.y += event.getDeltaY();
            this.dong_ho.parent.position = pos;
        };
        let touch_end_dau_thuoc = (event: cc.Event.EventTouch) => { };
        this.dong_ho.on(cc.Node.EventType.TOUCH_START, touch_start_dau_thuoc, this);
        this.dong_ho.on(cc.Node.EventType.TOUCH_MOVE, touch_move_dau_thuoc, this);
        this.dong_ho.on(cc.Node.EventType.TOUCH_END, touch_end_dau_thuoc, this);
        this.dong_ho.on(cc.Node.EventType.TOUCH_CANCEL, touch_end_dau_thuoc, this);
        this.time_dong_ho.string = "";
    }
    time() {
        this.time_dong_ho.string = (parseFloat(this.time_dong_ho.string) + 0.1).toFixed(1) + " ms"
    }
    isRunTime: boolean = false;
    playDongHo() {
        this.unschedule(this.time)
        this.isRunTime = !this.isRunTime;
        this.reset_dong_ho.interactable = !this.isRunTime;
        if (this.isRunTime) {
            this.time_dong_ho.string = "0 ms";
            this.schedule(this.time, 0.1 / this.speed);
        }
        else {

        }
    }

    resetDongHo() {
        this.time_dong_ho.string = "0 ms";
    }

    reset() {
        this.fre.progress = 0;
        this.amp.progress = 0;
        this.graph.isChecked = false;
        this.play_tone.isChecked = false;
        this.waves.isChecked = false;
        this.particles.isChecked = false;
        this.both.isChecked = false;
    }


    @property(cc.Node)
    dau_thuoc: cc.Node = null;
    @property(cc.Node)
    duoi_thuoc: cc.Node = null;
    @property(cc.Label)
    soDo: cc.Label = null;
    @property(cc.Graphics)
    thuoc: cc.Graphics = null;


    showthuoc() {
        this.dau_thuoc.active = true;
        let touch_start_dau_thuoc = (event: cc.Event.EventTouch) => { };
        let touch_move_dau_thuoc = (event: cc.Event.EventTouch) => {
            var pos = this.dau_thuoc.parent.position;
            pos.x += event.getDeltaX();
            pos.y += event.getDeltaY();
            this.dau_thuoc.parent.position = pos;
        };
        let touch_end_dau_thuoc = (event: cc.Event.EventTouch) => { };
        this.dau_thuoc.on(cc.Node.EventType.TOUCH_START, touch_start_dau_thuoc, this);
        this.dau_thuoc.on(cc.Node.EventType.TOUCH_MOVE, touch_move_dau_thuoc, this);
        this.dau_thuoc.on(cc.Node.EventType.TOUCH_END, touch_end_dau_thuoc, this);
        this.dau_thuoc.on(cc.Node.EventType.TOUCH_CANCEL, touch_end_dau_thuoc, this);

        this.duoi_thuoc.active = true;
        let touch_start_duoi_thuoc = (event: cc.Event.EventTouch) => { };
        let touch_move_duoi_thuoc = (event: cc.Event.EventTouch) => {
            var pos = this.duoi_thuoc.position;
            pos.x += event.getDeltaX();
            pos.y += event.getDeltaY();
            this.duoi_thuoc.position = pos;
            this.thuoc.clear(true)
            this.thuoc.moveTo(0, 0);
            this.thuoc.lineJoin = cc.Graphics.LineJoin.ROUND;
            this.thuoc.lineTo(pos.x, pos.y);
            this.thuoc.stroke();
            this.soDo.string = (Math.abs(Math.sqrt(Math.pow(pos.x, 2) + Math.pow(pos.y, 2)) * 50 / 505).toFixed(1) + "")
            this.dau_thuoc.scaleX = pos.x > 0 ? 1 : -1;
            this.soDo.node.scaleX = pos.x > 0 ? 1 : -1;
        };
        let touch_end_duoi_thuoc = (event: cc.Event.EventTouch) => { };
        this.duoi_thuoc.on(cc.Node.EventType.TOUCH_START, touch_start_duoi_thuoc, this);
        this.duoi_thuoc.on(cc.Node.EventType.TOUCH_MOVE, touch_move_duoi_thuoc, this);
        this.duoi_thuoc.on(cc.Node.EventType.TOUCH_END, touch_end_duoi_thuoc, this);
        this.duoi_thuoc.on(cc.Node.EventType.TOUCH_CANCEL, touch_end_duoi_thuoc, this);

    }
}
module.exports = Main;


