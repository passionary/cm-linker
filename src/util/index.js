let ranges

export function makeOutput(array)
{
	let dstruct = []
	ranges = array.sort((a,b) => a.tag[0] - b.tag[0])
	dstruct = recursion(ranges,dstruct)	
	return defineDom(ranges,dstruct)
}
function recursion(rangs,dstruct){
	for(let i=0;i<rangs.length;i++){
		const id = ranges.findIndex(e => e == rangs[i])
		const children = ranges.filter(e => e.tag[0] > rangs[i].tag[0] && e.etag[0] < rangs[i].etag[0])
		if(children.length){
			dstruct[id] = children.map(e => ranges.findIndex(el => el == e)).join(',')
			recursion(children,dstruct)
		}else	dstruct[id] = ''
	}
	return dstruct
}
function defineDom(ranges,array){
	let DOM = []
	for(let i=0;i<array.length;i++){				
		const count = array.filter(e => new RegExp(`\\b${i}\\b`).test(e)).length
		DOM.push([ranges.find((e,index) => index == i),count,[]])
	}
	return DOM
}