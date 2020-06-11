import Component from './instance/index'

export default class Linker
{
	static register = (el = null,data = null) => {		
		let cm = new Component( el, data )
		
		return cm.proxy
	}
}
window.Linker = Linker