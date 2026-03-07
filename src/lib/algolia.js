import { liteClient as algoliasearch } from 'algoliasearch/lite'

const appId = import.meta.env.VITE_ALGOLIA_APP_ID || ''
const apiKey = import.meta.env.VITE_ALGOLIA_SEARCH_KEY || ''
const indexName = import.meta.env.VITE_ALGOLIA_INDEX_NAME || 'muridata'

export const searchClient = appId && apiKey ? algoliasearch(appId, apiKey) : null
export { indexName }
