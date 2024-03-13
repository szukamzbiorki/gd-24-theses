<template>
	<div
		ref="container"
		:class="'wheel keen-slider wheel--perspective-' + perspective"
	>
		<!-- <div
			class="wheel__shadow-top"
			:style="{
				transform: `translateZ(${radius}px)`,
				'-webkit-transform': `translateZ(${radius}px)`,
			}"
		></div> -->

		<div
			v-for="(slide, index) in data"
			:key="index"
			class="keen-slider__slide"
			:style="slide.style"
		>
			<span>{{ slide.name }}</span>
		</div>

		<!-- <div
			class="wheel__shadow-bottom"
			:style="{
				transform: `translateZ(${radius}px)`,
				'-webkit-transform': `translateZ(${radius}px)`,
			}"
		></div> -->
	</div>
</template>

<script setup>
	import { ref } from 'vue'

	import { useKeenSlider } from 'keen-slider/vue.es'
	import 'keen-slider/keen-slider.min.css'

	const props = defineProps({
		data: { type: Array },
		initIdx: { type: Number, default: 0 },
		loop: { type: Boolean, default: false },
		length: { type: Number },
		perspective: { type: String, default: 'center' },
		label: { type: String, default: '' },
		width: { type: Number, default: 500 },
	})

	const wheelSize = 20
	const slideDegree = 360 / 60
	const slidesPerView = 1
	const height = ref(0)
	const slideValues = ref([])
	const radius = ref(0)
	let slides = []

	function setSlideValues(details) {
		const offset = 0

		const values = []
		for (let i = 0; i < props.length; i++) {
			const distance = (details.slides[i].distance - offset) * slidesPerView
			const rotate =
				Math.abs(distance) > wheelSize / 2
					? 180
					: distance * (360 / wheelSize) * -1
			const style = {
				transform: `rotateX(${rotate}deg) translateZ(${radius.value}px)`,
				WebkitTransform: `rotateX(${rotate}deg) translateZ(${radius.value}px)`,
			}
			const value = props.data[i].name
			values.push({ style, value })
		}
		slideValues.value = values
	}

	// const options = {
	// 	slides: {
	// 		number: props.length,
	// 		origin: props.loop ? 'center' : 'auto',
	// 		perView: slidesPerView,
	// 	},
	// 	vertical: true,
	// 	initial: props.initIdx || 0,
	// 	loop: props.loop,
	// 	created: (s) => {
	// 		height.value = s.size
	// 		radius.value = height.value / 6
	// 		setSlideValues(s.track.details)
	// 	},
	// 	updated: (s) => {
	// 		height.value = s.size
	// 	},
	// 	dragSpeed: (val) => {
	// 		return (
	// 			val *
	// 			(height.value /
	// 				((height.value / 2) * Math.tan(slideDegree * (Math.PI / 180))) /
	// 				slidesPerView)
	// 		)
	// 	},
	// 	detailsChanged: (s) => {
	// 		setSlideValues(s.track.details)
	// 	},
	// 	animationStarted(s) {
	// 		console.log('start')
	// 		Remove active class from all slides
	// 		s.track.details.slides.forEach((slide) => {
	// 			slide.classList.remove('active-slide')
	// 		})
	// 	},
	// 	animationEnded: (s) => {
	// 		console.log(s, slides)
	// 		s.track.details.slides[s.track.details.rel].classList.add('active-slide')
	// 	},
	// 	rubberband: false,
	// 	mode: 'free-snap',
	// }

	const options = {
		loop: false,
		mode: 'free-snap',
		slides: {
			perView: 3,
			spacing: 15,
		},
		vertical: true,
	}

	const [container] = useKeenSlider(options)
	onMounted(() => {})
</script>

<style scoped>
	body {
		margin: 0;
		font-family: 'Inter', sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	/* .wheel {
		color: #fff;
		display: block;
		height: 100%;
		overflow: visible;
		width: 100%;
	}
	.wheel--perspective-right .wheel__inner {
		perspective-origin: calc(50% + 100px) 50%;
		transform: translateX(10px);
		-webkit-transform: translateX(10px);
	}
	.wheel--perspective-left .wheel__inner {
		perspective-origin: calc(50% - 100px) 50%;
		transform: translateX(-10px);
		-webkit-transform: translateX(-10px);
	}

	.wheel__inner {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		perspective: 1000px;
		transform-style: preserve-3d;
		height: 16%;
		width: 100%;
		color: black;
	}

	.wheel__slides {
		height: 100%;
		position: relative;
		width: 100%;
	}

	.wheel__shadow-top,
	.wheel__shadow-bottom {
		background: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0.9) 0%,
			rgba(0, 0, 0, 0.5) 100%
		);
		left: 0;
		height: calc(42% + 2px);
		width: 100%;
		border-bottom: 0.5px solid rgba(255, 255, 255, 0.3);
		position: relative;
		margin-top: -2px;
		z-index: 5;
	}

	.wheel__shadow-bottom {
		background: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0.5) 0%,
			rgba(0, 0, 0, 0.9) 100%
		);
		margin-top: 2px;
		border-bottom: none;
		border-top: 0.5px solid rgba(255, 255, 255, 0.3);
	}

	.wheel__label {
		font-weight: 500;
		font-size: 15px;
		line-height: 1;
		margin-top: 1px;
		margin-left: 5px;
	}

	.wheel__slide {
		align-items: center;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		display: flex;
		font-size: 20px;
		font-weight: 400;
		height: 100%;
		width: 100%;
		position: absolute;
		justify-content: flex-start;
	}

	.active-slide {
		color: pink;
	} */
</style>
