import Render from './render'
import { count, name, array, random } from './helpers'
import GlobalApi from './global_api'

window.GlobalApi = GlobalApi

const reactivate = function (render){	
	this.proxy = new Proxy(render.data, {
		get(target, prop){
			return Reflect.get(target, prop)
		},
	  set(target, prop, val) {
	  	target[prop] = val

	  	render.update()
	  	render.loop()

	  	return true
	  }
	})

	render.loop()
}

export class Component
{
	constructor(el,object){
		this.id = count(name.call(this))
		let {cname, data, methods, template} = object
		this.template = template		
		this.methods = methods
		this.data = data		
		this.el = document.querySelector(el)
		reactivate.call(this,new Render(this,template))
	}	
}