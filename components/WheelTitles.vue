<template>
	<div ref="container" class="wheel keen-slider">
		<div
			v-for="(slide, index) in sortedTitle"
			:key="index"
			class="keen-slider__slide"
		>
			<span>{{ slide.title }}</span>
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

	function findNameIndex(glob) {
		const name = props.data[glob].name
		return props.data.findIndex((obj) => obj.name === name)
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
			const name = sortedTitle[s.track.details.rel].name
			const ind = props.data.findIndex((obj) => obj.name === name)
			emit('slideChanged', ind)
		},
	}

	onMounted(() => {
		slider.value = new KeenSlider(container.value, options)
	})
</script>

<style>
	.wheel {
		overflow: visible !important;
		height: 100vh !important;
		max-height: 100vh !important;
		width: 33vw !important;
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

	.active-slide {
		color: black;
	}
</style>
