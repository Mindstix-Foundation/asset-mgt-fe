**API Specification Doc**

**(*TrackStix - Asset Management System*)**

| Version | Date | Author | Description |
| :---- | :---- | :---- | :---- |
| 1.0 | 08-Aug-2024 | Nishant Bondre, Uday Narsale | Initial draft |

## Table of Contents

[**1. User Authentication**](#1-user-authentication)

[**Request**](#request)

[**Response**](#response)

[**2. Get Dashboard Statistics**](#2-get-dashboard-statistics)

[**Request**](#request-1)

[**Response**](#response-1)

[**3. Get All Assets**](#3-get-all-assets)

[**Request**](#request-2)

[**Response**](#response-2)

[**4. Create Asset**](#4-create-asset)

[**Request**](#request-3)

[**Response**](#response-3)

[**5. Get All Employees**](#5-get-all-employees)

[**Request**](#request-4)

[**Response**](#response-4)

[**6. Create Employee**](#6-create-employee)

[**Request**](#request-5)

[**Response**](#response-5)

[**7. Assign Asset to Employee**](#7-assign-asset-to-employee)

[**Request**](#request-6)

[**Response**](#response-6)

[**8. Collect Asset from Employee**](#8-collect-asset-from-employee)

[**Request**](#request-7)

[**Response**](#response-7)

[**9. Get Inventory Overview**](#9-get-inventory-overview)

[**Request**](#request-8)

[**Response**](#response-8)

[**10. Create Maintenance Schedule**](#10-create-maintenance-schedule)

[**Request**](#request-9)

[**Response**](#response-9)

[**11. Generate Report**](#11-generate-report)

[**Request**](#request-10)

[**Response**](#response-10)

[**12. Bulk Upload Assets**](#12-bulk-upload-assets)

[**Request**](#request-11)

[**Response**](#response-11)

[**Conventions**](#conventions)

[**Status Codes**](#status-codes)

## 

## 

## 

## 

## 

## Entities

## **1. User Authentication** {#1-user-authentication}

User login authentication with role-based access

| Method | URL |
| :---- | :---- |
| **POST** | api/auth/login |

## **Request** {#request}

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | api_key | string |
| POST | username | string |
| POST | password | string |
| POST | userType | admin\|hr |

**api_key**  
api_key must be sent with all client requests. The api_key helps the server to validate the request source.

**userType**  
Specify user role type - admin for full access, hr for read-only access.

## **Response** {#response}

| Status | Response |
| :---- | :---- |
| 200 | { "auth_key": \<auth_key\>, "user": { "id": "string", "username": "string", "role": "admin\|hr", "permissions": \["array_of_permissions"\] } } auth_key (**string**) - all further API calls must have this key in header |
| 403 | {"error":"API key is missing."} |
| 400 | {"error":"Please provide username."} |
| 400 | {"error":"Please provide password."} |
| 400 | {"error":"Please provide userType."} |
| 401 | {"error":"Invalid API key."} |
| 401 | {"error":"Incorrect username or password."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

## **2. Get Dashboard Statistics** {#2-get-dashboard-statistics}

Get real-time dashboard statistics and KPIs

## **Request** {#request-1}

| Method | URL |
| :---- | :---- |
| **GET** | api/dashboard/stats |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| GET | dateRange | string \[optional\] |

**auth_key**  
The auth_key that was given in response to /api/auth/login

**dateRange**  
Optional date range for statistics filtering (e.g., "30d", "7d", "1m")

## **Response** {#response-1}

| Status | Response |
| :---- | :---- |
| 200 | **Response will be an object containing dashboard statistics** { "totalAssets": { "count": 1247, "trend": 8.5 }, "assignedAssets": { "count": 892, "percentage": 71.5, "trend": 12.3 }, "availableAssets": { "count": 312, "percentage": 25.0, "trend": 5.7 }, "underMaintenance": { "count": 43, "percentage": 3.4, "trend": -2.1 } } |
| 400 | {"error":"Invalid date range format."} |
| 401 | {"error":"Invalid auth key."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

## **3. Get All Assets** {#3-get-all-assets}

Get all assets with pagination and filtering

## **Request** {#request-2}

| Method | URL |
| :---- | :---- |
| **GET** | api/assets |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| GET | page | number \[**1**\] |
| GET | limit | number \[**10**\] |
| GET | search | string \[optional\] |
| GET | category | string \[optional\] |
| GET | status | string \[optional\] |

**page**  
Page number for pagination (default: 1)

**limit**  
Number of items per page (default: 10, max: 100)

**search**  
Search term for asset name, model, or serial number

**category**  
Filter by asset category (Laptop, Monitor, Mobile, Tablets, iPads, Accessories)

**status**  
Filter by asset status (Available, In Use, Under Maintenance, Retired, Reserved)

## **Response** {#response-2}

| Status | Response |
| :---- | :---- |
| 200 | **Response contains array of assets with pagination info** { "assets": \[ { "id": "string", "assetId": "AST-001", "name": "MacBook Pro 16\"", "model": "MacBook Pro", "serialNumber": "SERIAL123", "manufacturer": "Apple", "category": "Laptop", "brand": "Apple", "status": "Available", "specifications": { "ram": "16GB", "cpu": "M1 Pro", "storage": "512GB SSD", "os": "macOS" }, "location": "Warehouse A" } \], "totalCount": 1247, "pagination": { "currentPage": 1, "totalPages": 125, "hasNext": true, "hasPrevious": false } } |
| 400 | {"error":"Invalid page number."} |
| 400 | {"error":"Invalid limit value."} |
| 401 | {"error":"Invalid auth key."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

## **4. Create Asset** {#4-create-asset}

Register a new asset in the system

## **Request** {#request-3}

| Method | URL |
| :---- | :---- |
| **POST** | api/assets |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| POST | name | string |
| POST | model | string |
| POST | serialNumber | string |
| POST | manufacturer | string |
| POST | category | Laptop\|Monitor\|Mobile\|Tablets\|iPads\|Accessories |
| POST | brand | string |
| POST | specifications | object \[optional\] |
| POST | purchaseDate | date \[optional\] |
| POST | cost | number \[optional\] |
| POST | location | string \[optional\] |

**specifications**  
Object containing technical specifications like {"ram": "16GB", "cpu": "M1 Pro", "storage": "512GB"}

## **Response** {#response-3}

| Status | Response |
| :---- | :---- |
| 201 | { "asset": { "id": "generated_id", "assetId": "AST-1248", "name": "MacBook Pro 16\"", "status": "Available", "createdAt": "2024-08-08T10:30:00Z" } } |
| 400 | {"error":"Asset name is required."} |
| 400 | {"error":"Serial number already exists."} |
| 401 | {"error":"Invalid auth key."} |
| 403 | {"error":"Admin access required."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

## **5. Get All Employees** {#5-get-all-employees}

Get all employees with their assigned assets

## **Request** {#request-4}

| Method | URL |
| :---- | :---- |
| **GET** | api/employees |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| GET | page | number \[**1**\] |
| GET | limit | number \[**10**\] |
| GET | search | string \[optional\] |
| GET | department | string \[optional\] |
| GET | status | string \[optional\] |

**search**  
Search by employee name, ID, or email

**status**  
Filter by employment status (Active, Inactive, On Leave, Maternity Leave, Sabbatical Leave)

## **Response** {#response-4}

| Status | Response |
| :---- | :---- |
| 200 | **Response contains array of employees** { "employees": \[ { "id": "string", "employeeId": "EMP-001", "firstName": "John", "lastName": "Doe", "email": "john.doe@mindstix.com", "phone": "+91-9876543210", "position": "Software Engineer", "department": "IT", "location": "Pune", "status": "Active", "joinDate": "2022-01-15", "assignedAssets": \["AST-001", "AST-002"\] } \], "totalCount": 150, "pagination": { "currentPage": 1, "totalPages": 15, "hasNext": true, "hasPrevious": false } } |
| 401 | {"error":"Invalid auth key."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

## **6. Create Employee** {#6-create-employee}

Add a new employee to the system

## **Request** {#request-5}

| Method | URL |
| :---- | :---- |
| **POST** | api/employees |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| POST | firstName | string |
| POST | lastName | string |
| POST | email | string |
| POST | phone | string \[optional\] |
| POST | position | string \[optional\] |
| POST | department | string \[optional\] |
| POST | location | string \[optional\] |
| POST | joinDate | date \[optional\] |
| POST | status | Active\|Inactive\|On Leave \[**Active**\] |

**employeeId**  
Auto-generated if not provided

## **Response** {#response-5}

| Status | Response |
| :---- | :---- |
| 201 | { "employee": { "id": "generated_id", "employeeId": "EMP-151", "firstName": "John", "lastName": "Doe", "email": "john.doe@mindstix.com", "status": "Active", "createdAt": "2024-08-08T10:30:00Z" } } |
| 400 | {"error":"First name is required."} |
| 400 | {"error":"Email already exists."} |
| 401 | {"error":"Invalid auth key."} |
| 403 | {"error":"Admin access required."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

## **7. Assign Asset to Employee** {#7-assign-asset-to-employee}

Assign an available asset to an employee

## **Request** {#request-6}

| Method | URL |
| :---- | :---- |
| **POST** | api/assignments |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| POST | assetId | string |
| POST | employeeId | string |
| POST | assignmentDate | date |
| POST | location | string \[optional\] |
| POST | notes | string \[optional\] |

**assetId**  
ID of the asset to be assigned (must be Available status)

**employeeId**  
ID of the employee to assign the asset to

## **Response** {#response-6}

| Status | Response |
| :---- | :---- |
| 201 | { "assignment": { "id": "generated_id", "assetId": "AST-001", "employeeId": "EMP-001", "assignmentDate": "2024-08-08", "status": "Active", "createdAt": "2024-08-08T10:30:00Z" } } |
| 400 | {"error":"Asset ID is required."} |
| 400 | {"error":"Employee not found."} |
| 400 | {"error":"Asset not available for assignment."} |
| 401 | {"error":"Invalid auth key."} |
| 403 | {"error":"Admin access required."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

## **8. Collect Asset from Employee** {#8-collect-asset-from-employee}

Collect an assigned asset from an employee

## **Request** {#request-7}

| Method | URL |
| :---- | :---- |
| **POST** | api/assignments/\<assignment_id\>/collect |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| URL_PARAM | \<assignment_id\> | string |
| POST | collectionDate | date |
| POST | reason | Employee Left\|Reassignment\|Maintenance\|Upgrade\|Other |
| POST | notes | string \[optional\] |
| POST | condition | string \[optional\] |

**assignment_id**  
ID of the assignment to collect

**reason**  
Reason for asset collection

## **Response** {#response-7}

| Status | Response |
| :---- | :---- |
| 200 | { "assignment": { "id": "assignment_id", "status": "Collected", "collectionDate": "2024-08-08", "reason": "Employee Left", "collectedAt": "2024-08-08T10:30:00Z" } } |
| 400 | {"error":"Invalid assignment ID."} |
| 400 | {"error":"Collection reason is required."} |
| 404 | {"error":"Assignment not found."} |
| 401 | {"error":"Invalid auth key."} |
| 403 | {"error":"Admin access required."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

## **9. Get Inventory Overview** {#9-get-inventory-overview}

Get inventory statistics and available assets

## **Request** {#request-8}

| Method | URL |
| :---- | :---- |
| **GET** | api/inventory |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| GET | location | string \[optional\] |
| GET | category | string \[optional\] |
| GET | status | Available\|Reserved \[optional\] |

## **Response** {#response-8}

| Status | Response |
| :---- | :---- |
| 200 | **Response contains inventory overview** { "summary": { "availableStock": 312, "reservedStock": 25, "lowStockAlerts": 5 }, "items": \[ { "assetId": "AST-100", "name": "MacBook Pro", "category": "Laptop", "location": "Warehouse A", "status": "Available" } \], "locations": \[ { "name": "Warehouse A", "count": 180 }, { "name": "Warehouse B", "count": 132 } \] } |
| 401 | {"error":"Invalid auth key."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

## **10. Create Maintenance Schedule** {#10-create-maintenance-schedule}

Schedule maintenance for an asset

## **Request** {#request-9}

| Method | URL |
| :---- | :---- |
| **POST** | api/maintenance/schedules |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| POST | assetId | string |
| POST | maintenanceType | Preventive\|Corrective\|Emergency |
| POST | scheduledDate | date |
| POST | description | string |
| POST | priority | Low\|Medium\|High\|Critical \[**Medium**\] |
| POST | assignedTo | string \[optional\] |
| POST | estimatedCost | number \[optional\] |

## **Response** {#response-9}

| Status | Response |
| :---- | :---- |
| 201 | { "schedule": { "id": "generated_id", "assetId": "AST-001", "maintenanceType": "Preventive", "scheduledDate": "2024-08-15", "status": "Scheduled", "createdAt": "2024-08-08T10:30:00Z" } } |
| 400 | {"error":"Asset ID is required."} |
| 400 | {"error":"Invalid maintenance type."} |
| 404 | {"error":"Asset not found."} |
| 401 | {"error":"Invalid auth key."} |
| 403 | {"error":"Admin access required."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

## **11. Generate Report** {#11-generate-report}

Generate custom reports with filtering

## **Request** {#request-10}

| Method | URL |
| :---- | :---- |
| **POST** | api/reports/generate |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| POST | reportType | assets\|employees\|maintenance\|audit |
| POST | format | json\|csv\|excel\|pdf \[**json**\] |
| POST | filters | object \[optional\] |
| POST | dateRange | object \[optional\] |

**filters**  
Object containing filter criteria like {"department": "IT", "status": "Active"}

**dateRange**  
Object with startDate and endDate for filtering

## **Response** {#response-10}

| Status | Response |
| :---- | :---- |
| 200 | **For JSON format:** { "reportData": \[...\], "summary": { "totalRecords": 100, "generatedAt": "2024-08-08T10:30:00Z" } } **For file formats:** Binary file download with appropriate content-type header |
| 400 | {"error":"Invalid report type."} |
| 400 | {"error":"Invalid date range."} |
| 401 | {"error":"Invalid auth key."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

## **12. Bulk Upload Assets** {#12-bulk-upload-assets}

Upload multiple assets via CSV/Excel file

## **Request** {#request-11}

| Method | URL |
| :---- | :---- |
| **POST** | api/assets/bulk-upload |

| Type | Params | Values |
| :---- | :---- | :---- |
| HEAD | auth_key | string |
| POST | file | multipart/form-data |
| POST | validateOnly | boolean \[**false**\] |

**file**  
CSV or Excel file containing asset data

**validateOnly**  
If true, only validates the file without importing

## **Response** {#response-11}

| Status | Response |
| :---- | :---- |
| 200 | { "success": true, "imported": 95, "errors": \[ { "row": 5, "field": "serialNumber", "message": "Serial number already exists" } \], "summary": { "totalRows": 100, "successfulImports": 95, "failedImports": 5 } } |
| 400 | {"error":"File is required."} |
| 400 | {"error":"Invalid file format. Only CSV and Excel files are allowed."} |
| 413 | {"error":"File size too large. Maximum 10MB allowed."} |
| 401 | {"error":"Invalid auth key."} |
| 403 | {"error":"Admin access required."} |
| 500 | {"error":"Something went wrong. Please try again later."} |

## 

## 

## 

## Glossary

## **Conventions** {#conventions}

* **Client** - Client application.  
* **Status** - HTTP status code of response.  
* All the possible responses are listed under 'Responses' for each method. Only one of them is issued per request server.  
* All response are in JSON format.  
* All request parameters are mandatory unless explicitly marked as \[optional\]  
* The type of values accepted for a *request* parameter are shown in the values column like this \[**10**|\<any number\>\]. The | symbol means *OR*. If the parameter is \[optional\], the default value is shown in blue bold text, as **10** is written in \[**10**|\<any number\>\].
* **auth_key** must be included in the header of all API calls (except login) as: `Authorization: Bearer <auth_key>`
* All dates should be in ISO 8601 format (YYYY-MM-DD) unless specified otherwise
* File uploads use multipart/form-data encoding
* Pagination starts from page 1
* Maximum items per page is 100

## **Status Codes** {#status-codes}

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
| 503 | Service Unavailable 