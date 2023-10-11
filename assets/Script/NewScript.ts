// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';
    isGhi: boolean = false;
    isPhat: boolean = false;
    @property(cc.Prefab)
    man1Prefab: cc.Prefab = null;
    man1: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:


    @property(cc.EditBox)
    edb: cc.EditBox = null;
    // onLoad () {}

    start() {

    }

    click() {
        // this.label.string = "" + new Date();
        cc.log(this.man1)
        if (!this.man1) {
            this.man1 = cc.instantiate(this.man1Prefab)
        }
        this.node.addChild(this.man1)
    }
    onCallNative() {
        this.label.string = "" + new Date();
        if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onCallFromJavascript", "(Ljava/lang/String;Ljava/lang/String;)V", this.isGhi + "", this.isPhat + "");
        }
    }
    ghi() {
        this.label.string = this.isGhi ? "đã dừng ghi" : "đang ghi";
        if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "ghi", "(Z)V", false);
        }
        this.isGhi = !this.isGhi;
    }

    phat() {
        this.label.string = this.isPhat ? "đã dừng phát" : "đang phát";
        if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "phat", "(I)V", parseInt(this.edb.string));
        }
        this.isPhat = !this.isPhat;
    }
    // update (dt) {}
}
