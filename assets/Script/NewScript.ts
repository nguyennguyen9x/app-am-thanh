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
@ccclass
export default class Scren extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Label)
    labelGhi: cc.Label = null;
    @property(cc.Label)
    labelPhat: cc.Label = null;
    @property
    isGhi: boolean = false;
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
        this.show();
        this.node.opacity = 0;
        this.man1.active = true;
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
        Scren._line.node.getParent().runAction(cc.scaleTo(0.2, 1));
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

    static checkDecibel(data) {
        Scren.dataInput.push(data);
        // cc.lo
        if (Scren.dataInput.length > 100)
            Scren.dataInput.shift();
        if (Scren.max_decibel >= data.decibel) {
            if (Scren.max_decibel > data.decibel) Scren.max_frequency = 0;
            Scren.dataSave = Scren.dataInput.filter(vl => vl.decibel == Scren.max_decibel).slice();
            Scren.max_decibel = data.decibel;
        }
        if (Scren.dataSave.length < 200 && Scren.max_decibel == data.decibel) {
            Scren.dataSave.push(data);
            let list = Scren.dataSave.map(vl => vl.frequency);
            cc.log("start ", Scren.dataSave.map(vl => vl.frequency))
            cc.log("checkDecibel ======>", list)
            Scren._line2.clear();
            Scren._line2.moveTo(0, list[0]);
            list.forEach((diem, ind) => {
                Scren._line2.lineJoin = cc.Graphics.LineJoin.ROUND;
                Scren._line2.lineTo(ind * 2, diem);
            })
            Scren._line2.stroke();
            cc.log("end ")
            Scren.dataSave.forEach(res => {
                Scren.max_frequency = Math.max(Scren.max_frequency, res.frequency)
                if (Scren.max_frequency < 261.63 + (294.33 - 261.63) / 2) //Đô(C4) 261.63
                    Scren._labelAMP.string = "Nốt nhạc : Đô - C4 \n(chênh " + (Scren.max_frequency - 261.63).toFixed(2) + " Hz)\nnốt chuẩn : 261.63 Hz";
                else if (Scren.max_frequency < 293.55 + (329.65 - 293.55) / 2) //Rê 293.55
                    Scren._labelAMP.string = "Nốt nhạc : Rê \n(chênh " + (Scren.max_frequency - 293.55).toFixed(2) + " Hz)\nnốt chuẩn : 293.55 Hz";
                else if (Scren.max_frequency < 329.65 + (349.28 - 329.65) / 2) //Mi 329.65
                    Scren._labelAMP.string = "Nốt nhạc : Mi \n(chênh " + (Scren.max_frequency - 329.65).toFixed(2) + " Hz)\nnốt chuẩn : 329.65 Hz";
                else if (Scren.max_frequency < 349.28 + (391.92 - 349.28) / 2) //Fa 349.28
                    Scren._labelAMP.string = "Nốt nhạc : Fa \n(chênh " + (Scren.max_frequency - 349.28).toFixed(2) + " Hz)\nnốt chuẩn : 349.28 Hz";
                else if (Scren.max_frequency < 391.92 + (440.06 - 391.92) / 2) //Sol 391,92
                    Scren._labelAMP.string = "Nốt nhạc : Sol \n(chênh " + (Scren.max_frequency - 391.92).toFixed(2) + " Hz)\nnốt chuẩn : 391.92 Hz";
                else if (Scren.max_frequency < 440.06 + (493.95 - 440.06) / 2) //La 400,06
                    Scren._labelAMP.string = "Nốt nhạc : La \n(chênh " + (Scren.max_frequency - 440.06).toFixed(2) + " Hz)\nnốt chuẩn : 440.06 Hz";
                else if (Scren.max_frequency < 493.95 + (523.26 - 493.95) / 2)//Si 493.95
                    Scren._labelAMP.string = "Nốt nhạc : Si \n(chênh " + (Scren.max_frequency - 493.95).toFixed(2) + " Hz)\nnốt chuẩn : 493.95 Hz";
                else //Đô(C5) 523.26
                    Scren._labelAMP.string = "Nốt nhạc : Đô - C5 \n(chênh " + (Scren.max_frequency - 523.26).toFixed(2) + " Hz)\nnốt chuẩn : 523.26 Hz";
            })

            Scren._labelDB.string = "Decibel : " + -data.decibel.toFixed(2) + " dB\nFrequency : " + Scren.max_frequency.toFixed(2) + " Hz";
            // cc.log("checkDecibel", Scren.max_decibel.toFixed(2), Scren.dataInput.length, Scren.dataSave.length)
        }

        return;

    }

    static updateFrequency(data) {
        data = JSON.parse(data)
        if (cc.sys.isBrowser) {
            data = {
                frequency: Math.random() * cc.winSize.height * Scren.max_height,
                decibel: -Math.random() * 110,
                amplitude: Math.random() * 110,
            }
        }
        Scren.checkDecibel(data);
        // Scren.max_frequency = Math.max(Scren.max_frequency, data.frequency)
        // cc.log(data);
        data.frequency /= 10;
        if (data.frequency > Scren.maxHeight && data.frequency > cc.winSize.height && data.frequency < cc.winSize.height * Scren.max_height) {
            Scren._line.node.getParent().runAction(cc.scaleTo(0.2, 1, cc.winSize.height / data.frequency - 0.05));
            Scren._line.lineWidth = 4
        }
        Scren.maxHeight = Math.min(Math.max(data.frequency, Scren.maxHeight), cc.winSize.height * Scren.max_height);
        Scren.listDiem.unshift(data.frequency);

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
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onCallFromJavascript", "(Ljava/lang/String;Ljava/lang/String;)V", this.isGhi + "", this.isPhat + "");
        }
    }
    ghi() {
        this.labelGhi.string = this.isGhi ? "đã dừng ghi" : "đang ghi";
        this.isGhi = !this.isGhi;
        if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "ghi", "(Z)V", this.isGhi);
        }
        if (!this.isGhi) {
            if (cc.sys.isBrowser) this.unschedule(Scren.updateFrequency);
        } else {

            this.showDoThi();
            if (cc.sys.isBrowser) this.schedule(Scren.updateFrequency, 0.2);

        }
    }

    phat() {
        if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "phat", "(I)V", parseInt(this.edb.string) || 0);
        }
    }
    // update (dt) {}
}
module.exports = Scren;
