// 响应式化的部分
let ARRAY_METHOD = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice',
];

let array_methods=Object.create(Array.prototype);

ARRAY_METHOD.forEach(method=>{
    array_methods[method]=function () {
        for (let i = 0; i < arguments.length; i++) {
            let argument = arguments[i];
            observe(argument)
        }
        let res=Array.prototype[method].apply(this,arguments)
        return res;
    }
})

//劫持数据响应化
function defineReactive(target,key,value,enumerable) {
    if (typeof value==='object'&&value!=null ) {
        //非数组引用类型
        observe(value)//递归响应化
    }

    let dep=new Dep();
    dep.__propName__=key;
    console.log('劫持',value)
    Object.defineProperty(target,key,{
        configurable:true,
        enumerable:!!enumerable,
        get(){
            dep.depend()
            return value;
        },
        set(newValue){
            if (value===newValue) return;

            //重置引用类型的数据时候，重新响应化数据
            if (typeof newValue=='object'&&newValue!=null) {
                observe(newValue)
            }

            value=newValue;
            dep.notify();
        }
    });
}

//讲某个对象属性访问映射到对象的某个属性成员上
function proxy(target,prop,key){
    Object.defineProperty(target,prop,{
        enumerable: true,
        configurable: true,
        get(){
            return target[prop][key]
        },
        set(newVal){
            target[prop][key]=newVal;
        }
    })
}

//将对象变为响应式对象
function observe(obj){
    if (typeof obj !='object') {
        console.log("no object")
        return
    }
    console.log(obj,Array.isArray(obj))
    if (Array.isArray(obj)) {
        //对数组进行处理
        obj.__proto__=array_methods;
        for (let i = 0; i < obj.length; i++) {
              observe(obj[i])//循环递归array元素响应化
        }
    }else {
        //对成员进行处理
        let keys=Object.keys(obj)
        // keys.forEach(key=>{
        //     console.log(key)
        //     defineReactive(obj,key,obj[key],true)
        // })
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            defineReactive(obj,key,obj[key],true)
        }
    }
}

KVue.prototype.initData=function () {
    //遍历 this._data对象，将属性转换为响应式
    let keys=Object.keys(this._data);

    //响应化
    observe(this._data);

    for (let i = 0; i < keys.length; i++) {
       // proxy(this,'_data',keys[i])
    }

}
