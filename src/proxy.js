export function proxy(target, options){
	return new Proxy(target, options)
}