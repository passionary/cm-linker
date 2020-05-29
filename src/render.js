import helpers from './helpers'

export function render(array,object)
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
					if(!ch[0].idata || ch[0].idata && object[ch[0].idata]){
						pr[0].node.appendChild(el)
					}
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