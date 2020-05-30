import { Component } from './index'

export default class GlobalApi
{
	static register = (el,data) => {
		const cm = new Component( data )
		return cm.proxy
	}
}