<template>
	<div id="index">
		<WheelNames
			:data="sortedNames"
			@slideChanged="slideChangedNames"
			ref="wheelNames"
		></WheelNames>
		<WheelImages
			:data="sortedNames"
			:length="data.data?.length"
			ref="wheelImages"
			@slideChanged="slideChangedImages"
		></WheelImages>
		<WheelTitles
			:data="sortedNames"
			:length="data.data?.length"
			ref="wheelTitles"
			@slideChanged="slideChangedTitles"
		></WheelTitles>
		<div class="landing" :class="{ hide: !landing }">
			<div class="left">KABK</div>
			<div class="center">Graduation theses—Graphic Design Department</div>
			<div class="right">2024</div>
		</div>
		<div class="line">
			<div class="left"></div>
			<div class="right"></div>
		</div>
	</div>
</template>

<script setup>
	const { data } = await useAsyncData('data', () =>
		queryContent('/data').findOne()
	)

	const sortedNames = sortData(data.value.data, 'name')

	const landing = ref(true)

	onMounted(() => {
		setTimeout(() => {
			landing.value = false
		}, 3000)
	})

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

	const wheelNames = ref()
	const wheelTitles = ref()

	const globalSlide = useGlobalSlide()

	function slideChangedNames(i) {
		globalSlide.value = i
	}

	function slideChangedTitles(i) {
		// const name = props.data[glob].name
		// const ind = props.data.findIndex((obj) => obj.name === name)
		// slider.value.moveToIdx(ind)
		globalSlide.value = i
	}

	function slideChangedImages(i) {
		// const name = props.data[glob].name
		// const ind = props.data.findIndex((obj) => obj.name === name)
		// slider.value.moveToIdx(ind)
		globalSlide.value = i
	}
</script>

<style lang="postcss" scoped>
	#index {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		height: 100vh;
		width: 100vw;
		padding: 0 var(--space-m);
		overflow: hidden;
		gap: var(--space-m);
		@media screen and (max-width: 640px) {
			flex-direction: column;
		}
		& > .landing {
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			height: calc(100vh);
			padding-bottom: 3rem;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			pointer-events: none;
			padding: var(--space-m);
			background-color: rgba(30, 30, 30, 0.9);
			transition: opacity 1s ease-in-out;

			&.hide {
				opacity: 0;
			}

			& > * {
				padding-bottom: 2.7rem;
			}

			& > .left {
				width: 15vw !important;
			}
			& > .center {
				width: 33vw !important;
			}
			& > .right {
				/* width: 50vw !important; */
			}
		}

		& > .line {
			& > * {
				position: absolute;
				top: calc(50vh - 0.75rem);

				background-color: white;
				mix-blend-mode: difference;
				height: 1.4rem;
			}
			& > .left {
				left: var(--space-s);
				width: calc(33.5vw - 2 * var(--space-s));
			}

			& > .right {
				right: var(--space-s);
				width: calc(34.25vw - 2 * var(--space-s));
			}
		}
	}
</style>
