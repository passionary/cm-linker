import Render from './render'
import { count, name, array } from './helpers'
import GlobalApi from './global_api'

window.GlobalApi = GlobalApi

const reactivate = function (render){
	return new Proxy(render.data, {
		get(target, prop){
			return Reflect.get(target, prop)
		},
	  set(target, prop, val) {
	  	target[prop] = val
	  	render.update()
	  	return true
	  }
	})
}

export class Component
{
	constructor(el,object){
		this.id = count(name.call(this))
		let {cname, data, methods, children, hooks, template} = object
		this.template = template
		this.data = data		
		this.el = document.querySelector(el)
		this.proxy = reactivate(new Render(this,template))		
	}
}