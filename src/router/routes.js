
const routes = [
  {
    path: '/',
    component: () => import('layouts/UserLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'listings', component: () => import('pages/Listings.vue') },
      { path: 'listing/:listingId', props: true, component: () => import('pages/Listing.vue') },
      { path: 'products', component: () => import('pages/Products.vue') },
      { path: 'product/:productId', props: true, component: () => import('pages/Product.vue') },
      { path: 'lifetimes', component: () => import('pages/Lifetimes.vue') },
      { path: 'lifetime/:lifetimeId', props: true, component: () => import('pages/Lifetime.vue') }
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
