import { ref, watch } from 'vue'

interface SearchOptions {
  debounceMs?: number
  minLength?: number
  caseSensitive?: boolean
  exactMatch?: boolean
  fuzzySearch?: boolean
  highlightMatches?: boolean
  searchFields?: string[]
  maxResults?: number
}

interface SearchResult<T> {
  item: T
  score: number
  matches: SearchMatch[]
  highlightedText?: string
}

interface SearchMatch {
  field: string
  value: string
  startIndex: number
  endIndex: number
}

interface SearchIndex {
  [key: string]: {
    [field: string]: string[]
  }
}

class AdvancedSearchService {
  private searchIndex: SearchIndex = {}
  private readonly debounceTimers = new Map<string, ReturnType<typeof setTimeout>>()
  private readonly defaultOptions: Required<SearchOptions> = {
    debounceMs: 300,
    minLength: 2,
    caseSensitive: false,
    exactMatch: false,
    fuzzySearch: true,
    highlightMatches: true,
    searchFields: [],
    maxResults: 100
  }

  /**
   * Build search index for a collection of items
   */
  buildIndex<T>(items: T[], keyField: string = 'id', searchFields: string[] = []): void {
    this.searchIndex = {}
    
    for (const item of items) {
      const key = (item as any)[keyField]
      if (!key) continue
      
      this.searchIndex[key] = {}
      
      // If no search fields specified, use all string fields
      const fieldsToIndex = searchFields.length > 0 ? searchFields : this.getSearchableFields(item)
      
      for (const field of fieldsToIndex) {
        const value = this.getNestedValue(item, field)
        if (typeof value === 'string') {
          this.searchIndex[key][field] = this.tokenize(value)
        }
      }
    }
  }

  /**
   * Search with debouncing
   */
  searchDebounced<T>(
    query: string,
    items: T[],
    callback: (results: SearchResult<T>[]) => void,
    options: SearchOptions = {}
  ): void {
    const opts = { ...this.defaultOptions, ...options }
    const searchKey = `search-${JSON.stringify(opts)}`
    
    // Clear existing timer
    if (this.debounceTimers.has(searchKey)) {
      const existing = this.debounceTimers.get(searchKey)
      if (existing) clearTimeout(existing)
    }
    
    // Set new timer
    const timer = setTimeout(() => {
      const results = this.search(query, items, opts)
      callback(results)
      this.debounceTimers.delete(searchKey)
    }, opts.debounceMs)
    
    this.debounceTimers.set(searchKey, timer)
  }

  /**
   * Perform search on items
   */
  search<T>(query: string, items: T[], options: SearchOptions = {}): SearchResult<T>[] {
    const opts = { ...this.defaultOptions, ...options }
    
    if (query.length < opts.minLength) {
      return []
    }
    
    const results: SearchResult<T>[] = []
    const searchTerms = this.tokenize(query)
    
    for (const item of items) {
      const result = this.searchItem(item, searchTerms, opts)
      if (result.score > 0) {
        results.push(result)
      }
    }
    
    // Sort by score (highest first)
    results.sort((a, b) => b.score - a.score)
    
    // Limit results
    return results.slice(0, opts.maxResults)
  }

  /**
   * Search a single item
   */
  private searchItem<T>(item: T, searchTerms: string[], options: Required<SearchOptions>): SearchResult<T> {
    const matches: SearchMatch[] = []
    let totalScore = 0
    const searchFields = options.searchFields.length > 0 ? options.searchFields : this.getSearchableFields(item)
    
    for (const field of searchFields) {
      const value = this.getNestedValue(item, field)
      if (typeof value !== 'string') continue
      
      const fieldMatches = this.findMatches(value, searchTerms, field, options)
      matches.push(...fieldMatches)
      
      // Calculate score for this field
      const fieldScore = this.calculateFieldScore(value, searchTerms, options)
      totalScore += fieldScore
    }
    
    return {
      item,
      score: totalScore,
      matches,
      highlightedText: options.highlightMatches ? this.highlightText(item, matches) : undefined
    }
  }

  /**
   * Find matches in a text field
   */
  private findMatches(
    text: string,
    searchTerms: string[],
    field: string,
    options: Required<SearchOptions>
  ): SearchMatch[] {
    const matches: SearchMatch[] = []
    const searchText = options.caseSensitive ? text : text.toLowerCase()
    
    for (const term of searchTerms) {
      const searchTerm = options.caseSensitive ? term : term.toLowerCase()
      let startIndex = 0
      
      while (true) {
        const index = searchText.indexOf(searchTerm, startIndex)
        if (index === -1) break
        
        matches.push({
          field,
          value: text.substring(index, index + term.length),
          startIndex: index,
          endIndex: index + term.length
        })
        
        startIndex = index + 1
      }
    }
    
    return matches
  }

  /**
   * Calculate score for a field
   */
  private calculateFieldScore(text: string, searchTerms: string[], options: Required<SearchOptions>): number {
    let score = 0
    const searchText = options.caseSensitive ? text : text.toLowerCase()
    
    for (const term of searchTerms) {
      const searchTerm = options.caseSensitive ? term : term.toLowerCase()
      
      if (options.exactMatch) {
        if (searchText === searchTerm) {
          score += 100
        }
      } else if (searchText === searchTerm) {
        // Exact match gets highest score
        score += 100
      } else if (searchText.startsWith(searchTerm)) {
        // Starts with gets high score
        score += 80
      } else if (searchText.includes(searchTerm)) {
        // Contains gets medium score
        score += 60
      } else if (options.fuzzySearch && this.fuzzyMatch(searchText, searchTerm)) {
        // Fuzzy match gets lower score
        score += 30
      }
    }
    
    return score
  }

  /**
   * Simple fuzzy matching
   */
  private fuzzyMatch(text: string, pattern: string): boolean {
    let patternIdx = 0
    let textIdx = 0
    
    while (textIdx < text.length && patternIdx < pattern.length) {
      if (text[textIdx] === pattern[patternIdx]) {
        patternIdx++
      }
      textIdx++
    }
    
    return patternIdx === pattern.length
  }

  /**
   * Highlight matched text
   */
  private highlightText<T>(item: T, matches: SearchMatch[]): string {
    const fieldMatches = new Map<string, SearchMatch[]>()
    
    for (const match of matches) {
      if (!fieldMatches.has(match.field)) {
        fieldMatches.set(match.field, [])
      }
      fieldMatches.get(match.field)!.push(match)
    }
    
    const highlightedFields: string[] = []
    
    for (const [field, fieldMatchesArr] of fieldMatches.entries()) {
      const value = this.getNestedValue(item, field)
      if (typeof value === 'string') {
        let highlightedValue = value
        
        // Sort matches by start index (descending) to avoid index shifting
        const sortedMatches = [...fieldMatchesArr].sort((a, b) => b.startIndex - a.startIndex)
        
        for (const match of sortedMatches) {
          const before = highlightedValue.substring(0, match.startIndex)
          const matchText = highlightedValue.substring(match.startIndex, match.endIndex)
          const after = highlightedValue.substring(match.endIndex)
          
          highlightedValue = `${before}<mark class="search-highlight">${matchText}</mark>${after}`
        }
        
        highlightedFields.push(`${field}: ${highlightedValue}`)
      }
    }
    
    return highlightedFields.join(' | ')
  }

  /**
   * Tokenize text for searching
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter(token => token.length > 0)
      .map(token => token.replaceAll(/[^\w]/g, ''))
  }

  /**
   * Get nested value from object
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  /**
   * Get searchable fields from an object
   */
  private getSearchableFields(obj: any): string[] {
    const fields: string[] = []
    
    const traverse = (current: any, path: string = '') => {
      if (typeof current === 'object' && current !== null) {
        for (const key of Object.keys(current)) {
          const newPath = path ? `${path}.${key}` : key
          const value = current[key]
          
          if (typeof value === 'string') {
            fields.push(newPath)
          } else if (typeof value === 'object' && value !== null) {
            traverse(value, newPath)
          }
        }
      }
    }
    
    traverse(obj)
    return fields
  }

  /**
   * Clear debounce timers
   */
  clearDebounceTimers(): void {
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer)
    }
    this.debounceTimers.clear()
  }

  /**
   * Get search statistics
   */
  getStats(): any {
    return {
      indexedItems: Object.keys(this.searchIndex).length,
      activeTimers: this.debounceTimers.size
    }
  }
}

// Create singleton instance
export const advancedSearchService = new AdvancedSearchService()

// Search hook for Vue components
export function useAdvancedSearch<T>(items: T[] | (() => T[]), options: SearchOptions = {}) {
  const searchQuery = ref('')
  const searchResults = ref<SearchResult<T>[]>([])
  const isSearching = ref(false)
  const searchStats = ref({ totalResults: 0, searchTime: 0 })

  const getItems = () => {
    return typeof items === 'function' ? items() : items
  }

  const search = (query: string) => {
    if (query.length < (options.minLength || 2)) {
      searchResults.value = []
      return
    }

    isSearching.value = true
    const startTime = performance.now()

    advancedSearchService.searchDebounced(
      query,
      getItems(),
      (results) => {
        searchResults.value = results
        searchStats.value = {
          totalResults: results.length,
          searchTime: performance.now() - startTime
        }
        isSearching.value = false
      },
      options
    )
  }

  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
    isSearching.value = false
  }

  watch(searchQuery, (newQuery) => {
    search(newQuery)
  })

  return {
    searchQuery,
    searchResults,
    isSearching,
    searchStats,
    search,
    clearSearch
  }
}

export default advancedSearchService
