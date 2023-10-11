// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

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
        this.scheduleOnce(this.showSong, 0.2)
        this.scheduleOnce(this.showHat, 0.3)
        this.scheduleOnce(this.showDoThi, 0.4)
        this.scheduleOnce(this.showthuoc, 0.5)
        this.scheduleOnce(this.run, 0.5)
        // cc.NativeCallJS(11)
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
        this.vong.scale = 0.1;
        this.vong.scale = 1;
        let delta = 8;
        let trai = -Math.ceil(this.contentDoThi.width / delta * this.contentDoThi.anchorX);
        let phai = Math.ceil(this.contentDoThi.width / delta * (1 - this.contentDoThi.anchorX));
        let length = (phai - trai) * 1.07;

        for (let ngang = length; ngang > 0; ngang--) {
            let vong = cc.instantiate(this.vong);
            vong.active = true;
            vong.color = new cc.Color(255 * ngang / length, 255 * ngang / length, 255 * ngang / length, 255)
            Main.listVong = [{
                target: vong,
                color: new cc.Color(127, 127, 127, 255),
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
                cham.position = cc.v3(x, 0)// doc * delta + this.goc.y);
            }
        }
        this.schedule(() => {
            this.listCham.forEach(cham => {
                let time = 0.2 + 0.2 * Math.random();
                let x = cham.position_song.x + Math.random() * 15;
                let y = cham.position_song.y + Math.random() * 15;
                cc.tween(cham.target)
                    .to(time, {
                        position: cc.v3(x, y)
                    })
                    .start()
            })
        }, 0.2)
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
        this.dau_thuoc.off(cc.Node.EventType.TOUCH_START);
        this.dau_thuoc.off(cc.Node.EventType.TOUCH_MOVE);
        this.dau_thuoc.off(cc.Node.EventType.TOUCH_END);
        this.dau_thuoc.off(cc.Node.EventType.TOUCH_CANCEL);
        this.duoi_thuoc.off(cc.Node.EventType.TOUCH_START);
        this.duoi_thuoc.off(cc.Node.EventType.TOUCH_MOVE);
        this.duoi_thuoc.off(cc.Node.EventType.TOUCH_END);
        this.duoi_thuoc.off(cc.Node.EventType.TOUCH_CANCEL);
        this.node.removeFromParent()
    }
    action() {
        let delta = 2 * Math.PI * (1 / 60 * (1 + this.fre.progress))
        let ACham = 20 * this.amp.progress

        this.listCham.forEach((diem, ind) => {
            diem.time -= 0.2;
            diem.position_song = cc.v2(diem.delta + ACham * Math.cos(delta * diem.delta / 2 + diem.time), 0)
        })
        let AVong = this.amp.progress * 127
        Main.listVong.forEach((diem, ind) => {
            diem.time -= 0.2;
            let color = -128 + AVong * Math.cos(delta * diem.delta / 2 + diem.time)
            diem.target.color = new cc.Color(color, color, color, 255);
        })
        let ADiem = this.amp.progress * 30
        Main.listDiem.forEach((diem, ind) => {
            diem.time += -0.2// ind > 15 ? -0.2 : +0.2;
            diem.target.position = cc.v3(diem.position.x, ADiem * Math.cos(delta * diem.delta / 2 + diem.time));// (ind > 15 ? -diem.time : -diem.time - Math.PI * 1.8)));
        })
    }
    run() {
        this.unschedule(this.action)
        this.schedule(this.action, 0.03 / this.speed)
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

    static maxHeight = 0;
    static updateFrequency(frequency = 0) {
        cc.log(frequency)
        Main.maxHeight = Math.max(Main.maxHeight, frequency)
        for (let index = Main.listDiem.length - 1; index >= 1; index--) {
            Main.listDiem[index].height = Main.listDiem[index - 1].height;
            Main.listDiem[index].target.height = Main.listDiem[index].height / Main.maxHeight * 85;
        }
        Main.listDiem[0].height = frequency;
        Main.listDiem[0].target.height = frequency / Main.maxHeight * 85;
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

cc.NativeCallJS = function (params) {
    Main.updateFrequency(parseFloat(params))
};
