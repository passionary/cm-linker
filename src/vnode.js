import counts from './counts'
import { name, count } from './helpers'

export default class Vnode {	
	constructor(cb,pointer){
		this.id = count(name.call(this))		
		
		cb()
	}
}