let watcherid=0;
class Watcher{
    /**
     *
     * @param vm vue实例
     * @param exOrfn 如果是渲染watcher传入的就是渲染函数，如果是计算watcher传入的就是路径表达式
     */
    constructor(vm,exOrfn) {
        this.vm=vm;
        this.getter=exOrfn;
        this.id=watcherid++;
        this.deps=[];//依赖项
        this.depIds={}//set集合，用于保证数据依赖项的唯一性
        this.get()
    }

    //计算触发getter
    get(){
        pushTarget(this);
        this.getter.call(this.vm,this.vm)
        popTarget();
    }


    //执行判断懒加载同步还是异步
    run(){
        this.get();
    }

    //对外公开函数，用于属性变化时更新页面的接口
    update(){
        this.run();
    }

    //清空依赖项
    cleanupDep(){

    }

    //将传入的dep与watcher关联
    addDep(dep){
        this.deps.push(dep)
    }
}
