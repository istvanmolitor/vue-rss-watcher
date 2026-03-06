import type { RouteRecordRaw } from 'vue-router'

const rssWatcherRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/rss-feed',
    name: 'rss-feeds',
    component: () => import('../views/feed/RssFeedIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/rss-feed/create',
    name: 'rss-feed-create',
    component: () => import('../views/feed/RssFeedCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/rss-feed/:id/edit',
    name: 'rss-feed-edit',
    component: () => import('../views/feed/RssFeedEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/rss-item',
    name: 'rss-items',
    component: () => import('../views/item/RssFeedItemIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/rss-item/:id',
    name: 'rss-item-view',
    component: () => import('../views/item/RssFeedItemView.vue'),
    meta: { requiresAuth: true }
  },
]

export default rssWatcherRoutes

