# Test Plan: Student Account Management System

Business-logic test plan for the COBOL application, to validate with stakeholders and reuse for the Node.js port.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | View initial balance | App started | 1. Select option 1 | Displays `Current balance: 001000.00` | | | Initial balance is 1000.00 |
| TC-002 | Credit valid amount | Balance 1000.00 | 1. Select 2 2. Enter 100.00 3. Select 1 | New balance 1100.00 shown and persisted | | | |
| TC-003 | Credit zero amount | Balance 1000.00 | 1. Select 2 2. Enter 0 | Balance unchanged 1000.00 | | | |
| TC-004 | Debit valid amount | Balance 1000.00 | 1. Select 3 2. Enter 50.00 3. Select 1 | New balance 950.00 shown and persisted | | | |
| TC-005 | Debit exact balance | Balance 1000.00 | 1. Select 3 2. Enter 1000.00 | New balance 0.00 | | | Boundary |
| TC-006 | Debit more than balance | Balance 1000.00 | 1. Select 3 2. Enter 2000.00 | `Insufficient funds for this debit.`; balance unchanged | | | Balance never negative |
| TC-007 | Multiple operations | Balance 1000.00 | 1. Credit 200 2. Debit 300 3. View | Balance 900.00 | | | Balance kept across operations |
| TC-008 | Invalid menu choice | App started | 1. Enter 9 | `Invalid choice, please select 1-4.`; menu shown again | | | |
| TC-009 | Exit application | App started | 1. Select 4 | `Exiting the program. Goodbye!`; app terminates | | | |
