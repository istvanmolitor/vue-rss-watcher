# Vue RSS Watcher

RSS Feed watching package for Vue 3 applications.

## Features

- RSS Feed management (CRUD operations)
- RSS Feed Items listing and viewing
- Pagination and filtering
- Search functionality
- Composable hooks for easy integration

## Installation

This package is part of a monorepo and should be installed automatically.

## Usage

### Import the package

```typescript
import { 
  useRssFeeds, 
  useRssFeedItems,
  rssFeedService,
  rssFeedItemService,
  router as rssWatcherRouter,
  rssWatcherMenuConfig 
} from '@/packages/vue-rss-watcher'
```

### Using Composables

#### RSS Feeds

```vue
<script setup>
import { useRssFeeds } from '@/packages/vue-rss-watcher'

const {
  feeds,
  loading,
  fetchFeeds,
  createFeed,
  updateFeed,
  deleteFeed
} = useRssFeeds()

// Fetch feeds
await fetchFeeds()
</script>
```

#### RSS Feed Items

```vue
<script setup>
import { useRssFeedItems } from '@/packages/vue-rss-watcher'

const {
  items,
  loading,
  fetchItems,
  deleteItem,
  setFeedFilter
} = useRssFeedItems()

// Fetch items for a specific feed
setFeedFilter(1)
await fetchItems()
</script>
```

### Using Services Directly

```typescript
import { rssFeedService, rssFeedItemService } from '@/packages/vue-rss-watcher'

// Create a feed
const feed = await rssFeedService.create({
  name: 'Tech News',
  url: 'https://example.com/feed.xml',
  enabled: true
})

// Get items
const items = await rssFeedItemService.getAll({
  feed_id: 1,
  search: 'technology'
})
```

## Routes

The package provides the following routes:

- `/rss-feeds` - List all RSS feeds
- `/rss-feeds/create` - Create new RSS feed
- `/rss-feeds/:id/edit` - Edit RSS feed
- `/rss-items` - List all RSS items
- `/rss-items/:id` - View RSS item details

## Menu Integration

The package exports menu configuration that can be integrated with the menu system:

```typescript
import { rssWatcherMenuConfig, rssWatcherMenuBuilder } from '@/packages/vue-rss-watcher'

// Use the menu config or builder as needed
```

## API

### Types

#### RssFeed

```typescript
interface RssFeed {
  id: number
  name: string
  url: string
  enabled: boolean
  last_fetched_at: string | null
  created_at: string
  updated_at: string
  items_count?: number
}
```

#### RssFeedItem

```typescript
interface RssFeedItem {
  id: number
  rss_feed_id: number
  guid: string
  title: string
  link: string
  description: string | null
  image: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  feed?: RssFeed
}
```

