const Render = require('render').default
const reactivate = require('reactivate').reactivate
const Component = require('index').default

jest.mock('proxy')
const proxy = require('proxy').proxy

describe('proxy cases into reactivate function', () => {
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
	test('reactivate function should convert all arrays in data to proxy',() => {
		obj.data = {
			some:123,
			array:[],
			tests:[]
		}

		const render = new Render(obj)
		reactivate(render)
		
		expect(proxy).toHaveBeenCalled()
		expect(proxy.mock.calls.length).toBe(3)
	})
	test('reactivate function should return a new Proxy',() => {
		obj.data = {
			some:123
		}
		const render = new Render(obj)
		reactivate(render)
		expect(proxy).toHaveBeenCalled()
		expect(proxy.mock.calls.length).toBe(1)
	})
})