#  cm-Linker

# Description
cm-Linker is a library for creating web-applications with reactive components.

This lib you can use for DOM-elements and make their reactive.

# Installation

Bundle of library is by path "dist/bundle.js".

# Examples

*Also you can find examples in the folder "examples"*

Two parameters must be passed to the class method "register"

First parameter is a selector. Second is a object that may contain objects for data, template and methods.

*l-if directive:*
let some = Linker.register('#app', {
	template:`
		<div l-if="bool"></div>
	`,
	data:{
		bool: false
	}		
})

*l-for directive:*
let test = Linker.register('#app', {
	template:
	`
		<div l-for="test in tests">{{test}}</div>
	`,
	data:{
		tests: [1,2,3]
	}		
})

*l-bind directive:*
let data = Linker.register('.app', {
	template:
	`
	<input type="text" l-bind:value="data">
	`,
	data:{
		data: 'data',
	}
})

*methods initialisation and event binding*

let data = Linker.register('.app', {
	template:
	`
	<button type="text" @click="handler">
	`,
	data:{
		data: 'data',
	},
	methods: {
		handler(e) {
			this.data = 'new data'
		}
	}
})

## Author

(C) 2020 Aldiyar Amanbaev.

