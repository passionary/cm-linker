import Component from './index'

export default class GlobalApi
{
	static register = (el = null,data = null) => {		
		let cm = new Component( el, data )
		
		return cm.proxy
	}
}