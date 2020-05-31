import { array, count, name } from './helpers'
import linker from './linker'
import patch from './patch'
import { makeOutput } from './util'

function main(nodes,ctx)
{
	return patch(makeOutput(nodes),ctx)
}

export default class Render
{
	rules = {
		tag: '(?<=[\\s]*)(?<=\<)[\\w]+(?=.*>)',
		ctag: '(?<=\/)[\\w]+',
		event: '(?<=@)([\\w]+)="([^"]+)(?=")',
		inner: '(?<=\{\{\)[\\w]+(?=\}\})',
		lfor: '(?<=for=")[^"]+(?=")',
		lif: '(?<=if=")[^"]+(?=")',
		stag:'(?<=[\\s]*\<)(?:input|hr|br)(?=.*\\s?\/>)',
		attr: '(href|name|value|type|action|placeholder)\=\"([^\=\"]+)',
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
		this.nexts.unshift(0)
		this.opens = array(this.template.matchAll(new RegExp(this.rules.tag,'g')))
		.filter(e => !/(input|hr|br)/.test(e[0]))		
		this.closes = array(this.template.matchAll(new RegExp(this.rules.ctag,'g')))
		this.stags = array(this.template.matchAll(new RegExp(this.rules.stag,'g')))		
		this.ecount = this.opens.length + this.stags.length
		this.defineView()
		const html = main(this.nodes,this.cm)
		this.cm._view = html
		this.cm.el.innerHTML = ''		
		this.cm.el.append(html)
	}
	update(){
		this.reset()
		this.defineView()
		const html = main(this.nodes,this.cm)
		this.cm._view = html
		this.cm.el.innerHTML = ''		
		this.cm.el.append(html)
		return html
	}
	loop(){		
		for(const el of this.cm._view.querySelectorAll('[event')) {
			const [
				event,
				handler
			] = el.getAttribute('event').split(',')		

			el.addEventListener(event,this.cm.methods[handler].bind(this.cm.proxy))			
		}
	}
	reset(){
		this.pointer = 0
		this.current = 0
		this.crtag = ''
		this.nodes = []
	}
	defineView(){
		linker.call(this)
	}
	next(){
		this.current = this.nexts[this.pointer++]
	}
	back(){
		this.current = this.nexts[this.pointer - 2]
		this.pointer--
	}
}