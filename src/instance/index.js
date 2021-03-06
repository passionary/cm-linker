import Render from '../render/index'
import { count, name, array } from '../util/helpers'
import { reactivate } from '../reactiv/index'
import { warn } from '../util/warn'
import { error } from '../util/error'

export default class Component
{
	constructor(el,object){
		if(!el || !object) {
			error('no required parametr or required parametrs')
			return
		}
		this.id = count(name.call(this))
		let { data, methods, template } = object		
		this.template = template
		this.data = data
		this.methods = methods
		if(!el || !document.querySelector(el)) {
			error('invalid selector string or no such node')
			return
		}
		if(!template) {
			warn('instance should contain a template value')
			return
		}
		if(!data) {
			warn('instance should contain a data value')
			return
		}
		this.el = document.querySelector(el)
		this.render = new Render(this)
		this.proxy = reactivate(this.render)
		this.render.loop()
	}
}