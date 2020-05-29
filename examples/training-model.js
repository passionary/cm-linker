/* global variables */
const helpers = {
	create(tag){
		return document.createElement(tag)
	},
	append(parent,node){
		return parent.appendChild(node)
	},
	remove(parent,child){
		parent.removeChild(child)
	},
	update(node,val){
		node.innerHTML = val
	},
	style(node){
		const styles = Array.from(arguments).slice(1)
		const rule = /([^:\s]{3,}):+\s?(\w+)/
		for(let i=0;i<styles.length;i++){			
			const s = styles[i].match(rule)[1]
			const v = styles[i].match(rule)[2]
			if(rule.test(styles[i])) node.style[s] = v			
		}
		return node
	}
}
let html = document.createElement('div')
let dom = []
let ranges
let template = `
	<div l-for="test in tests" l-if="data">
		<ul l-for="n in tests">
			<select name="" id="" l-for="new in news">
				<option value="" l-for="o in other">
					<p l-if="data">
						{{new}}
					</p>
					<span l-if="data2">
						{{test}}
					</span>
					<p l-if="data3">
						{{n}}
					</p>
				</option>
			</select>
		</ul>
	</div>
	<p l-if="data">
	{{data}}
	</p>
	<p l-if="data2">
	{{data2}}
	</p>
	<p l-if="data3">
		{{data3}}
	</p>			
	<ul l-for="new in news" l-if="data2">
		<li>
			<select name="" id="">
				<p l-for="some in other" l-if="data2">
					<option value="">
					qwerty
					</option>
					<p l-if="data3">
					</p>
					<span l-if="data">
						something else.
					</span>
				</p>
			</select>
		</li>
	</ul>
	<video l-if="data3">
	</video>
	`
let object = {
	data: 'asd',
	data2:'123',
	data3:'123',
	tests:['test1','test2','test3!'],
	news:['news1','news2','news3'],
	other:['other1','other2']
}
const proxy = new Proxy(object, {
	get(target, prop){
		return target[prop]
	},
	set(target, prop, val, receiver) {    		
		target[prop] = val 		
		html = main()
		return true
	}	
})
proxy.tests = ['test1','test2','test3!']
console.log(html)
function defineNodes(temp)
{
	let rules = {
		tag: '(?<=[\\s]*)(?<=\<)[\\w]+',
		cTag: '(?<=\/)[\\w]+',
		inner: '(?<=\{\{\)[\\w]+(?=\}\})',
		lfor: '(?<=for=")[^"]+(?=")',
		lif: '(?<=if=")[^"]+(?=")',
		innerText: '.+'
	}
	let nexts = Array.from(temp.matchAll(/\n/g)).map(i => i.index + 1)
	let pointer = 0
	let current = 0
	let iter = 0

	function next(){
		current = nexts[pointer++]
	}
	let sopens = Array.from(temp.matchAll(new RegExp(rules.tag,'g')))
	let scloses = Array.from(temp.matchAll(new RegExp(rules.cTag,'g')))
	if(sopens.length != scloses.length) throw Error('invalid html in template')
	let nodes = []
	let crtag = ''
	function back(){
		current = nexts[pointer - 2]
		pointer--
	}
	function findInner(str,b,e,dir = false){								
		let txt
		for(let i=b;i<e;i++){
			if(temp.slice(nexts[i],nexts[i+1]).match(new RegExp(rules.tag) || temp.slice(nexts[i],nexts[i+1]).match(new RegExp(rules.cTag)))) 
			break
			txt = dir ? 
				temp.slice(nexts[i],nexts[i+1]).match(new RegExp(rules.inner))
			:!temp.slice(nexts[i],nexts[i+1]).match(new RegExp(rules.inner)) 
			&&temp.slice(nexts[i],nexts[i+1]).match(new RegExp(rules.innerText))
			if(txt) break										
		}
		return txt
	}
	let inner
	let text
	while(current < temp.length && nodes.length != sopens.length){
		iter++
		let str = temp.slice(current,nexts[pointer])
		let tag = str.match(new RegExp(rules.tag))
		let cTag = str.match(new RegExp(rules.cTag))				
		if(tag && tag[0] && !nodes.find(i => i.tag[0] == pointer)){
			crtag = {id:pointer,tag}
			next()
			continue
		}else	if(cTag && crtag && crtag.tag && cTag[0] && crtag.tag[0] && crtag.tag[0] == cTag[0] && !nodes.find(i => i.etag[0] == pointer)){
			const expr = temp.slice(nexts[crtag.id-1],nexts[crtag.id]).match(new RegExp(rules.lfor)) || ['']
			const expr2 = temp.slice(nexts[crtag.id-1],nexts[crtag.id]).match(new RegExp(rules.lif)) || ['']
			const lif = expr2[0]
			const forExp = expr[0]
			const [key,data] = [forExp.split(' ')[0],forExp.split(' ')[2]]
			let obj = {
				tag:[crtag.id,crtag.tag],
				etag:[pointer,cTag],
			}					
			if(inner = findInner(temp,crtag.id,pointer-1,true)) {
				obj.inner = inner
			}
			if (text = findInner(temp,crtag.id,pointer-1)) {
				obj.text = text[0].trim()
			}
			if(lif) obj.idata = lif
			if(data && key) obj.fdata = [data,object[data].length,key]
			nodes.unshift(obj)					
			crtag = 'no'					
			next()
			continue
		}else if(crtag === 'no'){
			back()
			continue
		}
		next()
	}
	console.log(iter)
	return nodes
}

function render(array)
{
	let html = helpers.create('div')
	let i = 0
	let buf
	let down = false
	let buffer = []
	while(array.length){
		const id = array.findIndex((i,ind,arr) => arr[ind+1] && arr[ind+1][1] - i[1] < 0 || arr[ind+1] && arr[ind+1][1] == 0 && arr[ind][1] == 0)
		if(id < 0) {
			buffer.push(array.sort((a,b) => b[1]-a[1]))
			break
		}				
		buffer.push(array.slice(0,id+1).sort((a,b) => b[1] - a[1]))
		array.splice(0,id+1)
	}
	buffer = buffer.sort((a,b) => b[b.length - 1][1] - a[a.length - 1][1])
	console.log(buffer)
	for(let buf of buffer){
		let i = 0
		while(true){
			const ch = buf[i]
			const pr = buf.find(e => ch[1] - e[1] == 1 && ch[0].tag[0] > e[0].tag[0] && ch[0].etag[0] < e[0].etag[0])
			let el = ch[0].node || helpers.create(ch[0].tag[1][0])
			if(ch[0].inner || ch[0].text){
				if(ch[0].inner) el.setAttribute(`data-${ch[0].inner[0]}`,'')
				el.innerHTML = ch[0].inner ? object[ch[0].inner && ch[0].inner[0]] || '' : ch[0].text || ''
			}					
			ch[0].node = el
			if(pr)
			pr[0].node = pr[0].node || helpers.create(pr[0].tag[1][0])
			if(!pr && buf.length > 1) {
				const parent = buffer.find(e => ch[1] - e[e.length - 1][1] == 1 && ch[0].tag[0] > e[e.length - 1][0].tag[0] && ch[0].etag[0] < e[e.length - 1][0].etag[0])
				if(ch[2].length) {
					ch[2].forEach(e => {
						if(Array.isArray(e)){
							e.forEach(n => {
								if(!ch[0].idata || ch[0].idata && object[ch[0].idata])
								ch[0].node.append(n)
							})
						}else {
							if(!ch[0].idata || ch[0].idata && object[ch[0].idata])
							ch[0].node.append(e)
						}
					})
				}
				if(ch[0].fdata && ch[1] == 0){
					buf.nodes = []
					for(let i=0;i<ch[0].fdata[1];i++){
						const el = ch[0].node.cloneNode(true)								
						let child = el.querySelectorAll(`[data-${ch[0].fdata[2]}`)
						child = child.length ? child : el.hasAttribute(`data-${ch[0].fdata[2]}`) && el
						if(child.length || child) {
							if(child.length){
								for(let j=0;j<child.length; j++){
									child[j].innerHTML = object[ch[0].fdata[0]][i] || ''
								}								
							}else{
								child.innerHTML = object[ch[0].fdata[0]][i] || ''
							}
						}
						if(!ch[0].idata || ch[0].idata && object[ch[0].idata])
						buf.nodes.push(el)
					}
				}
				if(parent) {
					buf.parent = parent[parent.length - 1]
					buf.parent[0].node = buf.parent[0].node || helpers.create(buf.parent[0].tag[1][0])
					let a = []
					if(ch[0].fdata){
						for(let i=0;i<ch[0].fdata[1];i++){
							const el = ch[0].node.cloneNode(true)
							let child = el.querySelector(`[data-${ch[0].fdata[2]}`)
							if(child)	child.innerHTML = object[ch[0].fdata[0]][i] || ''
							if(!ch[0].idata || ch[0].idata && object[ch[0].idata])
							a.push(el)
						}
						if(!ch[0].idata || ch[0].idata && object[ch[0].idata])
						buf.parent[2].push(a)
					}else {
						if(!ch[0].idata || ch[0].idata && object[ch[0].idata])
						buf.parent[2].push(ch[0].node)
					}
				}
				break
			}else if(buf.length <= 1){						
				if(ch[0].fdata && ch[1] == 0){
					buf.nodes = []
					for(let i=0;i<ch[0].fdata[1];i++){
						const el = ch[0].node ? ch[0].node.cloneNode(true) : helpers.create(ch[0].tag[1][0])
						let child = el.querySelectorAll(`[data-${ch[0].fdata[2]}`)
						child = child.length ? child : el.hasAttribute(`data-${ch[0].fdata[2]}`) && el
						if(child.length || child) {
							if(child.length){
								for(let j=0;j<child.length; j++){
									child[j].innerHTML = object[ch[0].fdata[0]][i] || ''
								}								
							}else{
								child.innerHTML = object[ch[0].fdata[0]][i] || ''
							}
						}								
						if(!ch[0].idata || ch[0].idata && object[ch[0].idata])
						buf.nodes.push(el)
					}
				}
			 	break
			}					
			if(ch[0].fdata){
				for(let i=0;i<ch[0].fdata[1];i++){
					const el = ch[0].node.cloneNode(true)
					let child = el.querySelectorAll(`[data-${ch[0].fdata[2]}`)
					child = child.length ? child : el.hasAttribute(`data-${ch[0].fdata[2]}`) && el							
					if(child.length || child) {
						if(child.length){
							for(let j=0;j<child.length; j++){
								child[j].innerHTML = object[ch[0].fdata[0]][i] || ''
							}								
						}else{
							child.innerHTML = object[ch[0].fdata[0]][i] || ''
						}
					}
					if(!ch[0].idata || ch[0].idata && object[ch[0].idata])
					pr[0].node.appendChild(el)
				}
			}else {
				if(!ch[0].idata || ch[0].idata && object[ch[0].idata]){
					pr[0].node.appendChild(ch[0].node)
				}
			}
			i++
		}
	}
	buffer.filter(e => e[e.length - 1][1] == 0).forEach(el => {
		if(el.nodes){
			el.nodes.forEach(node => html.append(node))
		}else if(!el[el.length - 1][0].idata || el[el.length - 1][0].idata && object[el[el.length - 1][0].idata]) {
			html.appendChild(el[el.length - 1][0].node)
		}
	})
	return html
}
function makeOutput(array)
{			
	ranges = array.sort((a,b) => a.tag[0] - b.tag[0])
	recursion(ranges)			
	return defineDom(ranges,dom)
}
function recursion(rangs){
	for(let i=0;i<rangs.length;i++){
		const id = ranges.findIndex(e => e == rangs[i])
		const children = ranges.filter(e => e.tag[0] > rangs[i].tag[0] && e.etag[0] < rangs[i].etag[0])
		if(children.length){
			dom[id] = children.map(e => ranges.findIndex(el => el == e)).join(',')
			recursion(children)
		}else	dom[id] = ''
	}
}
function defineDom(ranges,array){
	let DOM = []
	for(let i=0;i<array.length;i++){				
		const count = array.filter(e => new RegExp(`\\b${i}\\b`).test(e)).length
		DOM.push([ranges.find((e,index) => index == i),count,[]])
	}
	return DOM
}
function main()
{
	return render(makeOutput(defineNodes(template)))
}		