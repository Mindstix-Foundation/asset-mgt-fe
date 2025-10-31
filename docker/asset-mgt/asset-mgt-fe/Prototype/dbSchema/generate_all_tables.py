#!/usr/bin/env python3
"""
Script to generate all Asset Management database table CSV files
Following Test Vista format for easy import to Google Sheets
"""

import os

# Define all tables with their structures
tables = {
    "09_department_table.csv": {
        "name": "9.department",
        "purpose": "Stores department information for organizational structure and employee categorization",
        "columns": [
            ("id", "PK", "SERIAL", "", "Unique identifier for the department"),
            ("name", "NOT NULL UNIQUE", "VARCHAR(100)", "", "Department name (IT HR Finance etc.)"),
            ("description", "NULL", "TEXT", "", "Department description"),
            ("manager_id", "FK NULL", "INT", "1-M", "Department manager (Foreign Key referencing employee.id)"),
            ("is_active", "NOT NULL DEFAULT TRUE", "BOOLEAN", "", "Department status"),
            ("created_by", "FK NOT NULL", "INT", "1-M", "User ID who created this record (Foreign Key referencing user.id)"),
            ("created_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was created"),
            ("updated_by", "FK NOT NULL", "INT", "1-M", "User ID who last updated this record (Foreign Key referencing user.id)"),
            ("updated_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was last updated")
        ]
    },
    "10_location_table.csv": {
        "name": "10.location",
        "purpose": "Stores office and warehouse locations where assets and employees are located",
        "columns": [
            ("id", "PK", "SERIAL", "", "Unique identifier for the office location"),
            ("name", "NOT NULL", "VARCHAR(100)", "", "Location name (New York Office Remote etc.)"),
            ("address_id", "FK NULL", "INT", "1-1", "Address ID (Foreign Key referencing address.id)"),
            ("location_type", "NOT NULL", "VARCHAR(20)", "", "Type: OFFICE WAREHOUSE REMOTE etc."),
            ("is_active", "NOT NULL DEFAULT TRUE", "BOOLEAN", "", "Location status"),
            ("created_by", "FK NOT NULL", "INT", "1-M", "User ID who created this record (Foreign Key referencing user.id)"),
            ("created_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was created"),
            ("updated_by", "FK NOT NULL", "INT", "1-M", "User ID who last updated this record (Foreign Key referencing user.id)"),
            ("updated_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was last updated")
        ]
    },
    "11_asset_category_table.csv": {
        "name": "11.asset_category",
        "purpose": "High-level categorization of assets for better organization and reporting",
        "columns": [
            ("id", "PK", "SERIAL", "", "Unique identifier for asset category"),
            ("name", "NOT NULL UNIQUE", "VARCHAR(50)", "", "Category name (Electronics Furniture etc.)"),
            ("description", "NULL", "TEXT", "", "Category description"),
            ("is_active", "NOT NULL DEFAULT TRUE", "BOOLEAN", "", "Category status"),
            ("created_by", "FK NOT NULL", "INT", "1-M", "User ID who created this record (Foreign Key referencing user.id)"),
            ("created_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was created"),
            ("updated_by", "FK NOT NULL", "INT", "1-M", "User ID who last updated this record (Foreign Key referencing user.id)"),
            ("updated_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was last updated")
        ]
    },
    "12_asset_type_table.csv": {
        "name": "12.asset_type",
        "purpose": "Specific types of assets within categories with depreciation and lifecycle information",
        "columns": [
            ("id", "PK", "SERIAL", "", "Unique identifier for asset type"),
            ("category_id", "FK NOT NULL", "INT", "1-M", "Category ID (Foreign Key referencing asset_category.id)"),
            ("name", "NOT NULL", "VARCHAR(50)", "", "Type name (Laptop Monitor Mobile etc.)"),
            ("description", "NULL", "TEXT", "", "Type description"),
            ("depreciation_rate", "NULL", "DECIMAL(5,2)", "", "Annual depreciation rate percentage"),
            ("useful_life_years", "NULL", "INT", "", "Expected useful life in years"),
            ("is_active", "NOT NULL DEFAULT TRUE", "BOOLEAN", "", "Type status"),
            ("created_by", "FK NOT NULL", "INT", "1-M", "User ID who created this record (Foreign Key referencing user.id)"),
            ("created_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was created"),
            ("updated_by", "FK NOT NULL", "INT", "1-M", "User ID who last updated this record (Foreign Key referencing user.id)"),
            ("updated_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was last updated")
        ]
    },
    "13_brand_table.csv": {
        "name": "13.brand",
        "purpose": "Asset manufacturers and brands for standardization and vendor management",
        "columns": [
            ("id", "PK", "SERIAL", "", "Unique identifier for brand"),
            ("name", "NOT NULL UNIQUE", "VARCHAR(50)", "", "Brand name (Apple Dell HP etc.)"),
            ("description", "NULL", "TEXT", "", "Brand description"),
            ("is_active", "NOT NULL DEFAULT TRUE", "BOOLEAN", "", "Brand status"),
            ("created_by", "FK NOT NULL", "INT", "1-M", "User ID who created this record (Foreign Key referencing user.id)"),
            ("created_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was created"),
            ("updated_by", "FK NOT NULL", "INT", "1-M", "User ID who last updated this record (Foreign Key referencing user.id)"),
            ("updated_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was last updated")
        ]
    },
    "14_model_table.csv": {
        "name": "14.model",
        "purpose": "Specific models of assets with detailed specifications and technical information",
        "columns": [
            ("id", "PK", "SERIAL", "", "Unique identifier for model"),
            ("brand_id", "FK NOT NULL", "INT", "1-M", "Brand ID (Foreign Key referencing brand.id)"),
            ("asset_type_id", "FK NOT NULL", "INT", "1-M", "Asset type ID (Foreign Key referencing asset_type.id)"),
            ("name", "NOT NULL", "VARCHAR(100)", "", "Model name (MacBook Pro 16 Dell XPS 13 etc.)"),
            ("specifications", "NULL", "JSONB", "", "Technical specifications in JSON format"),
            ("is_active", "NOT NULL DEFAULT TRUE", "BOOLEAN", "", "Model status"),
            ("created_by", "FK NOT NULL", "INT", "1-M", "User ID who created this record (Foreign Key referencing user.id)"),
            ("created_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was created"),
            ("updated_by", "FK NOT NULL", "INT", "1-M", "User ID who last updated this record (Foreign Key referencing user.id)"),
            ("updated_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was last updated")
        ]
    },
    "15_vendor_table.csv": {
        "name": "15.vendor",
        "purpose": "Suppliers and vendors for asset procurement and maintenance services",
        "columns": [
            ("id", "PK", "SERIAL", "", "Unique identifier for vendor"),
            ("name", "NOT NULL", "VARCHAR(100)", "", "Vendor/Supplier name"),
            ("contact_person", "NULL", "VARCHAR(100)", "", "Primary contact person"),
            ("email", "NULL", "VARCHAR(255)", "", "Vendor email address"),
            ("phone", "NULL", "VARCHAR(20)", "", "Vendor phone number"),
            ("address_id", "FK NULL", "INT", "1-1", "Vendor address ID (Foreign Key referencing address.id)"),
            ("tax_id", "NULL", "VARCHAR(50)", "", "Tax identification number"),
            ("is_active", "NOT NULL DEFAULT TRUE", "BOOLEAN", "", "Vendor status"),
            ("created_by", "FK NOT NULL", "INT", "1-M", "User ID who created this record (Foreign Key referencing user.id)"),
            ("created_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was created"),
            ("updated_by", "FK NOT NULL", "INT", "1-M", "User ID who last updated this record (Foreign Key referencing user.id)"),
            ("updated_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was last updated")
        ]
    },
    "16_maintenance_type_table.csv": {
        "name": "16.maintenance_type",
        "purpose": "Categories of maintenance activities for scheduling and cost tracking",
        "columns": [
            ("id", "PK", "SERIAL", "", "Unique identifier for maintenance type"),
            ("name", "NOT NULL UNIQUE", "VARCHAR(50)", "", "Maintenance type (Preventive Corrective Emergency etc.)"),
            ("description", "NULL", "TEXT", "", "Description of maintenance type"),
            ("is_active", "NOT NULL DEFAULT TRUE", "BOOLEAN", "", "Type status"),
            ("created_by", "FK NOT NULL", "INT", "1-M", "User ID who created this record (Foreign Key referencing user.id)"),
            ("created_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was created"),
            ("updated_by", "FK NOT NULL", "INT", "1-M", "User ID who last updated this record (Foreign Key referencing user.id)"),
            ("updated_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was last updated")
        ]
    },
    "17_maintenance_schedule_table.csv": {
        "name": "17.maintenance_schedule",
        "purpose": "Scheduled maintenance activities for proactive asset management and lifecycle planning",
        "columns": [
            ("id", "PK", "SERIAL", "", "Unique identifier for maintenance schedule"),
            ("asset_id", "FK NOT NULL", "INT", "1-M", "Asset ID (Foreign Key referencing asset.id)"),
            ("maintenance_type_id", "FK NOT NULL", "INT", "1-M", "Maintenance type ID (Foreign Key referencing maintenance_type.id)"),
            ("scheduled_date", "NOT NULL", "DATE", "", "Scheduled maintenance date"),
            ("frequency_days", "NULL", "INT", "", "Frequency in days for recurring maintenance"),
            ("description", "NULL", "TEXT", "", "Maintenance description"),
            ("assigned_to", "FK NULL", "INT", "1-M", "Employee assigned to maintenance (Foreign Key referencing employee.id)"),
            ("status", "NOT NULL DEFAULT 'SCHEDULED'", "VARCHAR(20)", "", "Status: SCHEDULED IN_PROGRESS COMPLETED CANCELLED"),
            ("is_active", "NOT NULL DEFAULT TRUE", "BOOLEAN", "", "Schedule status"),
            ("created_by", "FK NOT NULL", "INT", "1-M", "User ID who created this record (Foreign Key referencing user.id)"),
            ("created_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was created"),
            ("updated_by", "FK NOT NULL", "INT", "1-M", "User ID who last updated this record (Foreign Key referencing user.id)"),
            ("updated_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was last updated")
        ]
    },
    "18_address_table.csv": {
        "name": "18.address",
        "purpose": "Physical addresses for locations employees and vendors with GPS coordinates",
        "columns": [
            ("id", "PK", "SERIAL", "", "Unique identifier for the address"),
            ("city_id", "FK NOT NULL", "INT", "1-M", "City ID (Foreign Key referencing city.id)"),
            ("street_address", "NOT NULL", "TEXT", "", "Street address details"),
            ("postal_code", "NOT NULL", "VARCHAR(20)", "", "Postal/ZIP code"),
            ("latitude", "NULL", "DECIMAL(10,8)", "", "GPS latitude coordinate"),
            ("longitude", "NULL", "DECIMAL(11,8)", "", "GPS longitude coordinate"),
            ("is_active", "NOT NULL DEFAULT TRUE", "BOOLEAN", "", "Address status"),
            ("created_by", "FK NOT NULL", "INT", "1-M", "User ID who created this record (Foreign Key referencing user.id)"),
            ("created_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was created"),
            ("updated_by", "FK NOT NULL", "INT", "1-M", "User ID who last updated this record (Foreign Key referencing user.id)"),
            ("updated_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was last updated")
        ]
    },
    "19_city_table.csv": {
        "name": "19.city",
        "purpose": "City information for address hierarchy and location-based reporting",
        "columns": [
            ("id", "PK", "SERIAL", "", "Unique identifier for the city"),
            ("state_id", "FK NOT NULL", "INT", "1-M", "State ID (Foreign Key referencing state.id)"),
            ("name", "NOT NULL", "VARCHAR(100)", "", "City name"),
            ("postal_code", "NULL", "VARCHAR(20)", "", "Primary postal code for the city"),
            ("is_active", "NOT NULL DEFAULT TRUE", "BOOLEAN", "", "City status"),
            ("created_by", "FK NOT NULL", "INT", "1-M", "User ID who created this record (Foreign Key referencing user.id)"),
            ("created_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was created"),
            ("updated_by", "FK NOT NULL", "INT", "1-M", "User ID who last updated this record (Foreign Key referencing user.id)"),
            ("updated_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was last updated")
        ]
    },
    "20_state_table.csv": {
        "name": "20.state",
        "purpose": "State/Province information for geographic hierarchy and regional reporting",
        "columns": [
            ("id", "PK", "SERIAL", "", "Unique identifier for the state"),
            ("country_id", "FK NOT NULL", "INT", "1-M", "Country ID (Foreign Key referencing country.id)"),
            ("name", "NOT NULL", "VARCHAR(100)", "", "State/Province name"),
            ("code", "NULL", "VARCHAR(10)", "", "State code or abbreviation"),
            ("is_active", "NOT NULL DEFAULT TRUE", "BOOLEAN", "", "State status"),
            ("created_by", "FK NOT NULL", "INT", "1-M", "User ID who created this record (Foreign Key referencing user.id)"),
            ("created_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was created"),
            ("updated_by", "FK NOT NULL", "INT", "1-M", "User ID who last updated this record (Foreign Key referencing user.id)"),
            ("updated_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was last updated")
        ]
    },
    "21_country_table.csv": {
        "name": "21.country",
        "purpose": "Country information for international operations and address standardization",
        "columns": [
            ("id", "PK", "SERIAL", "", "Unique identifier for the country"),
            ("name", "NOT NULL UNIQUE", "VARCHAR(100)", "", "Country name"),
            ("iso_code", "NOT NULL UNIQUE", "CHAR(2)", "", "ISO 2-letter country code"),
            ("is_active", "NOT NULL DEFAULT TRUE", "BOOLEAN", "", "Country status"),
            ("created_by", "FK NOT NULL", "INT", "1-M", "User ID who created this record (Foreign Key referencing user.id)"),
            ("created_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was created"),
            ("updated_by", "FK NOT NULL", "INT", "1-M", "User ID who last updated this record (Foreign Key referencing user.id)"),
            ("updated_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was last updated")
        ]
    },
    "22_notification_table.csv": {
        "name": "22.notification",
        "purpose": "System notifications for users about asset assignments maintenance and other important events",
        "columns": [
            ("id", "PK", "SERIAL", "", "Unique identifier for notification"),
            ("user_id", "FK NOT NULL", "INT", "1-M", "Recipient user ID (Foreign Key referencing user.id)"),
            ("type", "NOT NULL", "VARCHAR(50)", "", "Notification type: ASSET_ASSIGNED MAINTENANCE_DUE etc."),
            ("title", "NOT NULL", "VARCHAR(255)", "", "Notification title"),
            ("message", "NOT NULL", "TEXT", "", "Notification message"),
            ("related_table", "NULL", "VARCHAR(50)", "", "Related table name"),
            ("related_id", "NULL", "INT", "", "Related record ID"),
            ("is_read", "NOT NULL DEFAULT FALSE", "BOOLEAN", "", "Read status"),
            ("priority", "NOT NULL DEFAULT 'NORMAL'", "VARCHAR(10)", "", "Priority: LOW NORMAL HIGH URGENT"),
            ("expires_at", "NULL", "TIMESTAMPTZ", "", "Expiration timestamp"),
            ("created_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when notification was created"),
            ("read_at", "NULL", "TIMESTAMPTZ", "", "Timestamp when notification was read")
        ]
    },
    "23_system_setting_table.csv": {
        "name": "23.system_setting",
        "purpose": "System configuration settings for application behavior and user preferences",
        "columns": [
            ("id", "PK", "SERIAL", "", "Unique identifier for system setting"),
            ("setting_key", "NOT NULL UNIQUE", "VARCHAR(100)", "", "Setting key/name"),
            ("setting_value", "NULL", "TEXT", "", "Setting value"),
            ("data_type", "NOT NULL DEFAULT 'STRING'", "VARCHAR(20)", "", "Data type: STRING INTEGER BOOLEAN JSON"),
            ("description", "NULL", "TEXT", "", "Setting description"),
            ("is_user_configurable", "NOT NULL DEFAULT FALSE", "BOOLEAN", "", "Can users modify this setting"),
            ("created_by", "FK NOT NULL", "INT", "1-M", "User ID who created this record (Foreign Key referencing user.id)"),
            ("created_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was created"),
            ("updated_by", "FK NOT NULL", "INT", "1-M", "User ID who last updated this record (Foreign Key referencing user.id)"),
            ("updated_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was last updated")
        ]
    },
    "24_report_template_table.csv": {
        "name": "24.report_template",
        "purpose": "Predefined report templates for generating various asset and employee reports",
        "columns": [
            ("id", "PK", "SERIAL", "", "Unique identifier for report template"),
            ("name", "NOT NULL", "VARCHAR(100)", "", "Report template name"),
            ("description", "NULL", "TEXT", "", "Report description"),
            ("template_type", "NOT NULL", "VARCHAR(50)", "", "Type: ASSET_INVENTORY EMPLOYEE_ASSETS MAINTENANCE etc."),
            ("sql_query", "NULL", "TEXT", "", "SQL query for generating report"),
            ("parameters", "NULL", "JSONB", "", "Report parameters configuration"),
            ("output_format", "NOT NULL DEFAULT 'CSV'", "VARCHAR(10)", "", "Output format: CSV PDF XLSX"),
            ("is_active", "NOT NULL DEFAULT TRUE", "BOOLEAN", "", "Template status"),
            ("created_by", "FK NOT NULL", "INT", "1-M", "User ID who created this record (Foreign Key referencing user.id)"),
            ("created_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was created"),
            ("updated_by", "FK NOT NULL", "INT", "1-M", "User ID who last updated this record (Foreign Key referencing user.id)"),
            ("updated_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when record was last updated")
        ]
    },
    "25_file_attachment_table.csv": {
        "name": "25.file_attachment",
        "purpose": "File attachments for assets maintenance records and other entities with metadata",
        "columns": [
            ("id", "PK", "SERIAL", "", "Unique identifier for file attachment"),
            ("related_table", "NOT NULL", "VARCHAR(50)", "", "Table name this file is attached to"),
            ("related_id", "NOT NULL", "INT", "", "Record ID this file is attached to"),
            ("file_name", "NOT NULL", "VARCHAR(255)", "", "Original file name"),
            ("file_path", "NOT NULL", "VARCHAR(500)", "", "File storage path"),
            ("file_size", "NOT NULL", "BIGINT", "", "File size in bytes"),
            ("mime_type", "NOT NULL", "VARCHAR(100)", "", "MIME type of the file"),
            ("file_hash", "NULL", "VARCHAR(64)", "", "SHA-256 hash of file content"),
            ("description", "NULL", "TEXT", "", "File description"),
            ("uploaded_by", "FK NOT NULL", "INT", "1-M", "User who uploaded the file (Foreign Key referencing user.id)"),
            ("uploaded_at", "DEFAULT NOW()", "TIMESTAMPTZ", "", "Timestamp when file was uploaded")
        ]
    }
}

def create_table_csv(filename, table_data):
    """Create a CSV file for a single table"""
    content = []
    content.append(f"{table_data['name']},,,,")
    content.append(f"Purpose:{table_data['purpose']},,,,")
    content.append(",,,,")
    content.append("column name,constraint,data_type,relation_type,Description")
    
    for col_name, constraint, data_type, relation_type, description in table_data['columns']:
        content.append(f"{col_name},{constraint},{data_type},{relation_type},{description}")
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write('\n'.join(content))

def main():
    """Generate all table CSV files"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    print("Generating Asset Management Database Table CSV files...")
    
    for filename, table_data in tables.items():
        filepath = os.path.join(script_dir, filename)
        create_table_csv(filepath, table_data)
        print(f"✓ Created {filename}")
    
    print(f"\n🎉 Successfully generated {len(tables)} table CSV files!")
    print("\nNext steps:")
    print("1. Import each CSV file as a separate sheet in Google Sheets")
    print("2. Each sheet represents one database table")
    print("3. Review and customize as needed")
    print("4. Use these sheets to generate your actual SQL DDL statements")

if __name__ == "__main__":
    main() 