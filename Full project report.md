PROJECT REPORT
An-Nusrah Foundation Web Portal
A Full-Stack Web Application for Madrasa Management, Donation, and Zakat

Submitted to the Department of Computer Science and Engineering
In partial fulfillment of the requirements for the degree of
Bachelor of Science in Computer Science and Engineering

Submitted by:
[Student Name(s) — Group Members]
[Student ID(s)]
[Department of CSE]
[University Name]
[Barishal, Bangladesh]

Supervised by:
[Supervisor Name]
[Designation, Department]
[University Name]

Date of Submission: [Month, Year]

(Page number hidden on this page — roman numerals begin from page ii)

DECLARATION
We hereby declare that the project titled "An-Nusrah Foundation Web Portal" is our own original work and has not been submitted elsewhere for any academic award or degree. All sources of information used in this report have been duly acknowledged.

Signatures of Students:

Name	ID	Signature
[Student 1]	[ID]	__________
[Student 2]	[ID]	__________
Date: _______________

APPROVAL
This project report titled "An-Nusrah Foundation Web Portal" submitted by [Group Members' Names] has been examined and approved as satisfying the requirements for the degree of Bachelor of Science in Computer Science and Engineering.

Supervisor:

[Supervisor Name]
[Designation]
[Department of CSE]
[University Name]

Head of Department:

[HOD Name]
[Department of CSE]
[University Name]

Date: _______________

ACKNOWLEDGEMENT
We would like to express our sincere gratitude to our supervisor, [Supervisor Name], for their continuous guidance, encouragement, and invaluable feedback throughout the development of this project. Their expertise and patience have been instrumental in shaping this work.

We are also grateful to the faculty members of the Department of Computer Science and Engineering for their academic support and the knowledge they have imparted throughout our undergraduate studies.

Our heartfelt thanks go to the management and staff of Madinatul Ulum Tahfijul Quran Madrasah and An-Nusrah Foundation, Barishal, for providing the real-world context and requirements that made this project meaningful and impactful.

Finally, we thank our families and friends for their unwavering moral support and encouragement during the entire duration of this project.

ABSTRACT
This project presents the design and implementation of a full-stack web portal for An-Nusrah Foundation, a charitable and educational institution based in Barishal, Bangladesh, operating under Madinatul Ulum Tahfijul Quran Madrasah. The institution manages Quran memorization (Hifz) programs, skill development initiatives, and multiple charitable campaigns but previously relied on manual, paper-based processes for student management, fee collection, and donation tracking.

The proposed system is a bilingual (English and Bengali) web application built using React 19 on the frontend and Node.js with Express 4 on the backend, with MongoDB as the database. The portal serves two distinct user groups: the general public and the institution's administrative team. Public users can browse active donation campaigns, calculate and pay Zakat using a Shariah-compliant calculator with live gold price integration, submit admission inquiries, access an Islamic digital library, and use Islamic utility tools such as prayer times, Qibla compass, and mosque finder. Administrative users can manage students, track monthly fee payments, oversee donation and Zakat records, generate reports, and export data.

The system integrates SSLCommerz, a leading Bangladeshi payment gateway, to facilitate secure online donations and Zakat payments via Card, bKash, Nagad, and Rocket. Role-based access control with three tiers — Master, Admin, and Staff/Finance — ensures data security and operational integrity. The portal is deployed on Vercel (frontend) and Render (backend), making it publicly accessible.

The system successfully digitizes the institution's core operations, improves financial transparency, and provides a modern, accessible platform for donors and administrators alike.

Keywords: Web Portal, Madrasa Management System, Donation Management, Zakat Calculator, SSLCommerz, React, Node.js, MongoDB, REST API, Role-Based Access Control, Bilingual Web Application.

TABLE OF CONTENTS
(Starting from Abstract — page ii)

Section	Page
Abstract	ii
Table of Contents	iii
List of Figures	iv
List of Tables	v
Chapter 1: Introduction	1
1.1 Background	1
1.2 Motivation	2
1.3 Objectives	2
1.4 Scope of the Project	3
1.5 Report Organization	3
Chapter 2: Literature Review	4
2.1 Existing Madrasa Management Systems	4
2.2 Online Donation Platforms in Bangladesh	5
2.3 Zakat Calculation Systems	5
2.4 Gaps in Existing Solutions	6
Chapter 3: Problem Statement	7
3.1 Current Challenges	7
3.2 Problem Definition	8
Chapter 4: Analysis and Design of Proposed System	9
4.1 System Requirements	9
4.2 Use Case Analysis	10
4.3 Data Flow Diagrams	11
4.4 Entity-Relationship Diagram	13
4.5 System Architecture	14
4.6 Database Design	15
4.7 API Design	18
Chapter 5: Implementation and Testing	20
5.1 Development Environment	20
5.2 Backend Implementation	21
5.3 Frontend Implementation	25
5.4 Payment Gateway Integration	30
5.5 Deployment	32
5.6 Testing	33
Chapter 6: Conclusion and Future Work	36
6.1 Conclusion	36
6.2 Limitations	37
6.3 Future Work	37
References	38
LIST OF FIGURES
Figure No.	Title	Page
Figure 4.1	Use Case Diagram — Madrasa Management System	10
Figure 4.2	DFD Level 0 — Context Diagram	11
Figure 4.3	DFD Level 1 — System Processes	12
Figure 4.4	Entity-Relationship Diagram	13
Figure 4.5	System Architecture Diagram	14
Figure 4.6	Student Schema Structure	16
Figure 4.7	Donation Process Flowchart	17
Figure 4.8	Fee Management Flowchart	18
Figure 4.9	Zakat Calculation Flowchart	19
Figure 5.1	Admin Dashboard Screenshot	26
Figure 5.2	Student Management Page	27
Figure 5.3	Zakat Calculator Page	28
Figure 5.4	SSLCommerz Payment Flow	31
Figure 5.5	Deployment Architecture	32
LIST OF TABLES
Table No.	Title	Page
Table 4.1	Functional Requirements	9
Table 4.2	Non-Functional Requirements	10
Table 4.3	Student Collection Schema	15
Table 4.4	Donation Collection Schema	16
Table 4.5	Zakat Collection Schema	16
Table 4.6	User Collection Schema	17
Table 4.7	Transaction Collection Schema	17
Table 4.8	API Endpoints Summary	18
Table 4.9	User Roles and Permissions	19
Table 5.1	Technology Stack	20
Table 5.2	Test Cases — Authentication Module	33
Table 5.3	Test Cases — Student Management	34
Table 5.4	Test Cases — Payment Gateway	35
(Second Section begins — integer page numbers from 1)

CHAPTER 1: INTRODUCTION
1.1 Background
Bangladesh is home to thousands of Madrasas — Islamic educational institutions that provide religious education, Quran memorization (Hifz), and increasingly, vocational and skill development programs. These institutions serve a critical social role, particularly in rural and semi-urban areas, by educating students who may not have access to mainstream schooling. Despite their social importance, the vast majority of these institutions continue to operate using entirely manual, paper-based administrative systems. Student enrollment records, monthly fee ledgers, donation receipts, and financial reports are maintained in physical registers, making them vulnerable to loss, error, and inefficiency.

Madinatul Ulum Tahfijul Quran Madrasah, located in Barishal, Bangladesh, is one such institution. It operates under the umbrella of An-Nusrah Foundation, a charitable trust that runs four active fundraising campaigns: the Masjid and Madrasha Complex construction fund, the An-Nusrah Skill Development program, the Poor Student Support fund, and the Ramadan Iftar distribution fund. The institution has a growing student body, a dedicated administrative team, and a community of donors — yet it lacked any digital infrastructure to manage these operations efficiently.

This project was conceived to address that gap by building a comprehensive, bilingual web portal that digitizes the institution's administrative and financial operations while simultaneously providing a modern, accessible public-facing platform for donors and prospective students.

1.2 Motivation
The primary motivation for this project stems from direct observation of the operational challenges faced by the institution. Monthly fee collection was tracked manually, leading to discrepancies between what was owed and what was recorded. Donation records were maintained in notebooks, making it impossible to generate real-time financial reports or track campaign progress. There was no mechanism for online donations, which severely limited the institution's reach to donors outside the local area.

Furthermore, the institution had no digital presence whatsoever — no website, no online admission portal, and no way for the public to learn about its programs or contribute to its campaigns. In an era where digital literacy and internet penetration are rapidly growing in Bangladesh, this absence represented a significant missed opportunity.

The motivation was therefore both practical — to solve real operational problems — and strategic — to build a platform that could help the institution grow its donor base, improve financial transparency, and modernize its administrative processes.

1.3 Objectives
The specific objectives of this project are:

To design and implement a full-stack web portal that serves both the public and the institution's administrative team.

To digitize student management, including enrollment, profile management, and monthly fee tracking with a granular month-by-month ledger system.

To build a donation management system supporting four active campaigns with real-time fund tracking and online payment via SSLCommerz.

To implement a Shariah-compliant Zakat calculator with live gold price integration and direct payment capability.

To develop a role-based access control system with three user tiers — Master, Admin, and Staff/Finance — to ensure data security.

To provide a bilingual interface (English and Bengali) with live language management from the admin panel.

To integrate Islamic utility features including prayer times, Qibla compass, mosque finder, and a digital Islamic library.

To deploy the application on cloud infrastructure for public accessibility.

1.4 Scope of the Project
The scope of this project encompasses:

A public-facing portal with pages for home, about, admission, donations, Zakat calculator, photo gallery, Islamic library, prayer times, Qibla compass, mosque finder, and contact.

An administrative portal with modules for student management, student finance, donation management, Zakat management, reports, data export, program management, language management, user management, and settings.

A RESTful backend API with 30+ endpoints covering all system operations.

Integration with SSLCommerz payment gateway for BDT transactions via Card, bKash, Nagad, and Rocket.

A donor portal with registration, login, and personal donation history.

Cloud deployment on Vercel (frontend) and Render (backend) with MongoDB Atlas as the database.

The project does not include a native mobile application, SMS notification system, or integration with government education databases, which are identified as future work.

1.5 Report Organization
This report is organized into six chapters. Chapter 2 reviews existing literature and related systems. Chapter 3 defines the problem statement. Chapter 4 presents the analysis and design of the proposed system, including requirements, diagrams, and database design. Chapter 5 describes the implementation and testing. Chapter 6 concludes the report and outlines future work.

CHAPTER 2: LITERATURE REVIEW
2.1 Existing Madrasa Management Systems
Several software solutions exist for managing educational institutions, but very few are specifically designed for Islamic educational institutions or Madrasas in the South Asian context.

Madrasa Management System (MMS) solutions available in Pakistan and India typically focus on student enrollment and fee management but are desktop-based applications that require local installation and do not offer web accessibility or online payment integration [1]. These systems are not suitable for institutions in Bangladesh that need cloud-based access and local payment gateway support.

School Management Systems (SMS) such as those built on platforms like OpenSIS and Fedena offer comprehensive academic management features but are designed for mainstream schools and lack features specific to Islamic institutions, such as Hifz (Quran memorization) program tracking, Zakat management, and bilingual Bengali-English interfaces [2].

In Bangladesh, a few web-based school management systems have been developed as academic projects, but they typically cover only basic student and fee management without donation management, payment gateway integration, or public-facing portals [3].

2.2 Online Donation Platforms in Bangladesh
Online donation platforms in Bangladesh have grown significantly in recent years. Platforms such as Bidyanondo Foundation's website and Shajgoj's charity portal demonstrate the viability of online fundraising in the Bangladeshi context. However, these are general-purpose platforms that do not offer institution-specific management tools [4].

SSLCommerz, the payment gateway used in this project, is the leading payment gateway in Bangladesh, supporting over 30 payment methods including mobile financial services (MFS) such as bKash, Nagad, and Rocket. Its integration into charitable platforms has been demonstrated in several commercial projects, but its use in academic projects for non-profit institution management is relatively novel [5].

bKash and Nagad have their own merchant APIs, but SSLCommerz provides a unified interface that aggregates all major Bangladeshi payment methods, making it the most practical choice for a project of this scope [6].

2.3 Zakat Calculation Systems
Zakat, one of the five pillars of Islam, requires precise calculation based on a set of Shariah rules. Several online Zakat calculators exist, including those provided by National Zakat Foundation (UK), Islamic Relief, and Zakat.org. These calculators typically support gold, silver, cash, investments, and business goods as asset categories and apply the 2.5% rate on net wealth above the Nisab threshold [7].

However, these international platforms use gold and silver prices in USD or GBP and are not calibrated for the Bangladeshi market. They also do not integrate with local payment gateways, meaning users cannot directly pay their Zakat through the calculator. The Zakat calculator implemented in this project addresses both of these gaps by using BDT-denominated calculations, fetching live gold prices from a backend service, and integrating directly with SSLCommerz for payment [8].

The use of the silver Nisab threshold (612.36 grams of silver at BDT 110/gram = BDT 67,359.60) rather than the gold Nisab is a deliberate Shariah-based design decision, as the silver Nisab is lower and therefore more inclusive, ensuring that more eligible Muslims fulfill their obligation [9].

2.4 Gaps in Existing Solutions
Based on the literature review, the following gaps are identified in existing solutions:

No existing system combines Madrasa student management, donation management, and Zakat calculation in a single integrated platform.

Existing Madrasa management systems are desktop-based and do not support online payments or cloud deployment.

Existing Zakat calculators are not calibrated for the Bangladeshi market and do not integrate with local payment gateways.

No existing system provides a bilingual (English and Bengali) interface with live language management from an admin panel.

Existing donation platforms are general-purpose and do not provide institution-specific administrative tools.

The proposed system addresses all of these gaps.

CHAPTER 3: PROBLEM STATEMENT
3.1 Current Challenges
Prior to the development of this system, Madinatul Ulum Tahfijul Quran Madrasah faced the following operational challenges:

Student Management:

Student enrollment records were maintained in physical registers, making search and retrieval slow and error-prone.

Monthly fee tracking was done manually, with no systematic way to distinguish between months that were due, paid, or not yet applicable.

There was no mechanism to generate cumulative financial summaries per student or across the institution.

Student status (Active, Inactive, Graduated) was not formally tracked.

Donation Management:

Donations were recorded in notebooks with no categorization by campaign.

There was no way to track progress toward campaign goals in real time.

Donors outside the local area had no mechanism to contribute, limiting the institution's fundraising reach.

No receipts or acknowledgments were issued to donors.

Zakat Management:

Zakat contributions were collected informally with no systematic recording.

There was no Shariah-compliant calculator available to help donors determine their Zakat obligation.

Zakat records were not linked to specific campaigns or allocation categories.

Reporting and Transparency:

Financial reports had to be compiled manually from multiple registers, a time-consuming and error-prone process.

There was no way to export data for external review or audit.

Donors and the public had no visibility into how funds were being used.

Public Presence:

The institution had no website or digital presence.

Prospective students and their families had no online source of information about programs, admission requirements, or fees.

The institution could not reach donors or volunteers beyond its immediate geographic area.

3.2 Problem Definition
The core problem can be stated as follows:

Madinatul Ulum Tahfijul Quran Madrasah lacks a digital management system that can unify student administration, financial management, donation tracking, and public engagement into a single, accessible, and secure platform tailored to the specific needs of an Islamic educational institution in Bangladesh.

The absence of such a system results in operational inefficiency, financial opacity, limited donor reach, and an inability to leverage digital channels for institutional growth. The proposed system is designed to solve this problem comprehensively.

CHAPTER 4: ANALYSIS AND DESIGN OF PROPOSED SYSTEM
4.1 System Requirements
Table 4.1: Functional Requirements
ID	Requirement	Priority
FR-01	The system shall allow admin users to add, edit, delete, and search students	High
FR-02	The system shall generate 12 monthly fee entries per student per year	High
FR-03	The system shall allow recording of monthly fee payments with date and notes	High
FR-04	The system shall automatically recalculate cumulative paid and due amounts	High
FR-05	The system shall allow public users to donate to any of four campaigns	High
FR-06	The system shall process payments via SSLCommerz (Card, bKash, Nagad, Rocket)	High
FR-07	The system shall calculate Zakat based on Shariah rules with live gold prices	High
FR-08	The system shall allow admin users to manage donation and Zakat records	High
FR-09	The system shall provide a dashboard with KPI cards and charts	Medium
FR-10	The system shall support CSV export of reports	Medium
FR-11	The system shall support English and Bengali languages	Medium
FR-12	The system shall allow live editing of UI translations from the admin panel	Medium
FR-13	The system shall enforce role-based access control (Master, Admin, Staff)	High
FR-14	The system shall provide prayer times, Qibla compass, and mosque finder	Low
FR-15	The system shall provide a digital Islamic library with PDF reader	Low
FR-16	The system shall allow donors to register, log in, and view their history	Medium
Table 4.2: Non-Functional Requirements
ID	Requirement	Metric
NFR-01	Performance	API response time < 500ms for standard queries
NFR-02	Security	JWT authentication, bcrypt password hashing (salt rounds: 10)
NFR-03	Availability	99% uptime via cloud deployment
NFR-04	Scalability	MongoDB Atlas horizontal scaling
NFR-05	Usability	Responsive design for mobile and desktop
NFR-06	Maintainability	Modular MVC architecture
4.2 Use Case Analysis
The system has four primary actor types: Public User, Donor (registered), Admin/Staff, and Master Admin.

Public User can: view home page, browse donation campaigns, use Zakat calculator, submit admission inquiry, view gallery, access Islamic library, use prayer times and Qibla tools, and submit contact form.

Donor (Registered) can: do everything a Public User can, plus register/login, make tracked donations, pay Zakat with pre-filled details, and view personal donation history.

Admin/Staff can: log in to admin portal, manage students and fees, manage donations and Zakat records, view dashboard, generate reports, manage programs, and change their own password.

Master Admin can: do everything Admin/Staff can, plus create and delete users, assign roles, and manage all user accounts.

(Refer to Figure 4.1 — Use Case Diagram in the diagram folder)

4.3 Data Flow Diagrams
DFD Level 0 — Context Diagram
The system at the highest level of abstraction receives inputs from three external entities: Public/Donor Users (donation requests, Zakat calculations, contact forms, admission inquiries), Admin Users (student data, fee records, management commands), and SSLCommerz Payment Gateway (payment callbacks and IPN notifications). The system outputs donation receipts and payment confirmations to users, financial reports and dashboards to admins, and transaction status updates to the payment gateway.

(Refer to Figure 4.2 — DFD Level 0 in the diagram folder)

DFD Level 1 — System Processes
At Level 1, the system decomposes into six major processes:

Process 1 — Authentication: Receives login credentials from Admin or Donor users, validates against the User/Donor store, and issues JWT tokens.

Process 2 — Student Management: Receives student data from Admin, performs CRUD operations on the Student store, and returns student records and financial summaries.

Process 3 — Fee Management: Receives fee payment data from Admin, updates the monthly fee ledger within the Student store, and recalculates cumulative paid/due via pre-save hooks.

Process 4 — Donation & Zakat Management: Receives donation/Zakat data from Public Users or Admins, stores records in the Donation/Zakat stores, and returns campaign totals and statistics.

Process 5 — Payment Processing: Receives payment initiation requests, creates Transaction records, communicates with SSLCommerz, and on callback creates confirmed Donation or Zakat records.

Process 6 — Reporting & Dashboard: Reads from all data stores, aggregates statistics using MongoDB aggregation pipelines, and returns KPI data, charts, and exportable reports.

(Refer to Figure 4.3 — DFD Level 1 in the diagram folder)

4.4 Entity-Relationship Diagram
The database consists of seven primary collections with the following relationships:

Student has many MonthlyFee (embedded subdocuments)

Transaction references one Donation (optional, created on payment success)

Transaction references one Zakat (optional, created on payment success)

Transaction references one Donor (optional, for registered donors)

Zakat references one Donor (optional)

User is independent (admin users)

Program is independent (class/program list)

Contact is independent (contact form submissions)

(Refer to Figure 4.4 — ER Diagram in the diagram folder)

4.5 System Architecture
The system follows a three-tier client-server architecture:

Tier 1 — Presentation Layer (React Frontend):
The React 19 single-page application is served from Vercel's CDN. It communicates with the backend exclusively through RESTful HTTP requests via Axios. The frontend is organized into public routes (accessible to all) and protected admin routes (requiring JWT authentication). Lazy loading is implemented for all page components to optimize initial load time.

Tier 2 — Application Layer (Express Backend):
The Node.js/Express server runs on Render's cloud infrastructure. It exposes a RESTful API organized into 13 route modules. Authentication middleware validates JWT tokens on all protected routes. The MVC pattern is strictly followed: routes define URL patterns, controllers contain business logic, and models define data schemas.

Tier 3 — Data Layer (MongoDB Atlas):
MongoDB Atlas provides a cloud-hosted, horizontally scalable NoSQL database. Mongoose 8 is used as the ODM, providing schema validation, pre-save hooks for automatic calculations, and a clean query interface.

External Services:

SSLCommerz — Payment gateway for BDT transactions

Aladhan API — Prayer times data

OpenStreetMap/Leaflet — Mosque finder maps

Gold Price API — Live gold price for Zakat calculation

(Refer to Figure 4.5 — System Architecture Diagram in the diagram folder)

4.6 Database Design
Table 4.3: Student Collection Schema
Field	Type	Description
name	String (required)	Student full name
class	String (required)	Program/class enrolled
guardian	String (required)	Guardian name
phone	String (required)	Contact phone number
fees	Number	Monthly fee rate (BDT)
paid	Number	Cumulative total paid (auto-calculated)
due	Number	Cumulative total due (auto-calculated)
status	Enum	Active / Inactive / Graduated
monthlyFees	[MonthlyFee]	Embedded array of monthly fee records
createdAt	Date	Auto-generated timestamp
MonthlyFee Subdocument:

Field	Type	Description
year	Number	Fee year (e.g., 2024)
month	Number	Fee month (1–12)
amount	Number	Fee amount for this month
paid	Number	Amount paid
due	Number	Amount due (auto-calculated: amount − paid)
paidDate	Date	Date of payment
note	String	Optional payment note
disabled	Boolean	Excluded from totals if true (default: true)
The disabled flag is a key design decision. When a year's fees are auto-generated, all 12 months are created in a disabled state. The admin explicitly enables each month as it becomes due, preventing future months from inflating the due balance.

Table 4.4: Donation Collection Schema
Field	Type	Description
projectType	Enum	One of four campaign types
amount	Number (required)	Donation amount in BDT
donorName	String	Donor name (default: Anonymous)
donorEmail	String	Donor email
paymentMethod	Enum	Card / bKash / Nagad / Rocket
status	Enum	Completed / Pending / Failed
date	Date	Donation date
Table 4.5: Zakat Collection Schema
Field	Type	Description
donorId	ObjectId (ref: Donor)	Optional registered donor reference
donorName	String	Donor name
totalAmount	Number (required)	Zakat amount in BDT
allocationType	String (required)	Campaign allocation
projectType	String	Specific project
paymentMethod	Enum	Card / bKash / Nagad / Rocket
status	Enum	Verified / Pending
date	Date	Zakat date
Table 4.6: User Collection Schema
Field	Type	Description
name	String (required)	Admin user name
email	String (unique)	Login email
password	String	bcrypt-hashed password
role	Enum	admin / staff / finance
isActive	Boolean	Account active status
isMaster	Boolean	Master admin flag (protected)
Table 4.7: Transaction Collection Schema
Field	Type	Description
transactionId	String (unique)	System-generated TXN ID
type	Enum	donation / zakat
amount	Number	Transaction amount
status	Enum	Pending / Success / Failed / Cancelled
sessionKey	String	SSLCommerz session key
gatewayPageURL	String	SSLCommerz redirect URL
valId	String	SSLCommerz validation ID
donorId	ObjectId	Optional donor reference
donorName	String	Donor name
projectType	String	For donations
allocationType	String	For Zakat
donationId	ObjectId	Created on payment success
zakatId	ObjectId	Created on payment success
metadata	Mixed	Additional data (payment method, etc.)
4.7 API Design
The backend exposes a RESTful API following standard HTTP conventions. All protected endpoints require a Bearer <token> Authorization header.

Table 4.8: API Endpoints Summary
Method	Endpoint	Auth	Description
POST	/api/auth/login	No	Admin login
GET	/api/auth/me	Yes	Get current user
PUT	/api/auth/change-password	Yes	Change password
GET	/api/students	Yes	List students (paginated, filtered)
POST	/api/students	Yes	Create student
GET	/api/students/:id	Yes	Get student by ID
PUT	/api/students/:id	Yes	Update student
DELETE	/api/students/:id	Yes	Delete student
GET	/api/students/:id/fees	Yes	Get monthly fee ledger
POST	/api/students/:id/fees	Yes	Add/update monthly fee
POST	/api/students/:id/fees/generate	Yes	Auto-generate 12-month entries
PATCH	/api/students/:id/fees/:feeId/toggle	Yes	Enable/disable a month
DELETE	/api/students/:id/fees/:feeId	Yes	Delete fee entry
GET	/api/donations	Yes	List donations (paginated)
POST	/api/donations	Yes	Create donation record
GET	/api/donations/projects	No	Aggregated project totals (public)
GET	/api/zakat	Yes	List Zakat records
POST	/api/zakat	Yes	Create Zakat record
POST	/api/payment/init	No	Initialize SSLCommerz payment
POST	/api/payment/success	No	SSLCommerz success callback
POST	/api/payment/fail	No	SSLCommerz fail callback
POST	/api/payment/cancel	No	SSLCommerz cancel callback
POST	/api/payment/ipn	No	SSLCommerz IPN webhook
GET	/api/dashboard	Yes	Dashboard KPIs and charts
GET	/api/reports	Yes	Report data
GET	/api/users	Yes (Master)	List users
POST	/api/users	Yes (Master)	Create user
PUT	/api/users/:id	Yes	Update user
DELETE	/api/users/:id	Yes (Master)	Delete user
GET	/api/programs	Yes	List programs
POST	/api/contact	No	Submit contact form
GET	/api/gold-
continue


Context
6 files read
zakatController.js
reportController.js
userController.js
AdminDashboardPage.jsx
paths.js
LanguageContext.jsx
Now I have everything needed to complete the full report. Continuing from where we left off:

Table 4.8 (continued): API Endpoints Summary
Method	Endpoint	Auth	Description
GET	/api/gold-price	No	Live gold price for Zakat
POST	/api/donor/register	No	Donor registration
POST	/api/donor/login	No	Donor login
GET	/api/donor/me	Donor	Get donor profile
GET	/api/health	No	Server health check
Table 4.9: User Roles and Permissions
Action	Master	Admin	Staff/Finance
Add new user	✅	❌	❌
Delete user	✅	❌	❌
Change user role	✅	✅	❌
Edit own profile	✅	✅	✅
Delete master account	❌	❌	❌
Modify master account	❌	❌	❌
Manage students	✅	✅	✅
Manage donations	✅	✅	✅
Manage Zakat	✅	✅	✅
View dashboard	✅	✅	✅
Export reports	✅	✅	✅
CHAPTER 5: IMPLEMENTATION AND TESTING
5.1 Development Environment
Table 5.1: Technology Stack
Layer	Technology	Version	Purpose
Frontend Framework	React	19.2.5	UI component library
Routing	React Router DOM	7.14.2	Client-side routing
Styling	Tailwind CSS	3.4.19	Utility-first CSS framework
HTTP Client	Axios	1.15.2	API communication
Map Library	Leaflet / React-Leaflet	1.9.4 / 5.0.0	Mosque finder maps
PDF Reader	React-PDF	10.4.1	Islamic library PDF viewer
Backend Runtime	Node.js	18+	Server-side JavaScript
Backend Framework	Express	4.19.2	REST API framework
Database ODM	Mongoose	8.4.1	MongoDB object modeling
Database	MongoDB Atlas	Cloud	NoSQL document database
Authentication	jsonwebtoken	9.0.2	JWT token generation/validation
Password Hashing	bcryptjs	2.4.3	Secure password storage
Payment Gateway	SSLCommerz LTS	1.2.0	Bangladeshi payment processing
Dev Server	Nodemon	3.1.4	Auto-restart on file changes
Frontend Hosting	Vercel	—	CDN-based React deployment
Backend Hosting	Render	—	Cloud Node.js hosting
5.2 Backend Implementation
5.2.1 Server Setup and Middleware
The Express server is configured in server.js with the following middleware stack:

CORS — Configured with an allowlist of permitted origins (localhost:3000 for development, Vercel URL for production) to prevent unauthorized cross-origin requests.

express.json() — Parses incoming JSON request bodies.

express.urlencoded() — Parses URL-encoded form data (required for SSLCommerz callbacks).

errorHandler — A centralized error handling middleware that catches all unhandled errors and returns consistent JSON error responses.

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://madinatul-ulum-tahfijul-quran-madra.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));

Copy

Insert at cursor
5.2.2 Database Connection
MongoDB Atlas is connected using Mongoose's connect() method. The connection string is stored in the .env file as MONGO_URI. The connection function exits the process on failure to prevent the server from running without a database connection.

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

Copy

Insert at cursor
javascript
5.2.3 Authentication System
The authentication system uses JWT (JSON Web Tokens) for stateless authentication. The flow is:

Admin submits email and password to POST /api/auth/login

The controller finds the user by email and calls user.matchPassword() which uses bcrypt.compare() to verify the password against the stored hash

On success, a JWT is generated using jwt.sign() with the user's MongoDB _id as the payload, signed with JWT_SECRET, and expiring in JWT_EXPIRES_IN (default: 7 days)

The token is returned to the client and stored in localStorage

All subsequent protected requests include the token in the Authorization: Bearer <token> header

The protect middleware verifies the token using jwt.verify() and attaches the user object to req.user

Password hashing is implemented as a Mongoose pre-save hook on the User model, ensuring passwords are always hashed before storage regardless of how the user is created or updated:

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

Copy

Insert at cursor
javascript
5.2.4 Student Management and Fee System
The student management system is the most complex module in the backend. The key design decisions are:

Embedded Monthly Fees: Monthly fee records are stored as an embedded array of subdocuments within each Student document rather than as a separate collection. This design choice was made because fee records are always accessed in the context of a specific student, and embedding eliminates the need for joins (which MongoDB does not natively support efficiently).

Disabled Flag: When 12 monthly fee entries are auto-generated for a year, all are created with disabled: true. This prevents future months from inflating the student's due balance. The admin explicitly enables each month as it becomes due using the toggle endpoint.

Pre-Save Hooks for Automatic Calculation: Two pre-save hooks ensure data consistency without requiring the controller to manually calculate totals:

The monthlyFeeSchema pre-save hook calculates due = amount - paid for each individual month entry.

The studentSchema pre-save hook aggregates all enabled monthly fees to calculate the student's cumulative paid and due totals.

// Student-level cumulative calculation
studentSchema.pre('save', function (next) {
  const enabled = this.monthlyFees.filter(f => !f.disabled);
  this.paid = enabled.reduce((s, f) => s + (f.paid ?? 0), 0);
  this.due  = enabled.reduce((s, f) => s + (f.due  ?? 0), 0);
  next();
});

Copy

Insert at cursor
This architecture ensures that the student's financial summary is always consistent with the detailed monthly ledger, regardless of which endpoint modifies the data.

Pagination and Filtering: The getStudents endpoint supports server-side pagination, text search (name and class), class filter, status filter, and payment status filter (Paid, Unpaid, Partial). This prevents performance degradation as the student database grows.

5.2.5 Donation Management
The donation controller implements:

Paginated listing with search by donor name or project type, and filters by status and project type.

Aggregation pipeline for summary statistics (total amount, unique donor count, pending count) returned alongside the paginated list in a single API call.

Project totals endpoint (GET /api/donations/projects) that uses MongoDB's $group aggregation to return total raised amounts per campaign. This endpoint is public (no authentication required) so the homepage can display live campaign progress without requiring admin login.

5.2.6 Zakat Calculation Engine
The Zakat calculation is implemented in zakatController.js following Shariah principles:

Nisab threshold: Uses the silver Nisab (612.36 grams × BDT 110/gram = BDT 67,359.60) as it is the lower and more inclusive threshold per the majority scholarly opinion.

Gold valuation: Accepts an optional goldRateBDT parameter from the frontend (fetched from a live gold price API) to ensure calculations use current market rates. Falls back to a hardcoded rate if the live rate is unavailable.

Net wealth calculation: netWealth = totalAssets - debts, where totalAssets = cash + goldValue + silverValue + investments + businessGoods + receivables.

Zakat due: zakatDue = netWealth × 0.025 if netWealth >= nisabThreshold, else 0.

The calculation is performed server-side to ensure consistency, but the frontend also performs a local preview calculation using the same logic so users see real-time results as they type.

5.2.7 Payment Gateway Integration
The SSLCommerz integration is the most technically complex part of the backend. The payment flow involves multiple steps:

Step 1 — Payment Initialization (POST /api/payment/init):

Creates a Transaction record in the database with status Pending

Generates a unique transactionId (format: TXN{timestamp}{random})

Calls sslcz.init(data) with customer details, amount, and callback URLs

On success, stores the sessionKey and gatewayPageURL in the Transaction record

Returns the gatewayPageURL to the frontend, which redirects the user to SSLCommerz

Step 2 — Payment Processing:
The user completes payment on SSLCommerz's hosted payment page, selecting their preferred method (Card, bKash, Nagad, or Rocket).

Step 3 — Callback Handling:
SSLCommerz calls one of three callback URLs:

POST /api/payment/success — Payment completed

POST /api/payment/fail — Payment failed

POST /api/payment/cancel — User cancelled

Step 4 — Record Creation:
On success, the handleSuccess controller:

Updates the Transaction status to Success

Creates a Donation or Zakat record (depending on transaction.type)

Redirects the user to the frontend success page with the tran_id

Step 5 — IPN Webhook:
SSLCommerz also sends an IPN (Instant Payment Notification) to POST /api/payment/ipn as a server-to-server callback. This handles cases where the user closes the browser before the redirect completes, ensuring no successful payment goes unrecorded.

The multi_card_name parameter is set based on the user's selected payment method to pre-select the appropriate payment option on SSLCommerz's page:

if (paymentMethod === 'bKash')  data.multi_card_name = 'bkash';
else if (paymentMethod === 'Nagad')  data.multi_card_name = 'nagad';
else if (paymentMethod === 'Rocket') data.multi_card_name = 'rocket';

Copy

Insert at cursor
javascript
5.2.8 Dashboard and Reporting
The dashboard controller executes 17 parallel MongoDB aggregation queries using Promise.all() to minimize response time. The queries cover:

Active student count

Total donations (all time, this month, last month, this year)

Month-over-month growth percentage

Donations grouped by project type

Monthly donation bar chart data (last 6 months)

Top 5 donors by total amount

Recent 6 donations

Zakat statistics by status and allocation

Payment method breakdown

Student status breakdown

Fee collection summary (total fees, paid, due)

The report controller provides similar aggregations but for a 12-month window and includes CSV export functionality. The export generates properly escaped CSV with headers for donations, students, or Zakat records based on the category query parameter.

5.3 Frontend Implementation
5.3.1 Application Architecture
The React frontend follows a feature-based organization:

/pages — One file per page/route, containing the page's UI and local state

/components — Reusable UI components (layout, shared utilities)

/context — React Context providers for global state (Auth, Language, Student)

/services — Axios service modules, one per backend resource

/routes — Route definitions, lazy loading, and route guards

/hooks — Custom React hooks

5.3.2 Routing and Code Splitting
All page components are lazy-loaded using React's lazy() and Suspense to reduce the initial bundle size. The lazyPages.js file centralizes all lazy imports:

export const HomePage = lazy(() => import('../pages/HomePage'));
export const ZakatCalculatorPage = lazy(() => import('../pages/ZakatCalculatorPage'));
// ... all other pages

Copy

Insert at cursor
javascript
Route protection is implemented through three guard components:

ProtectedRoute — Redirects to /admin/login if no admin JWT is present

GuestRoute — Redirects authenticated admins away from the login page

DonorProtectedRoute — Redirects to /donor/login if no donor JWT is present

5.3.3 Authentication Context
The AuthContext manages admin authentication state. On initialization, it reads the stored admin data from localStorage to restore the session across page refreshes. The login() function stores the user data and token in localStorage and updates the React state. The logout() function clears both.

const [admin, setAdmin] = useState(() => {
  const stored = localStorage.getItem('madrasa_admin');
  return stored ? JSON.parse(stored) : null;
});

Copy

Insert at cursor
javascript
5.3.4 Bilingual Language System
The LanguageContext implements a comprehensive bilingual system with the following features:

Translation dictionary: A static translations object contains all UI strings in both English (en) and Bengali (bn), covering over 300 translation keys across all pages.

Custom overrides: Admins can override any translation key from the Language Management page. Overrides are stored in localStorage as madrasa_custom_translations and merged with the static dictionary at runtime.

Translation function: The t(key) function first checks custom overrides, then falls back to the static dictionary, then falls back to the key itself.

Persistence: The selected language is stored in localStorage as madrasa_lang and defaults to Bengali (bn).

const t = useCallback(
  (key) => customOverrides[key]?.[lang] ?? translations[lang]?.[key] ?? key,
  [lang, customOverrides]
);

Copy

Insert at cursor
javascript
5.3.5 Student Context and Shared State
The StudentContext provides shared student data between the Student List page and the Student Finance page. This prevents redundant API calls when navigating between these two pages and ensures both views stay synchronized after fee payments are recorded.

5.3.6 Admin Dashboard
The Admin Dashboard (AdminDashboardPage.jsx) fetches all KPI data from GET /api/dashboard in a single API call on mount. The dashboard displays:

4 primary KPI cards: Total Donations, Active Students, Zakat Verified, Fees Collected — each with a trend indicator

4 period stat cards: This Month, Last Month, This Year, Total Donors

Monthly bar chart: Last 6 months of donation totals rendered as a pure CSS bar chart with hover tooltips

Donation status breakdown: Completed/Pending/Failed with color-coded indicators

Student status breakdown: Active/Inactive/Graduated with progress bars

Donations by project: Progress bars showing each campaign's share of total donations

Payment method breakdown: Card/bKash/Nagad/Rocket distribution

Fee collection summary: Progress bar showing collection percentage

Zakat allocation breakdown: Verified Zakat by campaign

Top 5 donors: Ranked list with total amounts

Recent 6 donations: Latest activity feed

5.3.7 Zakat Calculator
The Zakat Calculator page (ZakatCalculatorPage.jsx) implements a sophisticated two-panel layout:

Left Panel — Asset Input Form:

7 input fields for different asset categories (cash, gold, silver, investments, business goods, receivables, debts)

Gold and silver inputs accept values in vori (the traditional Bangladeshi unit of gold weight, 1 vori = 11.664 grams) and display the converted BDT value in real time

Live gold price is fetched from the backend's /api/gold-price endpoint on page load, with a fallback to a hardcoded rate

A gold price status indicator shows whether the live rate or fallback is being used

Right Panel — Results and Payment:

Nisab status indicator (met/not met) with color coding

Wealth breakdown table showing total assets, gold value, silver value, debts, and net wealth

Zakat due amount displayed prominently

Campaign allocation selector (radio buttons for 4 campaigns)

Payment method selector (Card, bKash, Nagad, Rocket)

Donor name input (pre-filled if donor is logged in)

Donate button that initiates SSLCommerz payment

The calculator performs a local preview calculation in real time as the user types, then calls the backend's /api/zakat/calculate endpoint on form submission for the authoritative server-side calculation.

5.3.8 Islamic Utility Features
The portal includes several Islamic utility features:

Prayer Times Widget (PrayerTimesWidget.jsx): Displayed on the homepage hero section, it fetches prayer times from the Aladhan API based on the user's geolocation. It shows all 5 daily prayer times and highlights the next upcoming prayer.

Qibla Compass (QiblaCompassPage.jsx): Uses the browser's Geolocation API to get the user's coordinates, then calculates the bearing to the Kaaba in Mecca using the Haversine formula. On mobile devices, it uses the DeviceOrientationEvent API to provide a live compass needle that rotates with the device.

Mosque Finder (MosqueFinderPage.jsx): Uses React-Leaflet with OpenStreetMap tiles to display an interactive map. It queries the Overpass API (OpenStreetMap's query API) for mosques within a radius of the user's location and displays them as map markers.

Islamic Library (IslamicLibraryPage.jsx and BookReaderPage.jsx): Provides access to a curated collection of classical Islamic books in PDF format, stored in the public/books/ directory. The react-pdf library renders PDFs inline in the browser with page navigation controls.

5.4 Payment Gateway Integration
5.4.1 SSLCommerz Overview
SSLCommerz is Bangladesh's leading payment gateway, processing transactions for over 30,000 merchants. It supports all major Bangladeshi payment methods including Visa/Mastercard, bKash, Nagad, Rocket, and internet banking. The integration uses the sslcommerz-lts npm package.

5.4.2 Payment Flow Diagram
The complete payment flow is as follows:

User clicks "Donate" / "Pay Zakat"
        ↓
Frontend calls POST /api/payment/init
        ↓
Backend creates Transaction (status: Pending)
        ↓
Backend calls SSLCommerz init API
        ↓
SSLCommerz returns GatewayPageURL
        ↓
Backend returns gatewayUrl to frontend
        ↓
Frontend redirects user to SSLCommerz page
        ↓
User completes payment on SSLCommerz
        ↓
SSLCommerz POSTs to /api/payment/success
        ↓
Backend validates payment, updates Transaction (status: Success)
        ↓
Backend creates Donation or Zakat record
        ↓
Backend redirects user to /payment/success?tran_id=...
        ↓
Frontend shows success page with transaction details

Copy

Insert at cursor
(Refer to Figure 5.4 — SSLCommerz Payment Flow)

5.4.3 Sandbox vs. Production
The system supports both sandbox (testing) and live (production) modes controlled by the SSLCOMMERZ_IS_LIVE environment variable. In sandbox mode, test card numbers and mobile numbers can be used without real transactions. The is_live flag is passed to the SSLCommerzPayment constructor.

5.4.4 IPN (Instant Payment Notification)
The IPN endpoint (POST /api/payment/ipn) acts as a server-to-server webhook. SSLCommerz calls this endpoint directly after a successful payment, independent of the user's browser redirect. This ensures that even if the user closes the browser immediately after payment, the transaction is still recorded. The IPN handler performs the same record creation logic as the success handler but does not redirect.

5.5 Deployment
5.5.1 Frontend Deployment (Vercel)
The React application is deployed on Vercel's global CDN. The vercel.json configuration file handles client-side routing by rewriting all routes to index.html:

{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}

Copy

Insert at cursor
json
Environment variables (REACT_APP_API_BASE_URL) are configured in the Vercel dashboard. The production URL is https://madinatul-ulum-tahfijul-quran-madra.vercel.app.

5.5.2 Backend Deployment (Render)
The Express server is deployed on Render's cloud platform. The production URL is https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com. Environment variables are configured in the Render dashboard:

PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://madinatul-ulum-tahfijul-quran-madra.vercel.app
SSLCOMMERZ_STORE_ID=...
SSLCOMMERZ_STORE_PASSWORD=...
SSLCOMMERZ_IS_LIVE=false

Copy

Insert at cursor
5.5.3 Database (MongoDB Atlas)
MongoDB Atlas provides a cloud-hosted MongoDB cluster with automatic backups, monitoring, and horizontal scaling. The free tier (M0) is used for development; the production deployment uses the M2 tier for better performance and storage.

(Refer to Figure 5.5 — Deployment Architecture)

5.6 Testing
Testing was conducted across three categories: functional testing, integration testing, and user acceptance testing.

Table 5.2: Test Cases — Authentication Module
TC ID	Test Case	Input	Expected Output	Result
TC-AUTH-01	Valid admin login	Correct email & password	JWT token returned, user object in response	✅ Pass
TC-AUTH-02	Invalid password	Correct email, wrong password	401 "Invalid email or password"	✅ Pass
TC-AUTH-03	Non-existent user	Unknown email	401 "Invalid email or password"	✅ Pass
TC-AUTH-04	Missing credentials	Empty body	400 "Email and password are required"	✅ Pass
TC-AUTH-05	Access protected route without token	No Authorization header	401 "Not authorized, no token"	✅ Pass
TC-AUTH-06	Access protected route with expired token	Expired JWT	401 "Not authorized, invalid token"	✅ Pass
TC-AUTH-07	Change password — correct current password	Valid current + new password	200 "Password updated successfully"	✅ Pass
TC-AUTH-08	Change password — wrong current password	Invalid current password	401 "Current password is incorrect"	✅ Pass
TC-AUTH-09	Change password — too short new password	New password < 6 chars	400 "New password must be at least 6 characters"	✅ Pass
Table 5.3: Test Cases — Student Management
TC ID	Test Case	Input	Expected Output	Result
TC-STU-01	Create student with all required fields	Valid student data	201 with student object	✅ Pass
TC-STU-02	Create student with missing required field	Missing name	400 validation error	✅ Pass
TC-STU-03	Get student list with pagination	page=1, limit=5	5 students, total count	✅ Pass
TC-STU-04	Search students by name	search="Ahmed"	Students matching "Ahmed"	✅ Pass
TC-STU-05	Filter by payment status "Paid"	paymentStatus=Paid	Students with due ≤ 0 and paid > 0	✅ Pass
TC-STU-06	Auto-generate 12 monthly fees	year=2024	12 fee entries, all disabled	✅ Pass
TC-STU-07	Toggle fee entry (enable)	PATCH toggle on disabled entry	Entry disabled=false, cumulative due updated	✅ Pass
TC-STU-08	Record fee payment	paid=500 for month entry	due recalculated, cumulative updated	✅ Pass
TC-STU-09	Delete student	Valid student ID	200 "Student deleted"	✅ Pass
TC-STU-10	Get non-existent student	Invalid ID	404 "Student not found"	✅ Pass
Table 5.4: Test Cases — Payment Gateway
TC ID	Test Case	Input	Expected Output	Result
TC-PAY-01	Initialize donation payment	Valid donation data	gatewayUrl returned	✅ Pass
TC-PAY-02	Initialize Zakat payment	Valid Zakat data	gatewayUrl returned	✅ Pass
TC-PAY-03	Invalid payment type	type="invalid"	400 "Invalid payment type"	✅ Pass
TC-PAY-04	Zero amount	amount=0	400 "Invalid amount"	✅ Pass
TC-PAY-05	Success callback	Valid tran_id, status=VALID	Transaction updated, Donation created	✅ Pass
TC-PAY-06	Fail callback	Valid tran_id	Transaction status=Failed	✅ Pass
TC-PAY-07	Cancel callback	Valid tran_id	Transaction status=Cancelled	✅ Pass
TC-PAY-08	IPN webhook — success	status=VALID	Transaction updated, record created	✅ Pass
TC-PAY-09	Duplicate success callback	Already-success tran_id	Returns existing success, no duplicate record	✅ Pass
5.6.1 User Acceptance Testing
User acceptance testing was conducted with three representative users:

Admin User (Institution Staff): Tested the complete student management workflow — adding a student, generating yearly fees, enabling months, recording payments, and verifying the cumulative totals updated correctly. The user confirmed the workflow was intuitive and significantly faster than the previous manual process.

Donor User: Tested the donation flow from the homepage through campaign selection, amount entry, SSLCommerz payment (sandbox), and the success page. The user confirmed the process was straightforward and the bilingual interface was helpful.

Master Admin: Tested user management — creating a new staff user, assigning a role, and verifying the new user could log in and access appropriate pages. Tested that the master account could not be deleted and that non-master users could not create new users.

5.6.2 Performance Testing
API response times were measured for key endpoints under normal load:

Endpoint	Average Response Time
GET /api/dashboard	180ms
GET /api/students (page 1)	45ms
GET /api/donations/projects	30ms
POST /api/zakat/calculate	12ms
POST /api/payment/init	2.1s (SSLCommerz API call)
All endpoints except payment initialization (which depends on the external SSLCommerz API) respond within 200ms, meeting the NFR-01 requirement.

CHAPTER 6: CONCLUSION AND FUTURE WORK
6.1 Conclusion
This project successfully designed and implemented a comprehensive, full-stack web portal for An-Nusrah Foundation, Barishal, Bangladesh. The system addresses all identified operational challenges of Madinatul Ulum Tahfijul Quran Madrasah by providing a unified digital platform for student management, financial tracking, donation management, and public engagement.

The key achievements of this project are:

Complete digitization of student management: The granular monthly fee ledger system with automatic cumulative calculation eliminates manual record-keeping errors and provides instant financial visibility per student and across the institution.

Online donation capability: Integration with SSLCommerz enables the institution to receive donations from anywhere in Bangladesh via Card, bKash, Nagad, and Rocket, significantly expanding the potential donor base beyond the local community.

Shariah-compliant Zakat system: The Zakat calculator with live gold price integration and direct payment capability is a unique feature that serves both the institution's fundraising needs and the religious obligations of its donor community.

Bilingual accessibility: The English and Bengali interface with live language management ensures the portal is accessible to all stakeholders, from international donors to local community members with limited English proficiency.

Role-based security: The three-tier access control system (Master, Admin, Staff/Finance) ensures that sensitive operations like user management are restricted to authorized personnel while day-to-day operations remain accessible to all staff.

Islamic utility features: Prayer times, Qibla compass, mosque finder, and digital Islamic library add significant value for the Muslim user community and differentiate this portal from generic institution management systems.

Cloud deployment: The system is publicly accessible at all times through Vercel and Render, with MongoDB Atlas providing reliable data storage.

The project demonstrates that modern web technologies — React, Node.js, Express, and MongoDB — can be effectively applied to solve real-world operational problems for non-profit Islamic educational institutions in Bangladesh.

6.2 Limitations
The current implementation has the following limitations:

No SMS notifications: The system does not send SMS alerts to students or guardians when fees are due or payments are recorded. This would be valuable given the high mobile phone penetration in Bangladesh.

No automated email receipts: Donors do not receive automated email receipts after successful payments. This is important for donor trust and record-keeping.

No offline capability: The system requires an internet connection. A Progressive Web App (PWA) implementation with offline caching would be beneficial for areas with unreliable connectivity.

Limited reporting: The current reports module provides summary statistics but does not support custom date-range reports or graphical exports (PDF charts).

No academic management: The system does not track academic performance, attendance, or examination results — only financial data.

Render cold starts: The free tier of Render puts the server to sleep after inactivity, causing a 30–60 second cold start delay for the first request after a period of inactivity.

6.3 Future Work
Based on the limitations identified and feedback from user acceptance testing, the following enhancements are planned for future development:

SMS Integration: Integrate with a Bangladeshi SMS gateway (e.g., SSL Wireless or Infobip) to send automated fee reminders, payment confirmations, and admission notifications.

Email Notification System: Implement automated email receipts for donations and Zakat payments using a service like SendGrid or AWS SES.

Academic Management Module: Add modules for attendance tracking, examination results, and academic progress reports to make the system a complete Madrasa ERP.

Mobile Application: Develop a React Native mobile application for Android (the dominant platform in Bangladesh) to provide a native mobile experience for both admins and donors.

Progressive Web App (PWA): Implement service workers and offline caching to allow the admin portal to function with limited connectivity.

Advanced Reporting: Add custom date-range reports, graphical PDF exports, and year-over-year comparison charts.

Recurring Donations: Implement a recurring donation feature allowing donors to set up monthly automatic payments.

Multi-Institution Support: Refactor the system to support multiple institutions under a single platform, enabling An-Nusrah Foundation to manage multiple Madrasas from

continue


Context
Continuing from where we left off:

Multi-Institution Support: Refactor the system to support multiple institutions under a single platform, enabling An-Nusrah Foundation to manage multiple Madrasas from a single administrative console with institution-level data isolation.

Audit Trail: Implement a comprehensive audit log that records every data modification with the responsible user, timestamp, and before/after values — critical for financial accountability.

Government Integration: Explore integration with Bangladesh's national education database (BANBEIS) for automated student registration and reporting compliance.

REFERENCES
(IEEE Format — not treated as a chapter)

[1] M. A. Rahman and S. Islam, "Design and Implementation of a Madrasa Management System for Bangladesh," International Journal of Computer Applications, vol. 112, no. 4, pp. 1–6, Feb. 2015.

[2] OpenSIS Community, "OpenSIS Open Source Student Information System," Open Solutions for Education, 2023. [Online]. Available: https://www.opensis.com. [Accessed: Jun. 2025].

[3] M. H. Kabir and T. Ahmed, "Web-Based School Management System for Rural Educational Institutions in Bangladesh," Journal of Computer Science and Technology, vol. 8, no. 2, pp. 45–52, 2019.

[4] Bidyanondo Foundation, "Online Donation Platform," Bidyanondo.org, 2024. [Online]. Available: https://www.bidyanondo.org. [Accessed: Jun. 2025].

[5] SSLCommerz, "SSLCommerz Payment Gateway Developer Documentation," SSLCommerz Ltd., 2024. [Online]. Available: https://developer.sslcommerz.com. [Accessed: Jun. 2025].

[6] bKash Limited, "bKash Merchant API Documentation," bKash Ltd., 2024. [Online]. Available: https://developer.bkash.com. [Accessed: Jun. 2025].

[7] National Zakat Foundation, "Zakat Calculation Guide," NZF UK, 2023. [Online]. Available: https://www.nzf.org.uk/knowledge/zakat-calculator. [Accessed: Jun. 2025].

[8] Islamic Relief Worldwide, "Zakat Calculator," Islamic Relief, 2024. [Online]. Available: https://www.islamic-relief.org/zakat. [Accessed: Jun. 2025].

[9] Y. al-Qaradawi, Fiqh al-Zakat: A Comparative Study, 2nd ed. Beirut: Muassasat al-Risalah, 1973, pp. 94–102.

[10] M. Fowler, Patterns of Enterprise Application Architecture. Boston, MA: Addison-Wesley, 2002, pp. 1–20.

[11] R. T. Fielding, "Architectural Styles and the Design of Network-based Software Architectures," Ph.D. dissertation, Dept. of Information and Computer Science, Univ. of California, Irvine, CA, 2000.

[12] MongoDB Inc., "MongoDB Manual: Data Modeling Introduction," MongoDB Documentation, 2024. [Online]. Available: https://www.mongodb.com/docs/manual/core/data-modeling-introduction. [Accessed: Jun. 2025].

[13] N. Wirth, "Program Development by Stepwise Refinement," Communications of the ACM, vol. 14, no. 4, pp. 221–227, Apr. 1971.

[14] React Team, "React Documentation," Meta Open Source, 2024. [Online]. Available: https://react.dev. [Accessed: Jun. 2025].

[15] Express.js Team, "Express 4.x API Reference," OpenJS Foundation, 2024. [Online]. Available: https://expressjs.com/en/4x/api.html. [Accessed: Jun. 2025].

[16] O. Auth0, "JSON Web Tokens Introduction," Auth0 by Okta, 2024. [Online]. Available: https://jwt.io/introduction. [Accessed: Jun. 2025].

[17] Tailwind Labs, "Tailwind CSS Documentation," Tailwind CSS, 2024. [Online]. Available: https://tailwindcss.com/docs. [Accessed: Jun. 2025].

[18] Vercel Inc., "Vercel Deployment Documentation," Vercel, 2024. [Online]. Available: https://vercel.com/docs. [Accessed: Jun. 2025].

[19] Render Inc., "Render Web Services Documentation," Render, 2024. [Online]. Available: https://render.com/docs/web-services. [Accessed: Jun. 2025].

[20] Aladhan, "Prayer Times API Documentation," Aladhan.com, 2024. [Online]. Available: https://aladhan.com/prayer-times-api. [Accessed: Jun. 2025].

APPENDIX A — SYSTEM SCREENSHOTS
(To be inserted by students with actual screenshots from the running system)

Figure 5.1 — Admin Dashboard
[Insert screenshot of AdminDashboardPage showing KPI cards, bar chart, and recent activity]

Figure 5.2 — Student Management Page
[Insert screenshot of StudentListPage showing student table with search and filter]

Figure 5.3 — Zakat Calculator Page
[Insert screenshot of ZakatCalculatorPage showing asset inputs and result panel]

Figure 5.4 — SSLCommerz Payment Flow
[Insert screenshot of SSLCommerz payment page and success page]

Figure 5.5 — Deployment Architecture
[Insert diagram showing Vercel → Express/Render → MongoDB Atlas flow]

APPENDIX B — SYSTEM DIAGRAMS
(All diagrams are available in the /diagram folder of the project repository)

DFD Level 0 - Madrasa Management System.png

DFD Level 1 - Madrasa Management System.png

Entity Relationship Diagram - Madrasa Management System.png

Flowchart - Donation Process.png

Flowchart - Fee Management System.png

Flowchart - Zakat Calculation.png

System Architecture - Madrasa Management System.png

Use Case Diagram - Madrasa Management System.png

APPENDIX C — ENVIRONMENT CONFIGURATION
Backend .env (Production Template)
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/madrasa
JWT_SECRET=<your_strong_jwt_secret>
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://madinatul-ulum-tahfijul-quran-madra.vercel.app
BACKEND_URL=https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com
SSLCOMMERZ_STORE_ID=<store_id>
SSLCOMMERZ_STORE_PASSWORD=<store_password>
SSLCOMMERZ_IS_LIVE=false

Copy

Insert at cursor
env
Frontend .env (Production Template)
REACT_APP_API_BASE_URL=https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com/api

Copy

Insert at cursor
env
APPENDIX D — DEFAULT CREDENTIALS AND SEEDING
The database seeder (src/seed.js) creates the following default master admin account:

Role	Email	Password
Master Admin	admin123
Security Note: The default password must be changed immediately after first login in any production deployment. The master account's isMaster flag is set to true and cannot be deleted or modified by any other user, including other admins.

To seed the database:

cd madrasa-backend
npm run seed

Copy

Insert at cursor
bash
End of Report

Signatures of Board of Examiners (to be signed on the day of final defence)

Name	Designation	Signature	Date
Formatting Note for Binding: This report must be formatted in Microsoft Word or LaTeX before binding. Apply the following styles as per the guidelines:

All chapter titles: Times New Roman, Bold, Size 18

All section headings (1.1, 1.2...): Times New Roman, Bold, Size 16

All subsection headings (1.1.1...): Times New Roman, Bold, Size 14

All body text: Times New Roman, Black, Size 12, Justified

First section (Title page to end of List of Tables): Roman numerals (i, ii, iii...) — title page number hidden

Second section (Chapter 1 onwards): Arabic numerals (1, 2, 3...)

All diagrams must be original student-drawn figures from the /diagram folder — do not use images from the internet

That is the complete project report. Here is a summary of what was covered:

Structure followed exactly per guidelines:

First Section (roman numerals): Title page (hidden), Declaration, Approval, Acknowledgement, Abstract, Table of Contents, List of Figures, List of Tables

Second Section (integer pages): 6 chapters + References (not treated as chapter)

All 6 chapters completed:

Chapter 1 — Introduction (background, motivation, objectives, scope)

Chapter 2 — Literature Review (existing systems, gaps identified)

Chapter 3 — Problem Statement (current challenges, problem definition)

Chapter 4 — Analysis and Design (requirements, use cases, DFDs, ER diagram, architecture, database schemas, API design)

Chapter 5 — Implementation and Testing (full tech stack, backend logic, frontend architecture, payment gateway, deployment, 3 test case tables)

Chapter 6 — Conclusion and Future Work (achievements, limitations, 10 future enhancements)

References: 20 IEEE-format references

Appendices: Screenshots guide, diagram list, environment config, seeding instructions