import Component from 'index'

jest.mock('warn')
jest.mock('error')

import { warn } from 'warn'
import { error } from 'error'

describe('basic successfully cases of component instance creating ', () => {
	beforeEach(() => {
		warn.mock.calls = []
		error.mock.calls = []
		document.body.innerHTML = '<div><div id="primary"></div></div><button>some</button>'
	})

	test('simple instance #1', () => {
		new Component()
		expect(error).toHaveBeenCalled()
		expect(error).toHaveBeenCalledWith('no required parametr or required parametrs')
	})

	test('simple instance #2',() => {		
		new Component('#some',{})
		expect(error).toHaveBeenCalled()
		expect(error).toHaveBeenCalledWith('invalid selector string or no such node')
		expect(error.mock.calls.length).toBe(1)
	})
	test('simple instance #3',() => {
		const object = {
			template: `
				<div>
					<p>
						new
					</p>
				</div>
			`
		}
		new Component('#any',object)
		expect(error).toHaveBeenCalled()
		expect(error.mock.calls.length).toBe(1)
	})
	test('simple instance #4',() => {
		const object = {
			template: `
				<div>
					<p>
						new
					</p>
				</div>
			`
		}
		new Component('#primary',object)
		expect(error).not.toHaveBeenCalled()
		expect(warn).toHaveBeenCalled()
		expect(warn).toHaveBeenCalledWith('instance should contain a data value')
		expect(warn.mock.calls.length).toBe(1)
	})
	test('simple instance #5',() => {
		const object = {
			template: `
				<div>
					<p>
						{{new}}
					</p>
				</div>
			`,
			data:{
				new: 123
			}
		}
		new Component('#primary',object)
		expect(error).not.toHaveBeenCalled()
		expect(warn).not.toHaveBeenCalled()
	})
})