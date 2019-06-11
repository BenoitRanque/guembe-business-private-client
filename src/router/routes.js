
const routes = [
  {
    path: '/',
    component: () => import('layouts/UserLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'listings', component: () => import('pages/Listings.vue'), meta: { requireAuthentication: true } },
      { path: 'listing/:listingId', props: true, component: () => import('pages/Listing.vue'), meta: { requireAuthentication: true } },
      { path: 'products', component: () => import('pages/Products.vue'), meta: { requireAuthentication: true } },
      { path: 'product/:productId', props: true, component: () => import('pages/Product.vue'), meta: { requireAuthentication: true } },
      { path: 'lifetimes', component: () => import('pages/Lifetimes.vue'), meta: { requireAuthentication: true } },
      { path: 'lifetime/:lifetimeId', props: true, component: () => import('pages/Lifetime.vue'), meta: { requireAuthentication: true } },
      { path: 'holidays', component: () => import('pages/Holidays.vue'), meta: { requireAuthentication: true } },
      { path: 'holiday/:holidayId', props: true, component: () => import('pages/Holiday.vue'), meta: { requireAuthentication: true } },
      { path: 'purchases', component: () => import('pages/Purchases.vue'), meta: { requireAuthentication: true } },
      { path: 'purchase/:purchaseId', props: true, component: () => import('pages/Purchase.vue'), meta: { requireAuthentication: true } },
      { path: 'purchase/:purchaseId/purchasedproducts', props: true, component: () => import('pages/PurchasedProducts.vue'), meta: { requireAuthentication: true } },
      { path: 'purchase/:purchaseId/invoices', props: true, component: () => import('pages/Invoices.vue'), meta: { requireAuthentication: true } },
      { path: 'purchasedproducts', component: () => import('pages/PurchasedProducts.vue'), meta: { requireAuthentication: true } },
      { path: 'purchasedproducts/use', component: () => import('pages/PurchasedProductUse.vue'), meta: { requireAuthentication: true } },
      { path: 'invoices', component: () => import('pages/Invoices.vue'), meta: { requireAuthentication: true } },
      { path: 'invoice/:invoiceId', props: true, component: () => import('pages/Invoice.vue'), meta: { requireAuthentication: true } },
      { path: 'clients', component: () => import('pages/Clients.vue'), meta: { requireAuthentication: true } },
      { path: 'client/:clientId', props: true, component: () => import('pages/Client.vue'), meta: { requireAuthentication: true } },
      { path: 'client/:clientId/invoices', props: true, component: () => import('pages/Invoices.vue'), meta: { requireAuthentication: true } },
      { path: 'client/:clientId/purchases', props: true, component: () => import('pages/Purchases.vue'), meta: { requireAuthentication: true } },
      { path: 'client/:clientId/purchasedproducts', props: true, component: () => import('pages/PurchasedProducts.vue'), meta: { requireAuthentication: true } },
      { path: 'client/:clientId/purchasedproducts/usable', props: true, component: () => import('pages/PurchasedProductUsable.vue'), meta: { requireAuthentication: true } },
      { path: 'client/:clientId/purchasedproducts/use', props: true, component: () => import('pages/PurchasedProductUse.vue'), meta: { requireAuthentication: true } },

      { path: 'website', props: true, component: () => import('pages/Website.vue'), meta: { requireAuthentication: true } },
      { path: 'website/test/:path(.*)?', props: true, component: () => import('pages/WebsitePage.vue'), meta: { requireAuthentication: true } }
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
