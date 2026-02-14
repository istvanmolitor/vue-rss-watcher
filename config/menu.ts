import { Rss } from 'lucide-vue-next'
import type { MenuItemConfig } from '@menu/index'

/**
 * RSS Watcher package menu configuration
 * Defines the menu structure for RSS feed management features
 */
export const rssWatcherMenuConfig: MenuItemConfig = {
  id: 'rss-watcher',
  title: 'RSS Figyelő',
  icon: Rss,
  order: 30,
  children: [
    {
      id: 'rss-feeds',
      title: 'RSS Feedek',
      path: '/rss-feeds',
      order: 10
    },
    {
      id: 'rss-items',
      title: 'RSS Elemek',
      path: '/rss-items',
      order: 20
    }
  ]
}

export default rssWatcherMenuConfig

