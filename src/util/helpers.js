import counts from '../util/counts'

export default {
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
export function random(){
	let rstr = ''
	let str = Date.now().toString()
	for(let i=0;i<str.length;i++){			
		rstr += str.charAt(Math.floor(Math.random() * str.length))
	}
	return rstr
}
export function array(elem){
	return Array.from(elem)
}

export function name(){
	return this['__proto__'].constructor.name
}

export function count(context){
	counts[context]++
	return counts[context]
}