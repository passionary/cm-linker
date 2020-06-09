import { findInner } from './patch'
import { array } from './helpers'

function find (id) {
	let c
	for(let i=id;i<this.template.length;i++){
		c = i
		if(this.template[i] == '>') break
	}
	return c
}

export default function linker (){
	if(this.pointer <= 0) this.crtag = ''
	if(this.nodes.length == this.ecount || this.pointer >= this.entities.length) {
		return
	}
	const entity = this.entities[this.pointer]
	let attrs
	let cls
	let events
	let id
	let bindings	
	let obj = Object.create(null)
	if(entity.stag && !this.nodes.find(e => e.tag[0] === entity.index)){
		const end = find.call(this,entity.index)
		cls = this.template.slice(entity.index,end)
		.match(this.rules.class)
		attrs = array(this.template.slice(entity.index,end)
		.matchAll(new RegExp(this.rules.attr,'g')))
		events = array(this.template.slice(entity.index,end)
			.matchAll(this.rules.event))
		bindings = array(this.template.slice(entity.index,end)
		.matchAll(new RegExp(this.rules.binding,'g')))
		const expr = this.template.slice(entity.index,end)
		.match(new RegExp(this.rules.lfor)) || ['']
		const expr2 = this.template.slice(entity.index,end)
		.match(new RegExp(this.rules.lif)) || ['']
		const forExp = expr[0]
		const [key,data] = [forExp.split(' ')[0],forExp.split(' ')[2]]
		const lif = expr2[0]
		id = this.template.slice(entity.index,end)
		.match(new RegExp(this.rules.id))
		obj = {
			tag:[entity.index,entity[0]],
			etag:[entity.index,entity[0]]
		}
		if(id) obj.id = id[0]
		if(cls) obj.classes = cls[0].split(' ').filter(e => e.length)
		if(bindings.length) obj.bindings = bindings.map(e => ({key:e[1],value:e[2]}))
		if(attrs.length){
			obj.attrs = attrs.map(e => ({key:e[1],value:e[2]}))
		}		
		if(events.length){
			obj.events = events.map(e => ({key:e[1],value:e[2]}))			
		}
		if(lif) obj.idata = lif		
		if(data && key) obj.fdata = [data,this.data[data].length,key]		
		this.nodes.unshift(obj)		
		this.crtag = 'no'
		this.pointer++
		linker.call(this)
	}

	if(entity.open && !this.nodes.find(e => e.tag[0] == entity.index)){
		this.crtag = entity
		this.pointer++
		linker.call(this)
	}else if(this.crtag && !entity.open && this.crtag[0] 
		&& entity[0] && entity[0] == this.crtag[0] 
		&& !this.nodes.find(e => e.etag[0] == entity.index))
	{
		const end = find.call(this,this.crtag.index)
		id = this.template.slice(this.crtag.index,end)
		.match(new RegExp(this.rules.id))
		cls = this.template.slice(this.crtag.index,end)
		.match(this.rules.class)
		attrs = array(this.template.slice(this.crtag.index,end).matchAll(new RegExp(this.rules.attr,'g')))
		events = array(this.template.slice(this.crtag.index,end)
			.matchAll(this.rules.event))
		bindings = array(this.template.slice(this.crtag.index,end)
		.matchAll(new RegExp(this.rules.binding,'g')))
		const expr = this.template.slice(this.crtag.index,end)
		.match(new RegExp(this.rules.lfor)) || ['']
		const expr2 = this.template.slice(this.crtag.index,end)
		.match(new RegExp(this.rules.lif)) || ['']
		const lif = expr2[0]
		const forExp = expr[0]
		const [key,data] = [forExp.split(' ')[0],forExp.split(' ')[2]]	

		obj = {
			tag:[this.crtag.index,this.crtag[0]],
			etag:[entity.index,entity[0]]
		}
		if(id) obj.id = id[0]
		if(bindings.length) obj.bindings = bindings.map(e => ({key:e[1],value:e[2]}))
		if(cls) obj.classes = cls[0].split(' ').filter(e => e.length)
		if(events.length){
			obj.events = events.map(e => ({key:e[1],value:e[2]}))
		}
		if(attrs.length) {
			obj.attrs = attrs.map(e => ({key:e[1],value:e[2]}))
		}
		if(findInner.call(this,this.crtag.index,entity.index,true))
			obj.inner = findInner.call(this,this.crtag.index,entity.index,true)
		if(findInner.call(this,this.crtag.index,entity.index))
			obj.text = findInner.call(this,this.crtag.index,entity.index)[0].trim()
		if(lif) obj.idata = lif
		if(data && key) obj.fdata = [data,this.data[data].length,key]
		this.nodes.unshift(obj)
		this.crtag = 'no'
		this.pointer++
		linker.call(this)
	}else if(this.crtag == 'no'){
		this.pointer--
		linker.call(this)
	}
	this.pointer++
	linker.call(this)
}