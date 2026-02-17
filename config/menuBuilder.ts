import { MenuBuilder, type MenuItemConfig } from '@menu/types/menu'
import { Rss, Radio, List } from 'lucide-vue-next'

/**
 * RSS Watcher Menu Builder
 * Builds the RSS Watcher menu structure
 */
export class RssWatcherMenuBuilder extends MenuBuilder {
  build(menu: MenuItemConfig, menuName: string): MenuItemConfig {
    if (menuName === 'settings') {
      return this.buildMainMenu(menu)
    }
    return menu
  }

  /**
   * Build main menu items
   */
  private buildMainMenu(menu: MenuItemConfig): MenuItemConfig {
    // Add RSS Watcher section to the menu
    const rssSection: MenuItemConfig = {
      id: 'rss-watcher',
      title: 'RSS Figyelő',
      icon: Rss,
      order: 30,
      children: [
        {
          id: 'rss-feeds',
          title: 'RSS Feedek',
          path: '/rss-feeds',
          icon: Radio,
          order: 10
        },
        {
          id: 'rss-items',
          title: 'RSS Elemek',
          path: '/rss-items',
          icon: List,
          order: 20
        }
      ]
    }

    this.addMenuItem(menu, rssSection)

    return menu
  }
}

// Export singleton instance
export const rssWatcherMenuBuilder = new RssWatcherMenuBuilder()

