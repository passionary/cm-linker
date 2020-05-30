import { array, count, name } from './helpers'
import Vnode from './vnode'
import linker from './linker'
import patch from './patch'
import { makeOutput } from './util'

function main(nodes,data)
{
	return patch(makeOutput(nodes),data)
}

export default class Render
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
	constructor(context){		
		this.cm = context
		this.template = this.cm.template
		this.data = this.cm.data
		this.nexts = array(this.template.matchAll(/\n/g)).map(i => i.index + 1)		
		this.opens = array(this.template.matchAll(new RegExp(this.rules.tag,'g')))
		this.closes = array(this.template.matchAll(new RegExp(this.rules.ctag,'g')))
		this.defineView()
		const html = main(this.nodes,this.data)
		this.cm._view = html		
		this.cm.el.innerHTML = ''
		console.log(this.cm.el.append(html))
	}
	update(){
		this.reset()
		this.defineView()
		const html = main(this.nodes,this.data)
		this.cm._view = html
		this.cm.el.innerHTML = ''
		this.cm.el.append(html)
		return html
	}
	reset(){
		this.pointer = 0
		this.current = 0
		this.crtag = ''
		this.nodes = []
	}
	defineView(){
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