import patch from 'patch'
import linker from 'linker'
import { makeOutput } from 'util.js'
import { tags, stags, rules } from 'render'

describe('elementary case testing', () => {
	let obj
	beforeEach(() => {
		obj = {
			data: {
				data: false,
				data2:true,
				links:'qwertyqwerty',
				data3:'anything-3',
				tests:['test1','test2','test3!'],
				news:['news1','news2','news3'],
				other:['other1','other2']
			},
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
	test('#1', () => {
		obj.template = `
		<p>text</p>
		`
		linker.call(obj)
		const html = patch(makeOutput(obj.nodes),obj)
		expect(html.innerHTML).toBe('<p>text</p>')
	})
	test('#2', () => {
		obj.template = `
		<p l-for="test in tests">text</p>
		`
		linker.call(obj)
		const html = patch(makeOutput(obj.nodes),obj)
		expect(html.innerHTML).toBe('<p>text</p><p>text</p><p>text</p>')
	})
	test('#3', () => {
		obj.template = `
		<p l-for="test in tests">{{test}}</p>
		`
		linker.call(obj)
		const html = patch(makeOutput(obj.nodes),obj)
		expect(html.innerHTML).toBe('<p data-test="">test1</p><p data-test="">test2</p><p data-test="">test3!</p>')
	})
	test('#4', () => {
		obj.template = `
			<div><p><span>1</span></p><h1>2</h1></div>
		`
		linker.call(obj)
		const html = patch(makeOutput(obj.nodes),obj)
		expect(html.innerHTML).toBe('<div><p><span>1</span></p><h1>2</h1></div>')
	})
	test('#5', () => {
		obj.template = `
			<div><h1>2</h1><p><span>1</span></p></div>
		`
		linker.call(obj)
		const html = patch(makeOutput(obj.nodes),obj)
		expect(html.innerHTML).toBe('<div><h1>2</h1><p><span>1</span></p></div>')
	})
	test('#6', () => {
		obj.template = `
			<div><h1>2</h1><p l-for="t in tests"><span>1</span></p></div>		
		`
		linker.call(obj)
		const html = patch(makeOutput(obj.nodes),obj)
		expect(html.innerHTML).toBe('<div><h1>2</h1><p><span>1</span></p><p><span>1</span></p><p><span>1</span></p></div>')
	})
	test('#7', () => {
		obj.template = `
			<div><p l-for="t in tests"><span>1</span></p><h1>2</h1></div>
		`
		linker.call(obj)
		const html = patch(makeOutput(obj.nodes),obj)
		expect(html.innerHTML).toBe('<div><p><span>1</span></p><p><span>1</span></p><p><span>1</span></p><h1>2</h1></div>')
	})
	test('#8', () => {
		obj.template = `
			<main><div><p></p></div><p></p></main><div></div><div><p></p></div>
		`
		linker.call(obj)
		const html = patch(makeOutput(obj.nodes),obj)
		expect(html.innerHTML).toBe('<main><div><p></p></div><p></p></main><div></div><div><p></p></div>')
	})
	test('#9', () => {
		obj.template = `
			<main><div><p></p></div><p></p></main><div l-for="t in tests">{{t}}</div><div><p></p></div>
		`
		linker.call(obj)
		const html = patch(makeOutput(obj.nodes),obj)
		expect(html.innerHTML).toBe('<main><div><p></p></div><p></p></main><div data-t="">test1</div><div data-t="">test2</div><div data-t="">test3!</div><div><p></p></div>')
	})
	test('#9', () => {
		obj.template = `
			<main><div><p></p></div><p l-for="n in news">{{n}}</p></main><div l-for="t in tests">test</div><div><p></p></div>
		`
		linker.call(obj)
		const html = patch(makeOutput(obj.nodes),obj)
		expect(html.innerHTML).toBe('<main><div><p></p></div><p data-n="">news1</p><p data-n="">news2</p><p data-n="">news3</p></main><div>test</div><div>test</div><div>test</div><div><p></p></div>')
	})
	test('#10', () => {
		obj.template = `
			<main><div l-for="o in other"><p>{{o}}</p></div><p l-for="n in news">{{n}}</p></main><div l-for="t in tests">test</div><div><p l-for="n in news">{{n}}</p></div>
		`
		linker.call(obj)
		const html = patch(makeOutput(obj.nodes),obj)
		expect(html.innerHTML).toBe('<main><div><p data-o="">other1</p></div><div><p data-o="">other2</p></div><p data-n="">news1</p><p data-n="">news2</p><p data-n="">news3</p></main><div>test</div><div>test</div><div>test</div><div><p data-n="">news1</p><p data-n="">news2</p><p data-n="">news3</p></div>')
	})	
	test('#11', () => {
		obj.template = `
			<main><div l-for="o in other"><p>{{o}}</p></div><p l-for="n in news">{{n}}</p></main><div l-for="t in tests">test</div><div l-for="new in news"><p l-for="n in news">{{n}}</p><p>{{new}}</p></div>
		`
		linker.call(obj)
		const html = patch(makeOutput(obj.nodes),obj)
		expect(html.innerHTML).toBe('<main><div><p data-o="">other1</p></div><div><p data-o="">other2</p></div><p data-n="">news1</p><p data-n="">news2</p><p data-n="">news3</p></main><div>test</div><div>test</div><div>test</div><div><p data-n="">news1</p><p data-n="">news2</p><p data-n="">news3</p><p data-new="">news1</p></div><div><p data-n="">news1</p><p data-n="">news2</p><p data-n="">news3</p><p data-new="">news2</p></div><div><p data-n="">news1</p><p data-n="">news2</p><p data-n="">news3</p><p data-new="">news3</p></div>')
	})
	test('#12', () => {
		obj.template = `
			<div l-for="new in news"><p l-for="n in news">{{n}}</p><p>{{new}}</p></div>
		`
		linker.call(obj)
		const html = patch(makeOutput(obj.nodes),obj)
		expect(html.innerHTML).toBe('<div><p data-n="">news1</p><p data-n="">news2</p><p data-n="">news3</p><p data-new="">news1</p></div><div><p data-n="">news1</p><p data-n="">news2</p><p data-n="">news3</p><p data-new="">news2</p></div><div><p data-n="">news1</p><p data-n="">news2</p><p data-n="">news3</p><p data-new="">news3</p></div>')
	})
})

describe('testing a patch cases', () => {
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
	test('patch case №1', () => {
		obj.data = {
			data: false,
			data2:true,
			links:'qwertyqwerty',
			data3:'anything-3',
			tests:['test1','test2','test3!'],
			news:['news1','news2','news3'],
			other:['other1','other2']
		}
		obj.template = `
			<div id="sw-content" class="container" l-for="t in tests">
    <section id="header-section">
        <div class="video-container hero-video-container" style="z-index: 2;">
            <video autoplay="" muted="" loop="" id="myVideo" style="z-index: -1;">
                <source/>
            </video>
        </div>
        <div class="video-overlay-section col-sm-12 text-left container-fluid">
            <div class="header-text col-sm-8 col-md-offset-1">
                <div class="text home-header-base-text ">
                    <h1 style="font-size: 32px;">Snapwire lets you quickly generate high-quality photos that are<br>
                        <span class="word theme-yellow transition-state-end">from anywhere.</span>
                        <span class="word theme-yellow transition-state-begin">cost-effective.</span>
                        <span class="word theme-yellow transition-state-begin">on-brand.</span>
                    </h1>
                </div>
                <h4 style="padding-top:40px" class="photo-header-h2 normal margin-bottom-big top-text-2 ">
                    <br/>This is the future of custom content creation.
                </h4>
            </div>
        </div>
    </section>
    <section id="press-section" class="intro-section  header-new-pluses">
    <div id="section-press" style="background-color: black;">
        <div class="container">
            <div class="row">
                <div class="home__logo-header">Trusted By</div>
                <div class="col-md-12 text-center home__logo-content">
                    <a href="/press" class="press-logo kimpton" l-for="link in links">{{link}}</a>
                </div>
            </div>
        </div>
    </div>
    </section>
    <section id="custom-visuals" class="intro-section header-new-pluses">
        <div class="photo-header margin-none ">
            <div class="header-content header-overlay-both custom-visuals-block__slideshow-container">
                <div id="custom-visuals-block__slides" class="custom-visuals-block__slides" l-for="test in tests">
                    <div id="tell-a-story-video" style="height: 100%; width: 100%;z-index: 2;" class="unselected-slide">
                        <div class="video-container">                            
                            <h1>{{test}}</h1>
                            <p>{{t}}</p>                            
                        </div>
                    </div>
                    <div id="tell-a-story-library" class="unselected-slide">
                        <img class="fill-container" src="https://images.snapwi.re/assets/img/homepage/stories.jpg">
                    </div>
                    <div id="tell-a-story-location" class="selected-slide" style="z-index: 2;">
                        <img class="fill-container" src="https://images.snapwi.re/assets/img/homepage/location.jpg" style="z-index: -1;">
                    </div>
                    <div id="tell-a-story-product" class="unselected-slide">
                        <img class="fill-container" src="https://images.snapwi.re/assets/img/homepage/product.jpg">
                    </div>
                </div>
                <div class="container-fluid">
                    <div class="header-message header-message-left" style="z-index: 10;position: relative;">
                        <div id="custom-visuals-block" class="responsive-margin">
                            <h2 style="margin-left: 0;">Custom visuals so good they <span class="theme-yellow">speak for themselves</span></h2>
                            <h4 class="padding-top-10 " style="margin-left: 0;font-size: 18px;font-weight: bold;"><span class="custom-visuals-block__slide-menu" id="custom-visuals-block__slide-0">Tell a story through video</span></h4>
                            <h4 class="padding-top-10 " style="margin-left: 0;font-size: 18px;font-weight: bold;"><span class="custom-visuals-block__slide-menu" id="custom-visuals-block__slide-1">Build a library of stories</span></h4>
                            <h4 class="padding-top-10 " style="margin-left: 0;font-size: 18px;font-weight: bold;"><span class="custom-visuals-block__slide-menu selected-menu" id="custom-visuals-block__slide-2">Tell a story about a location</span></h4>
                            <h4 class="padding-top-10 " style="margin-left: 0;font-size: 18px;font-weight: bold;"><span class="custom-visuals-block__slide-menu" id="custom-visuals-block__slide-3">Tell a story about a product</span></h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section id="section-launch-high-volume" class=" header-new-pluses">
        <div class="photo-header margin-none" style="background-image: url('https://images.snapwi.re/assets/img/homepage/launch.png'); background-size: cover; background-position: center 20%;">
            <div class="header-content header-overlay-both">
                <div class="container-fluid">
                    <div class="header-message header-message-right transition-state-begin">
                        <div class="padding-top-10">
                            <h2 style="margin-right: 0;">Launch a <span class="theme-yellow"> high-volume <br> production </span> from the comfort <br> of your laptop</h2>
                        </div>
                        <div class="padding-top-10">
                            <h4 style="margin-right: 0;font-weight: bold;">Snap a single product or all 10,000 SKUs. <br> Snapwire is built for agility, enterprise scale, and<br> global reach.</h4>
                        </div>
                        <div class="padding-top-10">
                            <h4 style="margin-right: 0;font-weight: bold;">Lightning fast</h4>
                            <h4 style="margin-right: 0;font-weight: bold;">Cost-efficient</h4>
                            <h4 style="margin-right: 0;font-weight: bold;">High volume</h4>
                        </div>
                        <div class="padding-top-10">
                            <a class="btn btn-success btn-lg" href="/howitworks">See How It Works</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section id="home-new-first-under-screen" class="intro-section section-white header-new-pluses">
        <div class="container">
            <div class="new-home-section-content">
                <div class="row">
                    <h2 style="font-weight: bold;">Think of Snapwire as a <span class="sw-blue"> visual asset pipeline  <br> </span> for every situation</h2>
                </div>
                <div class="row">
                    <div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin">
                        <div class="header-new-pluses-elem-glob sw-green">
                        <i class="fas fa-2x fa-temperature-high"></i>
                        </div>
                        <h4 class="bold margin-bottom home-header-text">High-volume production</h4>
                        <p class="normal home-body-text">Get tens of thousands of photos in weeks</p>
                    </div>
                    <div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin">
                        <div class="header-new-pluses-elem-glob sw-green">
                            <i class="fa fa-2x fa-map-marker-alt"></i>
                        </div>
                        <h4 class="bold margin-bottom home-header-text">Localized visuals</h4>
                        <p class="normal home-body-text">Capture neighborhoods, cities, buildings, or people.</p>
                    </div>
                    <div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin">
                        <div class="header-new-pluses-elem-glob sw-green">
                            <i class="fa fa-2x fa-rocket"></i>
                        </div>
                        <h4 class="bold margin-bottom home-header-text">Product launch</h4>
                        <p class="normal home-body-text">Support a launch with product and lifestyle shots</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin">
                        <div class="header-new-pluses-elem-glob sw-green">
                            <i class="fa fa-2x fa-book"></i>
                        </div>
                        <h4 class="bold margin-bottom home-header-text">Content library</h4>
                        <p class="normal home-body-text">Build a wholly-owned repository of on-brand images</p>
                    </div>
                    <div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin">
                        <div class="header-new-pluses-elem-glob sw-green">
                            <i class="fa fa-2x fa-bullhorn"></i>
                        </div>
                        <h4 class="bold margin-bottom home-header-text">Marketing campaigns</h4>
                        <p class="normal home-body-text">Launch a campaign with photos that support your objectives</p>
                    </div>
                    <div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin">
                        <div class="header-new-pluses-elem-glob sw-green">
                            <i class="fa fa-2x fa-thumbs-up"></i>
                        </div>
                        <h4 class="bold margin-bottom home-header-text">Social media</h4>
                        <p class="normal home-body-text">Increase engagement with authentic lifestyle shots</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin">
                        <div class="header-new-pluses-elem-glob sw-green">
                            <i class="fa fa-2x fa-mobile-alt"></i>
                        </div>
                        <h4 class="bold margin-bottom home-header-text ">App overhaul</h4>
                        <p class="normal home-body-text">Refresh your app with high-quality visuals that sell</p>
                    </div>
                    <div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin">
                        <div class="header-new-pluses-elem-glob sw-green">
                            <i class="fab fa-2x fa-hotjar"></i>
                        </div>
                        <h4 class="bold margin-bottom home-header-text">Rebrand</h4>
                        <p class="normal home-body-text">Celebrate your new brand with brand new visuals</p>
                    </div>
                    <div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin">
                        <div class="header-new-pluses-elem-glob sw-green">
                            <i class="fa fa-2x fa-funnel-dollar"></i>
                        </div>
                        <h4 class="bold margin-bottom home-header-text">Ecommerce</h4>
                        <p class="normal home-body-text">Scale high-quality photos while protecting your margins</p>
                    </div>
                </div>
            </div>
        </div>
    </section>       
</div>
		`
		linker.call(obj)
		const html = patch(makeOutput(obj.nodes),obj)
		expect(html.innerHTML).toBe(`<div id="sw-content" class="container"><section id="header-section"><div class="video-container hero-video-container"><video id="myVideo"><source></video></div><div class="video-overlay-section col-sm-12 text-left container-fluid"><div class="header-text col-sm-8 col-md-offset-1"><div class="text home-header-base-text"><h1><span class="word theme-yellow transition-state-end">from anywhere.</span><span class="word theme-yellow transition-state-begin">cost-effective.</span><span class="word theme-yellow transition-state-begin">on-brand.</span></h1></div><h4 class="photo-header-h2 normal margin-bottom-big top-text-2"><br>This is the future of custom content creation.</h4></div></div></section><section id="press-section" class="intro-section header-new-pluses"><div id="section-press"><div class="container"><div class="row"><div class="home__logo-header">Trusted By</div><div class="col-md-12 text-center home__logo-content"><a data-link="" href="/press" class="press-logo kimpton">q</a><a data-link="" href="/press" class="press-logo kimpton">w</a><a data-link="" href="/press" class="press-logo kimpton">e</a><a data-link="" href="/press" class="press-logo kimpton">r</a><a data-link="" href="/press" class="press-logo kimpton">t</a><a data-link="" href="/press" class="press-logo kimpton">y</a><a data-link="" href="/press" class="press-logo kimpton">q</a><a data-link="" href="/press" class="press-logo kimpton">w</a><a data-link="" href="/press" class="press-logo kimpton">e</a><a data-link="" href="/press" class="press-logo kimpton">r</a><a data-link="" href="/press" class="press-logo kimpton">t</a><a data-link="" href="/press" class="press-logo kimpton">y</a></div></div></div></div></section><section id="custom-visuals" class="intro-section header-new-pluses"><div class="photo-header margin-none"><div class="header-content header-overlay-both custom-visuals-block__slideshow-container"><div id="custom-visuals-block__slides" class="custom-visuals-block__slides"><div id="tell-a-story-video" class="unselected-slide"><div class="video-container"><h1 data-test="">test1</h1><p data-t="">test1</p></div></div><div id="tell-a-story-library" class="unselected-slide"><img src="https://images.snapwi.re/assets/img/homepage/stories.jpg" class="fill-container"></div><div id="tell-a-story-location" class="selected-slide"><img src="https://images.snapwi.re/assets/img/homepage/location.jpg" class="fill-container"></div><div id="tell-a-story-product" class="unselected-slide"><img src="https://images.snapwi.re/assets/img/homepage/product.jpg" class="fill-container"></div></div><div id="custom-visuals-block__slides" class="custom-visuals-block__slides"><div id="tell-a-story-video" class="unselected-slide"><div class="video-container"><h1 data-test="">test2</h1><p data-t="">test1</p></div></div><div id="tell-a-story-library" class="unselected-slide"><img src="https://images.snapwi.re/assets/img/homepage/stories.jpg" class="fill-container"></div><div id="tell-a-story-location" class="selected-slide"><img src="https://images.snapwi.re/assets/img/homepage/location.jpg" class="fill-container"></div><div id="tell-a-story-product" class="unselected-slide"><img src="https://images.snapwi.re/assets/img/homepage/product.jpg" class="fill-container"></div></div><div id="custom-visuals-block__slides" class="custom-visuals-block__slides"><div id="tell-a-story-video" class="unselected-slide"><div class="video-container"><h1 data-test="">test3!</h1><p data-t="">test1</p></div></div><div id="tell-a-story-library" class="unselected-slide"><img src="https://images.snapwi.re/assets/img/homepage/stories.jpg" class="fill-container"></div><div id="tell-a-story-location" class="selected-slide"><img src="https://images.snapwi.re/assets/img/homepage/location.jpg" class="fill-container"></div><div id="tell-a-story-product" class="unselected-slide"><img src="https://images.snapwi.re/assets/img/homepage/product.jpg" class="fill-container"></div></div><div class="container-fluid"><div class="header-message header-message-left"><div id="custom-visuals-block" class="responsive-margin"><h2><span class="theme-yellow">speak for themselves</span></h2><h4 class="padding-top-10"><span id="custom-visuals-block__slide-0" class="custom-visuals-block__slide-menu">Tell a story through video</span></h4><h4 class="padding-top-10"><span id="custom-visuals-block__slide-1" class="custom-visuals-block__slide-menu">Build a library of stories</span></h4><h4 class="padding-top-10"><span id="custom-visuals-block__slide-2" class="custom-visuals-block__slide-menu selected-menu">Tell a story about a location</span></h4><h4 class="padding-top-10"><span id="custom-visuals-block__slide-3" class="custom-visuals-block__slide-menu">Tell a story about a product</span></h4></div></div></div></div></div></section><section id="section-launch-high-volume" class="header-new-pluses"><div class="photo-header margin-none"><div class="header-content header-overlay-both"><div class="container-fluid"><div class="header-message header-message-right transition-state-begin"><div class="padding-top-10"><h2><span class="theme-yellow">high-volume <br> production</span></h2></div><div class="padding-top-10"><h4>Snap a single product or all 10,000 SKUs. <br> Snapwire is built for agility, enterprise scale, and<br> global reach.</h4></div><div class="padding-top-10"><h4>Lightning fast</h4><h4>Cost-efficient</h4><h4>High volume</h4></div><div class="padding-top-10"><a href="/howitworks" class="btn btn-success btn-lg">See How It Works</a></div></div></div></div></div></section><section id="home-new-first-under-screen" class="intro-section section-white header-new-pluses"><div class="container"><div class="new-home-section-content"><div class="row"><h2><span class="sw-blue">visual asset pipeline  <br></span></h2></div><div class="row"><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fas fa-2x fa-temperature-high"></i></div><h4 class="bold margin-bottom home-header-text">High-volume production</h4><p class="normal home-body-text">Get tens of thousands of photos in weeks</p></div><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-map-marker-alt"></i></div><h4 class="bold margin-bottom home-header-text">Localized visuals</h4><p class="normal home-body-text">Capture neighborhoods, cities, buildings, or people.</p></div><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-rocket"></i></div><h4 class="bold margin-bottom home-header-text">Product launch</h4><p class="normal home-body-text">Support a launch with product and lifestyle shots</p></div></div><div class="row"><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-book"></i></div><h4 class="bold margin-bottom home-header-text">Content library</h4><p class="normal home-body-text">Build a wholly-owned repository of on-brand images</p></div><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-bullhorn"></i></div><h4 class="bold margin-bottom home-header-text">Marketing campaigns</h4><p class="normal home-body-text">Launch a campaign with photos that support your objectives</p></div><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-thumbs-up"></i></div><h4 class="bold margin-bottom home-header-text">Social media</h4><p class="normal home-body-text">Increase engagement with authentic lifestyle shots</p></div></div><div class="row"><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-mobile-alt"></i></div><h4 class="bold margin-bottom home-header-text">App overhaul</h4><p class="normal home-body-text">Refresh your app with high-quality visuals that sell</p></div><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fab fa-2x fa-hotjar"></i></div><h4 class="bold margin-bottom home-header-text">Rebrand</h4><p class="normal home-body-text">Celebrate your new brand with brand new visuals</p></div><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-funnel-dollar"></i></div><h4 class="bold margin-bottom home-header-text">Ecommerce</h4><p class="normal home-body-text">Scale high-quality photos while protecting your margins</p></div></div></div></div></section></div><div id="sw-content" class="container"><section id="header-section"><div class="video-container hero-video-container"><video id="myVideo"><source></video></div><div class="video-overlay-section col-sm-12 text-left container-fluid"><div class="header-text col-sm-8 col-md-offset-1"><div class="text home-header-base-text"><h1><span class="word theme-yellow transition-state-end">from anywhere.</span><span class="word theme-yellow transition-state-begin">cost-effective.</span><span class="word theme-yellow transition-state-begin">on-brand.</span></h1></div><h4 class="photo-header-h2 normal margin-bottom-big top-text-2"><br>This is the future of custom content creation.</h4></div></div></section><section id="press-section" class="intro-section header-new-pluses"><div id="section-press"><div class="container"><div class="row"><div class="home__logo-header">Trusted By</div><div class="col-md-12 text-center home__logo-content"><a data-link="" href="/press" class="press-logo kimpton">q</a><a data-link="" href="/press" class="press-logo kimpton">w</a><a data-link="" href="/press" class="press-logo kimpton">e</a><a data-link="" href="/press" class="press-logo kimpton">r</a><a data-link="" href="/press" class="press-logo kimpton">t</a><a data-link="" href="/press" class="press-logo kimpton">y</a><a data-link="" href="/press" class="press-logo kimpton">q</a><a data-link="" href="/press" class="press-logo kimpton">w</a><a data-link="" href="/press" class="press-logo kimpton">e</a><a data-link="" href="/press" class="press-logo kimpton">r</a><a data-link="" href="/press" class="press-logo kimpton">t</a><a data-link="" href="/press" class="press-logo kimpton">y</a></div></div></div></div></section><section id="custom-visuals" class="intro-section header-new-pluses"><div class="photo-header margin-none"><div class="header-content header-overlay-both custom-visuals-block__slideshow-container"><div id="custom-visuals-block__slides" class="custom-visuals-block__slides"><div id="tell-a-story-video" class="unselected-slide"><div class="video-container"><h1 data-test="">test1</h1><p data-t="">test2</p></div></div><div id="tell-a-story-library" class="unselected-slide"><img src="https://images.snapwi.re/assets/img/homepage/stories.jpg" class="fill-container"></div><div id="tell-a-story-location" class="selected-slide"><img src="https://images.snapwi.re/assets/img/homepage/location.jpg" class="fill-container"></div><div id="tell-a-story-product" class="unselected-slide"><img src="https://images.snapwi.re/assets/img/homepage/product.jpg" class="fill-container"></div></div><div id="custom-visuals-block__slides" class="custom-visuals-block__slides"><div id="tell-a-story-video" class="unselected-slide"><div class="video-container"><h1 data-test="">test2</h1><p data-t="">test2</p></div></div><div id="tell-a-story-library" class="unselected-slide"><img src="https://images.snapwi.re/assets/img/homepage/stories.jpg" class="fill-container"></div><div id="tell-a-story-location" class="selected-slide"><img src="https://images.snapwi.re/assets/img/homepage/location.jpg" class="fill-container"></div><div id="tell-a-story-product" class="unselected-slide"><img src="https://images.snapwi.re/assets/img/homepage/product.jpg" class="fill-container"></div></div><div id="custom-visuals-block__slides" class="custom-visuals-block__slides"><div id="tell-a-story-video" class="unselected-slide"><div class="video-container"><h1 data-test="">test3!</h1><p data-t="">test2</p></div></div><div id="tell-a-story-library" class="unselected-slide"><img src="https://images.snapwi.re/assets/img/homepage/stories.jpg" class="fill-container"></div><div id="tell-a-story-location" class="selected-slide"><img src="https://images.snapwi.re/assets/img/homepage/location.jpg" class="fill-container"></div><div id="tell-a-story-product" class="unselected-slide"><img src="https://images.snapwi.re/assets/img/homepage/product.jpg" class="fill-container"></div></div><div class="container-fluid"><div class="header-message header-message-left"><div id="custom-visuals-block" class="responsive-margin"><h2><span class="theme-yellow">speak for themselves</span></h2><h4 class="padding-top-10"><span id="custom-visuals-block__slide-0" class="custom-visuals-block__slide-menu">Tell a story through video</span></h4><h4 class="padding-top-10"><span id="custom-visuals-block__slide-1" class="custom-visuals-block__slide-menu">Build a library of stories</span></h4><h4 class="padding-top-10"><span id="custom-visuals-block__slide-2" class="custom-visuals-block__slide-menu selected-menu">Tell a story about a location</span></h4><h4 class="padding-top-10"><span id="custom-visuals-block__slide-3" class="custom-visuals-block__slide-menu">Tell a story about a product</span></h4></div></div></div></div></div></section><section id="section-launch-high-volume" class="header-new-pluses"><div class="photo-header margin-none"><div class="header-content header-overlay-both"><div class="container-fluid"><div class="header-message header-message-right transition-state-begin"><div class="padding-top-10"><h2><span class="theme-yellow">high-volume <br> production</span></h2></div><div class="padding-top-10"><h4>Snap a single product or all 10,000 SKUs. <br> Snapwire is built for agility, enterprise scale, and<br> global reach.</h4></div><div class="padding-top-10"><h4>Lightning fast</h4><h4>Cost-efficient</h4><h4>High volume</h4></div><div class="padding-top-10"><a href="/howitworks" class="btn btn-success btn-lg">See How It Works</a></div></div></div></div></div></section><section id="home-new-first-under-screen" class="intro-section section-white header-new-pluses"><div class="container"><div class="new-home-section-content"><div class="row"><h2><span class="sw-blue">visual asset pipeline  <br></span></h2></div><div class="row"><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fas fa-2x fa-temperature-high"></i></div><h4 class="bold margin-bottom home-header-text">High-volume production</h4><p class="normal home-body-text">Get tens of thousands of photos in weeks</p></div><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-map-marker-alt"></i></div><h4 class="bold margin-bottom home-header-text">Localized visuals</h4><p class="normal home-body-text">Capture neighborhoods, cities, buildings, or people.</p></div><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-rocket"></i></div><h4 class="bold margin-bottom home-header-text">Product launch</h4><p class="normal home-body-text">Support a launch with product and lifestyle shots</p></div></div><div class="row"><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-book"></i></div><h4 class="bold margin-bottom home-header-text">Content library</h4><p class="normal home-body-text">Build a wholly-owned repository of on-brand images</p></div><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-bullhorn"></i></div><h4 class="bold margin-bottom home-header-text">Marketing campaigns</h4><p class="normal home-body-text">Launch a campaign with photos that support your objectives</p></div><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-thumbs-up"></i></div><h4 class="bold margin-bottom home-header-text">Social media</h4><p class="normal home-body-text">Increase engagement with authentic lifestyle shots</p></div></div><div class="row"><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-mobile-alt"></i></div><h4 class="bold margin-bottom home-header-text">App overhaul</h4><p class="normal home-body-text">Refresh your app with high-quality visuals that sell</p></div><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fab fa-2x fa-hotjar"></i></div><h4 class="bold margin-bottom home-header-text">Rebrand</h4><p class="normal home-body-text">Celebrate your new brand with brand new visuals</p></div><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-funnel-dollar"></i></div><h4 class="bold margin-bottom home-header-text">Ecommerce</h4><p class="normal home-body-text">Scale high-quality photos while protecting your margins</p></div></div></div></div></section></div><div id="sw-content" class="container"><section id="header-section"><div class="video-container hero-video-container"><video id="myVideo"><source></video></div><div class="video-overlay-section col-sm-12 text-left container-fluid"><div class="header-text col-sm-8 col-md-offset-1"><div class="text home-header-base-text"><h1><span class="word theme-yellow transition-state-end">from anywhere.</span><span class="word theme-yellow transition-state-begin">cost-effective.</span><span class="word theme-yellow transition-state-begin">on-brand.</span></h1></div><h4 class="photo-header-h2 normal margin-bottom-big top-text-2"><br>This is the future of custom content creation.</h4></div></div></section><section id="press-section" class="intro-section header-new-pluses"><div id="section-press"><div class="container"><div class="row"><div class="home__logo-header">Trusted By</div><div class="col-md-12 text-center home__logo-content"><a data-link="" href="/press" class="press-logo kimpton">q</a><a data-link="" href="/press" class="press-logo kimpton">w</a><a data-link="" href="/press" class="press-logo kimpton">e</a><a data-link="" href="/press" class="press-logo kimpton">r</a><a data-link="" href="/press" class="press-logo kimpton">t</a><a data-link="" href="/press" class="press-logo kimpton">y</a><a data-link="" href="/press" class="press-logo kimpton">q</a><a data-link="" href="/press" class="press-logo kimpton">w</a><a data-link="" href="/press" class="press-logo kimpton">e</a><a data-link="" href="/press" class="press-logo kimpton">r</a><a data-link="" href="/press" class="press-logo kimpton">t</a><a data-link="" href="/press" class="press-logo kimpton">y</a></div></div></div></div></section><section id="custom-visuals" class="intro-section header-new-pluses"><div class="photo-header margin-none"><div class="header-content header-overlay-both custom-visuals-block__slideshow-container"><div id="custom-visuals-block__slides" class="custom-visuals-block__slides"><div id="tell-a-story-video" class="unselected-slide"><div class="video-container"><h1 data-test="">test1</h1><p data-t="">test3!</p></div></div><div id="tell-a-story-library" class="unselected-slide"><img src="https://images.snapwi.re/assets/img/homepage/stories.jpg" class="fill-container"></div><div id="tell-a-story-location" class="selected-slide"><img src="https://images.snapwi.re/assets/img/homepage/location.jpg" class="fill-container"></div><div id="tell-a-story-product" class="unselected-slide"><img src="https://images.snapwi.re/assets/img/homepage/product.jpg" class="fill-container"></div></div><div id="custom-visuals-block__slides" class="custom-visuals-block__slides"><div id="tell-a-story-video" class="unselected-slide"><div class="video-container"><h1 data-test="">test2</h1><p data-t="">test3!</p></div></div><div id="tell-a-story-library" class="unselected-slide"><img src="https://images.snapwi.re/assets/img/homepage/stories.jpg" class="fill-container"></div><div id="tell-a-story-location" class="selected-slide"><img src="https://images.snapwi.re/assets/img/homepage/location.jpg" class="fill-container"></div><div id="tell-a-story-product" class="unselected-slide"><img src="https://images.snapwi.re/assets/img/homepage/product.jpg" class="fill-container"></div></div><div id="custom-visuals-block__slides" class="custom-visuals-block__slides"><div id="tell-a-story-video" class="unselected-slide"><div class="video-container"><h1 data-test="">test3!</h1><p data-t="">test3!</p></div></div><div id="tell-a-story-library" class="unselected-slide"><img src="https://images.snapwi.re/assets/img/homepage/stories.jpg" class="fill-container"></div><div id="tell-a-story-location" class="selected-slide"><img src="https://images.snapwi.re/assets/img/homepage/location.jpg" class="fill-container"></div><div id="tell-a-story-product" class="unselected-slide"><img src="https://images.snapwi.re/assets/img/homepage/product.jpg" class="fill-container"></div></div><div class="container-fluid"><div class="header-message header-message-left"><div id="custom-visuals-block" class="responsive-margin"><h2><span class="theme-yellow">speak for themselves</span></h2><h4 class="padding-top-10"><span id="custom-visuals-block__slide-0" class="custom-visuals-block__slide-menu">Tell a story through video</span></h4><h4 class="padding-top-10"><span id="custom-visuals-block__slide-1" class="custom-visuals-block__slide-menu">Build a library of stories</span></h4><h4 class="padding-top-10"><span id="custom-visuals-block__slide-2" class="custom-visuals-block__slide-menu selected-menu">Tell a story about a location</span></h4><h4 class="padding-top-10"><span id="custom-visuals-block__slide-3" class="custom-visuals-block__slide-menu">Tell a story about a product</span></h4></div></div></div></div></div></section><section id="section-launch-high-volume" class="header-new-pluses"><div class="photo-header margin-none"><div class="header-content header-overlay-both"><div class="container-fluid"><div class="header-message header-message-right transition-state-begin"><div class="padding-top-10"><h2><span class="theme-yellow">high-volume <br> production</span></h2></div><div class="padding-top-10"><h4>Snap a single product or all 10,000 SKUs. <br> Snapwire is built for agility, enterprise scale, and<br> global reach.</h4></div><div class="padding-top-10"><h4>Lightning fast</h4><h4>Cost-efficient</h4><h4>High volume</h4></div><div class="padding-top-10"><a href="/howitworks" class="btn btn-success btn-lg">See How It Works</a></div></div></div></div></div></section><section id="home-new-first-under-screen" class="intro-section section-white header-new-pluses"><div class="container"><div class="new-home-section-content"><div class="row"><h2><span class="sw-blue">visual asset pipeline  <br></span></h2></div><div class="row"><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fas fa-2x fa-temperature-high"></i></div><h4 class="bold margin-bottom home-header-text">High-volume production</h4><p class="normal home-body-text">Get tens of thousands of photos in weeks</p></div><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-map-marker-alt"></i></div><h4 class="bold margin-bottom home-header-text">Localized visuals</h4><p class="normal home-body-text">Capture neighborhoods, cities, buildings, or people.</p></div><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-rocket"></i></div><h4 class="bold margin-bottom home-header-text">Product launch</h4><p class="normal home-body-text">Support a launch with product and lifestyle shots</p></div></div><div class="row"><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-book"></i></div><h4 class="bold margin-bottom home-header-text">Content library</h4><p class="normal home-body-text">Build a wholly-owned repository of on-brand images</p></div><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-bullhorn"></i></div><h4 class="bold margin-bottom home-header-text">Marketing campaigns</h4><p class="normal home-body-text">Launch a campaign with photos that support your objectives</p></div><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-thumbs-up"></i></div><h4 class="bold margin-bottom home-header-text">Social media</h4><p class="normal home-body-text">Increase engagement with authentic lifestyle shots</p></div></div><div class="row"><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-mobile-alt"></i></div><h4 class="bold margin-bottom home-header-text">App overhaul</h4><p class="normal home-body-text">Refresh your app with high-quality visuals that sell</p></div><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fab fa-2x fa-hotjar"></i></div><h4 class="bold margin-bottom home-header-text">Rebrand</h4><p class="normal home-body-text">Celebrate your new brand with brand new visuals</p></div><div class="col-sm-4 margin-bottom header-new-pluses-elem green-background-on-hover tile-pluses transition-state-begin"><div class="header-new-pluses-elem-glob sw-green"><i class="fa fa-2x fa-funnel-dollar"></i></div><h4 class="bold margin-bottom home-header-text">Ecommerce</h4><p class="normal home-body-text">Scale high-quality photos while protecting your margins</p></div></div></div></div></section></div>`)
	})
	test('patch case №2', () => {
		obj.data = {
			data: false,
			data2:'some data-3',
			data3:'anything-3',
			tests:['test1','test2','test3!','test','ntest'],
			news:['news1','news2','news3'],
			other:['other1','other2']
		}
		obj.template = `
			<nav class="navbar navbar-expand-md navbar-light shadow-sm topNav">
      <div class="container">
          <a class="navbar-brand" href="{{ url('/') }}">
              Contentmaker
          </a>                

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <!-- Left Side Of Navbar -->                    
              <!-- Right Side Of Navbar -->
              <ul class="navbar-nav ml-auto">
                  <!-- Authentication Links -->
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('login') }}"><i class="far fa-user"></i></a>
                </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('register') }}">{{ __('Register') }}</a>
                    </li>
                <li class="nav-item dropdown">
                    <a href="{{ route('logout') }}">
                        <i class="fas fa-sign-out-alt"></i>
                    </a>

                    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                    </form>
                </li>
              </ul>
          </div>
      </div>
  </nav>
  <main class="py-4">
	  <div class="container">
	    <main l-for="test in tests">      
	        <h2 class="request-title-desc text-center mt-2">Requests</h2>
	        <div id="app" class="d-flex justify-content-between flex-wrap w-75 mx-auto">
            <a class="request-container text-center" href="{{route($request->type,['request' => $request->id,'id' => $request[$request->type] ?? 1])}}">
                <div class="request" l-for="new in news">
                    <h5>{{new}}</h5>
                    <h6>{{substr($request->created_at,10,strlen($request->created_at))}}</h6>
                    <p class="text-center">
                        {{test}}
                    </p>
                </div>
            </a>
	        </div>
	    </main>
		</div>
	</main>
		`
		linker.call(obj)
		const html = patch(makeOutput(obj.nodes),obj)
		expect(html.innerHTML).toBe(`<nav class="navbar navbar-expand-md navbar-light shadow-sm topNav"><div class="container"><a href="{{ url('/') }}" class="navbar-brand">Contentmaker</a><div id="navbarSupportedContent" class="collapse navbar-collapse"><ul class="navbar-nav ml-auto"><li class="nav-item"><a href="{{ route('login') }}" class="nav-link"><i class="far fa-user"></i></a></li><li class="nav-item"><a href="{{ route('register') }}" class="nav-link">{{ __('Register') }}</a></li><li class="nav-item dropdown"><a href="{{ route('logout') }}"><i class="fas fa-sign-out-alt"></i></a><form id="logout-form" action="{{ route('logout') }}"></form></li></ul></div></div></nav><main class="py-4"><div class="container"><main><h2 class="request-title-desc text-center mt-2">Requests</h2><div id="app" class="d-flex justify-content-between flex-wrap w-75 mx-auto"><a href="{{route($request-" class="request-container text-center"><div class="request"><h5 data-new="">news1</h5><h6>{{substr($request-&gt;created_at,10,strlen($request-&gt;created_at))}}</h6><p data-test="" class="text-center">test1</p></div><div class="request"><h5 data-new="">news2</h5><h6>{{substr($request-&gt;created_at,10,strlen($request-&gt;created_at))}}</h6><p data-test="" class="text-center">test1</p></div><div class="request"><h5 data-new="">news3</h5><h6>{{substr($request-&gt;created_at,10,strlen($request-&gt;created_at))}}</h6><p data-test="" class="text-center">test1</p></div></a></div></main><main><h2 class="request-title-desc text-center mt-2">Requests</h2><div id="app" class="d-flex justify-content-between flex-wrap w-75 mx-auto"><a href="{{route($request-" class="request-container text-center"><div class="request"><h5 data-new="">news1</h5><h6>{{substr($request-&gt;created_at,10,strlen($request-&gt;created_at))}}</h6><p data-test="" class="text-center">test2</p></div><div class="request"><h5 data-new="">news2</h5><h6>{{substr($request-&gt;created_at,10,strlen($request-&gt;created_at))}}</h6><p data-test="" class="text-center">test2</p></div><div class="request"><h5 data-new="">news3</h5><h6>{{substr($request-&gt;created_at,10,strlen($request-&gt;created_at))}}</h6><p data-test="" class="text-center">test2</p></div></a></div></main><main><h2 class="request-title-desc text-center mt-2">Requests</h2><div id="app" class="d-flex justify-content-between flex-wrap w-75 mx-auto"><a href="{{route($request-" class="request-container text-center"><div class="request"><h5 data-new="">news1</h5><h6>{{substr($request-&gt;created_at,10,strlen($request-&gt;created_at))}}</h6><p data-test="" class="text-center">test3!</p></div><div class="request"><h5 data-new="">news2</h5><h6>{{substr($request-&gt;created_at,10,strlen($request-&gt;created_at))}}</h6><p data-test="" class="text-center">test3!</p></div><div class="request"><h5 data-new="">news3</h5><h6>{{substr($request-&gt;created_at,10,strlen($request-&gt;created_at))}}</h6><p data-test="" class="text-center">test3!</p></div></a></div></main><main><h2 class="request-title-desc text-center mt-2">Requests</h2><div id="app" class="d-flex justify-content-between flex-wrap w-75 mx-auto"><a href="{{route($request-" class="request-container text-center"><div class="request"><h5 data-new="">news1</h5><h6>{{substr($request-&gt;created_at,10,strlen($request-&gt;created_at))}}</h6><p data-test="" class="text-center">test</p></div><div class="request"><h5 data-new="">news2</h5><h6>{{substr($request-&gt;created_at,10,strlen($request-&gt;created_at))}}</h6><p data-test="" class="text-center">test</p></div><div class="request"><h5 data-new="">news3</h5><h6>{{substr($request-&gt;created_at,10,strlen($request-&gt;created_at))}}</h6><p data-test="" class="text-center">test</p></div></a></div></main><main><h2 class="request-title-desc text-center mt-2">Requests</h2><div id="app" class="d-flex justify-content-between flex-wrap w-75 mx-auto"><a href="{{route($request-" class="request-container text-center"><div class="request"><h5 data-new="">news1</h5><h6>{{substr($request-&gt;created_at,10,strlen($request-&gt;created_at))}}</h6><p data-test="" class="text-center">ntest</p></div><div class="request"><h5 data-new="">news2</h5><h6>{{substr($request-&gt;created_at,10,strlen($request-&gt;created_at))}}</h6><p data-test="" class="text-center">ntest</p></div><div class="request"><h5 data-new="">news3</h5><h6>{{substr($request-&gt;created_at,10,strlen($request-&gt;created_at))}}</h6><p data-test="" class="text-center">ntest</p></div></a></div></main></div></main>`)
	})
	test('patch case №3', () => {
		obj.data = {
			data: true,
			data2:'some',
			data3:'anything-3',
			tests:['test1','test2','test3!'],
			news:['news1','news2','news3'],
			other:['other1','other2']
		}
		obj.template = `
		<div l-for="o in other">
  <div class="bb-custom-wrapper">    
  	<div class="top d-flex justify-content-between w-50">
      <h1 class="text-center mt-3">Content</h1>
      <a href="">edit book</a>
    </div>
    <div class="bkbl-wrp">
	    <div class="bb-bookblock mx-auto">
	      <div class="bb-item">        
	        <p v-if="el[0]" class="content left-content">
	          el[0].cont
	        </p>
	        <p class="page">el[0].page</p>
	        <p class="content right-content">
	          {{o}}
	        </p>
	        <p class="page2">el[1].page</p>
	      </div>
	    </div>

    	<h1 class="text-center">No content</h1>
    </div>
    <nav>
      <a id="bb-nav-first" href="#" class="bb-custom-icon bb-custom-icon-first">First page</a>
      <a id="bb-nav-prev" href="#" class="bb-custom-icon bb-custom-icon-arrow-left">Previous</a>
      <a id="bb-nav-next" href="#" class="bb-custom-icon bb-custom-icon-arrow-right">Next</a>
      <a id="bb-nav-last" href="#" class="bb-custom-icon bb-custom-icon-last">Last page</a>
    </nav>
    <div>
      {{o}}
    </div>    
  </div>
  <form action="http://127.0.0.1:8000/api/request" method="post" class="form-group mx-auto mt-3" id="book-form">
  	<p>{{o}}</p>
    <input type="hidden" name="request[type]" value="book" />
    <textarea name="request[message]" class="form-control" placeholder="message">
    </textarea><br/>
    <input type="text" name="request[author]" class="form-control" placeholder="author" /><br/>
    <input type="hidden" name="request[email]" class="form-control" />
    <input type="text" name="item[genre]" class="form-control" placeholder="genre" /><br/>
    <input type="hidden" name="item[content]" />
    <div>
      <input type="hidden" name="item[name]" />
      <input disabled="true" type="text" name="item[name]" class="form-control" placeholder="name" />
    </div>
    <input type="text" name="item[size]" class="form-control" placeholder="size" />
    <input type="hidden" name="item[count_of_pages]" class="form-control" placeholder="count of pages" /><br/>
    <input type="text" name="item[tags]" class="form-control" placeholder="tags" /><br/>
    <input type="submit" class="btn btn-secondary" />
  </form>
</div>
		`
		linker.call(obj)
		const html = patch(makeOutput(obj.nodes),obj)
		expect(html.innerHTML).toBe(`<div><div class="bb-custom-wrapper"><div class="top d-flex justify-content-between w-50"><h1 class="text-center mt-3">Content</h1><a>edit book</a></div><div class="bkbl-wrp"><div class="bb-bookblock mx-auto"><div class="bb-item"><p class="content left-content">el[0].cont</p><p class="page">el[0].page</p><p data-o="" class="content right-content">other1</p><p class="page2">el[1].page</p></div></div><h1 class="text-center">No content</h1></div><nav><a id="bb-nav-first" href="#" class="bb-custom-icon bb-custom-icon-first">First page</a><a id="bb-nav-prev" href="#" class="bb-custom-icon bb-custom-icon-arrow-left">Previous</a><a id="bb-nav-next" href="#" class="bb-custom-icon bb-custom-icon-arrow-right">Next</a><a id="bb-nav-last" href="#" class="bb-custom-icon bb-custom-icon-last">Last page</a></nav><div data-o="">other1</div></div><form id="book-form" action="http://127.0.0.1:8000/api/request" class="form-group mx-auto mt-3"><p data-o="">other1</p><input type="hidden" name="request[type]" value="book"><textarea name="request[message]" placeholder="message" class="form-control"></textarea><input type="text" name="request[author]" placeholder="author" class="form-control"><input type="hidden" name="request[email]" class="form-control"><input type="text" name="item[genre]" placeholder="genre" class="form-control"><input type="hidden" name="item[content]"><div><input type="hidden" name="item[name]"><input type="text" name="item[name]" placeholder="name" class="form-control"></div><input type="text" name="item[size]" placeholder="size" class="form-control"><input type="hidden" name="item[count_of_pages]" placeholder="count of pages" class="form-control"><input type="text" name="item[tags]" placeholder="tags" class="form-control"><input type="submit" class="btn btn-secondary"></form></div><div><div class="bb-custom-wrapper"><div class="top d-flex justify-content-between w-50"><h1 class="text-center mt-3">Content</h1><a>edit book</a></div><div class="bkbl-wrp"><div class="bb-bookblock mx-auto"><div class="bb-item"><p class="content left-content">el[0].cont</p><p class="page">el[0].page</p><p data-o="" class="content right-content">other2</p><p class="page2">el[1].page</p></div></div><h1 class="text-center">No content</h1></div><nav><a id="bb-nav-first" href="#" class="bb-custom-icon bb-custom-icon-first">First page</a><a id="bb-nav-prev" href="#" class="bb-custom-icon bb-custom-icon-arrow-left">Previous</a><a id="bb-nav-next" href="#" class="bb-custom-icon bb-custom-icon-arrow-right">Next</a><a id="bb-nav-last" href="#" class="bb-custom-icon bb-custom-icon-last">Last page</a></nav><div data-o="">other2</div></div><form id="book-form" action="http://127.0.0.1:8000/api/request" class="form-group mx-auto mt-3"><p data-o="">other2</p><input type="hidden" name="request[type]" value="book"><textarea name="request[message]" placeholder="message" class="form-control"></textarea><input type="text" name="request[author]" placeholder="author" class="form-control"><input type="hidden" name="request[email]" class="form-control"><input type="text" name="item[genre]" placeholder="genre" class="form-control"><input type="hidden" name="item[content]"><div><input type="hidden" name="item[name]"><input type="text" name="item[name]" placeholder="name" class="form-control"></div><input type="text" name="item[size]" placeholder="size" class="form-control"><input type="hidden" name="item[count_of_pages]" placeholder="count of pages" class="form-control"><input type="text" name="item[tags]" placeholder="tags" class="form-control"><input type="submit" class="btn btn-secondary"></form></div>`)
	})
})