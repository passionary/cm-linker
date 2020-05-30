import { Component } from './index'

export default class GlobalApi
{
	static register = (el,data) => {
		const cm = new Component( el, data )

		return {
			proxy:cm.proxy,
			output: cm._view
		}
	}
}