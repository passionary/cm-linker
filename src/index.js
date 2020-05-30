import dom from './helpers'
import patch from './patch'
import Render from './render'
import { findInner } from './patch'
import { makeOutput } from './util'
import { linker } from './linker'
import counts from './counts'
import Vnode from './vnode'
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
	  	console.log(render.update())
	  	return true
	  }
	})
}

export class Component
{
	constructor(obj){		
		this.id = count(name.call(this))
		let {cname, data, methods, children, hooks, template} = obj
		this.template = template
		this.data = data
		this.proxy = reactivate(new Render(this,template))
	}
}