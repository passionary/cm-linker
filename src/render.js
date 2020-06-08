import { array, count, name } from './helpers'
import linker from './linker'
import patch from './patch'
import { error } from './error'
import { reactivate } from './proxy'
import { makeOutput } from './util'

function main(nodes,ctx)
{
	return patch(makeOutput(nodes),ctx)
}

export const tags = ['p','a','div','span','select','b','strong','i','em','main','button','option','form','h1','h2','h3','h4','h5','h6','ul','li','section','article','nav','aside']
export const stags = ['input','br','hr']
export const rules = {
		tag: `(?<=[\\s]*\<)(${tags.join('\\b|\\b')})+(?=.*>)`,
		ctag: `(?<=\/)(${tags.join('\\b|\\b')})+`,
		id:'(?<=id=")[^"]+(?=")',
		event: '(?<=@)([\\w]+)="([^"]+)(?=")',
		inner: '(?<=\{\{\)[\\w]+(?=\}\})',
		binding: '(?<=l-bind\:)(name|href|value|type|action|placeholder)(?:=")([^"]+)(?=")',
		lfor: '(?<=l-for=")[^"]+(?=")',
		class: '(?<=class=")[^"]+(?=")',
		lif: '(?<=l-if=")[^"]+(?=")',
		stag:`(?<=[\\s]*\<)(?:${stags.join('|')})(?=.*\\s?\/>)`,
		attr: /(href|name|value|type|action|placeholder)(?:\=\")([^\=\"]+)/,
		innerText: '(?<=\>)[\\w\\s]*.+(?=[\\w\\s]*<)'
	}
export default class Render
{
	nodes = []
	crtag =  ''
	pointer = 0
	constructor(context){
		this.rules = rules
		this.cm = context
		this.template = this.cm.template
		this.data = this.cm.data
		if(!this.template || !this.data) return
		this.opens = array(this.template.matchAll(new RegExp(this.rules.tag,'g')))
		.filter(e => !/(input|hr|br)/.test(e[0])).map(e => {e.open = true; return e})
		this.closes = array(this.template.matchAll(new RegExp(this.rules.ctag,'g')))
		this.stags = array(this.template.matchAll(new RegExp(this.rules.stag,'g')))
		.map(e => {e.stag = true; return e})
		this.entities = this.opens.concat(this.closes,this.stags).sort((a,b) => a.index - b.index)
		this.ecount = this.opens.length + this.stags.length
		this.defineView()
		if(this.nodes.length != this.opens.length + this.stags.length || this.opens.length != this.closes.length) error('invalid html syntaxis')
		const html = main(this.nodes,this.cm)
		this.cm.el.parentNode.replaceChild(html,this.cm.el)
		this.cm.el = html
	}
	update(){
		this.reset()
		this.defineView()
		const html = main(this.nodes,this.cm)
		this.cm.el.parentNode.replaceChild(html,this.cm.el)
		this.cm.el = html
	}
	loop(){
		for(let el of this.cm.el.querySelectorAll('[event]')) {
			const [
				event,
				handler
			] = el.getAttribute('event').split(',')			
			el.addEventListener(event,this.cm.methods[handler].bind(this.cm.proxy,el))
		}		
	}
	reset(){
		this.pointer = 0
		this.crtag = ''
		this.nodes = []
	}
	defineView(){
		linker.call(this)
	}
}