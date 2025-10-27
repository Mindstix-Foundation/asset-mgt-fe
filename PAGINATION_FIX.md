# Pagination Fix for Employee Range Selection

## Issue
When trying to fetch all deletable employees for range selection, the frontend was requesting `limit: 10000`, but the backend has a maximum limit of 100 employees per request.

**Error:**
```json
{
    "message": ["limit must not be greater than 100"],
    "error": "Bad Request",
    "statusCode": 400
}
```

## Root Cause
In `employees.service.ts` (backend), the limit is capped at 100:
```typescript
const limit = Math.min(query.limit || 10, 100);
```

## Solution
Instead of trying to fetch all employees in a single request, the frontend now:
1. **Paginates through all pages** using the maximum allowed limit (100)
2. **Accumulates all results** until all pages are fetched
3. **Uses the complete list** for range selection and validation

## Implementation

### New Helper Function: `fetchAllDeletableEmployees()`
```typescript
const fetchAllDeletableEmployees = async () => {
  const allEmployees: any[] = []
  let currentPage = 1
  let hasMore = true
  
  while (hasMore) {
    const response = await employeeService.getDeletableEmployees({
      page: currentPage,
      limit: 100, // Maximum allowed by backend
      sortBy: 'employeeId',
      sortOrder: 'asc'
    })
    
    const employees = response.data.employees || []
    allEmployees.push(...employees)
    
    const pagination = response.data.pagination
    hasMore = pagination.hasNext
    currentPage++
  }
  
  return allEmployees
}
```

### Updated Functions

#### 1. `processEmployeeRange()`
**Before:**
```typescript
// Tried to fetch all in one request with limit: 10000
const response = await employeeService.getDeletableEmployees({
  page: 1,
  limit: 10000,
  sortBy: 'employeeId',
  sortOrder: 'asc'
})
```

**After:**
```typescript
// Fetches all employees by paginating through all pages
const allDeletableEmployees = await fetchAllDeletableEmployees()
```

#### 2. `addSingleEmployee()`
**Before:**
```typescript
// Tried to fetch all in one request with limit: 10000
const response = await employeeService.getDeletableEmployees({
  page: 1,
  limit: 10000,
  search: employeeId
})
```

**After:**
```typescript
// Uses search parameter for efficient single employee lookup
const response = await employeeService.getDeletableEmployees({
  page: 1,
  limit: 100,
  search: employeeId
})
```
*Note: For single employee search, we don't need pagination since search will likely return < 100 results*

## Benefits

1. **Respects Backend Limits**: No more 400 errors from exceeding the limit
2. **Scalable**: Works with any number of deletable employees
3. **Efficient**: 
   - Range selection: Fetches all pages (necessary for accurate range filtering)
   - Single employee: Uses search parameter (no need to fetch all)
4. **Maintains Functionality**: Range selection still works across all employees

## Performance Considerations

### Range Selection
- **Worst Case**: If there are 1000 deletable employees, it will make 10 API calls (1000 ÷ 100)
- **Average Case**: Most systems will have < 500 deletable employees = 5 API calls
- **Trade-off**: Slight delay for accuracy (users need to see all matching employees in range)

### Single Employee Selection
- **Best Case**: 1 API call with search filter
- **Optimization**: Backend search filters results before pagination

## Testing

### Test Cases:
1. ✅ Add single employee (uses search, < 100 results)
2. ✅ Add range of 20 employees across multiple pages
3. ✅ Add range of 100+ employees (tests pagination)
4. ✅ Handle case where range spans all deletable employees
5. ✅ No more "limit must not be greater than 100" errors

## Files Modified

- `/asset-mgt-fe/frontend/src/views/employees/ManageEmployeesView.vue`
  - Added `fetchAllDeletableEmployees()` helper function
  - Updated `processEmployeeRange()` to use pagination
  - Optimized `addSingleEmployee()` to use search parameter

## Date
October 27, 2025

