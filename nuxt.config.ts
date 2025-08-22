
export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  css: ['assets/styles/main.scss'],
  app: {
    head: {
      title: 'Список квартир',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ]
    }
  },
  devtools: { enabled: true }
})
