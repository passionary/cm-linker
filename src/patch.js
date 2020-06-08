import helpers, { array } from './helpers'

const clearNodes = (p,nodes) => {
	array(nodes).forEach(e => p.removeChild(e))
}

export default function patch(array,object)
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
	const merge = buffer.reduce((p,e) => p.concat(e),[])
	for(let buf of buffer){
		let i = 0
		while(true){
			const ch = buf[i]
			if(!ch) break
			let pro
			let pr = buf[i+1] && buf[i+1][0].tag[0] < ch[0].tag[0] && buf[i+1][0].etag[0] > ch[0].etag[0] ? buf[i+1] : buf.find(e => ch[1] - e[1] == 1 && ch[0].tag[0] > e[0].tag[0] && ch[0].etag[0] < e[0].etag[0])
			if(!pr && i == buf.length - 1) {
				for(let index = 0; index < buffer.length;index++){
					const e = buffer[index]
					pro = e.find(el => ch[1] - el[1] == 1 && ch[0].tag[0] > el[0].tag[0] && ch[0].etag[0] < el[0].etag[0])
					if(pro) break
				}
			}
			if(pro) pr = pro
			let el = ch[0].node || helpers.create(ch[0].tag[1])
			if(ch[0].inner || ch[0].text){
				if(ch[0].inner) el.setAttribute(`data-${ch[0].inner[0]}`,'')
				el.innerHTML = ch[0].inner ? object.data[ch[0].inner && ch[0].inner[0]] : ch[0].text || ''
			}
			if(ch[0].id) el.id = ch[0].id
			if(ch[0].attrs) ch[0].attrs.forEach(e => el.setAttribute(e.key,e.value))
			if(ch[0].events) ch[0].events.forEach(e => el.setAttribute('event',`${e.key},${e.value}`))			
			if(ch[0].classes) ch[0].classes.forEach(e => el.classList.add(e))
			if(ch[0].bindings) ch[0].bindings.forEach(e => el.setAttribute(e.key,object.data[e.value]))
			ch[0].node = el
			if(pr)
			pr[0].node = pr[0].node || helpers.create(pr[0].tag[1])
			if(!pr) {
				const parent = buffer.find(e => ch[1] - e[e.length - 1][1] == 1 && ch[0].tag[0] > e[e.length - 1][0].tag[0] && ch[0].etag[0] < e[e.length - 1][0].etag[0])
				if(ch[2].length) {
					ch[2].forEach(e => {
						if(Array.isArray(e)){
							e.forEach(n => {
								if(!ch[0].idata || ch[0].idata && object.data[ch[0].idata])
								ch[0].node.append(n)
							})
						}else {
							if(!ch[0].idata || ch[0].idata && object.data[ch[0].idata])
							ch[0].node.append(e)
						}
					})
				}
				if(ch[0].fdata && ch[1] == 0){
					buf.nodes = []
					for(let i=0;i<ch[0].fdata[1];i++){
						const el = ch[0].node.cloneNode(true)								
						let child = el.querySelectorAll(`[data-${ch[0].fdata[2]}]`)
						child = child.length ? child : el.hasAttribute(`data-${ch[0].fdata[2]}`) && el
						if(child.length || child) {
							if(child.length){
								for(let j=0;j<child.length; j++){
									child[j].innerHTML = object.data[ch[0].fdata[0]][i]
								}								
							}else{
								child.innerHTML = object.data[ch[0].fdata[0]][i]
							}
						}
						if(!ch[0].idata || ch[0].idata && object.data[ch[0].idata])
						buf.nodes.push(el)
					}
				}
				if(parent) {
					buf.parent = parent[parent.length - 1]
					buf.parent[0].node = buf.parent[0].node || helpers.create(buf.parent[0].tag[1])
					let a = []
					if(ch[0].fdata){
						for(let i=0;i<ch[0].fdata[1];i++){
							const el = ch[0].node.cloneNode(true)
							let child = el.querySelector(`[data-${ch[0].fdata[2]}]`)
							if(child)	child.innerHTML = object.data[ch[0].fdata[0]][i]
							if(!ch[0].idata || ch[0].idata && object.data[ch[0].idata])
							a.push(el)
						}
						if(!ch[0].idata || ch[0].idata && object.data[ch[0].idata])
						buf.parent[2].push(a)
					}else {
						if(!ch[0].idata || ch[0].idata && object.data[ch[0].idata])
						buf.parent[2].push(ch[0].node)
					}
				}
				break
			}
			if(!pr) break
			// if(ch[0].fdata){
			// 	// const children = merge.filter(e => e[1] - pr[1] == 1 
			// 	// 	&& pr[0].tag[0] < e[0].tag[0] 
			// 	// 	&& pr[0].etag[0] > e[0].etag[0] && e[0].tag[0] < ch[0].tag[0])

			// 	if(!ch[0].idata || ch[0].idata && object.data[ch[0].idata]){
			// 		const children = merge.filter(e => e[1] - pr[1] == 1 
			// 			&& pr[0].tag[0] < e[0].tag[0] 
			// 			&& pr[0].etag[0] > e[0].etag[0])
			// 		const nchildren = children.filter(e => e[0].node).sort((a,b) => a[0].tag[0] - b[0].tag[0])
			// 		if(children.length == nchildren.length && children.length > 1) {
			// 			clearNodes(pr[0].node,pr[0].node.children)
			// 			nchildren.forEach(el => {
			// 				if(el[0].fdata)	{
			// 					for(let idx = 0;idx < el[0].fdata[1];idx++){
			// 						const node = el[0].node.cloneNode(true)
			// 						let child = node.querySelectorAll(`[data-${el[0].fdata[2]}]`)
			// 						child = child.length ? child : node.hasAttribute(`data-${el[0].fdata[2]}`) && node
			// 						if(child.length || child) {
			// 							if(child.length){
			// 								for(let j=0;j<child.length; j++){								
			// 									child[j].innerHTML = object.data[ch[0].fdata[0]][idx]
			// 								}								
			// 							}else{
			// 								child.innerHTML = object.data[ch[0].fdata[0]][idx]
			// 							}
			// 						}
			// 					}
			// 				}else{
			// 					pr[0].node.appendChild(el[0].node)
			// 				}
			// 			})
			// 		}else pr[0].node.appendChild(el)
			// 		// if(!children.length && pr[0].node.children.length && reversed) {
			// 		// 	pr[0].node.insertBefore(el,pr[0].node.children[0])
			// 		// }else pr[0].node.appendChild(el)
			// 	}


			// 	// for(let i=0;i<ch[0].fdata[1];i++){
			// 	// 	const el = ch[0].node.cloneNode(true)
			// 	// 	let child = el.querySelectorAll(`[data-${ch[0].fdata[2]}]`)
			// 	// 	child = child.length ? child : el.hasAttribute(`data-${ch[0].fdata[2]}`) && el							
			// 	// 	if(child.length || child) {
			// 	// 		if(child.length){
			// 	// 			for(let j=0;j<child.length; j++){								
			// 	// 				child[j].innerHTML = obj[i]
			// 	// 			}								
			// 	// 		}else{
			// 	// 			child.innerHTML = obj[i]
			// 	// 		}
			// 	// 	}					
			// 	// }				
			// }else {				
				if(!ch[0].idata || ch[0].idata && object.data[ch[0].idata]){
					const children = merge.filter(e => e[1] - pr[1] == 1 
						&& pr[0].tag[0] < e[0].tag[0]
						&& pr[0].etag[0] > e[0].etag[0])
					const nchildren = children.filter(e => e[0].node).sort((a,b) => a[0].tag[0] - b[0].tag[0])
					if(children.length == nchildren.length && children.length > 1) {
						if(children.length == 4) console.log(children)
						clearNodes(pr[0].node,pr[0].node.children)
						nchildren.forEach(el => {
							if(el[0].fdata)	{
								for(let idx = 0;idx < el[0].fdata[1];idx++){
									const node = el[0].node.cloneNode(true)
									let child = node.querySelectorAll(`[data-${el[0].fdata[2]}]`)
									child = child.length ? child : node.hasAttribute(`data-${el[0].fdata[2]}`) && node
									if(child.length || child) {
										if(child.length){
											for(let j=0;j<child.length; j++){								
												child[j].innerHTML = object.data[el[0].fdata[0]][idx]
											}								
										}else{
											child.innerHTML = object.data[el[0].fdata[0]][idx]
										}
									}
									pr[0].node.appendChild(node)
								}
							}else{
								pr[0].node.appendChild(el[0].node)
							}
						})
					}else if(ch[0].fdata){
						for(let i=0;i<ch[0].fdata[1];i++){
							const el = ch[0].node.cloneNode(true)
							let child = el.querySelectorAll(`[data-${ch[0].fdata[2]}]`)
							child = child.length ? child : el.hasAttribute(`data-${ch[0].fdata[2]}`) && el							
							if(child.length || child) {
								if(child.length){
									for(let j=0;j<child.length; j++){								
										child[j].innerHTML = object.data[ch[0].fdata[0]][i]
									}								
								}else{
									child.innerHTML = object.data[ch[0].fdata[0]][i]
								}
							}
							pr[0].node.appendChild(el)
						}
					}else{
						pr[0].node.appendChild(ch[0].node)
					}
				}
			// }
			i++
		}
	}
	buffer.filter(e => e[e.length - 1][1] == 0).forEach(el => {
		if(el.nodes){
			el.nodes.forEach(node => html.append(node))
		}else if(!el[el.length - 1][0].idata || el[el.length - 1][0].idata && object.data[el[el.length - 1][0].idata]) {
			html.appendChild(el[el.length - 1][0].node)
		}
	})
	return html
}

export function findInner(b,e,dir = false){
	let txt
	if(this.template.slice(b,e).match(new RegExp(this.rules.tag)) || this.template.slice(b,e).match(new RegExp(this.rules.stag))) return false
	txt = dir ? 
		this.template.slice(b,e).match(new RegExp(this.rules.inner))
	:!this.template.slice(b,e).match(new RegExp(this.rules.inner))
	&&this.template.slice(b,e).match(new RegExp(this.rules.innerText))
	return txt
}