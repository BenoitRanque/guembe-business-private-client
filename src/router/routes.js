
const routes = [
  {
    path: '/',
    component: () => import('layouts/UserLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'listings', component: () => import('pages/Listings.vue'), meta: { requireAuthentication: true } },
      { path: 'listing', component: () => import('pages/CreateListing.vue'), meta: { requireAuthentication: true } },
      { path: 'listing/:listingId', props: true, component: () => import('pages/Listing.vue'), meta: { requireAuthentication: true } },
      { path: 'products', component: () => import('pages/Products.vue'), meta: { requireAuthentication: true } },
      { path: 'product', component: () => import('pages/CreateProduct.vue'), meta: { requireAuthentication: true } },
      { path: 'product/:productId', props: true, component: () => import('pages/Product.vue'), meta: { requireAuthentication: true } },
      { path: 'lifetimes', component: () => import('pages/Lifetimes.vue'), meta: { requireAuthentication: true } },
      { path: 'lifetime', component: () => import('pages/CreateLifetime.vue'), meta: { requireAuthentication: true } },
      { path: 'lifetime/:lifetimeId', props: true, component: () => import('pages/Lifetime.vue'), meta: { requireAuthentication: true } }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
