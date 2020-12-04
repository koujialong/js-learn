KVue.prototype.mount=function () {
    //提供一个render函数 生成虚拟dom
    this.render=this.createRenderFn();

    this.mountComponent()
}

//这里是生成render函数，目的是缓存抽象语法树ast-（这里用虚拟dom模拟）
KVue.prototype.createRenderFn=function(){
    //函数科里化，关村ast树
    let ast=getVNode(this._template)
    return function render() {
        let _tmp= combine(ast,this._data)
        return _tmp;
    }
}

KVue.prototype.mountComponent=function () {
    //执行渲染函数
    let mount=()=>{
        this.update(this.render());
    }

    //watcher 全局的watcher
    new Watcher(this,mount);
}


//将虚拟dom渲染到页面：diff算法就在这里
KVue.prototype.update=function (VNode) {
    let realDom=parseNode(VNode);
    this._parent.replaceChild(realDom,document.querySelector(this._el))
}
