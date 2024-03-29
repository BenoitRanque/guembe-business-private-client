// import something here

// leave the export, even if you don't use it
export default async ({ app, router, Vue, store }) => {
  // something to do
  router.beforeEach((to, from, next) => {
    if (to.meta.requireAuthentication && !store.getters['isAuthenticated']) {
      if (router.app) {
        console.log(router.app)
        router.app.$root.$emit('AUTHENTICATION_REQUIRED')
      }
      next('/')
    } else {
      next()
    }
  })
}
