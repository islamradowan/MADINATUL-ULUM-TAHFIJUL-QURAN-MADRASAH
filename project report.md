PROJECT REPORT
Title: Madinatul Ulum Tahfijul Quran Madrasah — Web Portal
Submitted in partial fulfilment of the requirements for the degree of Bachelor of Science in Computer Science & Engineering
________________________________________
ABSTRACT
This project presents the design, development, and deployment of a comprehensive web-based management portal for Madinatul Ulum Tahfijul Quran Madrasah, an Islamic educational institution in Barishal, Bangladesh. The system addresses critical operational challenges including student record management, monthly fee tracking, donation campaign management, and Shariah-compliant Zakat calculation. Built using the MERN stack (MongoDB, Express, React, Node.js), the portal serves both the general public and administrative staff through distinct interfaces. The system features bilingual support (English and Bengali), role-based access control, real-time financial transparency, and automated fee calculation. Successfully deployed on cloud infrastructure, the portal has replaced the institution's manual paper-based processes with a scalable digital solution.
Keywords: Web Portal, Student Management System, Donation Management, Zakat Calculator, MERN Stack, Educational Technology
________________________________________
Chapter 1: INTRODUCTION
1.1 Background
Educational institutions in developing countries, particularly Islamic madrasas, face significant administrative challenges due to reliance on manual record-keeping systems. Madinatul Ulum Tahfijul Quran Madrasah, established in 2018 in Barishal, Bangladesh, operates three academic programs: Hifz Quran, Aalim, and Combined Excellence. Prior to this project, the institution managed all operations through paper registers, leading to inefficiencies, data loss, and lack of accountability.
1.2 Problem Statement
The institution faced four interconnected operational challenges:
1.	Fragmented Student Records - Student information was scattered across multiple paper registers with no centralized access
2.	Manual Fee Tracking - Monthly tuition collection was recorded in handwritten ledgers with no systematic tracking
3.	Lack of Donation Transparency - No mechanism to show donors campaign progress or fund allocation
4.	Absence of Zakat Management - No digital tool for Shariah-compliant Zakat calculation and distribution tracking
1.3 Objectives
1.	Design and develop a dual-portal web application serving both public users and administrative staff
2.	Implement comprehensive student management with automated monthly fee ledger
3.	Build a donation management platform with real-time campaign progress tracking
4.	Develop a Shariah-compliant Zakat calculator implementing Islamic jurisprudence
5.	Provide public financial transparency through live dashboards
6.	Support bilingual operation with complete English and Bengali interfaces
7.	Deploy the system to production on cloud infrastructure
1.4 Scope
Public Portal: Institutional information, three donation campaigns, Zakat calculator, transparency dashboard, photo gallery, contact form, bilingual interface
Admin Portal: Student management, monthly fee ledger, donation records, Zakat management, dashboard with KPIs, financial reports with CSV export, user management, program management, language editing
________________________________________
Chapter 2: LITERATURE REVIEW
2.1 Existing School Management Systems
Several school management systems exist globally including Fedena, OpenSIS, SchoolTool, and Gibbon. However, these are designed for secular institutions and lack Islamic-specific features such as Zakat calculation, donation campaign management, and Bengali language support. Research shows these systems do not accommodate the unique structure of madrasa education or Islamic financial instruments.
2.2 Islamic Financial Technology
The Islamic FinTech field has grown significantly with applications addressing Zakat calculation. However, these are typically standalone tools not integrated with institutional management systems. Research by Hassan and Mahlknecht (2011) emphasizes the importance of Shariah compliance in financial technology, particularly regarding Nisab calculation and fund allocation transparency.
2.3 Web Technologies for Educational Systems
The MERN stack has emerged as a popular choice for full-stack JavaScript development. Research by Patel et al. (2020) found that React-based single-page applications provide superior user experience for data-intensive administrative interfaces. Studies on MongoDB by Boicea et al. (2012) demonstrate that document-oriented databases are well-suited for educational systems where schemas evolve over time.
2.4 Research Gap
No existing solution addresses the combined requirements of madrasa-specific student management, Islamic donation campaigns, Shariah-compliant Zakat calculation, and Bengali language support in a single integrated platform. This project fills that gap.
________________________________________
Chapter 3: SYSTEM ANALYSIS AND DESIGN
3.1 Requirements Analysis
Functional Requirements:
•	Student CRUD operations with search, filter, and pagination
•	Auto-generate 12 monthly fee entries per student per year
•	Record payments with automatic cumulative calculation
•	Donation management with real-time campaign progress
•	Zakat calculator based on Nisab threshold (612.36g silver)
•	Role-based access control (Master, Admin, Staff)
•	Live transparency dashboard for public viewing
•	Bilingual UI with editable translations
•	CSV export for reports
Non-Functional Requirements:
•	API response time under 2 seconds
•	JWT tokens with 7-day expiration
•	Bcrypt password hashing
•	CORS restricted to registered frontend domain
•	Responsive design for mobile, tablet, desktop
3.2 System Architecture
The system follows a three-tier client-server architecture:
Presentation Tier: React 19 single-page application with Tailwind CSS, deployed on Vercel CDN
Application Tier: Node.js + Express 4 REST API with JWT authentication, deployed on Render cloud platform
Data Tier: MongoDB Atlas cloud database with 6 collections (Students, Donations, Zakat, Users, Programs, Contact)
3.3 Database Design
Students Collection: Stores student records with embedded monthly fee array. Cumulative paid/due amounts auto-calculated via database middleware hooks.
Donations Collection: Records transactions with project type, amount, donor name, payment method, status, and timestamp.
Zakat Collection: Stores Zakat records with allocation type and verification status for approval workflow.
Users Collection: Maintains admin accounts with role-based permissions (admin, staff, finance) and master flag.
Programs Collection: Manages academic program definitions dynamically.
Contact Collection: Archives public contact form submissions.
3.4 API Design
The REST API provides 25 endpoints across 10 resource groups:
•	Authentication: Login, get current user, change password
•	Students: CRUD, search, filter, pagination
•	Student Fees: Upsert, generate year, toggle, delete
•	Donations: List, create, project aggregation
•	Zakat: Calculate, donate, list, verify
•	Dashboard: Aggregated KPI stats
•	Reports: Summary data, CSV export
•	Users: CRUD with role control
•	Programs: Manage class list
•	Transparency: Public financial data
All endpoints return JSON with consistent structure including data payload, error messages, and pagination metadata.
3.5 Security Design
•	Authentication: JWT-based stateless authentication with 7-day token expiration
•	Password Security: Bcrypt hashing with 10 salt rounds
•	Authorization: Role-based access control with hierarchical permissions
•	CORS Policy: Restricted to registered frontend domain only
•	Input Validation: Client and server-side validation with Mongoose schema enforcement
•	HTTPS Encryption: All communication encrypted in transit
•	Environment Variables: Sensitive configuration stored securely, never in version control
3.6 User Interface Design
The interface follows Material Design principles with Islamic aesthetic adaptations using green and gold tones. Navigation uses horizontal bar for public portal and collapsible sidebar for admin portal. Responsive design adapts to three breakpoints (mobile, tablet, desktop). Bilingual support with instant language switching. Forms use inline validation with clear error messages. Data tables include pagination and action buttons. Charts use color-coded visualizations with tooltips.
________________________________________
Chapter 4: IMPLEMENTATION
4.1 Technology Stack
Layer	Technology	Justification
Frontend	React 19	Component-based architecture, virtual DOM performance
Routing	React Router 7	Declarative client-side routing
Styling	Tailwind CSS 3	Utility-first rapid development
Backend	Express 4	Minimal, flexible Node.js framework
Database	MongoDB Atlas	Flexible schema, cloud-hosted
ODM	Mongoose 8	Schema validation, middleware hooks
Authentication	JWT + bcryptjs	Stateless auth, secure hashing
HTTP Client	Axios	Interceptors, error handling
Frontend Hosting	Vercel	Zero-config deployment, global CDN
Backend Hosting	Render	Free-tier Node.js hosting
4.2 Development Methodology
Phase 1 - Foundation (Weeks 1-2): Project structure, database schema, authentication, basic student CRUD
Phase 2 - Core Features (Weeks 3-5): Monthly fee ledger, donation management, Zakat calculator, admin dashboard
Phase 3 - Public Portal (Weeks 6-7): Public pages, transparency dashboard, gallery, contact form, bilingual support
Phase 4 - Polish and Deployment (Weeks 8-9): User management, language editing, CSV export, testing, production deployment
4.3 Key Implementation Challenges
Automatic Fee Calculation: Implemented database middleware hooks that trigger on every save, recalculating cumulative totals from all enabled monthly entries.
Shariah-Compliant Zakat: Researched Islamic jurisprudence to implement silver Nisab standard (612.36g). Created calculation engine converting asset weights to currency, computing net wealth, checking Nisab threshold, and applying 2.5% rate.
Real-Time Dashboard: Implemented 17 parallel aggregation queries using Promise.all() for efficient server-side computation with client-side caching.
Bilingual Support: Created centralized translation object with 300+ keys organized by page. Built admin interface for live translation editing with localStorage persistence.
Mobile Responsiveness: Used Tailwind breakpoints for responsive tables, collapsible sidebar, and bottom navigation on mobile devices.
4.4 Deployment Process
Version Control: GitHub repository with automatic deployment triggers
Frontend: Vercel connected to GitHub with automatic deployment on push to main branch
Backend: Render with manual deployment triggers through dashboard
Database: MongoDB Atlas free tier with IP whitelist configuration
Monitoring: Vercel analytics, Render logs, MongoDB Atlas performance metrics
________________________________________
Chapter 5: SYSTEM FEATURES
5.1 Public Portal
•	Home Page: Hero section, active campaigns with live progress bars, institution statistics
•	About Page: Mission, vision, heritage, guiding principles
•	Admission Page: Program descriptions, requirements, facilities, inquiry form
•	Donation Campaigns: Three campaigns (Madrasa ৳1,50,000; Mosque ৳12,00,000; Student Support ৳1,20,000) with real-time tracking
•	Zakat Calculator: Asset input, Nisab check, Zakat computation, payment recording
•	Transparency Dashboard: Fund distribution charts, monthly trends, project progress, documents
•	Photo Gallery: Categorized images with filter tabs
•	Contact Page: Form with subject categories
5.2 Admin Portal
•	Dashboard: 4 KPI cards, monthly bar chart, donation breakdown, student breakdown, top donors, fee collection progress
•	Student Management: Paginated list with search/filter, full CRUD, individual profiles with monthly fee ledger
•	Monthly Fee Ledger: Year selector, auto-generate 12 months, enable/disable months, record payments, delete entries
•	Student Finance: Finance overview with CSV export
•	Donation Management: Records with filters and summary stats
•	Zakat Management: Verify/reject records, filter by status and allocation
•	Reports & Export: Summary reports, CSV export
•	User Management: Create/edit/delete users, role assignment, Master-only controls
•	Language Management: Live edit 300+ translation keys, paginated by section, missing translations highlighted
•	Program Management: Manage academic programs/classes
________________________________________
Chapter 6: TESTING AND RESULTS
6.1 Testing Approach
Unit Testing: Business logic functions tested including Zakat calculation, fee totals, date formatting
Integration Testing: All 25 API endpoints tested for correct request handling, response formatting, authentication, and database operations
User Interface Testing: Tested across browsers (Chrome, Firefox, Safari, Edge) and devices (desktop, tablet, mobile)
User Acceptance Testing: Demonstrated to madrasa administration with real-world workflow testing
Performance Testing: API response times measured, database queries analyzed, frontend bundle optimized
6.2 Test Results
Test Case	Expected Result	Status
Login with valid credentials	JWT token returned	Pass
Login with wrong password	401 Unauthorized	Pass
Create student missing fields	400 validation error	Pass
Generate 12 monthly fees	12 entries created	Pass
Toggle fee disabled → enabled	Cumulative totals update	Pass
Zakat below Nisab	zakatDue = 0	Pass
Zakat above Nisab	zakatDue = netWealth × 2.5%	Pass
Access admin without token	Redirect to login	Pass
6.3 System Performance
•	Average API response time: under 500ms
•	Dashboard aggregation: under 1.2 seconds
•	Frontend initial load: under 3 seconds
•	MongoDB Atlas free tier sufficient for current data volume
6.4 User Feedback
The system was demonstrated to the Madrasa administration with positive feedback:
•	Bengali language support considered essential and well-implemented
•	Monthly fee ledger identified as most valuable feature
•	Transparency dashboard appreciated for donor trust-building
•	Mobile responsiveness confirmed on Android devices
________________________________________
Chapter 7: CONCLUSION AND FUTURE WORK
7.1 Achievements
•	Successfully replaced manual paper-based system with digital platform
•	300+ bilingual translation keys covering entire UI
•	Complete student lifecycle management from enrollment to graduation
•	Shariah-compliant Zakat engine with four allocation categories
•	Role-based access control with three permission levels
•	Live public transparency dashboard
•	Fully deployed and accessible at public URL
7.2 Limitations
•	Payment gateway integration (bKash, Nagad) not implemented - payments recorded manually
•	Photo gallery uses external URLs rather than file upload system
•	Render free tier cold start causes ~30 second delay after inactivity
•	No automated email/SMS notification for fee due dates
7.3 Future Enhancements
Enhancement	Priority
bKash/Nagad payment gateway integration	High
SMS notification for fee due dates	High
File upload for gallery and documents	Medium
Student attendance tracking module	Medium
Automated monthly fee generation via cron	Medium
Progressive Web App for offline access	Low
7.4 Conclusion
This project successfully designed, developed, and deployed a full-stack web portal addressing all identified operational challenges of Madinatul Ulum Tahfijul Quran Madrasah. The MERN stack enabled rapid development with unified JavaScript codebase. The system is live, publicly accessible, and actively used by the institution's administrative team, demonstrating how modern web technologies can transform traditional educational institutions.
________________________________________
REFERENCES
1.	MongoDB Documentation. (2024). Mongoose ODM v8. https://mongoosejs.com
2.	React Documentation. (2024). React 19 Reference. https://react.dev
3.	Express.js Documentation. (2024). Express 4.x API Reference. https://expressjs.com
4.	Hassan, M. K., & Mahlknecht, M. (2011). Islamic Capital Markets: Products and Strategies. Wiley Finance
5.	Dusuki, A. W., & Abdullah, N. I. (2007). Why do Malaysian customers patronise Islamic banks? International Journal of Bank Marketing, 25(3), 142-160
6.	Patel, S., et al. (2020). Comparative Analysis of Web Development Frameworks. International Journal of Computer Applications, 182(10)
7.	Boicea, A., et al. (2012). MongoDB vs Oracle - Database Comparison. Proceedings of the 3rd International Conference on Emerging Intelligent Data and Web Technologies
8.	Jones, M., et al. (2015). JSON Web Token (JWT). RFC 7519, Internet Engineering Task Force
9.	Islamic Fiqh Academy. (2009). Zakat Calculation Standards. Jeddah: OIC
________________________________________
APPENDIX
Project Statistics
Metric	Value
Total source files	68
Backend controllers	10
Mongoose models	6
API endpoints	25
Frontend pages	25 (14 admin + 11 public)
Translation keys	300+
Lines of code	~8,000
Live URLs
Resource	URL
Public Portal	https://madinatul-ulum-tahfijul-quran-madra.vercel.app
Admin Login	https://madinatul-ulum-tahfijul-quran-madra.vercel.app/admin/login
Backend API	https://madinatul-ulum-tahfijul-quran-madrasah.onrender.com/api
