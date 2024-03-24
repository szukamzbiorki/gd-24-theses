<template>
	<div id="index">
		<WheelNames
			:data="sortedNames"
			@slideChanged="slideChangedNames"
			ref="wheelNames"
			class="names"
		></WheelNames>
		<WheelTitles
			:data="sortedNames"
			:length="data.data?.length"
			ref="wheelTitles"
			@slideChanged="slideChangedTitles"
			class="titles"
		></WheelTitles>
		<WheelImages
			:data="sortedNames"
			:length="data.data?.length"
			ref="wheelImages"
			@slideChanged="slideChangedImages"
			class="images"
		></WheelImages>
		<div class="abstract">
			<div class="top">
				<div class="left">KABK Graphic Design</div>
				<div class="center">Graduation theses</div>
				<div class="right">2024</div>
			</div>
			<div class="text">
				{{ truncateString(data.data[globalSlide].abstract, 900) }}
			</div>
		</div>

		<div class="landing" :class="{ hide: !landing }">
			<div class="content">
				<div class="left">KABK Graphic Design</div>
				<div class="center">Graduation theses</div>
				<div class="right">2024</div>
			</div>
		</div>
		<a
			:href="`https://kabk.github.io/${data.data[globalSlide].link}`"
			class="line"
			><div class="enter">↗</div></a
		>
		<a
			:href="`https://kabk.github.io/${data.data[globalSlide].link}`"
			class="mobilecontainer"
		>
			<div class="title">{{ data.data[globalSlide].title }}</div>
			<div class="abst">
				{{ truncateString(data.data[globalSlide].abstract, 140) }}
			</div>
		</a>
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

	function truncateString(str, num) {
		if (str.length > num) {
			return str.slice(0, num) + '...'
		} else {
			return str
		}
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
			display: block;
		}
		& > .titles {
			display: block;
			@media screen and (max-width: 640px) {
				display: none;
			}
		}
		& > .abstract {
			& > .top {
				display: grid;
				grid-template-columns: 16vw 1fr auto;
				@media screen and (max-width: 640px) {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
				}
			}

			& > .text {
				transition: opacity 0.3s ease;
				opacity: 1;
				margin-left: calc(15.8vw);
				&.hide {
					opacity: 0;
				}
				@media screen and (max-width: 640px) {
					display: none;
				}
			}
			position: absolute;
			width: 50vw;
			height: calc(50vh - 0.7rem);
			text-overflow: ellipsis;
			overflow: hidden;
			left: 0;
			padding: var(--space-m) 0 0 var(--space-m);
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding-bottom: 3px;
			background-color: white;
			@media screen and (max-width: 640px) {
				width: calc(100vw - 2 * var(--space-m));
				height: auto;
			}
		}
		& > .landing {
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			height: calc(100vh);
			padding-bottom: 3rem;
			display: flex;
			flex-direction: column;
			justify-content: center;
			pointer-events: none;
			padding: var(--space-m);
			background-color: white;
			transition: opacity 1s ease-in-out;
			color: black;
			&.hide {
				opacity: 0;
			}
			& > .content {
				display: grid;
				grid-template-columns: 16vw 1fr auto;
				max-width: calc(50vw - var(--space-s));
				& > * {
					/* padding-bottom: 2.7rem; */
					display: inline-block;
				}
				@media screen and (max-width: 640px) {
					max-width: calc(100vw - 2 * var(--space-m));
					display: flex;
					flex-direction: row;
					justify-content: space-between;
				}
			}
		}

		& > .line {
			color: black;
			text-decoration: none;
			position: absolute;
			top: calc(50vh - 0.82rem);
			background-color: white;
			mix-blend-mode: difference;
			height: 1.4rem;
			left: var(--space-s);
			width: calc(50vw);
			cursor: pointer;
			transition: width 0.7s ease;
			display: flex;
			flex-direction: row-reverse;
			padding-top: 1.7px;
			/* padding-right: 2.8px; */

			& > .enter {
				aspect-ratio: 1;
				/* background-image: url('arrow.svg'); */
				/* filter: invert(); */
				opacity: 1;
				transition: opacity 0.7s ease;
			}

			@media screen and (max-width: 640px) {
				width: calc(100vw);
				top: 52vh;
				left: 0;
			}
		}

		& > .mobilecontainer {
			display: none;
			color: black;
			text-decoration: none;
			@media screen and (max-width: 640px) {
				display: block;
				position: absolute;
				bottom: 48vh;
				left: 0;
				z-index: 1;
				background-color: white;
				& > .title {
					background-color: black;
					color: white;
					padding: var(--space-s) var(--space-m);
				}
				& > .abst {
					padding: var(--space-s) var(--space-m);
				}
			}
		}
	}
</style>
