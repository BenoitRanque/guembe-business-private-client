
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
      { path: 'lifetime/:lifetimeId', props: true, component: () => import('pages/Lifetime.vue'), meta: { requireAuthentication: true } },
      { path: 'holidays', component: () => import('pages/Holidays.vue'), meta: { requireAuthentication: true } },
      { path: 'holiday', component: () => import('pages/CreateHoliday.vue'), meta: { requireAuthentication: true } },
      { path: 'holiday/:holidayId', props: true, component: () => import('pages/Holiday.vue'), meta: { requireAuthentication: true } },
      { path: 'client', component: () => import('pages/ClientIdentification.vue'), meta: { requireAuthentication: true } },
      { path: 'clients', component: () => import('pages/Clients.vue'), meta: { requireAuthentication: true } },
      { path: 'client/:clientId', props: true, component: () => import('pages/Client.vue'), meta: { requireAuthentication: true } },
      { path: 'client/:clientId/purchases', props: true, component: () => import('pages/Client.vue'), meta: { requireAuthentication: true } },
      { path: 'client/:clientId/products', props: true, component: () => import('pages/Client.vue'), meta: { requireAuthentication: true } },
      { path: 'client/:clientId/product/:productId', props: true, component: () => import('pages/Client.vue'), meta: { requireAuthentication: true } },
      { path: 'client/:clientId/products/usable', props: true, component: () => import('pages/ClientProductUsable.vue'), meta: { requireAuthentication: true } }
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
