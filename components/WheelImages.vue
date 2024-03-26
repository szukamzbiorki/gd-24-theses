<template>
	<div ref="container" class="wheel keen-slider">
		<div
			v-for="(slide, index) in data"
			:key="index"
			class="keen-slider__slide"
			:style="slide.style"
		>
			<img
				class="image"
				:src="`/gd-24-theses/images/${slide.image}`"
				alt=""
				srcset=""
			/>
			<!-- <span>{{ slide.name }}</span> -->
		</div>
	</div>
</template>

<script setup>
	import KeenSlider from 'keen-slider'
	import 'keen-slider/keen-slider.min.css'

	const props = defineProps({
		data: { type: Array },
	})

	const { height } = useWindowSize()
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

	const WheelControls = (slider) => {
		let touchTimeout
		let position
		let wheelActive

		function dispatch(e, name) {
			position.x -= e.deltaX * 2
			position.y -= e.deltaY * 2
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

	const options = {
		loop: false,
		mode: 'snap',
		slides: {
			origin: 'center',
			perView: 'auto',
			spacing: 10,
		},
		defaultAnimation: {
			duration: 500,
		},
		vertical: mobile.value ? false : true,
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
			globalSlide.value = s.track.details.rel
		},
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
		width: 52vw;
		background-color: white;
		@media screen and (max-width: 640px) {
			position: absolute;
			top: 2rem;
			left: 0;
			min-height: initial !important;
			height: initial !important;
			max-height: initial !important;
			/* min-height: 38.7vh !important;
			height: 38.7vh !important;
			max-height: 38.7vh !important; */
			width: 100vw !important;
			overflow: hidden !important;
		}
	}

	.keen-slider__slide {
		min-height: 47.5vh !important;
		max-height: 47.5vh !important;
		height: 47.5vh;
		@media screen and (max-width: 640px) {
			min-width: 75vw !important;
			width: 67vw;
			min-height: 90% !important;
			max-height: 90% !important;
			height: 90%;
			/* min-height: calc(48vh - 90px) !important;
			max-height: calc(48vh - 90px) !important;
			height: calc(48vh - 90px); */
		}
		width: 90%;

		color: grey;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all 0.3s ease;
		opacity: 0.85;
	}

	.image {
		max-width: 90%;
		max-height: 90%;
		object-fit: contain;
	}
</style>
