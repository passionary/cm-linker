/**
<-------- old code ---------->
// directives 

const [rvals,cicles,links,conditions] = [
	array(temp.matchAll(this.rules.directive)),
	array(temp.matchAll(this.rules.cicle)),
	array(temp.matchAll(this.rules.link)),
	array(temp.matchAll(this.rules.condition)),
]
const citems = cicles[0][1].split(' ')
const [data,val] = [
	citems[2],
	citems[0]
]
console.log(cicles[1][0].match(/<[^\s]+(?=\sl-for)/))

// regular algorithm

console.log(rvals,cicles,links,conditions)		

for(let i=0;i<rvals.length;i++){
	const val = rvals[i].groups.value
	const rule = new RegExp(`>+(?=\\s*\{\{${val}\\s*\}\})`,'g')
	const buffer = array(temp.matchAll(rule))

	const tag = buffer[0].index
	let j = tag
	while(j--) {
		if(temp[j] === '<') {
			let t = temp.slice(j,tag+1)				
			if(/[\s]/.test(t))
			console.log(t.match(/^<[\w]+(?=\s)/)[0] + t[t.length - 1])
			break
		}
	}
}

<-------- old code ---------->

*/

const counts = {Watcher:0,Dep:0,Vnode:0,Component:0,GlobalApi:0}

class GlobalApi
{
	static components = [
		'menu', 'cart'
	]
}

const Dom = {
	create(tag){
		return document.createElement(tag)
	},
	append(parent,node){
		return parent.appendChild(node)
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

const tParserFns = {
	snode: new RegExp(`<[^>/]+>+`,'g'),
	obsnode: new RegExp('(-if|-for|-bind)')
}
console.log(tParserFns.snode)
const array = elem => {
	return Array.from(elem)
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

function init(){	
	const component = new Component({
		cname:'test',
		data:{
			number:1
		},
		template: 
			`<div l-if="value" -bind="some">
				<p l-for="item in elems">{{number}}</p>
				<span l-for="item in elems">{{some}}</span>
			</div>
			`
		,
		methods:{

		},
		hooks:{

		}
	})
}
class Watcher 
{
	constructor(data,cb){
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
function renderHelpers()
{
	const createElements = () => {

	}
	const updateElements = () => {

	}
	const createChildren = () => {

	}
	const buildView = () => {

	}
	return {
		create: createElements,
		update: updateElements,
		children: createChildren,
		buildView
	}
}

class Vnode
{
	static patterns = {
		creating:[Dom.create,Dom.style],
		appearing:[Dom.create,Dom.style,Dom.remove],
		observing:[Dom.create,Dom.style,Dom.remove,Dom.update,Dom.append]
	}

	constructor(cb,pointer){
		this.id = count(name.call(this))		
		pointer++
		
		return cb()

	}
}

class Render
{
	rules = {
		directive: /\{\{(?<value>[\w]+)\}\}/g,
		cicle: /<[\w]+\sl-for="([^"]+?)"/g,
		link: /l-bind\:(?:value|style)="([^"]+?)"/g,
		condition: /l-if="([^"]+?)"/g
	}
	constructor(name,template,children){
		this.template = Dom.create('template')
		console.log(array(template.matchAll(tParserFns.snode))
			.filter(i => new RegExp(`^<(?!${GlobalApi.components.join('|')})`)
				.test(i[0]))
			.filter(i => tParserFns.obsnode
				.test(i[0])))
		this.view = this.defineView(name,template,children)
	}
	defineView(name,temp,pointer){
		const components = GlobalApi.components || []
		
		let foundedComponents = {}

		for(let i=0;i<components.length;i++){
			const comp = temp.matchAll(new RegExp(`${components[i].name}`,'g'))
			if(comp) foundedComponents[components[i].name] = comp
		}

		const linker = (t) => {
			// if(rvals.length && cicles.length || conditions.length || links.length) {
			// 	const renders = Vnode.patterns.observing
			// }else {
			// 	const renders = Vnode.patterns.creating
			// }			


			if(!this.template[pointer]) return this.template

			new Vnode(linker.bind(null,this.template),pointer)
			
		}

		return new Vnode(linker.bind(null,this.template),pointer)
		
	}
}

class Component
{
	pointer = 0
	constructor(obj){
		this.id = count(name.call(this))
		let {cname,data, methods, children, hooks, template} = obj
		this.name = cname
		this._view = new Render(cname,template,this.pointer).view		
		this._watcher = new Watcher(
			data,
			this.view
		)
	}
}

init()