export default {
  components: true,
  env: {
    LIFF_ID: '1655089903-YawqnnaN',
    dev: process.env.NODE_ENV !== 'production',
    prjname: '森上梅友前',
    baseUrl: process.env.NODE_ENV === 'production'? '': 'https://nomoney.nlplab.cc'
  },
  buildModules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/page-transition.css']
}