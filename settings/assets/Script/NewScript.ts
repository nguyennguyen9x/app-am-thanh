// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
cc.NativeCallJS = function (data) {
    Scren.updateFrequency(data)
};
var func = null;
var oldData = null;
var newData = null;
@ccclass
export default class Scren extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Label)
    labelGhi: cc.Label = null;
    @property(cc.Label)
    labelPhat: cc.Label = null;
    static isGhi: boolean = false;
    isPhat: boolean = false;
    @property(cc.Prefab)
    man1Prefab: cc.Prefab = null;
    @property(cc.Node)
    man1: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    @property(cc.Node)
    canvas: cc.Node = null;

    @property(cc.EditBox)
    edb: cc.EditBox = null;
    // onLoad () {}

    @property(cc.Node)
    contentDoThi: cc.Node = null;
    @property(cc.Node)
    diem: cc.Node = null;

    @property(cc.Graphics)
    line: cc.Graphics = null;
    static listDiem = [];
    fre: number = 0;
    static _line: cc.Graphics;
    start() {
        this.diem.active = false;
        this.scheduleOnce(this.showthuoc, 0.5)
        this.scheduleOnce(this.showDongHo, 0.5)
        // this.show();
        // this.node.opacity = 0;
        // this.man1.active = true;
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
            this.schedule(this.time, 0.1);
        }
        else {

        }
    }

    resetDongHo() {
        this.time_dong_ho.string = "0 ms";
    }

    show() {

        this.node.opacity = 255;
        this.contentDoThi.removeAllChildren()
        this.showDoThi()
    }
    showFrequency() {
        let list = Scren.listDiem// JSON.parse(JSON.stringify(Scren.listDiem))
        this.line.clear();
        this.line.moveTo(0, list[0]);
        list.forEach((diem, ind) => {
            this.line.lineJoin = cc.Graphics.LineJoin.ROUND;
            this.line.lineTo(ind * 2, diem);
        })
        this.line.stroke();
    }
    showDoThi() {

        Scren.maxHeight = 0;
        Scren.max_frequency = 0;
        this.contentDoThi.active = true;
        let delta = 2;
        let trai = 0;
        let phai = Math.ceil(this.contentDoThi.width / delta);
        cc.log(this.contentDoThi.anchorX, trai, phai);
        Scren.listDiem = []
        for (let ngang = trai; ngang < phai; ngang++) {
            // let diem = cc.instantiate(this.diem);
            // diem.active = true;
            // this.contentDoThi.addChild(diem);
            Scren.listDiem.push(0)
            // diem.position = cc.v3(ngang * delta, 0);
        }
        Scren._line = this.line;
        Scren._labelDB = this.labelDB;
        Scren._labelAMP = this.labelAMP;
        Scren._line.node.getParent().runAction(cc.scaleTo(0.2, 0.5));
        this.line.clear();
        this.line.moveTo(Scren.listDiem[0].delta, Scren.listDiem[0].y);
        Scren.listDiem.forEach(diem => {
            this.line.lineJoin = cc.Graphics.LineJoin.ROUND;
            this.line.lineTo(diem.delta, diem.y);
        })
        this.line.stroke();



        Scren._line2 = this.line2;
        Scren.max_decibel = 0;
        let list = [];
        this.line2.clear();
        this.line2.moveTo(0, list[0]);
        for (let i = 0; i < Scren.dataSave.length; i++) {
            list.push(0)
        }
        Scren.dataSave = [];
        Scren.dataInput = [];
        list.forEach((diem, ind) => {
            this.line2.lineJoin = cc.Graphics.LineJoin.ROUND;
            this.line2.lineTo(ind * 2, 0);
        })
        this.line2.stroke();
        newData = "Nốt nhạc :  \nFrequency :   Hz\n(chênh   Hz)\nnốt chuẩn : Hz";
        // this.schedule(this.updateLine, 1)
    }

    static maxHeight = 0;
    static max_height = 1;

    @property(cc.Label)
    labelDB: cc.Label = null;
    @property(cc.Label)
    labelAMP: cc.Label = null;

    static _labelDB;
    static _labelAMP;
    static max_frequency = 0;
    static max_decibel = 0;
    static dataInput = []
    static dataSave = []


    // static showed = false;
    // static show(isShow = false) {
    //     if (Scren.showed) return;
    //     if (isShow) Scren.showed = true;
    //     Scren._line.clear();
    //     Scren._line.moveTo(0, 0);
    //     Scren.max_frequency = 0;
    //     Scren.maxHeight = 0;
    //     Scren.dataSave.forEach(data => Scren.updateFrequency2(JSON.stringify(data)))
    // }
    static _line2: cc.Graphics;
    @property(cc.Graphics)
    line2: cc.Graphics = null;

    updateLine() {
        if (!newData) return;
        Scren._line2.clear();
        Scren._line2.moveTo(0, 0);
        cc.log("updateLine ", newData)
        for (let i = 0; i < 150; i++) {
            Scren._line2.lineJoin = cc.Graphics.LineJoin.ROUND;
            Scren._line2.lineTo(i, (newData.amplitude.toFixed(1) / 2) * Math.sin(2 * Math.PI * 10 / newData.frequency * i));
        }
        Scren._line2.stroke();
    }

    static checkDecibel(data) {
        // Scren.dataInput.push(data);
        // // cc.lo
        // if (Scren.dataInput.length > 100)
        //     Scren.dataInput.shift();
        if (Scren.max_decibel >= data.decibel) {
            if (Scren.max_decibel > data.decibel) Scren.max_frequency = 0;
            // Scren.dataSave = Scren.dataInput.filter(vl => vl.decibel == Scren.max_decibel).slice();
            Scren.max_decibel = data.decibel;
        }
        // if (Scren.dataSave.length < 200 && Scren.max_decibel == data.decibel) {
        //     Scren.dataSave.push(data);
        //     // cc.log("checkDecibel", Scren.max_decibel.toFixed(2), Scren.dataInput.length, Scren.dataSave.length)
        // }
        // Scren.dataSave.forEach(res => {
        if (Scren.max_frequency < data.frequency && Scren.max_decibel == data.decibel && data.frequency > 125 && data.frequency < 8000) {
            // cc.log("start ", res)
            // newData = res;
            // cc.log("end ")
            Scren.max_frequency = data.frequency
            if (Scren.max_frequency < 261.63 + (294.33 - 261.63) / 2) //Đô(C4) 261.63
                newData = "Nốt nhạc : Đô - C4 \nFrequency : " + data.frequency.toFixed(2) + " Hz\n(chênh " + (Scren.max_frequency - 261.63).toFixed(2) + " Hz)\nnốt chuẩn : 261.63 Hz";
            else if (Scren.max_frequency < 293.55 + (329.65 - 293.55) / 2) //Rê 293.55
                newData = "Nốt nhạc : Rê \nFrequency : " + data.frequency.toFixed(2) + " Hz\n(chênh " + (Scren.max_frequency - 293.55).toFixed(2) + " Hz)\nnốt chuẩn : 293.55 Hz";
            else if (Scren.max_frequency < 329.65 + (349.28 - 329.65) / 2) //Mi 329.65
                newData = "Nốt nhạc : Mi \nFrequency : " + data.frequency.toFixed(2) + " Hz\n(chênh " + (Scren.max_frequency - 329.65).toFixed(2) + " Hz)\nnốt chuẩn : 329.65 Hz";
            else if (Scren.max_frequency < 349.28 + (391.92 - 349.28) / 2) //Fa 349.28
                newData = "Nốt nhạc : Fa \nFrequency : " + data.frequency.toFixed(2) + " Hz\n(chênh " + (Scren.max_frequency - 349.28).toFixed(2) + " Hz)\nnốt chuẩn : 349.28 Hz";
            else if (Scren.max_frequency < 391.92 + (440.06 - 391.92) / 2) //Sol 391,92
                newData = "Nốt nhạc : Sol \nFrequency : " + data.frequency.toFixed(2) + " Hz\n(chênh " + (Scren.max_frequency - 391.92).toFixed(2) + " Hz)\nnốt chuẩn : 391.92 Hz";
            else if (Scren.max_frequency < 440.06 + (493.95 - 440.06) / 2) //La 400,06
                newData = "Nốt nhạc : La \nFrequency : " + data.frequency.toFixed(2) + " Hz\n(chênh " + (Scren.max_frequency - 440.06).toFixed(2) + " Hz)\nnốt chuẩn : 440.06 Hz";
            else if (Scren.max_frequency < 493.95 + (523.26 - 493.95) / 2)//Si 493.95
                newData = "Nốt nhạc : Si \nFrequency : " + data.frequency.toFixed(2) + " Hz\n(chênh " + (Scren.max_frequency - 493.95).toFixed(2) + " Hz)\nnốt chuẩn : 493.95 Hz";
            else //Đô(C5) 523.26
                newData = "Nốt nhạc : Đô - C5 \nFrequency : " + data.frequency.toFixed(2) + " Hz\n(chênh " + (Scren.max_frequency - 523.26).toFixed(2) + " Hz)\nnốt chuẩn : 523.26 Hz";
            // })
        }
        Scren._labelDB.string = "Decibel : " + -data.decibel.toFixed(2) + " dB\nFrequency : " + data.frequency.toFixed(2) + " Hz\nAmplitude : " + data.amplitude.toFixed(2) + "\n\n\n\n" + newData;

        return;

    }

    static updateFrequency(data) {
        if (!Scren.isGhi) return
        data = JSON.parse(data)
        if (cc.sys.isBrowser) {
            data = {
                frequency: Math.random() * cc.winSize.height * Scren.max_height,
                decibel: -31.5,
                amplitude: 200 + Math.random() * 110,
            }
        }
        Scren.checkDecibel(data);
        // Scren.max_frequency = Math.max(Scren.max_frequency, data.frequency)
        // cc.log(data);
        // data.frequency /= 10;
        // if (data.frequency > Scren.maxHeight && data.frequency > cc.winSize.height && data.frequency < cc.winSize.height * Scren.max_height) {
        //     Scren._line.node.getParent().runAction(cc.scaleTo(0.2, 1, cc.winSize.height / data.frequency - 0.05));
        //     Scren._line.lineWidth = 4
        // }

        Scren.maxHeight = Math.min(Math.max(data.frequency, Scren.maxHeight), cc.winSize.height * Scren.max_height);
        Scren.listDiem.unshift(data.frequency);
        if (Scren.listDiem.length > cc.winSize.width - 280) Scren.listDiem.pop()
        let list = Scren.listDiem// JSON.parse(JSON.stringify(Scren.listDiem))
        Scren._line.clear();
        Scren._line.moveTo(0, list[0]);
        list.forEach((diem, ind) => {
            Scren._line.lineJoin = cc.Graphics.LineJoin.ROUND;
            Scren._line.lineTo(ind * 2, diem);
        })
        Scren._line.stroke();



    }
    click() {
        // this.label.string = "" + new Date();
        cc.log("this.man1")
        this.node.opacity = 0;
        this.contentDoThi.removeAllChildren()
        if (!this.man1) {
            this.man1 = cc.instantiate(this.man1Prefab)
        }
        this.canvas.addChild(this.man1)
        // this.unschedule(this.showFrequency);
    }
    onCallNative() {
        this.label.string = "" + new Date();
        if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onCallFromJavascript", "(Ljava/lang/String;Ljava/lang/String;)V", Scren.isGhi + "", this.isPhat + "");
        }
    }
    ghi() {
        this.labelGhi.string = Scren.isGhi ? "đã dừng ghi" : "đang ghi";
        Scren.isGhi = !Scren.isGhi;
        if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "ghi", "(Z)V", Scren.isGhi);
        }
        if (!Scren.isGhi) {
            if (cc.sys.isBrowser) this.unschedule(Scren.updateFrequency);
            newData = "Nốt nhạc :  \nFrequency :   Hz\n(chênh   Hz)\nnốt chuẩn : Hz";
            // this.unschedule(this.updateLine)
        } else {
            this.showDoThi();
            if (cc.sys.isBrowser) this.schedule(Scren.updateFrequency, 0.01);

        }
    }

    open_phet() {
        if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "open_phet", "(I)V", parseInt(this.edb.string) || 0);
        }
    }

    open_quid() {
        if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "open_quid", "(I)V", parseInt(this.edb.string) || 0);
        }
    }
    // update (dt) {}
}
module.exports = Scren;
