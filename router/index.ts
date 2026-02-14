import type { RouteRecordRaw } from 'vue-router'

const rssWatcherRoutes: RouteRecordRaw[] = [
  {
    path: '/rss-feeds',
    name: 'rss-feeds',
    component: () => import('../views/feed/RssFeedIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/rss-feeds/create',
    name: 'rss-feed-create',
    component: () => import('../views/feed/RssFeedCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/rss-feeds/:id/edit',
    name: 'rss-feed-edit',
    component: () => import('../views/feed/RssFeedEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/rss-items',
    name: 'rss-items',
    component: () => import('../views/item/RssFeedItemIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/rss-items/:id',
    name: 'rss-item-view',
    component: () => import('../views/item/RssFeedItemView.vue'),
    meta: { requiresAuth: true }
  },
]

export default rssWatcherRoutes

