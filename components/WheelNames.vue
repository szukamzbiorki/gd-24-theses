<template>
	<div ref="container" class="wheel keen-slider">
		<div
			v-for="(slide, index) in data"
			:key="index"
			class="keen-slider__slide"
			:style="slide.style"
		>
			<span>{{ slide.name }}</span>
		</div>
	</div>
</template>

<script setup>
	import KeenSlider from 'keen-slider'
	import 'keen-slider/keen-slider.min.css'

	const props = defineProps({
		data: { type: Array },
	})

	const { height, width } = useWindowSize()
	const { mobile } = useScreenSize()

	const globalSlide = useGlobalSlide()

	watch(globalSlide, (v) => changeSlide(v))

	function changeSlide(glob) {
		slider.value.moveToIdx(findNameIndex(glob))
	}

	function findNameIndex(glob) {
		const name = props.data[glob].name
		return props.data.findIndex((obj) => obj.name === name)
	}

	const emit = defineEmits(['slideChanged'])

	const container = ref()
	const slider = ref()

	defineExpose({ changeSlide })

	const options = {
		loop: false,
		mode: 'snap',
		slides: {
			origin: 'center',
			perView: 'auto',
		},
		defaultAnimation: {
			duration: 500,
		},
		vertical: true,
		size: 20,
		created: (s) => {
			s.slides[s.track.details.rel].classList.add('active-slide')
		},
		animationStarted(s) {
			const abstract = document.querySelector('.text')
			abstract.classList.add('hide')
			console.log(abstract)
			s.slides.forEach((slide) => {
				slide.classList.remove('active-slide')
			})
		},
		animationEnded: (s) => {
			const abstract = document.querySelector('.text')
			abstract.classList.remove('hide')
			s.slides[s.track.details.rel].classList.add('active-slide')
			// emit('slideChanged', s.track.details.rel)
			globalSlide.value = s.track.details.rel
		},
	}

	const WheelControls = (slider) => {
		let touchTimeout
		let position
		let wheelActive

		function dispatch(e, name) {
			position.x -= e.deltaX
			position.y -= e.deltaY
			slider.container.dispatchEvent(
				new CustomEvent(name, {
					detail: {
						x: position.x,
						y: position.y,
					},
				})
			)
		}

		function wheelStart(e) {
			position = {
				x: e.pageX,
				y: e.pageY,
			}
			dispatch(e, 'ksDragStart')
		}

		function wheel(e) {
			dispatch(e, 'ksDrag')
		}

		function wheelEnd(e) {
			dispatch(e, 'ksDragEnd')
		}

		function eventWheel(e) {
			e.preventDefault()
			if (!wheelActive) {
				wheelStart(e)
				wheelActive = true
			}
			wheel(e)
			clearTimeout(touchTimeout)
			touchTimeout = setTimeout(() => {
				wheelActive = false
				wheelEnd(e)
			}, 50)
		}

		slider.on('created', () => {
			slider.container.addEventListener('wheel', eventWheel, {
				passive: false,
			})
		})
	}

	onMounted(() => {
		slider.value = new KeenSlider(container.value, options, [WheelControls])
		const slides = document.querySelectorAll('.names>.keen-slider__slide')
		slides.forEach((slide, i) => {
			slide.addEventListener('click', (event) => {
				slider.value.moveToIdx(i, false)
			})
		})
	})

	function onClickSlide(id) {}
</script>

<style lang="postcss" scoped>
	.wheel {
		overflow: visible !important;
		height: 100vh !important;
		max-height: 100vh !important;
		width: 16vw !important;

		@media screen and (max-width: 640px) {
			position: absolute;
			bottom: 0vh;
			min-height: calc(var(--window-height) * 0.8) !important;
			height: calc(var(--window-height) * 0.8) !important;
			max-height: calc(var(--window-height) * 0.8) !important;
			width: 90vw !important;
			overflow: hidden !important;
		}
	}

	.keen-slider__slide {
		min-height: 20px !important;
		max-height: 20px !important;
		color: grey;
	}
</style>
