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
		vertical: true,
		size: 20,
		created: (s) => {
			s.slides[s.track.details.rel].classList.add('active-slide')
		},
		animationStarted(s) {
			s.slides.forEach((slide) => {
				slide.classList.remove('active-slide')
			})
		},
		animationEnded: (s) => {
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
	})
</script>

<style lang="postcss" scoped>
	.wheel {
		overflow: visible !important;
		height: 100vh !important;
		max-height: 100vh !important;
		/* width: 33vw !important; */
		flex-grow: 1;

		@media screen and (max-width: 640px) {
			min-height: 10vh !important;
			height: 10vh !important;
			max-height: 10vh !important;
			width: 90vw !important;
			overflow: hidden !important;
		}
	}

	.keen-slider__slide {
		min-height: 20px !important;
		max-height: 20px !important;
		color: grey;
	}

	.active-slide {
		color: white;
	}
</style>
