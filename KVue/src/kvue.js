function KVue(options) {
    this._mounted=options.mounted;
    this._data=options.data;
    let elm=document.querySelector(options.el);
    this._el=options.el;
    this._template=elm;
    this._parent=elm.parentNode;
    this.initData();
    this.mount()
    //回调生命周期
    this._mounted()
}
