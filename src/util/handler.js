import { proxy } from '../proxy/index'

export function handler (render) {
	return {
		get(target, prop){
			return Reflect.get(target, prop)
		},
	  set(target, prop, val) {
			target[prop] = val

			if(Array.isArray(val)){
				target[prop] = proxy(target[prop], handler(render))
			}
	  	render.update()
	  	render.loop()

	  	return true	  	
	  }
	}
}