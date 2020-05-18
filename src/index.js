const counts = {Watcher:0,Dep:0,Vnode:0,Component:0,GlobalApi:0}

const Dom = {
	create(tag){
		document.createElement(tag)
	},
	append(parent,node){
		parent.appendChild(node)
	},
	remove(parent,child){
		parent.removeChild(child)
	},
	update(node,val){
		node.innerHTML = val
	},
	style(node){
		const styles = Array.from(arguments).slice(1)
		const rule = /([^:\s]{3,}):+\s?(\w+)/
		for(let i=0;i<styles.length;i++){			
			const s = styles[i].match(rule)[1]
			const v = styles[i].match(rule)[2]
			if(rule.test(styles[i])) node.style[s] = v			
		}
		return node
	}
}

const name = function (){
	return this['__proto__'].constructor.name
}

const count = function(context){
	counts[context]++
	return counts[context]
}

const reactivate = function (){
	const proxy = new Proxy(data, {
		get(target, prop){
			Reflect.get(target, prop)
		},
	  set(target, prop, val) {		  	
	    return Reflect.set(target, prop, val)
	  }
	})
}

class Vnode
{
	constructor(){
		this.id = count(name.call(this))
	}
}

class Watcher 
{
	constructor(){
		this.id = count(name.call(this))
		this.deps = []
	}	
	update(){
		for(let i=0;i<this.deps.length;i++){
			let dep = this.deps[i]

			dep.notify()
		}
	}
}

class Dep
{
	constructor(obj){
		this.id = count(name.call(this))
		this.vnodes = []
	}
	locate(vnode){
		this.vnodes.push(vnode)
	}
	notify(){
		for(let i=0;i<this.vnodes.length;i++){
			const vnode = this.vnodes[i]

			Dom.update(vnode,this.value || '')
		}
	}
}

class Component
{
	constructor(obj){
		this.id = count(name.call(this))
		let {cname,data, methods, hooks, template} = obj
		this.name = cname
		new Watcher(data,this.render)
	}
	render(){

	}
}

class GlobalApi
{
	static methods = {
		
	}
}

function init(){	
	const component = new Component({
		data:{

		},
		methods:{

		},
		hooks:{

		}
	})
}

init()