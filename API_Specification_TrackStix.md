# TrackStix: Asset Management System - API Specification

**Version:** 1.0  
**Prepared For:** Mindstix Software Labs  
**Document Type:** API Specification

---

## Document Information

- **Project Name**: TrackStix - Asset Management System  
- **API Version**: v1.0  
- **Base URL**: `https://api.trackstix.mindstix.com/v1`  
- **Authentication**: Bearer Token (JWT)  
- **Content Type**: application/json
- **Response Format**: Consistent structure with `message` and `data` fields
- **ID Format**: Custom IDs (asset_id, employee_id) are strings for flexibility

| Version | Date | Author | Description |
| :---- | :---- | :---- | :---- |
| 1.0 | 28-Aug-2024 | Uday Narsale Nishant Bondre | Initial draft |
| 1.1 | 29-Aug-2024 | System | Schema-aligned corrections |
| 1.2 | 29-Aug-2024 | System | Added missing lookup/reference APIs and search functionality |
| 1.3 | 29-Aug-2024 | System | Added CREATE APIs for "Add New" dropdown functionality |

|| 1.4 | [Current Date] | System | Updated to consistent response structure and string IDs per feedback |

## Table of content

[**1. User Authentication	2**](#1.-user-authentication)

[**2. Get Dashboard Statistics	3**](#2.-get-dashboard-statistics)

[**3. Get All Assets	4**](#3.-get-all-assets)

[**4. Create Asset	5**](#4.-create-asset)

[**5. Get All Employees	7**](#5.-get-all-employees)

[**6. Create Employee	8**](#6.-create-employee)

[**7. Assign Asset to Employee	9**](#7.-assign-asset-to-employee)

[**8. Collect Asset from Employee	10**](#8.-collect-asset-from-employee)

[**9. Get Inventory Overview	12**](#9.-get-inventory-overview)

[**10. Create Maintenance Schedule	13**](#10.-create-maintenance-schedule)

[**11. Generate Report	14**](#11.-generate-report)

[**12. Bulk Upload Assets	15**](#12.-bulk-upload-assets)

[**13. Get Asset Categories	16**](#13.-get-asset-categories)

[**14. Get Asset Types	17**](#14.-get-asset-types)

[**15. Get Brands	18**](#15.-get-brands)

[**16. Get Models	19**](#16.-get-models)

[**17. Get Vendors	20**](#17.-get-vendors)

[**18. Get Maintenance Types	21**](#18.-get-maintenance-types)

[**19. Get Available Assets	22**](#19.-get-available-assets)

[**20. Get Active Assignments	23**](#20.-get-active-assignments)

[**21. Search Assets	24**](#21.-search-assets)

[**22. Search Employees	25**](#22.-search-employees)

[**23. Create Asset Category	26**](#23.-create-asset-category)

[**24. Create Asset Type	27**](#24.-create-asset-type)

[**25. Create Brand	28**](#25.-create-brand)

[**26. Create Model	29**](#26.-create-model)

[**27. Create Vendor	30**](#27.-create-vendor)

[**Glossary	31**](#glossary)

---

# 1. User Authentication {#1.-user-authentication}

User login authentication with role-based access

| Method | URL |
| :---- | :---- |
| **POST** | api/auth/login |

## **Request**

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | api_key | string |
| POST | username | string |
| POST | password | string |

**api_key**  
api_key must be sent with all client requests. The api_key helps the server to validate the request source.

## **Response**

| Status | Response |
| :---- | :---- |
| 200 | { "message": "Authentication successful", "data": { "auth_key": \<auth_key\>, "user": { "id": "usr_001", "username": "string", "role": "admin\|manager\|employee", "permissions": \["array_of_permissions"\] } } } auth_key (**string**) - all further API calls must have this key in header |
| 403 | { "message": "Forbidden", "error": "API key is missing." } |
| 400 | { "message": "Bad Request", "error": "Please provide username." } |
| 400 | { "message": "Bad Request", "error": "Please provide password." } |
| 401 | { "message": "Unauthorized", "error": "Invalid API key." } |
| 401 | { "message": "Unauthorized", "error": "Incorrect username or password." } |
| 500 | { "message": "Internal Server Error", "error": "Something went wrong. Please try again later." } |

---

# 2. Get Dashboard Statistics {#2.-get-dashboard-statistics}

Get real-time dashboard statistics and KPIs

## **Request**

| Method | URL |
| :---- | :---- |
| **GET** | api/dashboard/stats |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| GET | dateRange | string [optional] |

**auth_key**  
The auth_key that was given in response to /api/auth/login

**dateRange**  
Optional date range for statistics filtering (e.g., "30d", "7d", "1m")

## **Response**

| Status | Response |
| :---- | :---- |
| 200 | { "message": "Dashboard statistics retrieved successfully", "data": { "total_assets": { "count": 1247, "trend": 8.5 }, "available_assets": { "count": 312, "percentage": 25.0, "trend": 5.7 }, "assigned_assets": { "count": 892, "percentage": 71.5, "trend": 12.3 }, "in_maintenance": { "count": 43, "percentage": 3.4, "trend": -2.1 }, "retired_assets": { "count": 0, "percentage": 0.0, "trend": 0.0 } } } |
| 400 | { "message": "Bad Request", "error": "Invalid date range format." } |
| 401 | {"error":"Invalid auth key."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 3. Get All Assets {#3.-get-all-assets}

Get all assets with pagination and filtering

## **Request**

| Method | URL |
| :---- | :---- |
| **GET** | api/assets |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| GET | page | number [**1**] |
| GET | limit | number [**10**] |
| GET | search | string [optional] |
| GET | category_id | integer [optional] |
| GET | asset_type_id | integer [optional] |
| GET | brand_id | integer [optional] |
| GET | status | string [optional] |
| GET | condition | string [optional] |

**page**  
Page number for pagination (default: 1)

**limit**  
Number of items per page (default: 10, max: 100)

**search**  
Search term for asset_id, serial_number, or location

**category_id**  
Filter by asset category ID (from asset_categories table)

**asset_type_id**  
Filter by asset type ID (from asset_types table)

**brand_id**  
Filter by brand ID (from brands table)

**status**  
Filter by asset status (AVAILABLE|ASSIGNED|IN_MAINTENANCE|RETIRED|LOST)

**condition**  
Filter by asset condition (NEW|GOOD|FAIR|POOR|DAMAGED)

## **Response**

| Status | Response |
| :---- | :---- |
| 200 | { "message": "Assets retrieved successfully", "data": { "assets": [ { "id": "string", "asset_id": "AST-001", "asset_type_id": 1, "brand_id": 1, "model_id": 1, "serial_number": "SERIAL123", "purchase_date": "2024-01-15", "purchase_cost": 2500.00, "vendor_id": 1, "warranty_start_date": "2024-01-15", "warranty_end_date": "2027-01-15", "location": "Warehouse A", "condition": "NEW", "status": "AVAILABLE", "notes": "New laptop for development team", "qr_code": "QR123456", "image_url": "https://example.com/asset.jpg", "created_at": "2024-01-15T10:30:00Z", "category_name": "Electronics", "type_name": "Laptop", "brand_name": "Apple", "model_name": "MacBook Pro 16\"", "vendor_name": "Apple Store" } ], "pagination": { "total_count": 1247, "current_page": 1, "total_pages": 125, "has_next": true, "has_previous": false } } } |
| 400 | {"error":"Invalid page number."} |
| 400 | {"error":"Invalid limit value."} |
| 401 | {"error":"Invalid auth key."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 4. Create Asset {#4.-create-asset}

Register a new asset in the system

## **Request**

| Method | URL |
| :---- | :---- |
| **POST** | api/assets |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| POST | asset_type_id | integer |
| POST | brand_id | integer |
| POST | model_id | integer |
| POST | serial_number | string |
| POST | purchase_date | date [optional] |
| POST | purchase_cost | decimal [optional] |
| POST | vendor_id | integer [optional] |
| POST | warranty_start_date | date [optional] |
| POST | warranty_end_date | date [optional] |
| POST | location | text [optional] |
| POST | condition | NEW\|GOOD\|FAIR\|POOR\|DAMAGED [**NEW**] |
| POST | status | AVAILABLE\|ASSIGNED\|IN_MAINTENANCE\|RETIRED\|LOST [**AVAILABLE**] |
| POST | notes | text [optional] |
| POST | qr_code | string [optional] |
| POST | image_url | string [optional] |

**asset_id**  
Auto-generated in format AST-001, AST-002, etc.

**asset_type_id**  
Foreign key reference to asset_types table (required)

**brand_id**  
Foreign key reference to brands table (required)

**model_id**  
Foreign key reference to models table (required)

**serial_number**  
Unique manufacturer serial number (required)

## **Response**

| Status | Response |
| :---- | :---- |
| 201 | { "message": "Asset created successfully", "data": { "asset": { "id": "generated_id", "asset_id": "AST-1248", "asset_type_id": 1, "brand_id": 1, "model_id": 5, "serial_number": "ABC123XYZ", "status": "AVAILABLE", "condition": "NEW", "created_at": "2024-08-08T10:30:00Z" } } } |
| 400 | {"error":"Asset type ID is required."} |
| 400 | {"error":"Serial number already exists."} |
| 400 | {"error":"Invalid asset_type_id."} |
| 400 | {"error":"Invalid brand_id."} |
| 400 | {"error":"Invalid model_id."} |
| 401 | {"error":"Invalid auth key."} |
| 403 | {"error":"Admin access required."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 5. Get All Employees {#5.-get-all-employees}

Get all employees with their assigned assets

## **Request**

| Method | URL |
| :---- | :---- |
| **GET** | api/employees |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| GET | page | number [**1**] |
| GET | limit | number [**10**] |
| GET | search | string [optional] |

**search**  
Search by employee name, employee_id, or email

## **Response**

| Status | Response |
| :---- | :---- |
| 200 | **Response contains array of employees** { "employees": [ { "id": "string", "employee_id": "EMP-001", "first_name": "John", "last_name": "Doe", "email": "john.doe@mindstix.com", "phone": "+91-9876543210", "date_of_birth": "1990-05-15", "address": "123 Main Street, Pune, Maharashtra", "created_at": "2022-01-15T10:30:00Z", "updated_at": "2024-01-15T10:30:00Z", "assigned_assets": ["AST-001", "AST-002"] } ], "total_count": 150, "pagination": { "current_page": 1, "total_pages": 15, "has_next": true, "has_previous": false } } |
| 401 | {"error":"Invalid auth key."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 6. Create Employee {#6.-create-employee}

Add a new employee to the system

## **Request**

| Method | URL |
| :---- | :---- |
| **POST** | api/employees |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| POST | first_name | string |
| POST | last_name | string |
| POST | email | string |
| POST | phone | string [optional] |
| POST | date_of_birth | date [optional] |
| POST | address | text [optional] |

**employee_id**  
Auto-generated in format EMP-001, EMP-002, etc.

**email**  
Must be unique in the system

## **Response**

| Status | Response |
| :---- | :---- |
| 201 | { "employee": { "id": "generated_id", "employee_id": "EMP-151", "first_name": "John", "last_name": "Doe", "email": "john.doe@mindstix.com", "created_at": "2024-08-08T10:30:00Z" } } |
| 400 | {"error":"First name is required."} |
| 400 | {"error":"Last name is required."} |
| 400 | {"error":"Email is required."} |
| 400 | {"error":"Email already exists."} |
| 401 | {"error":"Invalid auth key."} |
| 403 | {"error":"Admin access required."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 7. Assign Asset to Employee {#7.-assign-asset-to-employee}

Assign an available asset to an employee

## **Request**

| Method | URL |
| :---- | :---- |
| **POST** | api/assignments |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| POST | asset_id | integer |
| POST | employee_id | integer |
| POST | assigned_date | date |
| POST | expected_return_date | date [optional] |
| POST | assignment_reason | string [optional] |
| POST | notes | text [optional] |

**asset_id**  
ID of the asset to be assigned (must have AVAILABLE status)

**employee_id**  
ID of the employee to assign the asset to

## **Response**

| Status | Response |
| :---- | :---- |
| 201 | { "assignment": { "id": "generated_id", "asset_id": 1, "employee_id": 1, "assigned_date": "2024-08-08", "assignment_reason": "Work laptop", "is_active": true, "created_at": "2024-08-08T10:30:00Z" } } |
| 400 | {"error":"Asset ID is required."} |
| 400 | {"error":"Employee ID is required."} |
| 400 | {"error":"Employee not found."} |
| 400 | {"error":"Asset not available for assignment."} |
| 401 | {"error":"Invalid auth key."} |
| 403 | {"error":"Admin access required."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 8. Collect Asset from Employee {#8.-collect-asset-from-employee}

Collect an assigned asset from an employee (return process)

## **Request**

| Method | URL |
| :---- | :---- |
| **PUT** | api/assignments/\<assignment_id\>/return |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| URL_PARAM | \<assignment_id\> | integer |
| POST | return_date | date |
| POST | return_condition | GOOD\|FAIR\|POOR\|DAMAGED |
| POST | return_reason | string [optional] |
| POST | notes | text [optional] |

**assignment_id**  
ID of the assignment to return/collect

**return_condition**  
Condition of the asset when returned (ENUM from schema)

## **Response**

| Status | Response |
| :---- | :---- |
| 200 | { "assignment": { "id": "assignment_id", "asset_id": 1, "employee_id": 1, "return_date": "2024-08-08", "return_condition": "GOOD", "return_reason": "Employee Left", "is_active": false, "updated_at": "2024-08-08T10:30:00Z" } } |
| 400 | {"error":"Invalid assignment ID."} |
| 400 | {"error":"Return condition is required."} |
| 400 | {"error":"Invalid return condition."} |
| 404 | {"error":"Assignment not found."} |
| 401 | {"error":"Invalid auth key."} |
| 403 | {"error":"Admin access required."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 9. Get Inventory Overview {#9.-get-inventory-overview}

Get inventory statistics and available assets

## **Request**

| Method | URL |
| :---- | :---- |
| **GET** | api/inventory |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| GET | location | string [optional] |
| GET | category_id | integer [optional] |
| GET | status | AVAILABLE\|ASSIGNED [optional] |

## **Response**

| Status | Response |
| :---- | :---- |
| 200 | **Response contains inventory overview** { "summary": { "available_stock": 312, "assigned_stock": 892, "maintenance_stock": 43 }, "items": [ { "asset_id": "AST-100", "serial_number": "ABC123", "type_name": "Laptop", "brand_name": "Apple", "model_name": "MacBook Pro", "location": "Warehouse A", "status": "AVAILABLE", "condition": "NEW" } ], "locations": [ { "name": "Warehouse A", "count": 180 }, { "name": "Warehouse B", "count": 132 } ] } |
| 401 | {"error":"Invalid auth key."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 10. Create Maintenance Schedule {#10.-create-maintenance-schedule}

Schedule maintenance for an asset

## **Request**

| Method | URL |
| :---- | :---- |
| **POST** | api/maintenance/schedules |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| POST | asset_id | integer |
| POST | maintenance_type_id | integer |
| POST | scheduled_date | date |
| POST | description | text |
| POST | assigned_to | integer [optional] |
| POST | frequency_days | integer [optional] |

**maintenance_type_id**  
Foreign key reference to maintenance_types table (Preventive, Corrective, Emergency, etc.)

**assigned_to**  
Employee ID assigned to perform maintenance

## **Response**

| Status | Response |
| :---- | :---- |
| 201 | { "schedule": { "id": "generated_id", "asset_id": 1, "maintenance_type_id": 1, "scheduled_date": "2024-08-15", "status": "SCHEDULED", "assigned_to": 5, "created_at": "2024-08-08T10:30:00Z" } } |
| 400 | {"error":"Asset ID is required."} |
| 400 | {"error":"Invalid maintenance type ID."} |
| 400 | {"error":"Scheduled date is required."} |
| 404 | {"error":"Asset not found."} |
| 401 | {"error":"Invalid auth key."} |
| 403 | {"error":"Admin access required."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 11. Generate Report {#11.-generate-report}

Generate custom reports with filtering

## **Request**

| Method | URL |
| :---- | :---- |
| **POST** | api/reports/generate |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| POST | template_type | ASSET_INVENTORY\|EMPLOYEE_ASSETS\|MAINTENANCE\|AUDIT |
| POST | output_format | CSV\|PDF\|XLSX [**CSV**] |
| POST | filters | object [optional] |
| POST | date_range | object [optional] |

**template_type**  
Report template type from report_templates table

**filters**  
Object containing filter criteria like {"category_id": 1, "status": "AVAILABLE"}

**date_range**  
Object with start_date and end_date for filtering

## **Response**

| Status | Response |
| :---- | :---- |
| 200 | **For CSV/XLSX/PDF formats:** Binary file download with appropriate content-type header **For JSON format:** { "report_data": [...], "summary": { "total_records": 100, "generated_at": "2024-08-08T10:30:00Z" } } |
| 400 | {"error":"Invalid report template type."} |
| 400 | {"error":"Invalid date range."} |
| 401 | {"error":"Invalid auth key."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 12. Bulk Upload Assets {#12.-bulk-upload-assets}

Upload multiple assets via CSV/Excel file

## **Request**

| Method | URL |
| :---- | :---- |
| **POST** | api/assets/bulk-upload |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| POST | file | multipart/form-data |
| POST | validate_only | boolean [**false**] |

**file**  
CSV or Excel file containing asset data with columns: asset_type_id, brand_id, model_id, serial_number, purchase_date, purchase_cost, vendor_id, warranty_start_date, warranty_end_date, location, condition, status, notes

**validate_only**  
If true, only validates the file without importing

## **Response**

| Status | Response |
| :---- | :---- |
| 200 | { "success": true, "imported": 95, "errors": [ { "row": 5, "field": "serial_number", "message": "Serial number already exists" } ], "summary": { "total_rows": 100, "successful_imports": 95, "failed_imports": 5 } } |
| 400 | {"error":"File is required."} |
| 400 | {"error":"Invalid file format. Only CSV and Excel files are allowed."} |
| 413 | {"error":"File size too large. Maximum 10MB allowed."} |
| 401 | {"error":"Invalid auth key."} |
| 403 | {"error":"Admin access required."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 13. Get Asset Categories {#13.-get-asset-categories}

Get all asset categories for dropdown population

## **Request**

| Method | URL |
| :---- | :---- |
| **GET** | api/asset-categories |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |

## **Response**

| Status | Response |
| :---- | :---- |
| 200 | { "categories": [ { "id": 1, "name": "Electronics", "description": "Electronic devices and equipment", "is_active": true } ] } |
| 401 | {"error":"Invalid auth key."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 14. Get Asset Types {#14.-get-asset-types}

Get asset types, optionally filtered by category

## **Request**

| Method | URL |
| :---- | :---- |
| **GET** | api/asset-types |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| GET | category_id | integer [optional] |

**category_id**  
Filter asset types by category ID

## **Response**

| Status | Response |
| :---- | :---- |
| 200 | { "asset_types": [ { "id": 1, "name": "Laptop", "category_id": 1, "description": "Portable computers", "depreciation_rate": 20.00, "useful_life_years": 5, "is_active": true } ] } |
| 401 | {"error":"Invalid auth key."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 15. Get Brands {#15.-get-brands}

Get brands, optionally filtered by asset type

## **Request**

| Method | URL |
| :---- | :---- |
| **GET** | api/brands |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| GET | asset_type_id | integer [optional] |

**asset_type_id**  
Filter brands available for specific asset type

## **Response**

| Status | Response |
| :---- | :---- |
| 200 | { "brands": [ { "id": 1, "name": "Apple", "description": "Apple Inc. products", "is_active": true } ] } |
| 401 | {"error":"Invalid auth key."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 16. Get Models {#16.-get-models}

Get models filtered by brand and/or asset type

## **Request**

| Method | URL |
| :---- | :---- |
| **GET** | api/models |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| GET | brand_id | integer [optional] |
| GET | asset_type_id | integer [optional] |

**brand_id**  
Filter models by brand ID

**asset_type_id**  
Filter models by asset type ID

## **Response**

| Status | Response |
| :---- | :---- |
| 200 | { "models": [ { "id": 1, "name": "MacBook Pro 16\"", "brand_id": 1, "asset_type_id": 1, "specifications": { "ram": "16GB", "cpu": "M1 Pro", "storage": "512GB" }, "is_active": true } ] } |
| 401 | {"error":"Invalid auth key."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 17. Get Vendors {#17.-get-vendors}

Get all vendors for dropdown population

## **Request**

| Method | URL |
| :---- | :---- |
| **GET** | api/vendors |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |

## **Response**

| Status | Response |
| :---- | :---- |
| 200 | { "vendors": [ { "id": 1, "name": "Apple Store", "vendor_type": "supplier", "contact_person": "John Smith", "email": "contact@apple.com", "phone": "+1-800-275-2273", "address": "1 Apple Park Way, Cupertino, CA", "tax_id": "GSTIN12345", "pan_number": "ABCDE1234F", "notes": "Premium electronics supplier", "is_active": true } ] } |
| 401 | {"error":"Invalid auth key."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 18. Get Maintenance Types {#18.-get-maintenance-types}

Get all maintenance types for scheduling

## **Request**

| Method | URL |
| :---- | :---- |
| **GET** | api/maintenance-types |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |

## **Response**

| Status | Response |
| :---- | :---- |
| 200 | { "maintenance_types": [ { "id": 1, "name": "Preventive", "description": "Regular preventive maintenance", "is_active": true }, { "id": 2, "name": "Corrective", "description": "Fix issues and repairs", "is_active": true }, { "id": 3, "name": "Emergency", "description": "Urgent repairs", "is_active": true } ] } |
| 401 | {"error":"Invalid auth key."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 19. Get Available Assets {#19.-get-available-assets}

Get assets with AVAILABLE status for assignment

## **Request**

| Method | URL |
| :---- | :---- |
| **GET** | api/assets/available |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| GET | asset_type_id | integer [optional] |
| GET | search | string [optional] |

**asset_type_id**  
Filter available assets by type

**search**  
Search available assets by asset_id or serial_number

## **Response**

| Status | Response |
| :---- | :---- |
| 200 | { "available_assets": [ { "id": 1, "asset_id": "AST-001", "asset_type_id": 1, "brand_id": 1, "model_id": 1, "serial_number": "ABC123", "type_name": "Laptop", "brand_name": "Apple", "model_name": "MacBook Pro 16\"", "condition": "NEW", "location": "Warehouse A" } ] } |
| 401 | {"error":"Invalid auth key."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 20. Get Active Assignments {#20.-get-active-assignments}

Get active asset assignments, optionally filtered by employee

## **Request**

| Method | URL |
| :---- | :---- |
| **GET** | api/assignments/active |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| GET | employee_id | integer [optional] |

**employee_id**  
Get active assignments for specific employee

## **Response**

| Status | Response |
| :---- | :---- |
| 200 | { "active_assignments": [ { "id": 1, "asset_id": 1, "employee_id": 1, "asset_info": { "asset_id": "AST-001", "type_name": "Laptop", "brand_name": "Apple", "model_name": "MacBook Pro 16\"", "serial_number": "ABC123" }, "employee_info": { "employee_id": "EMP-001", "first_name": "John", "last_name": "Doe" }, "assigned_date": "2024-01-15", "assignment_reason": "Work laptop" } ] } |
| 401 | {"error":"Invalid auth key."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 21. Search Assets {#21.-search-assets}

Search assets by multiple criteria

## **Request**

| Method | URL |
| :---- | :---- |
| **GET** | api/assets/search |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| GET | q | string |
| GET | limit | number [**10**] |

**q**  
Search query (searches asset_id, serial_number, location, notes)

**limit**  
Maximum number of results to return (default: 10, max: 50)

## **Response**

| Status | Response |
| :---- | :---- |
| 200 | { "search_results": [ { "id": 1, "asset_id": "AST-001", "serial_number": "ABC123", "type_name": "Laptop", "brand_name": "Apple", "model_name": "MacBook Pro 16\"", "status": "AVAILABLE", "condition": "NEW", "location": "Warehouse A" } ], "total_found": 5 } |
| 400 | {"error":"Search query is required."} |
| 401 | {"error":"Invalid auth key."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 22. Search Employees {#22.-search-employees}

Search employees by multiple criteria

## **Request**

| Method | URL |
| :---- | :---- |
| **GET** | api/employees/search |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| GET | q | string |
| GET | limit | number [**10**] |

**q**  
Search query (searches employee_id, first_name, last_name, email)

**limit**  
Maximum number of results to return (default: 10, max: 50)

## **Response**

| Status | Response |
| :---- | :---- |
| 200 | { "search_results": [ { "id": 1, "employee_id": "EMP-001", "first_name": "John", "last_name": "Doe", "email": "john.doe@mindstix.com", "assigned_assets_count": 2 } ], "total_found": 3 } |
| 400 | {"error":"Search query is required."} |
| 401 | {"error":"Invalid auth key."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 23. Create Asset Category {#23.-create-asset-category}

Create a new asset category from the "Add New" option in forms

## **Request**

| Method | URL |
| :---- | :---- |
| **POST** | api/asset-categories |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| POST | name | string |
| POST | description | text [optional] |

**name**  
Category name (e.g., "Software", "Medical Equipment")

**description**  
Optional description of the category

## **Response**

| Status | Response |
| :---- | :---- |
| 201 | { "category": { "id": 5, "name": "Software", "description": "Software licenses and applications", "is_active": true, "created_at": "2024-08-08T10:30:00Z" } } |
| 400 | {"error":"Category name is required."} |
| 400 | {"error":"Category name already exists."} |
| 401 | {"error":"Invalid auth key."} |
| 403 | {"error":"Admin access required."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 24. Create Asset Type {#24.-create-asset-type}

Create a new asset type from the "Add New" option in forms

## **Request**

| Method | URL |
| :---- | :---- |
| **POST** | api/asset-types |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| POST | category_id | integer |
| POST | name | string |
| POST | description | text [optional] |
| POST | depreciation_rate | decimal [optional] |
| POST | useful_life_years | integer [optional] |

**category_id**  
Foreign key reference to the parent category (required)

**name**  
Asset type name (e.g., "Smartphone", "Office Chair")

## **Response**

| Status | Response |
| :---- | :---- |
| 201 | { "asset_type": { "id": 8, "category_id": 1, "name": "Smartphone", "description": "Mobile phones and devices", "depreciation_rate": 25.00, "useful_life_years": 3, "is_active": true, "created_at": "2024-08-08T10:30:00Z" } } |
| 400 | {"error":"Category ID is required."} |
| 400 | {"error":"Asset type name is required."} |
| 400 | {"error":"Invalid category_id."} |
| 400 | {"error":"Asset type name already exists in this category."} |
| 401 | {"error":"Invalid auth key."} |
| 403 | {"error":"Admin access required."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 25. Create Brand {#25.-create-brand}

Create a new brand from the "Add New" option in forms

## **Request**

| Method | URL |
| :---- | :---- |
| **POST** | api/brands |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| POST | name | string |
| POST | description | text [optional] |

**name**  
Brand name (e.g., "Samsung", "Herman Miller")

**description**  
Optional description of the brand

## **Response**

| Status | Response |
| :---- | :---- |
| 201 | { "brand": { "id": 10, "name": "Samsung", "description": "Samsung Electronics", "is_active": true, "created_at": "2024-08-08T10:30:00Z" } } |
| 400 | {"error":"Brand name is required."} |
| 400 | {"error":"Brand name already exists."} |
| 401 | {"error":"Invalid auth key."} |
| 403 | {"error":"Admin access required."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 26. Create Model {#26.-create-model}

Create a new model from the "Add New" option in forms

## **Request**

| Method | URL |
| :---- | :---- |
| **POST** | api/models |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| POST | brand_id | integer |
| POST | asset_type_id | integer |
| POST | name | string |
| POST | specifications | object [optional] |

**brand_id**  
Foreign key reference to the brand (required)

**asset_type_id**  
Foreign key reference to the asset type (required)

**name**  
Model name (e.g., "Galaxy S24 Ultra", "Aeron Chair")

**specifications**  
JSON object with technical specifications

## **Response**

| Status | Response |
| :---- | :---- |
| 201 | { "model": { "id": 15, "brand_id": 10, "asset_type_id": 3, "name": "Galaxy S24 Ultra", "specifications": { "ram": "12GB", "storage": "256GB", "display": "6.8 inch" }, "is_active": true, "created_at": "2024-08-08T10:30:00Z" } } |
| 400 | {"error":"Brand ID is required."} |
| 400 | {"error":"Asset type ID is required."} |
| 400 | {"error":"Model name is required."} |
| 400 | {"error":"Invalid brand_id."} |
| 400 | {"error":"Invalid asset_type_id."} |
| 400 | {"error":"Model name already exists for this brand and asset type."} |
| 401 | {"error":"Invalid auth key."} |
| 403 | {"error":"Admin access required."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# 27. Create Vendor {#27.-create-vendor}

Create a new vendor from the add-vendor form

## **Request**

| Method | URL |
| :---- | :---- |
| **POST** | api/vendors |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| POST | name | string |
| POST | vendor_type | string [**supplier**] |
| POST | contact_person | string [optional] |
| POST | email | string [optional] |
| POST | phone | string [optional] |
| POST | address | text [optional] |
| POST | tax_id | string [optional] |
| POST | pan_number | string [optional] |
| POST | notes | text [optional] |
| POST | user_id | integer [optional] |
| POST | is_active | boolean [**true**] |

**name**  
Vendor/Supplier name (required)

**vendor_type**  
Type of vendor: "supplier", "service_provider", or "both" (required, default: "supplier")

**contact_person**  
Primary contact person name

**email**  
Vendor email address

**phone**  
Phone number with country code (e.g., +91-9876543210)

**address**  
Complete vendor address

**tax_id**  
Tax identification number

**pan_number**  
Permanent Account Number (India-specific, max 10 characters)

**notes**  
Additional notes about the vendor

**user_id**  
Optional: Link to user account if vendor needs system access

## **Response**

| Status | Response |
| :---- | :---- |
| 201 | { "vendor": { "id": 6, "name": "TechFix Solutions Pvt Ltd", "vendor_type": "service_provider", "contact_person": "Rajesh Kumar", "email": "support@techfix.in", "phone": "+91-9876543210", "address": "Tech Park, Pune, Maharashtra 411001", "tax_id": "GSTIN123456789", "pan_number": "ABCDE1234F", "notes": "Specialized in laptop repairs and maintenance", "user_id": null, "is_active": true, "created_at": "2024-08-08T10:30:00Z" } } |
| 400 | {"error":"Vendor name is required."} |
| 400 | {"error":"Vendor type is required."} |
| 400 | {"error":"Invalid vendor type. Must be: supplier, service_provider, or both."} |
| 400 | {"error":"Vendor name already exists."} |
| 400 | {"error":"Invalid email format."} |
| 400 | {"error":"PAN number must be 10 characters."} |
| 400 | {"error":"Invalid user_id."} |
| 401 | {"error":"Invalid auth key."} |
| 403 | {"error":"Admin access required."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

---

# API Response Format Updates {#api-response-format-updates}

**As of Version 1.4**, all API responses follow a consistent structure to improve error handling and client-side processing:

## **Standard Response Format**

All successful responses now follow this structure:
```json
{
  "message": "Success message describing the operation",
  "data": {
    // Actual response data here
  }
}
```

## **Error Response Format**

All error responses follow this structure:
```json
{
  "message": "Error occurred",
  "error": "Detailed error description"
}
```

## **Updated Examples**

### Authentication Response (Updated)
```json
{
  "message": "Authentication successful",
  "data": {
    "auth_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_001",
      "username": "john.doe",
      "role": "admin",
      "permissions": ["asset:read", "asset:write", "employee:read"]
    }
  }
}
```

### Dashboard Stats Response (Updated)
```json
{
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "total_assets": { "count": 1247, "trend": 8.5 },
    "available_assets": { "count": 312, "percentage": 25.0, "trend": 5.7 },
    "assigned_assets": { "count": 892, "percentage": 71.5, "trend": 12.3 },
    "in_maintenance": { "count": 43, "percentage": 3.4, "trend": -2.1 },
    "retired_assets": { "count": 0, "percentage": 0.0, "trend": 0.0 }
  }
}
```

### Asset Creation Response (Updated)
```json
{
  "message": "Asset created successfully",
  "data": {
    "asset": {
      "id": 1248,
      "asset_id": "AST-1248",
      "asset_type_id": 1,
      "brand_id": 1,
      "model_id": 5,
      "serial_number": "ABC123XYZ",
      "status": "AVAILABLE",
      "condition": "NEW",
      "created_at": "2024-08-08T10:30:00Z"
    }
  }
}
```

## **ID Format Changes**

All custom IDs are now treated as **strings** for better flexibility:
- `asset_id`: String format (e.g., "AST-001", "AST-1248")
- `employee_id`: String format (e.g., "EMP-001", "EMP-151")
- Internal database IDs remain integers for foreign key relationships

## **Migration Notes**

- All existing endpoints maintain backward compatibility
- New responses include both the legacy format data and the new consistent structure
- Client applications should update to use the new `data` field structure
- Error handling should be updated to check both `message` and `error` fields

---

# Glossary {#glossary}

## **Conventions**

* **Client** - Client application.  
* **Status** - HTTP status code of response.  
* All the possible responses are listed under 'Responses' for each method. Only one of them is issued per request server.  
* All response are in JSON format.  
* All request parameters are mandatory unless explicitly marked as [optional]  
* The type of values accepted for a *request* parameter are shown in the values column like this [**10**|\<any number\>]. The | symbol means *OR*. If the parameter is [optional], the default value is shown in blue bold text, as **10** is written in [**10**|\<any number\>].  
* **auth_key** must be included in the header of all API calls (except login) as: `Authorization: Bearer <auth_key>`  
* All dates should be in ISO 8601 format (YYYY-MM-DD) unless specified otherwise  
* File uploads use multipart/form-data encoding  
* Pagination starts from page 1  
* Maximum items per page is 100
* Field naming follows snake_case convention to match database schema
* All ENUM values are uppercase and match database schema exactly
* **Response Format**: All responses follow consistent `{ "message": "", "data": {} }` structure
* **ID Format**: Custom IDs (asset_id, employee_id) are strings for better flexibility
* **API Versioning**: All endpoints use `/v1` prefix for explicit versioning

## **Database Schema Alignment**

This API specification is aligned with the database schema:
- **Assets**: Uses asset_type_id, brand_id, model_id foreign keys
- **Employees**: Only includes fields that exist in employees table
- **ENUMs**: All ENUM values match database schema exactly
- **Field Names**: Uses snake_case naming convention
- **Relationships**: Properly references foreign key relationships

## **Status Codes**

All status codes are standard HTTP status codes. The below ones are used in this API.

2XX - Success of some kind  
4XX - Error occurred in client's part  
5XX - Error occurred in server's part

| Status Code | Description |
| :---- | :---- |
| 200 | OK |
| 201 | Created |
| 202 | Accepted (Request accepted, and queued for execution) |
| 400 | Bad request |
| 401 | Authentication failure |
| 403 | Forbidden |
| 404 | Resource not found |
| 405 | Method Not Allowed |
| 409 | Conflict |
| 412 | Precondition Failed |
| 413 | Request Entity Too Large |
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 503 | Service Unavailable |