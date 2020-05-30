import { Component } from './index'

export default class GlobalApi
{
	static register = (el,data) => {		
		let cm = new Component( el, data )
		
		return cm.proxy
	}
}