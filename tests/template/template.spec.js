import Render from 'render'
import Component from 'index'

jest.mock('error')

import { error } from 'error'


describe('check valid of template string', () => {
	beforeEach(() => {
		error.mockClear()
		document.body.innerHTML = '<div id="main"><div id="primary"></div></div>'
	})
	test('no equal length of open and closed tag', () => {
		new Render({
			el:document.querySelector('#primary'),
			data: {
				some: 123
			},
			template: `
				<div>				
			`
		})
		expect(error).toHaveBeenCalled()
		expect(error.mock.calls.length).toBe(1)
	})
	test('no valid single tag input', () => {
		new Render({
			el:document.querySelector('#primary'),
			data: {
				some: 123
			},
			template: `
				<div>
				<input type="text">
				</input>
			`
		})
		expect(error).toHaveBeenCalled()
		expect(error.mock.calls.length).toBe(1)
	}) 
})

describe('check a job of directives', () => {
	beforeEach(() => {
		error.mockClear()
		document.body.innerHTML = '<div id="main"><div id="primary"></div></div>'
	})
	test('l-for directive', () => {
		new Render({
			el:document.querySelector('#primary'),
			data: {
				tests:[1,2,3]
			},
			template: `
				<div l-for="test in tests">
					text
				</div>
			`
		})
		expect(error).not.toHaveBeenCalled()
		expect(document.querySelector('#main').children[0].children.length).toBe(3)
	})
	test('l-if directive', () => {
		const cm = new Component('#primary',{
			data: {
				flag: false
			},
			template: `
				<div l-if="flag">
					text
				</div>
			`
		})
		expect(error).not.toHaveBeenCalled()
		expect(document.querySelector('#main').children[0].children.length).toBe(0)
		cm.proxy.flag = true
		expect(document.querySelector('#main').children[0].children.length).toBe(1)
	})
	test('case with binding classes, attributes, ids, l-bind directive', () => {
		const cm = new Component('#primary', {
			data: {
				value: 'testing value'
			},
			template: `
				<input class="some" id="query" type="submit" l-bind:value="value"/>
				<div class="some" id="query" type="submit" l-bind:value="value">
					test
				</div>
			`
		})
		const el = document.querySelector('#main')
			.children[0].children[0]
		const el2 = document.querySelector('#main')
			.children[0].children[1]
		expect(error).not.toHaveBeenCalled()
		expect(el.value === cm.proxy.value)
		.toBe(true)
		expect(el.getAttribute('type')).toBeDefined()
		expect(el.classList.contains('some')).toBe(true)
		expect(el.id == "query").toBe(true)
		expect(el2.value).not.toBeDefined()
		expect(el2.getAttribute('type')).toBeDefined()
		expect(el2.classList.contains('some')).toBe(true)
		expect(el2.id == "query").toBe(true)
	})
	test('event and event directive case', () => {
		const cm = new Component('#primary',{
			data: {
				value: 'value'
			},
			methods:{
				some(){
					this.value = 'new !!!'
				}
			},
			template: `
				<button @click="some">
					{{value}}
				</button>
			`
		})
		const el = document.querySelector('#main')
			.children[0].children[0]
		expect(error).not.toHaveBeenCalled()
		expect(el.innerHTML === cm.proxy.value)
		.toBe(true)
		expect(typeof el.click === "function").toBe(true)
		el.click()
		expect(cm.proxy.value === 'new !!!').toBe(true)
	})
	test('simple inner by node', () => {
		const cm = new Component('#primary',{
			data: {
				value: 'test'
			},
			template: `
				<div>
					value
				</div>
			`
		})
		expect(error).not.toHaveBeenCalled()
		const el = document.querySelector('#main')
			.children[0].children[0]
		expect(el.innerHTML === 'value').toBe(true)
	})
	test('simple inner of react object by node', () => {
		const cm = new Component('#primary',{
			data: {
				value: 'test'
			},
			template: `
				<div>
					{{value}}
				</div>
			`
		})
		const el = document.querySelector('#main')
			.children[0].children[0]
		expect(el.innerHTML === cm.proxy.value).toBe(true)
	})
})