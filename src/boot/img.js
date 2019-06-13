const baseURL = 'https://chuturubi.com'
function src (image_id, size = 'lg') {
  return `${baseURL}/uploads/image/${image_id}.${size}.jpg`
}

function srcset (image) {
  return image.image_format.image_format_sizes
    .map(({ size_id, width }) => `${src(image.image_id, size_id)} ${width}w`)
    .join(', ')
}

export default ({ app, router, store, Vue }) => {
  Vue.prototype.$img = {
    src,
    srcset
  }
}