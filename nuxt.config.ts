// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: false },
	css: ['~/assets/css/index.css'],
	app: {
		baseURL: '/gd-24-theses/',
		pageTransition: {
			name: 'fade',
			mode: 'out-in',
		},
		layoutTransition: {
			name: 'fade',
			mode: 'out-in',
		},
		head: {
			link: [
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: '/gd-24-theses/favicon.ico',
				},
			],
		},
	},
	modules: ['@vueuse/nuxt', '@nuxt/image', '@nuxt/content', 'nuxt-marquee'],
	ssr: true,
})
