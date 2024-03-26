<template>
	<ClientOnly>
		<div
			:style="[
				{ '--window-height': `${height}px` },
				{ '--cred-height': `${h}px` },
			]"
			id="index"
		>
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
					<div class="left">
						{{ mobile ? 'KABK GD' : 'KABK Graphic Design' }}
					</div>
					<div class="center">Graduation theses</div>
					<div class="right">2024</div>
					<div @click="showCredit = !showCredit" class="credit">
						{{ showCredit ? 'Close' : 'Credits' }}
					</div>
					<div v-if="showCredit" class="credits">
						Thesis Supervisors: Dirk Vis, Prof. Dr. Füsun Türetken<br />Visual
						Essay Supervisor: Bart de Baets<br />Coding Supervisors: Thomas
						Buxo, François Girard-Meunier<br />Website by Aliona Ciobanu,
						Bartosz Pierściński, Dans Jirgensons, Stefaniia Bodnia
						<!-- <div class="line">
							<div class="label">Thesis Supervisors</div>
							<div class="persons">
								<span class="person">Dirk Vis</span>
								<span class="person">Prof. Dr. Füsun Türetken</span>
							</div>
						</div>
						<div class="line">
							<div class="label">Visual Essay Supervisor</div>
							<div class="persons">
								<span class="person">Bart de Baets</span>
							</div>
						</div>
						<div class="line">
							<div class="label">Coding Supervisors</div>
							<div class="persons">
								<span class="person">Thomas Buxo</span>
								<span class="person">François Girard-Meunier</span>
							</div>
						</div>
						<div class="line">
							<div class="label">Website design</div>
							<div class="persons">
								<span class="person">Aliona Ciobanu</span>
								<span class="person">Bartek Pierściński</span>
								<span class="person">Dans Jirgensons</span>
								<span class="person">Stefaniia Bodnia</span>
							</div>
						</div> -->
					</div>
				</div>
				<div class="text">
					<div class="label">Abstract</div>
					<div class="text">
						{{ truncateString(data.data[globalSlide].abstract, 900) }}
					</div>
				</div>
			</div>

			<div class="landing" :class="{ hide: !landing }">
				<div class="content">
					<div class="left">
						{{ mobile ? 'KABK GD' : 'KABK Graphic Design' }}
					</div>
					<div class="center">Graduation theses</div>
					<div class="right">2024</div>
				</div>
			</div>
			<a
				:href="`https://kabk.github.io/${data.data[globalSlide].link}`"
				class="line"
				ref="line"
				:class="{ hide: !landing }"
				><div class="enter">↗</div></a
			>
			<a
				:href="`https://kabk.github.io/${data.data[globalSlide].link}`"
				class="mobilecontainer"
				ref="mobilecreds"
			>
				<div class="title">{{ data.data[globalSlide].title }}</div>
				<div class="abst">
					{{ truncateString(data.data[globalSlide].abstract, 140) }}
				</div>
			</a>
			<div v-if="showCredit" class="credits">
				Thesis Supervisors: Dirk Vis, Prof. Dr. Füsun Türetken<br />Visual Essay
				Supervisor: Bart de Baets<br />Coding Supervisors: Thomas Buxo, François
				Girard-Meunier<br />Website by Aliona Ciobanu, Bartosz Pierściński, Dans
				Jirgensons, Stefaniia Bodnia
				<!-- <div class="line">
					<div class="label">Thesis Supervisors</div>
					<div class="persons">
						<span class="person">Dirk Vis</span>
						<span class="person">Prof. Dr. Füsun Türetken</span>
					</div>
				</div>
				<div class="line">
					<div class="label">Visual Essay Supervisor</div>
					<div class="persons">
						<span class="person">Bart de Baets</span>
					</div>
				</div>
				<div class="line">
					<div class="label">Coding Supervisors</div>
					<div class="persons">
						<span class="person">Thomas Buxo</span>
						<span class="person">François Girard-Meunier</span>
					</div>
				</div>
				<div class="line">
					<div class="label">Website design</div>
					<div class="persons">
						<span class="person">Aliona Ciobanu</span>
						<span class="person">Bartek Pierściński</span>
						<span class="person">Dans Jirgensons</span>
						<span class="person">Stefaniia Bodnia</span>
					</div>
				</div>
				<div class="line">
					<div class="label">Website development</div>
					<div class="persons">
						<span class="person">Bartek Pierściński</span>
					</div>
				</div> -->
			</div>
		</div>
	</ClientOnly>
</template>

<script setup>
	const { data } = await useAsyncData('data', () =>
		queryContent('/data').findOne()
	)

	const { height } = useWindowSize()
	const { mobile } = useScreenSize()

	const line = ref(null)
	const mobilecreds = ref(null)

	const { height: h, top: t } = useElementBounding(mobilecreds)
	const { height: lineHeight, top: lineTop } = useElementBounding(line)

	const mobileContPos = computed(() => lineTop.value - h.value + 'px')
	// const mobileContTop = computed(() => t.value - 30 + 'px')
	const lineTopComp = computed(() => lineTop.value + 'px')
	const sortedNames = sortData(data.value.data, 'name')

	const landing = ref(true)
	const showCredit = ref(false)

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
			return 0
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
		globalSlide.value = i
	}

	onMounted(() => {
		setTimeout(() => {
			const activeel = document.querySelector('.names>.active-slide')
			const lineel = document.querySelector('a.line')
			const { top } = useElementBounding(activeel)
			console.log(activeel, lineel, top.value + 'px')
			lineel.style.top = top.value - 2 + 'px'
		}, 50)
	})
</script>

<style lang="postcss" scoped>
	#index {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		height: var(--window-height);
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
		& > .images {
			@media screen and (max-width: 640px) {
				height: v-bind(mobileContPos) !important;
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

				& > .credit {
					/* color: lightgrey; */
					cursor: pointer;
					user-select: none;
				}

				& > .right {
					@media screen and (max-width: 640px) {
						display: none;
					}
				}

				& > .credits {
					user-select: none;
					background-color: white;
					opacity: 1;
					@media screen and (max-width: 640px) {
						display: none;
					}

					& > .line {
						display: grid;
						grid-template-columns: 1fr 1fr;
						& > .persons {
							& > * {
								display: block;
							}
						}
					}
				}
			}

			& > .text {
				opacity: 1;
				display: flex;
				flex-direction: row;
				& > .label {
					min-width: calc(16vw);
				}

				& > .text {
					transition: opacity 0.3s ease;
					min-width: calc(16vw);
				}
				&.hide {
					& > .text {
						opacity: 0;
					}
				}
				@media screen and (max-width: 640px) {
					display: none;
				}
			}
			position: absolute;
			width: 50.5vw;
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
				width: calc(100vw);
				padding: var(--space-s);
				height: auto;
				padding-left: var(--space-m);
			}
		}
		& > .landing {
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			height: calc(100vh);
			display: flex;
			flex-direction: column;
			justify-content: center;
			pointer-events: none;
			padding: var(--space-m);
			padding-bottom: calc(2px + var(--space-m));
			background-color: white;
			transition: opacity 1s ease-in-out;
			z-index: 3;
			color: black;
			&.hide {
				opacity: 0;
			}
			& > .content {
				position: absolute;
				transform: translateY(2px);
				top: v-bind(lineTopComp);
				width: 100vw;
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
			padding-right: 5px;
			z-index: 5;

			&.hide {
				& > .enter {
					opacity: 1;
				}
			}

			& > .enter {
				opacity: 0;
				transition: opacity 0.7s ease;
			}

			@media screen and (max-width: 640px) {
				width: calc(100vw);
				top: calc(var(--window-height) * 0.586);
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
				top: v-bind(mobileContPos);
				left: 0;
				z-index: 1;
				background-color: white;
				& > .title {
					background-color: black;
					color: white;
					padding: var(--space-s) var(--space-m) 0 var(--space-m);
				}
				& > .abst {
					padding: var(--space-s) var(--space-m);
				}
			}
		}
		& > .credits {
			display: none;
			position: absolute;
			top: 1.8rem;
			left: 0;
			z-index: 1;
			user-select: none;
			background-color: white;
			opacity: 1;
			width: 100vw;
			padding-left: var(--space-m);

			& > .line {
				display: grid;
				grid-template-columns: 1fr 1fr;
				& > .persons {
					& > * {
						display: block;
					}
				}
			}
			@media screen and (max-width: 640px) {
				display: block;
			}
		}
	}

	.center {
		text-transform: capitalize;
	}
</style>
