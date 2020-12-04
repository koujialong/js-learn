//HtmlDom=>VNode
function getVNode(node) {
    let nodeType=node.nodeType;
    let _vnode=null;
    if (nodeType===1) {
        //元素
        let nodeName=node.nodeName;
        let attrs=node.attributes;
        let _attrObj={}
        for (let i = 0; i < attrs.length; i++) {
            let attr = attrs[i];
            //将attr属性节点提取
            _attrObj[attr.nodeName]=attr.nodeValue;
        }
        _vnode=new VNode(nodeName,_attrObj,undefined,nodeType)

        //考虑node的子元素
        let childNodes=node.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            _vnode.appendChild(getVNode(childNodes[i]))
        }
    }else if (nodeType===3) {
        _vnode=new VNode(undefined,undefined,node.nodeValue,node.nodeType)
    }
    return _vnode;
}

//将虚拟dom转化为真正的dom
function parseNode(vnode) {
    //创建真实的dom
    let type=vnode.type;
    let _node=null
    if (type===3) {
        return document.createTextNode(vnode.value);
    }else {
        _node=document.createElement(vnode.tag);
        //属性
        let data=vnode.data;
        Object.keys(data).forEach(key=>{
            _node.setAttribute(key,data[key]);
        })

        //子元素
        let children=vnode.children;
        children.forEach(subvnode=>{
            _node.appendChild(parseNode(subvnode))//递归子元素
        })
        return _node;
    }
}


//根据路径访问对象成员
function getValueByPath(obj,path) {
    let paths=path.split('.')
    let res=obj;
    let prop;
    while (prop=paths.shift()){
        res=res[prop];
    }
    return res;
}

let rkuohu=/\{\{(.+?)\}\}/g;
//差值表达式替换真正的数据
function combine(vnode,data) {
    let _type=vnode.type;
    let _data=vnode.data;
    let _value=vnode.value;
    let _tag=vnode.tag;
    let _children =vnode.children;

    let _vnode=null;
    if (_type===3) {
        //文本节点
        _value=_value.replace(rkuohu,function (_,g) {
            return getValueByPath(data,g.trim())
        });

        _vnode=new VNode(_tag,_data,_value,_type);
    }else if(_type===1){
        //元素节点
        _vnode=new VNode(_tag,_data,_value,_type)
        _children.forEach(_subvnode=>{
            _subvnode&&_vnode.appendChild(combine(_subvnode,data))
        })
    }
    return _vnode;
}

