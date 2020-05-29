import dom from './helpers'
import {render} from './render'
import {makeOutput,recursion,defineDom} from './util'

const counts = {Watcher:0,Dep:0,Vnode:0,Component:0,GlobalApi:0}

class GlobalApi
{
	static components = [
		'menu', 'cart'
	]
}

const tParserFns = {
	snode: new RegExp(`<[^>/]+>+`,'g'),
	obsnode: new RegExp('(-if|-for|-bind)')
}
// console.log(tParserFns.snode)
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
			data: 'object-data-1',
			data2:'some-data-2',
			data3:'anything-3',
			tests:['test1','test2','test3!'],
			news:['news1','news2','news3'],
			other:['other1','other2']
		},
		template:
			`
			<div l-for="test in tests" l-if="data">
				<ul l-for="n in tests">
					<select name="" id="" l-for="new in news">
						<option value="" l-for="o in other">
							<p l-if="data">
								{{new}}
							</p>
							<span l-if="data2">
								{{test}}
							</span>
							<p l-if="data3">
								{{n}}
							</p>
						</option>
					</select>
				</ul>
			</div>			
			<p l-if="data">
			{{data}}
			</p>
			<p l-if="data2">
			{{data2}}
			</p>
			<p l-if="data3">
				{{data3}}
			</p>										
			<ul l-for="new in news" l-if="data2">
				<li>
					<select name="" id="">
						<p l-for="some in other" l-if="data2">
							<option value="">
							qwerty
							</option>
							<p l-if="data3">
							{{data3}}
							</p>
							<span l-if="data">
								something else.
							</span>
						</p>
					</select>
				</li>
			</ul>			
			`			
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

			dom.update(vnode,this.value || '')
		}
	}
}
function findInner(str,b,e,dir = false){								
	let txt
	for(let i=b;i<e;i++){
		if(str.slice(this.nexts[i],this.nexts[i+1]).match(new RegExp(this.rules.tag) 
		|| str.slice(this.nexts[i],this.nexts[i+1]).match(new RegExp(this.rules.cTag)))) 
		break
		txt = dir ? 
			str.slice(this.nexts[i],this.nexts[i+1]).match(new RegExp(this.rules.inner))
		:!str.slice(this.nexts[i],this.nexts[i+1]).match(new RegExp(this.rules.inner)) 
		&&str.slice(this.nexts[i],this.nexts[i+1]).match(new RegExp(this.rules.innerText))
		if(txt) break										
	}
	return txt
}
class Vnode
{
	static patterns = {
		creating:[dom.create,dom.style],
		appearing:[dom.create,dom.style,dom.remove],
		observing:[dom.create,dom.style,dom.remove,dom.update,dom.append]
	}

	constructor(cb,pointer){
		this.id = count(name.call(this))		
		
		return cb()

	}
}

class Render
{
	rules = {
		tag: '(?<=[\\s]*)(?<=\<)[\\w]+',
		ctag: '(?<=\/)[\\w]+',
		inner: '(?<=\{\{\)[\\w]+(?=\}\})',
		lfor: '(?<=for=")[^"]+(?=")',
		lif: '(?<=if=")[^"]+(?=")',
		innerText: '.+'
	}
	nodes = []
	current = 0
	crtag =  ''
	pointer = 0	
	constructor(component,name,template,children){		
		this.template = template
		this.component = component
		this.nexts = array(template.matchAll(/\n/g)).map(i => i.index + 1)		
		this.opens = array(template.matchAll(new RegExp(this.rules.tag,'g')))
		this.closes = array(template.matchAll(new RegExp(this.rules.ctag,'g')))
		this.defineView(name,template,children)		
		this.view = render(makeOutput(this.nodes),component.data)
		console.log(this.view)
	}
	defineView(pointer){
		const linker = () => {
			if(typeof this.current == 'undefined' || this.current > this.template.length || this.nodes.length == this.opens.length) {				
				return 
			}
			let str = this.template.slice(this.current,this.nexts[this.pointer])
			let tag = str.match(new RegExp(this.rules.tag))
			let ctag = str.match(new RegExp(this.rules.ctag))
			if(tag && tag[0] && !this.nodes.find(i => i.tag[0] == this.pointer)){
				this.crtag = {id:this.pointer,tag}
				this.next()
				linker.call(this)
			}else if(ctag && this.crtag && this.crtag.tag 
				&& ctag[0] && this.crtag.tag[0] 
				&& this.crtag.tag[0] == ctag[0] && !this.nodes.find(i => i.etag[0] == this.pointer))
			{
				const expr = this.template.slice(this.nexts[this.crtag.id-1],this.nexts[this.crtag.id])
				.match(new RegExp(this.rules.lfor)) || ['']
				const expr2 = this.template.slice(this.nexts[this.crtag.id-1],this.nexts[this.crtag.id])
				.match(new RegExp(this.rules.lif)) || ['']
				const lif = expr2[0]
				const forExp = expr[0]
				const [key,data] = [forExp.split(' ')[0],forExp.split(' ')[2]]
				let obj = {
					tag:[this.crtag.id,this.crtag.tag],
					etag:[this.pointer,ctag]
				}
				if(findInner.call(this,this.template,this.crtag.id,this.pointer-1,true)) 
					obj.inner = findInner.call(this,this.template,this.crtag.id,this.pointer-1,true)
				if(findInner.call(this,this.template,this.crtag.id,this.pointer-1))
					obj.text = findInner.call(this,this.template,this.crtag.id,this.pointer-1)[0].trim()
				if(lif) obj.idata = lif				
				if(data && key) obj.fdata = [data,this.component.data[data].length,key]

				this.nodes.unshift(obj)
				this.crtag = 'no'
				this.next()
				linker.call(this)
			}else if(this.crtag == 'no'){
				this.back()
				linker.call(this)
			}
			this.next()
			new Vnode(linker.bind(this))
		}

		return new Vnode(linker.bind(this))
		
	}
	next(){
		this.current = this.nexts[this.pointer++]		
	}
	back(){
		this.current = this.nexts[this.pointer - 2]
		this.pointer--
	}
}

class Component
{
	pointer = 0
	constructor(obj){
		this.id = count(name.call(this))
		let {cname,data, methods, children, hooks, template} = obj
		this.data = data
		this.name = cname
		this._view = new Render(this,cname,template,this.pointer).view		
		this._watcher = new Watcher(
			data,
			this.view
		)
	}
}

init()