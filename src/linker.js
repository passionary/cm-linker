import { findInner } from './patch'
import { array } from './helpers'

export default function linker (){
	if(this.current == this.nexts[0] && this.crtag == 'no') this.crtag = ''
	if(typeof this.current == 'undefined' || this.current > this.template.length || this.nodes.length == this.ecount) {
		return
	}
	let str = this.template.slice(this.current,this.nexts[this.pointer])
	if(!/[^\s]+/.test(str) && this.crtag == 'no'){
		this.back()
		linker.call(this)
	}else if(!/[^\s]+/.test(str) && this.crtag != 'no'){
		this.next()
		linker.call(this)
	}
	let tag = !/(<input|br|hr)/.test(str) ? str.match(new RegExp(this.rules.tag))	: undefined	
	let ctag = str.match(new RegExp(this.rules.ctag))
	let stag = str.match(new RegExp(this.rules.stag))	
	let attrs	
	let obj = Object.create(null)	
	if(stag && !this.nodes.find(i => i.tag[0] == this.pointer)){			
		const expr = this.template.slice(this.nexts[this.pointer-1],this.nexts[this.pointer])
		.match(new RegExp(this.rules.lfor)) || ['']
		const expr2 = this.template.slice(this.nexts[this.pointer-1],this.nexts[this.pointer])
		.match(new RegExp(this.rules.lif)) || ['']
		attrs = array(this.template.slice(this.nexts[this.pointer-1],this.nexts[this.pointer])
		.matchAll(new RegExp(this.rules.attr,'g')))
		const forExp = expr[0]
		const [key,data] = [forExp.split(' ')[0],forExp.split(' ')[2]]
		const lif = expr2[0]
		obj = {
			tag:[this.pointer,stag],
			etag:[this.pointer,stag]
		}
		if(attrs){			
			obj.attrs = attrs.map(e => ({key:e[1],value:e[2]}))
		}
		if(lif) obj.idata = lif		
		if(data && key) obj.fdata = [data,this.data[data].length,key]		
		this.nodes.unshift(obj)		
		this.crtag = 'no'
		this.next()
		linker.call(this)
	}
	if(tag && tag[0] && !this.nodes.find(i => i.tag[0] == this.pointer)){
		this.crtag = {id:this.pointer,tag}
		this.next()
		linker.call(this)
	}else if(ctag && this.crtag && this.crtag.tag 
		&& ctag[0] && this.crtag.tag[0] 
		&& this.crtag.tag[0] == ctag[0] && !this.nodes.find(i => i.etag[0] == this.pointer))
	{
		attrs = array(this.template.slice(this.nexts[this.crtag.id-1],this.nexts[this.crtag.id]).matchAll(new RegExp(this.rules.attr,'g')))		
		const expr = this.template.slice(this.nexts[this.crtag.id-1],this.nexts[this.crtag.id])
		.match(new RegExp(this.rules.lfor)) || ['']
		const expr2 = this.template.slice(this.nexts[this.crtag.id-1],this.nexts[this.crtag.id])
		.match(new RegExp(this.rules.lif)) || ['']
		const lif = expr2[0]
		const forExp = expr[0]
		const [key,data] = [forExp.split(' ')[0],forExp.split(' ')[2]]
		obj = {
			tag:[this.crtag.id,this.crtag.tag],
			etag:[this.pointer,ctag]
		}
		if(attrs.length) {
			obj.attrs = attrs.map(e => ({key:e[1],value:e[2]}))			
		}
		if(findInner.call(this,this.template,this.crtag.id,this.pointer-1,true)) 
			obj.inner = findInner.call(this,this.template,this.crtag.id,this.pointer-1,true)
		if(findInner.call(this,this.template,this.crtag.id,this.pointer-1))
			obj.text = findInner.call(this,this.template,this.crtag.id,this.pointer-1)[0].trim()
		if(lif) obj.idata = lif
		if(data && key) obj.fdata = [data,this.data[data].length,key]
		this.nodes.unshift(obj)
		this.crtag = 'no'
		this.next()
		linker.call(this)
	}else if(this.crtag == 'no'){
		this.back()
		linker.call(this)
	}
	this.next()
	linker.call(this)
}