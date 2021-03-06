import { proxy } from '../proxy/index'
import { handler } from '../util/handler'

export function reactivate (render){
	for(let key in render.data){
		const val = render.data[key]
		if(Array.isArray(val)){
			render.data[key] = proxy(render.data[key], handler(render))
		}
	}
	const p = proxy(render.data, handler(render))
	return p
}