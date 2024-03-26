<template>
	<div ref="container" class="wheel keen-slider">
		<div
			v-for="(slide, index) in sortedTitle"
			:key="index"
			class="keen-slider__slide"
		>
			<NuxtMarquee
				v-if="index == findTitleIndex(globalSlide) && slide.title.length > 50"
				speed="38"
			>
				<span>{{ slide.title }}</span>
			</NuxtMarquee>
			<span v-else>{{ slide.title }}</span>
		</div>
	</div>
</template>

<script setup>
	import KeenSlider from 'keen-slider'
	import 'keen-slider/keen-slider.min.css'

	const props = defineProps({
		data: { type: Array },
	})

	const { mobile } = useScreenSize()

	const globalSlide = useGlobalSlide()

	watch(globalSlide, (v) => changeSlide(v))

	function changeSlide(glob) {
		slider.value.moveToIdx(findTitleIndex(glob))
	}

	function findTitleIndex(glob) {
		const title = props.data[glob].title
		return sortedTitle.findIndex((obj) => obj.title === title)
	}

	const localCopy = props.data.slice()

	const sortedTitle = sortData(localCopy, 'title')

	function sortData(arr, prop) {
		const s = arr.sort((a, b) => {
			const propA = a[prop].toUpperCase()
			const propB = b[prop].toUpperCase()
			if (propA < propB) {
				return -1
			}
			if (propA > propB) {
				return 1
			}
			return 0 // Names are equal
		})
		return s
	}

	const container = ref()
	const slider = ref()

	const emit = defineEmits(['slideChanged'])
	defineExpose({ changeSlide })

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

	const options = {
		loop: false,
		mode: 'snap',
		slides: {
			origin: 'center',
			perView: 'auto',
		},
		vertical: true,
		size: 20,
		defaultAnimation: {
			duration: 500,
		},
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
			const name = sortedTitle[s.track.details.rel].name
			const ind = props.data.findIndex((obj) => obj.name === name)
			emit('slideChanged', ind)
		},
	}

	onMounted(() => {
		slider.value = new KeenSlider(container.value, options, [WheelControls])
		const slides = document.querySelectorAll('.titles>.keen-slider__slide')
		slides.forEach((slide, i) => {
			slide.addEventListener('click', (event) => {
				// targetElement = id
				console.log(event)
				slider.value.moveToIdx(i, false)
			})
		})
	})

	function onClickSlide(id) {
		// targetElement = id
		keen.moveToIdx(id, false)
	}
</script>

<style lang="postcss" scoped>
	.wheel {
		overflow: visible !important;
		height: 100vh !important;
		max-height: 100vh !important;
		/* flex-grow: 2; */
		width: 34vw;
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
		@media screen and (max-width: 640px) {
			text-align: center;
		}
	}
</style>
