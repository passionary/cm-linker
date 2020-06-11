import linker from 'linker/index'
import { tags, stags, rules } from 'render/index'

describe('linker function testing', () => {
	let obj
	beforeEach(() => {
		obj = {
			get rules(){
				return rules
			},
			template : '',
			crtag:'',
			pointer:0,
			nodes:[],
			get stags() {
				return Array.from(this.template.matchAll(new RegExp(rules.stag,'g')))
				.map(e => {e.stag = true; return e})
			},
			get opens(){
				return Array.from(this.template.matchAll(new RegExp(rules.tag,'g')))
				.filter(e => !/(input|hr|br)/.test(e[0])).map(e => {e.open = true; return e})
			},
			get closes(){
				return Array.from(this.template.matchAll(new RegExp(rules.ctag,'g')))
			},
			get entities(){
				return this.opens.concat(this.closes,this.stags).sort((a,b) => a.index - b.index)
			},			
		}
	})
	test('linker case №1',() => {
		obj.template = `
			<div>
				<p>new</p>
				<p>test</p>
			</div>
			<ul><li></li></ul>
			<main>
				hello!!!
			</main>
			<div>
				<select name="" id=""><option value=""></option></select>
				<div><ul><li><p></p></li></ul></div>
			</div>
			`
		linker.call(obj)
		expect(obj.entities.length).toBe(26)
		expect(obj.nodes.length).toBe(13)
	})
	test('linker case №2',() => {
		obj.template = `
			<div><main><p><p><p></p></p></p></main></div><section><li><ul><option value=""></option><option value=""></option><option value=""></option></ul></li></section><h1></h1><h2></h2><h3></h3><option value=""><h4></h4><h6></h6><h5></h5></option>
			`
		linker.call(obj)
		expect(obj.entities.length).toBe(36)
		expect(obj.nodes.length).toBe(18)
	})
	test('linker case №3',() => {
		obj.data = {
			data3: 'test'
		}
		obj.template = `
			<div><input type="text" /><p><select><option>{{data3}}</option></select><ul><li><p><span><div></div></span></p></li></ul></p></div><div><main><select name="" id=""><option value=""><ul><li><p><em>{{data}}</em></p><p><b>something...</b></p></li></ul></option></select></main></div><aside><nav><section><select name="" id=""><option value=""><ul><span><p>{{some}}</p></span><li><p>{{n}}</p></li><nav><ul><li><p>{{data}}</p><p>{{other}}</p></li></ul></nav><p><div>hello!</div></p></ul></option></select></section></nav></aside>
			`
		linker.call(obj)
		expect(obj.entities.length).toBe(73)
		expect(obj.nodes.length).toBe(37)
	})
})
