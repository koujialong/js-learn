let depid = 0;

class Dep {
    constructor() {
        this.id = depid++;
        this.subs = [];//存储与当前Dep关联的watcher
    }

    //添加一个watcher
    addSub(sub) {
        this.subs.push(sub)
    }

    //删除watcher
    removeSub(sub) {
        for (let i = this.subs.length - 1; i >= 0; i--) {
            let subItem = this.subs[i];
            if (subItem===sub) {
                this.subs.splice(i,1);
            }
        }
    }

    //将dep与当前watcher关联
    depend(){
        //检查当前全局挂载的watcher
        if (Dep.target) {
            this.addSub(Dep.target);//将当前的watcher关联到dep上
            Dep.target.addDep(this);//将当前Dep挂载到当前watcher上
        }
    }

    //触发更新，更新watcher的update方法,更新页面数据
    notify(){
        let deps=this.subs;
        deps.forEach(watcher=>{
            watcher.update()
        })
    }

}

//全集挂载的watcher
Dep.target=null;
let targetStack=[]

//挂载全局的target
function pushTarget(target) {
    //保存历史watcher
    targetStack.unshift(Dep.target)
    Dep.target=target;
}

function popTarget() {
    Dep.target=targetStack.shift()//恢复历史的watcher
}
