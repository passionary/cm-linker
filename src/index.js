import dom from './helpers'
import patch from './patch'
import Render from './render'
import { findInner } from './patch'
import { makeOutput } from './util'
import { linker } from './linker'
import counts from './counts'
import Vnode from './vnode'
import { count, name, array } from './helpers'

class GlobalApi
{
	static components = [
		'menu', 'cart'
	]
}

const reactivate = function (render){			
	return new Proxy(render.data, {
		get(target, prop){
			return Reflect.get(target, prop)
		},
	  set(target, prop, val) {
	  	target[prop] = val
	  	console.log(render.update())
	  	return true
	  }
	})
}

class Component
{
	constructor(obj){
		let self = this
		this.id = count(name.call(this))
		let {cname,data, methods, children, hooks, template} = obj
		this.template = template
		this.data = data
		this.name = cname		
		const render = new Render(this,template)
		this.proxy = reactivate(render)
	}
}

window.component = new Component({
	cname:'test',
	data:{
		data: 'object-data-1',
		data2:'some-data-2',
		data3:'anything-3',
		tests:['test1','test2','test3!'],
		news:['news1','news2','news3'],
		other:['other1','other2']
	},
	template:
		`
		<ul l-for="new in news" l-if="data2">
			<li>
				<select name="" id="">
					<p l-for="some in other" l-if="data2">
						<option value="">
						qwerty
						</option>
						<p l-if="data3">
						{{data3}}
						</p>
						<span l-if="data">
							something else.
						</span>
					</p>
				</select>
			</li>
		</ul>
		`
})