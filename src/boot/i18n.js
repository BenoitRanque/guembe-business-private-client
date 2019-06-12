export default ({ app, router, store, Vue }) => {
  Vue.prototype.$i18n = function (obj, prop) {
    try {
      return obj.i18n[0][prop]
    } catch (error) {
      throw new Error(`Could not extract translation ${prop} from object ${obj}`)
    }
  }
}
