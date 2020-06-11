import { proxy } from 'proxy/index'

jest.isolateModules(() => {
	describe('simple proxy jobs', () => {
		test('basic instance',() => {
			expect(proxy({},{})).toBeInstanceOf(Object)
		})
		test('comparing proxy with object (negative && positive)', () => {
			const obj = {
				data: "",
				number: 111
			}
			let h = {
				get(){}
			}

			expect(proxy(obj,h)).not.toEqual(obj)

			h = {
				set(target, prop, val){
					return Reflect.set(target, prop, val)
				}
			}

			expect(proxy(obj, h)).toEqual(obj)
		})	
		test('comparing proxy with object', () => {
			const obj = {
				data: "",
				number: 111
			}
			const handler = {
				get(target, prop){
					return Reflect.get(target, prop)
				},
				set(target, prop, val){
					return Reflect.set(target, prop, val)
				}
			}
			expect(proxy(obj, handler)).toEqual(obj)
		})
	})
})

jest.isolateModules(() => {
	const Component = require('instance/index').default
	const Render = require('render/index').default
	const handler = require('util/handler').handler

	document.body.innerHTML = '<div><div id="primary"><button event="click,some"></button></div></div>'	

	describe('project cases with proxy',() => {
		test('proxy with handler from project', () => {
			const render = new Render({
				el:document.querySelector('#primary'),
				data:{
					some: 123,
					array: []
				},
				template: `
					<p>
					</p>
				`
			})
			const p = proxy(render.data,handler(render))
			expect(p).toBeInstanceOf(Object)
			expect(p).toEqual(render.data)
			jest.spyOn(render,'update')
			jest.spyOn(render,'loop')
			p.some = ''
			p.array = 123
			expect(render.update).toHaveBeenCalled()
			expect(render.loop).toHaveBeenCalled()
			expect(render.loop.mock.calls.length).toBe(2)
			expect(render.loop.mock.calls.length).toBe(2)
		})		
	})	
})

jest.isolateModules(() => {
	const Component = require('instance/index').default
	describe('some', () => {
		let obj
		beforeEach(() => {
			document.body.innerHTML = '<div><div id="primary"><button event="click,some"></button></div></div>'
			obj = {
				data: {
					some: 123,
				},
				template: `
					<p>
					</p>
				`
			}			
		})
		test('proxies with component instance', () => {						
			const cm = new Component('#primary',obj)
			const render = cm.render
			jest.spyOn(render,'update')
			jest.spyOn(render,'loop')
			cm.proxy.some = ''
			expect(render.update).toHaveBeenCalled()
			expect(render.loop).toHaveBeenCalled()
			expect(render.update.mock.calls.length).toBe(1)
			expect(render.loop.mock.calls.length).toBe(1)			
			render.update.mockClear()
			render.loop.mockClear()
			cm.proxy.array = []
			expect(render.update.mock.calls.length).toBe(1)
			expect(render.loop.mock.calls.length).toBe(1)
		})
		test('proxies with component instance(with nested proxies)', () => {
			obj.data = {
				some: 123, 
				array: [],
				tests: [],
				news: []
			}
			const cm = new Component('#primary',obj)
			const render = cm.render
			jest.spyOn(render,'update')
			jest.spyOn(render,'loop')
			cm.proxy.array.push("")
			expect(render.update).toHaveBeenCalled()
			expect(render.loop).toHaveBeenCalled()
			expect(render.update.mock.calls.length).toBe(2)
			expect(render.loop.mock.calls.length).toBe(2)
		})
	})	
})

jest.isolateModules(() => {
	jest.resetModules()
	const Component = require('instance/index').default
	jest.mock('proxy/index')
	const proxy = require('proxy/index').proxy
	let obj
	beforeEach(() => {
		proxy.mock.calls = []
		document.body.innerHTML = '<div><div id="primary"><button event="click,some"></button></div></div>'	
		obj = {
			template:
			`<div>
				some
			</div>`,
			el:document.querySelector('#primary'),
			data:{}
		}
	})
	describe('proxy cases with combination ', () => {		
		test('reactivate function should convert all arrays in data to proxy',() => {
			delete obj.el
			obj.data = {
				some: 123,
				array: [],
				tests: []
			}
			new Component('#primary',obj)
			
			expect(proxy).toHaveBeenCalled()
			expect(proxy.mock.calls.length).toBe(3)
		})
		test('one call with no arrays',() => {
			delete obj.el
			obj.data = {
				some:123,				
			}
			new Component('#primary',obj)
			
			expect(proxy).toHaveBeenCalled()
			expect(proxy.mock.calls.length).toBe(1)
		})
	})
})
