AN-NUSRAH FOUNDATION WEB PORTAL
Complete Feature & Function Reference Report
Project: Madinatul Ulum Tahfijul Quran Madrasah — Full-Stack Web Portal
Stack: React 19 · Node.js/Express 4 · MongoDB/Mongoose 8 · SSLCommerz · Vercel/Render

PART 1 — SYSTEM OVERVIEW
The portal is divided into three distinct user-facing portals running on a single React SPA:

Portal	URL Prefix	Users
Public Portal	/	Anyone (no login)
Donor Portal	/donor	Registered donors
Admin Portal	/admin	Staff, Finance, Admin, Master
The backend is a single Express REST API serving all three portals. MongoDB stores all data. SSLCommerz handles all BDT payments.

PART 2 — PUBLIC PORTAL: ALL PAGES & FEATURES
2.1 Home Page ( /)
Purpose: Landing page for the institution. First impression for donors and prospective students.

Features:

Hero Section — Full-screen background image (Unsplash CDN) with gradient overlay. Displays institution name, location (Barishal, Bangladesh), and description. Two CTA buttons: "Donate Now" → /donate and "Admission Info" → /admission.

Prayer Times Widget — Embedded in the hero section (right column on desktop). Fetches live prayer times from the Aladhan API using the browser's Geolocation API. Displays all 5 daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) and highlights the next upcoming prayer in real time.

Quick Donation Form — A compact 4-field form (Fund selector, Amount, Phone/Email, Donate button) displayed below the hero with a negative top margin to overlap the hero. Currently a UI element — connects to the full donation flow.

Services Row — Three feature cards with Material Symbols icons: Qualified Teachers, Islamic Environment, Hifz Program. Animated with IntersectionObserver (fade-in-up on scroll).

Featured Projects Slider — Displays all 4 active donation campaigns as cards. Each card shows: campaign image, tag badge, title, description, and a "Contribute" button. Implemented as a CSS-transform slider with Previous/Next arrow buttons and dot indicators. Campaign raised amounts are fetched live from GET /api/donations/projects (no auth required). Supports 2 slide positions (showing 3 cards at a time on desktop).

Stats & Join Us Section — Dark primary-colored section showing: 500+ students enrolled stat, total donations raised (live from API), and 4 action cards linking to Donate, Contact (Volunteer), Admission (Student), and Zakat Calculator.

Scroll Animations — All major sections use IntersectionObserver to trigger animate-fade-in-up CSS class when scrolled into view. Sections start with opacity-0 and animate in.

Bilingual — All text rendered via t(key) from LanguageContext. Supports English and Bengali.

2.2 About Page ( /about)
Features:
Quranic ayah banner (Al-Alaq 96:1) with Arabic and translation

Foundation story in two paragraphs (mission and approach)

Heritage section with year established

Guiding Principles section

Mission statement card

Vision statement card

CTA section with three buttons: Admission Info, Donate Now, Contact Us

Fully bilingual

2.3 Admission Page ( /admission)
Features:

Hero section with title and description

Academic Programs — Three program cards:

Hifz Quran Program (Ages 8–14, 3–4 years, immersive memorization)

Islamic Studies / Aalim (Advanced classical curriculum: Fiqh, Hadith, Tafseer, Arabic)

Combined Excellence Program (National curriculum + Islamic studies integrated)

Admission Requirements — Four requirement cards: Previous Academic Records, Age Verification, Entrance Interview, Medical Clearance

Facilities — Three facility cards: Central Library, Residential Hostel, Modern Classrooms

Admission Inquiry Form — Collects: Student/Parent Name, Phone, Email, Program of Interest (dropdown), Additional Message. Submits to POST /api/contact. Shows success message on submission.

Contact info sidebar: Phone, Email, Address, Office Hours (Sat–Thu, 9AM–4PM)

Fully bilingual

2.4 Donations Page ( /donate)
Features:

Hero section with title and description

4 Campaign Cards — Each card shows:

Campaign image

Tag badge (Infrastructure / Education / Skills / Food Aid)

Title and description

Progress bar (raised / goal)

Raised amount (live from API), goal amount, donor count, funded percentage

"Selected" indicator when clicked

"Details" button linking to individual campaign page

Donation Form (appears when a campaign is selected):

"Donating to: [Campaign Name]" label

Preset amount buttons (e.g., ৳500, ৳1000, ৳2000, ৳5000)

Custom amount input

Payment method selector (Card, bKash, Nagad, Rocket)

Full Name input (optional)

Email input (optional)

Anonymous donation toggle (checkbox to hide name from donor lists)

"Donate Now" button → initiates SSLCommerz payment via POST /api/payment/init

"Secure, encrypted transaction" label

Fully bilingual

2.5 Masjid and Madrasha Complex Donation Page ( /donate/mosque)
Features:
Breadcrumb navigation (Donations → Mosque Expansion Fund)

"Active Project" badge

Hero: "Grand Mosque Construction Phase II" with description

Funding Progress Panel:

Live raised amount from API

Goal: ৳20,00,000

Progress bar with percentage

Stats grid: Funded %, Remaining amount, Total Donors, Average Donation, Status (On Track / Completed)

Support Section — Hadith quote about building mosques

Expense Allocation — 4 expense breakdown cards with dynamic percentages based on raised amount:

Foundation & Structure

Exterior & Domes

Interior & Carpentry

Utilities & HVAC

Donation Form — Same as main donation page but pre-selected to this campaign

Fully bilingual

2.6 An-Nusrah Skill Development Donation Page ( /donate/madrasa)
Features:

Same structure as Mosque page but for Skill Development campaign

Goal: ৳2,00,000

Expense breakdown: Vocational Training, Learning Materials, Certification Programs, Student Facilities

Hadith: "The best of people are those most beneficial to others"

Live raised amount from API

2.7 Poor Student Support Donation Page ( /donate/student-support)
Features:
Goal: ৳1,50,000

Annual Scholarship Goal section with year label

Stats: Funded %, Remaining, Total Donors, Average Gift, Students Aided

Fund Allocation breakdown: Tuition Assistance, Boarding & Meals, Healthcare

Donation form pre-selected to this campaign

2.8 Iftar Fund Donation Page ( /donate/ifter-fund)
Features:
Goal: ৳1,00,000

Ramadan Campaign badge

Expense breakdown: Iftar Meals, Beverages & Dates, Distribution & Logistics

Hadith: "Whoever feeds a fasting person will have a reward like that of the fasting person"

Donation form pre-selected to this campaign

2.9 Zakat Calculator Page ( /zakat)
Features (most complex public page):

Header:

Page title and description

Nisab info badge: shows current Nisab threshold in BDT (612.36g silver × ৳110/g = ৳67,359.60)

Live gold price badge: fetches from GET /api/gold-price. Shows "Live Gold: ৳X/ভরি · ৳X/g" when successful, "Gold: ৳X/g (fallback)" with warning icon if API fails, loading spinner while fetching.

Left Panel — Asset Input Form (7 fields):

Cash, Bank Savings & Deposits (৳ prefix)

Gold in vori (right-side ভরি label) — shows real-time BDT conversion below input

Silver in vori — shows real-time BDT conversion below input

Investments & Shares (৳)

Business Goods & Inventory (৳)

Money Owed to You / Receivables (৳)

Deductible Debts (৳, red styling, negative prefix)

Each field has a hint text explaining what to include. Gold and silver inputs show live converted values as the user types (e.g., "2 ভরি = 23.328g · ≈ ৳221,616 at ৳9,500/ভরি").

Calculate Button — Calls POST /api/zakat/calculate with all asset values. Falls back to local calculation if API fails.

Islamic Rules Info Card — 6 rules displayed with icons: Hawl (1 lunar year), Nisab threshold, 2.5% rate, zakatable assets, deductible debts, non-zakatable items.

Right Panel — Results:

Nisab Status Indicator — Green "Nisab Threshold Met — Zakat is Obligatory" or grey "Nisab Not Met" with check/radio icon. Shows Nisab threshold and net wealth.

Wealth Breakdown Table — Total Assets, Gold Value, Silver Value, Less Debts, Net Wealth (bold, with divider)

Zakat Due Card (dark primary background):

Large BDT amount display

"2.5% × ৳X net wealth" subtitle

Campaign Allocation — 4 radio buttons: Masjid and Madrasha Complex, An Nusrah Skill Development, Poor Student Support, Ifter Fund. Each with icon and description.

Payment Method — 4 buttons: Card, bKash, Nagad, Rocket

Donor Name input (pre-filled if donor is logged in via DonorAuthContext)

Success/error message display

Donate Button — Disabled if Nisab not met or amount is 0. Calls POST /api/payment/init with type: "zakat". Redirects to SSLCommerz gateway URL.

Live preview updates in real time as user types (before clicking Calculate)

Fully bilingual (300+ translation keys)

2.10 Photo Gallery Page ( /gallery)
Features:

Hero section with title and description

Category Filter Tabs — All, Quran Learning, Classroom, Events, Student Life

Photo grid with images from public/Gallery/ folder

"Load More" button showing remaining count

Empty state message when no photos in category

Fully bilingual

2.11 Islamic Library Page ( /library)
Features:

"Islamic Library" badge

Title and description

Book Grid — Cards for each PDF book in public/books/:

Holy Quran (Bangla)

Tafsir Ibn Kathir (Bangla, 9 volumes)

Al-Bidaya Wan-Nihaya (10 volumes)

Ar-Raheeq Al-Makhtum (Sealed Nectar)

Kitabut Tawheed

Riyad-us-Saliheen (Bangla)

Zadul Ma'ad (2 volumes)

La Tahzan (Don't Be Sad)

Each card has: "Read Now" button → /library/:bookId and "Download PDF" button

Fully bilingual

2.12 Book Reader Page ( /library/:bookId)
Features:

Back to Library button

Book title display

Inline PDF Viewer using react-pdf library with page navigation (Previous/Next, page X of Y)

"Open in New Tab" button

"Download PDF" button

Fallback message if PDF cannot be displayed inline with direct open button

Fully bilingual

2.13 Prayer Times Page ( /prayer-times)
Features:

Uses browser Geolocation API to get user coordinates

Fetches prayer times from Aladhan API

Displays all 5 daily prayers with times

Highlights next upcoming prayer

Shows current date in Islamic (Hijri) and Gregorian calendar

Location display

2.14 Qibla Compass Page ( /qibla-compass)
Features:

Two tabs: Qibla and General Compass

Qibla Tab:

Gets user location via Geolocation API

Calculates bearing to Kaaba (Mecca) using Haversine formula

Shows Qibla bearing in degrees

Shows distance to Kaaba in km

On mobile: uses DeviceOrientationEvent API for live compass needle that rotates with device

Device heading display

Sensor active/inactive status indicator

Note about holding device flat for accuracy

Desktop note about needing mobile for live readings

Retry button if location access denied

General Compass Tab:

Live compass heading from device orientation sensor

Cardinal direction display (N, NE, E, SE, S, SW, W, NW)

Fully bilingual

2.15 Mosque Finder Page ( /mosque-finder)
Features:

Interactive map using React-Leaflet with OpenStreetMap tiles

Gets user location via Geolocation API

Queries Overpass API for mosques within radius

Displays mosque markers on map

Click marker to see mosque name

User location marker

2.16 Contact Page ( /contact)
Features:

Hero section

Contact Information Panel — Address, Phone, Email, Office Hours

Contact Form — Fields: Full Name, Phone (optional), Email, Subject (dropdown: General Inquiry, Admission, Donation, Zakat, Volunteering, Other), Message. Submits to POST /api/contact. Shows success message.

Fully bilingual

2.17 Payment Result Pages
Payment Success Page ( /payment/success):

Reads tran_id from URL query params

Fetches transaction details from GET /api/payment/transaction/:id

Shows: success icon, "Payment Successful" heading, transaction ID, amount, donor name, project/allocation, payment method, date

"Back to Home" and "View Campaigns" buttons

Payment Fail Page ( /payment/fail):

Shows failure icon and message

"Try Again" and "Back to Home" buttons

Payment Cancel Page ( /payment/cancel):

Shows cancellation message

"Back to Home" button

2.18 Not Found Page ( *)
Features:

404 illustration

"Page Not Found" heading and description

"Return Home" and "Contact Support" buttons

Footer copyright

Fully bilingual

PART 3 — DONOR PORTAL: ALL PAGES & FEATURES
3.1 Donor Login Page ( /donor/login)
Features:

Email and password fields

Login via POST /api/donor/login

JWT stored in localStorage via DonorAuthContext

"Register" link to donor registration

Redirects to /donor/dashboard on success

Error message display

3.2 Donor Registration Page
Features:

Name, Email, Phone, Password fields

Submits to POST /api/donor/register

Auto-login after successful registration

Redirects to dashboard

3.3 Donor Dashboard Page ( /donor/dashboard)
Features:

Top Navigation Bar — Institution logo/name (links to home), donor name display, Sign Out button

Welcome Message — "Welcome back, [First Name] 👋"

3 KPI Cards:

Total Donated (BDT, primary color background)

Donations Made (count + Zakat payment count)

Total Zakat Paid (BDT)

Giving by Campaign — Progress bars showing donation breakdown by campaign with percentage of total

Zakat History Table (shown only if donor has Zakat records):

Columns: Date, Allocated To (color-coded badge), Method, Amount, Status

"Pay Zakat" link to Zakat calculator

Donation History Table:

Columns: Date, Campaign (color-coded badge), Method, Amount, Status

Color coding: Masjid=blue, Skill=purple, Student=green, Iftar=amber

Status badges: Completed=green, Pending=yellow, Failed=red

"Donate again" link

Empty state with "Make your first donation" link

Data fetched from GET /api/donor/my-donations (authenticated with donor JWT)

Logout function clears donor JWT and redirects to /donor/login

PART 4 — ADMIN PORTAL: ALL PAGES & FEATURES
4.1 Admin Login Page ( /admin/login)
Features:

Email and password fields

Submits to POST /api/auth/login

JWT and user object stored in localStorage via AuthContext

Error message display (invalid credentials, missing fields)

Redirects to /admin on success

GuestRoute guard: redirects already-authenticated admins away from login page

4.2 Admin Dashboard Page ( /admin)
Features (most data-rich admin page):

All data fetched in a single call to GET /api/dashboard using 17 parallel MongoDB aggregation queries via Promise.all.

Primary KPI Cards (4):

Total Donations (all time, BDT) — with "This month: ৳X" subtitle and month-over-month growth % badge (green arrow up / red arrow down)

Active Students (count) — with total enrolled subtitle

Zakat Verified (BDT) — with pending review count

Fees Collected (BDT) — with outstanding balance (red if > 0)

Period Stats Row (4 cards):

This Month (BDT + donation count)

Last Month (BDT + donation count)

This Year (BDT + donation count)

Total Donors (unique donor count + active projects count)

Monthly Donation Bar Chart:

Last 6 months of donation totals

Pure CSS bar chart (no external chart library)

Bars sized proportionally to max value

Hover tooltip showing exact BDT amount and donation count

Month labels below bars

Donation Status Breakdown:

Completed (green), Pending (yellow), Failed (red)

Each shows total BDT and record count

Student Status Breakdown:

Active (green), Inactive (grey), Graduated (blue)

Progress bars showing percentage of total

Donations by Project:

All 4 campaigns with progress bars

Shows BDT amount, donor count, and percentage of total

"View All" link to /admin/donations

Payment Method Breakdown:

Card, bKash, Nagad, Rocket

Progress bars with transaction count and BDT amount

Fee Collection Summary Card:

Dark primary background

Total Fees, Collected, Outstanding in 3 columns

Progress bar (green if ≥80%, gold if ≥50%, red otherwise)

Collection percentage

Zakat Allocation Breakdown:

Verified Zakat by campaign

Progress bars with count and percentage

"Manage" link to /admin/zakat

Top 5 Donors:

Ranked list with gold/silver/bronze badges for top 3

Donor name, donation count, total BDT

Recent 6 Donations:

Activity feed with donor avatar (initial letter), name, project, payment method, amount, date

"View All" link to /admin/donations

Export Button — Links to /admin/reports/export

4.3 Student List Page ( /admin/students)
Features:

Header:

"Student Records" title with description

"Add Student" button (opens modal)

Filter Bar:

Search input (debounced 400ms) — searches by name or class

Program filter dropdown (populated from Program collection)

Status filter dropdown (All / Active / Inactive / Graduated)

"Clear" button (shown only when filters are active)

Student Table:

Columns: Student (avatar initial + name + MongoDB ID), Class, Guardian (name + phone), Fees (monthly rate + due amount in red if > 0), Status (color-coded badge), Actions

Hover reveals action buttons: View (eye icon → student detail page), Edit (pencil icon → opens edit modal), Delete (trash icon with confirmation dialog)

Loading spinner while fetching

"No students found" empty state

Pagination:

Shows "X of Y students"

Sliding window of 5 page buttons centered on current page

Previous/Next buttons (disabled at boundaries)

10 students per page

Add/Edit Student Modal:

Fields: Full Name, Guardian Name, Phone, Monthly Fee Rate (৳), Class/Program (ClassSelect component), Status

For new students: "Auto-generate monthly fees for [year]" checkbox (default ON) — creates all 12 month entries using the fee rate

Validation: all fields required

Error display

Save/Cancel buttons with loading spinner

StudentContext Integration:

Uses fetchStudents, invalidate, updateCached from StudentContext

Ensures Student Finance page stays in sync after changes

4.4 Student Details Page ( /admin/students/:id)
Features (most complex admin page):

Header:

Back button (navigate(-1))

"Student Details" title

"Edit Student" button (toggles inline edit form)

Inline Edit Form (shown when editing):

Fields: Full Name, Guardian Name, Phone, Monthly Fee Rate, Class/Program (ClassSelect), Status

Save Changes / Cancel buttons

Error display

Profile Card (left column):

Large avatar circle with first letter of name

Student name, MongoDB ID, status badge

Info rows: Program, Guardian, Phone

Monthly Fee Rate — inline editable: hover reveals edit pencil, click shows input + check/close buttons, saves via PUT /api/students/:id

Cumulative Fee Summary (right column):

3 stat boxes: Total Charged, Total Paid (green), Total Due (red if > 0)

Payment progress bar (percentage paid)

Student Information Card:

Grid of all student fields: Full Name, Class, Guardian, Phone, Status, Enrolled date, Monthly Rate

Monthly Fee Ledger (full-width section):

Ledger Header:

Year selector dropdown (current year ± 1 plus any year with existing data)

"Generate [Year]" button — calls POST /api/students/:id/fees/generate to create all 12 month entries for selected year (skips existing months)

Year Summary Bar:

Total Charged, Total Paid, Total Due for selected year (only enabled months)

Fee Table (12 rows for selected year):

Columns: Month, Fee Amount, Paid, Due, Payment Date, Note, Status, Actions

Disabled months shown with strikethrough and reduced opacity

Missing months shown as "—" with full opacity reduction

Status badges: Disabled (grey), Unpaid (red), Paid (green), Partial (yellow)

Per-row Actions:

Edit/Add button — Opens PaymentModal for that month

Toggle button (enable/disable) — Calls PATCH /api/students/:id/fees/:feeId/toggle. Green when disabled (click to enable), yellow when enabled (click to disable). Loading spinner while toggling.

Delete button — Calls DELETE /api/students/:id/fees/:feeId with confirmation dialog. Loading spinner while deleting.

Payment Modal:

Title: "Record Payment — [Month] [Year]"

Fields: Fee Amount (৳), Amount Paid (৳), Payment Date, Note (optional, e.g., "Paid via bKash")

Validation: paid cannot exceed amount

Calls POST /api/students/:id/fees (upsert)

After save: refreshes both fee data and student record, updates StudentContext cache

4.5 Student Finance Page ( /admin/finance/students)
Features:

Header: "Student Finance" title with description

Filter Bar:

Search input (debounced 400ms)

Program filter dropdown

Payment Status filter (All / Paid / Partial / Unpaid)

Clear button

Export CSV button (right-aligned)

Summary Stats (3 cards):

Total Fees (gold background)

Collected (primary background)

Outstanding Balance (error/red background)

Values calculated from current page's student data

Finance Table:

Columns: Student (name + ID), Program, Total Fee, Paid (green), Due (red), Status badge

Status: Paid (green), Partial (yellow), Unpaid (red)

20 students per page

Export CSV:

Calls GET /api/reports/export?category=students

Downloads students-finance.csv with columns: ID, Name, Class, Guardian, Phone, Fees, Paid, Due, Status

StudentContext Integration — Shares data with Student List page

4.6 Donation Management Page ( /admin/donations)
Features:

Header: "Donation Management" title, Export CSV button

Stats Row (3 cards):

Total Revenue (All Time) — from completed transactions

Active Donors — unique donor count from current page

Pending Approvals — pending transaction count

Filter Bar (Basic):

Search input (donor name or transaction ID)

Type filter (All / Donation / Zakat)

Status filter (All / Success / Pending / Failed / Cancelled)

"More Filters" toggle button

Advanced Filters (expandable):

Project filter (All / Masjid Complex / Skill Development / Student Support / Ifter Fund)

Date From picker

Date To picker

Amount Range (Min / Max inputs)

Active filter summary display (e.g., "Type: donation • Status: Success • From: 2024-01-01")

"Clear All Filters" button

Transaction Table:

Columns: Transaction ID (monospace + bank transaction ID if available), Donor (name + email), Type (donation/zakat + project/allocation), Amount, Payment Method (method + card brand/type if available), Status (icon + color badge), Date/Time

Status styles: Success=green, Pending=yellow, Failed=red, Cancelled=grey

Status icons: check_circle, schedule, error, cancel

10 per page with sliding window pagination

Export CSV:

Downloads donations-report.csv

Data source: GET /api/reports/export?category=donations

4.7 Zakat Management Page ( /admin/zakat)
Features:

Header: "Zakat Management" title, Export CSV button

Stats Row (3 cards):

Total Zakat Collected (BDT, from Verified records on current page)

Total Records (count)

Pending Verification (count)

Filter Bar:

Search input (donor name, debounced 400ms)

Status filter (All / Verified / Pending)

Allocation Type filter (General Fund / Student Sponsorship / Madrasa Maintenance / Islamic Education Materials)

Project Type filter (All 4 campaigns)

Payment Method filter (Card / bKash / Nagad / Rocket)

Clear button

Date Range Row:

Date From picker with calendar icon

Date To picker with event icon

Quick preset buttons: "This Month", "This Year" (auto-fills date range)

Zakat Records Table:

Columns: Donor, Amount, Allocation, Category, Payment, Date, Status

Status badges: Verified (green), Pending (yellow)

Verify button — Shown only for Pending records. Calls PATCH /api/zakat/:id with {status: "Verified"}. Updates record in-place without page reload. Loading state "Verifying…"

Export CSV:

Downloads zakat-report.csv

Data source: GET /api/reports/export?category=zakat

4.8 Export Report Page ( /admin/reports/export)
Features:

Step 1 — Data Category (radio cards):

Donations (volunteer_activism icon)

Students (groups icon)

Zakat (account_balance_wallet icon)

Step 2 — Date Range:

Start Date picker

End Date picker

Quick preset buttons: "Last 7 Days", "This Month", "YTD" (Year to Date) — auto-calculates and fills both date fields

Step 3 — Format:

CSV Spreadsheet (only option currently)

Summary Panel:

"Exporting [Category] data from [Date Range] as [Format]"

Error message display

Generate and Export button — Calls GET /api/reports/export?category=X&startDate=Y&endDate=Z&format=csv. Creates a Blob URL, triggers browser download, then revokes URL. Loading state "Generating…"

Validates start date < end date before export

4.9 Program Management Page ( /admin/programs)
Features:

Header: "Program Management" title, "Add Program" button

Add Program Form (shown when adding):

Single text input (e.g., "Hifz Year 1")

Save / Cancel buttons

Error display

Auto-focuses input

Calls POST /api/programs

Adds to list sorted alphabetically

Program List:

Numbered list (1, 2, 3…)

Each item: index badge, program name

Hover reveals: Edit (pencil) and Delete (trash) buttons

Inline Edit:

Click edit → name becomes an input field

Check button to save (calls PUT /api/programs/:id)

Close button to cancel

Error display

Delete:

Confirmation dialog: "Delete this program? Students assigned to it will keep their current class label."

Calls DELETE /api/programs/:id

Removes from list immediately

Footer: "[N] programs total" count

4.10 Language Management Page ( /admin/language)
Features (most sophisticated admin tool):

Header:

"Language Management" title

Stats: missing Bangla count (red), customised count (blue), total keys count

"Reset All" button (shown only if overrides exist) — confirms before clearing all custom translations from localStorage

"Save All" button — saves overrides to localStorage and calls setCustomTranslations() to apply instantly. Shows "Saved!" confirmation for 3 seconds.

Left Sidebar:

Search input (debounced 300ms) — searches across key names, English text, and Bangla text

Namespace List — All pages/sections as clickable buttons:

About Page, Admission Page, Admin Navigation, Contact Page, Donation Pages, Footer, Gallery Page, General UI, Home Page, Madrasa Donation, Mosque Donation, Not Found Page, Public Navigation, Student Support Donation, Transparency Page, Zakat Page

Each shows: namespace name, missing Bangla count (red badge), total key count

Active namespace highlighted

Filter Radio Buttons:

All Keys (total count)

Missing Bangla (count in red)

Customised (count in blue)

Main Editor (right 3/4):

Table header: Key, English, Bangla, Reset

15 rows per page (paginated)

Each row:

Key name in monospace code style

"!" badge (red) if Bangla is missing

"✎" badge (blue) if key has been customised

English textarea (editable)

Bangla textarea (editable, red border if missing, placeholder "Missing — add Bangla translation")

Reset button (shown only if key is customised) — removes override for that key

Row background: red tint if missing, blue tint if edited, white otherwise

Smart override logic: If edited value matches base value, override is removed automatically

Pagination with sliding window

Live Application: Changes apply instantly to the running app via setCustomTranslations() context function — no page reload needed.

Total keys managed: 300


Part 5: Remaining Public Portal Pages
5.1 About Page (/about)
Purpose: Institutional identity page presenting the foundation's history, mission, and vision.

Sections:

Hero Section

Arabic Quranic verse displayed RTL: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ" (Surah Al-Alaq 96:1)

English/Bengali translation below the verse

Geometric background pattern overlay

Intro Bento Grid (2-column)

Left card (2/3 width): Foundation label badge, title, two paragraphs of foundation history

Right card (1/3 width): Heritage card with mosque icon, heritage description, founding year "2018" prominently displayed

Mission & Vision Section

Two cards rendered from principles array

Mission card: icon explore, title from t('aboutMissionTitle'), text from t('aboutMissionText')

Vision card: icon visibility, title from t('aboutVisionTitle'), text from t('aboutVisionText')

Cards have hover lift animation (-translate-y-1)

CTA Section (dark green background)

Three action buttons: Apply for Admission → /admission, Donate → /donate, Contact Us → /contact

All bilingual via LanguageContext

API Calls: None — fully static/translated content.

5.2 Admission Page (/admission)
Purpose: Program information and inquiry form for prospective students.

Sections:

Hero — Title, description, hero image from Unsplash

Programs Grid (bento layout)

Program 1 (8/12 cols): Hifz/Tahfiz program — icon auto_stories, tags from translation keys

Program 2 (4/12 cols): Islamic Studies — icon school

Combined Program banner (full width): Combined Hifz + Islamic Studies, "Apply Now" anchor link to #apply

Requirements Section (sticky left + scrollable right)

4 numbered requirements (01–04), each with title and description from translation keys

Sticky image on desktop

Facilities Section

3 facility cards with Unsplash images: Library, Accommodation, Architecture

Each has icon, title, description

Admission Inquiry Form (id="apply")

Contact info sidebar: Phone, Email, Address, Office Hours

Form fields:

Name (text, required)

Phone (tel, required)

Email (email, required)

Program (select: Program 1 / Program 2 / Combined)

Message (textarea, optional)

Submit button with loading spinner

Success/error alert banners

Form Submission: Calls contactService.send() — POST /api/contact — with message formatted as:

Admission Inquiry
Program: [selected program]
Phone: [phone]

[message]

Copy

Insert at cursor
Validation: Name, phone, email required. Program defaults to Program 1 title.

5.3 Contact Page (/contact)
Purpose: General contact form with location map.

Sections:

Hero — Title and description

Contact Info Card (4/12 cols)

Address: Barishal, Bangladesh

Phone: +880 1711 234567

Email:

Office Hours: from translation key

Contact Form (8/12 cols)

Fields:

Name (text, required)

Phone (tel, optional)

Email (email, required)

Subject (select, 6 options from translation keys: contactSubject1–contactSubject6)

Message (textarea, 5 rows, required)

Submit button with loading spinner

Success/error banners

Embedded Google Map

iframe pointing to Barishal, Bangladesh coordinates (22.7010, 90.3298)

320px height, full width, lazy loading

Form Submission: POST /api/contact via contactService.send(). Message formatted as:

Subject: [subject]
Phone: [phone or "Not provided"]

[message]

Copy

Insert at cursor
5.4 Photo Gallery Page (/gallery)
Purpose: Visual gallery of madrasa life with category filtering and pagination.

Data: 15 static images in 4 categories:

Quran Learning (3 images)

Classroom (6 images)

Events (3 images)

Student Life (3 images)

Features:

Category Filter Tabs — 5 buttons: All, Quran Learning, Classroom, Events, Student Life

Active tab: filled primary style with shadow and lift

Inactive: surface container style

Switching filter resets visible count to 6

Image Grid — 3-column responsive grid, uniform 4:3 aspect ratio cards

Hover: scale-105 zoom on image, gradient overlay appears from bottom

Overlay shows: category badge, image title, description (2-line clamp)

Load More Button — Shows remaining count, loads 6 more per click

Hidden when all images are visible

Empty State — Shows photo_library icon and message when filter returns 0 results

State: activeFilter (string), visible (number, starts at 6, increments by 6)

API Calls: None — all images are local /Gallery/ static files.

5.5 Donation Hub Page (/donate)
Purpose: Overview of all 4 active campaigns with live fundraising progress.

Features:

Campaign Cards Grid — 3-column responsive, 4 cards total:

Masjid and Madrasha Complex (Goal: ৳20,00,000)

Poor Student Support (Goal: ৳1,50,000)

An Nusrah Skill Development (Goal: ৳2,00,000)

Ifter Fund (Goal: ৳1,00,000)

Each Card Contains:

Campaign image (local /img/ files)

Category tag badge (Infrastructure / Education / Skills / Food)

Title, description (3-line clamp)

Progress bar: raised / goal × 100%, capped at 100%

Raised amount in green, goal amount

Donor count + "% funded" label

"Donate Now" button → navigates to individual campaign page

Loading State: 4 skeleton pulse cards while API loads

Data Fetching: GET /api/donations/projects via donationService.getProjects()

Maps API response to campaign metadata

Falls back to raised: 0, count: 0 on error

5.6 Individual Campaign Donation Pages
All 4 campaign pages share the same layout pattern. Documented below with their differences:

Common Structure (all 4 pages):
Breadcrumb — Donations → [Campaign Name]

Hero Banner — Full-width image with gradient overlay, campaign tag, title, description

Progress Panel (2/3 width)

Raised amount, goal, progress bar, % funded, remaining

4 stat cards: Total Donors, Average Donation, Remaining, Status (On Track / Completed)

Donation Form (1/3 width, dark green card)

Name input (optional, defaults to "Anonymous")

Payment method selector: Card | bKash | Nagad | Rocket (4 toggle buttons)

Amount input with ৳ prefix

Submit button → initiates SSLCommerz payment

Expense/Allocation Breakdown — Cards showing how raised funds are allocated

Payment Flow: POST /api/payment/init → redirects to data.gatewayUrl (SSLCommerz hosted page)

Campaign-Specific Details:
Page	Path	Goal	Default Amount	Expense Breakdown
Mosque Complex	/donate/mosque	৳20,00,000	৳500	Foundation 30%, Building 35%, Interior 20%, Utilities 15%
Skill Development	/donate/madrasa	৳2,00,000	৳250	Vocational 35%, Materials 30%, Certification 20%, Facilities 15%
Student Support	/donate/student-support	৳1,50,000	৳100	Educational 50%, Accommodation 30%, Healthcare 20%
Ifter Fund	/donate/ifter-fund	৳1,00,000	৳200	Meals 50%, Beverages 30%, Distribution 20%
Expense amounts are calculated dynamically: raised × pctVal — so they update in real time as donations come in.

Donor Auth Integration: All pages read donor?.email from DonorAuthContext to pre-fill email in payment payload.

5.7 Islamic Library Page (/library)
Purpose: Free Islamic book library with PDF download functionality.

Book Collection (8 books, 5 categories, all in Bengali):

Category	Books
কোরআন	পবিত্র কোরআন (1 vol), তাফসীর ইবনে কাসীর (10 vols + index)
হাদিস	রিয়াদুস সালেহীন (1 vol)
আকীদা	কিতাবুত তাওহীদ (1 vol)
সীরাত	আর-রাহীকুল মাখতূম (1 vol), আল-বিদায়া ওয়ান নিহায়া (10 vols)
আত্মউন্নয়ন	যাদুল মাআদ (1 vol), লা-তাহযান (1 vol)
Stats Row (hero section): Total Books: 8, Total Volumes: 26, Categories: 5, Free: 100%

Features:

Category Filter Pills — "সব" + 5 category buttons, each with color coding and count badge

Book Cards — Color-coded header by category, icon, multi-volume badge if applicable

Single-volume books: One "Download" button → navigates to /library/read/:bookId

Multi-volume books: Grid of volume buttons (3 per row) → each navigates to /library/read/:bookId--vol-N

API Calls: None — all PDFs are static files in /public/books/.

5.8 Book Reader Page (/library/read/:bookId)
Purpose: Download page for a specific book or volume.

Logic:

Parses bookId from URL params

If bookId contains --vol-, splits into baseId and volIndex, resolves to specific volume

If not found, shows 404 state with back link

UI:

Book icon, title (with volume label if multi-vol), author name

"PDF ডাউনলোড করুন" button — HTML <a download> link to the PDF file

"Back to Library" button

Note: This is a download page, not an in-browser PDF viewer.

5.9 Prayer Times Page (/prayer-times)
Purpose: Live prayer times with countdown, monthly calendar, and geolocation support.

Data Source: Aladhan API (https://api.aladhan.com/v1/) — Method 1 (University of Islamic Sciences, Karachi)

Features:

Hero Section

Live clock (updates every second via setInterval)

Gregorian date (long format)

Hijri date (from API response)

City name (extracted from API timezone field)

Next prayer countdown timer (HH:MM:SS)

Today's Prayer Cards (6 cards)

Fajr 🌙, Sunrise 🌅, Dhuhr ☀️, Asr 🌤, Maghrib 🌇, Isha 🌃

Active prayer: dark green card, scaled up, pulsing dot, "Current" badge

Next prayer: light green border, "Next" badge

Times displayed in 12-hour format

Additional Times (4 cards)

Imsak 🌚 (Suhoor end), Midnight 🌑, Last Third Begins 🌘, Last Third Ends 🌗

Each with description (Tahajjud time, etc.)

Monthly Prayer Calendar

Full month table: Date | Fajr | Sunrise | Dhuhr | Asr | Maghrib | Isha

Today's row highlighted in green

Sticky date column on horizontal scroll

Alternating row colors

Geolocation: Requests browser location on mount; falls back to Barishal (22.701, 90.3535) on denial/timeout

Bilingual: All labels switch EN/BN based on lang from LanguageContext; Bengali numerals used in BN mode

API Calls:

GET https://api.aladhan.com/v1/timings/{date}?latitude=&longitude=&method=1 — today's times

GET https://api.aladhan.com/v1/calendar?latitude=&longitude=&method=1&month=&year= — monthly calendar

5.10 Qibla Compass Page (/qibla)
Purpose: Interactive Qibla direction finder and general compass using device sensors.

Features:

Tab Switcher — Qibla Compass | General Compass

Qibla Compass Tab

SVG compass dial with cardinal labels (N/E/S/W fixed, needle rotates)

Qibla needle: dark green (north/Qibla direction), grey (south)

Rotation formula: qiblaBearing - deviceHeading

Info cards: Qibla Bearing (degrees), Distance to Kaaba (km, Haversine), Device Heading

General Compass Tab

Red/grey needle (standard compass)

Rotation formula: -deviceHeading

Info cards: Heading (degrees), Cardinal Direction (N/NE/E/SE/S/SW/W/NW), GPS coordinates

Calculations:

Qibla bearing: Great-circle bearing formula to Kaaba (21.4225°N, 39.8262°E)

Distance: Haversine formula, result in km

Cardinal: 8-point compass from bearing

Device Orientation:

iOS: webkitCompassHeading

Android: 360 - alpha

iOS permission request via DeviceOrientationEvent.requestPermission()

Sensor Status Badge: Green pulsing "Active" or amber "Inactive"

Geolocation: Auto-requests on mount, retry button on error

API Calls: None — all calculations are client-side math.

5.11 Mosque Finder Page (/mosque-finder)
Purpose: Interactive map to find nearby mosques using OpenStreetMap data.

Features:

Controls Bar

"Find My Location" button — triggers geolocation

Radius selector: 500m | 1km | 2km | 3km | 5km (re-fetches on change if location known)

Mosque count badge (green, shows after results load)

Leaflet Map (2/3 width)

OpenStreetMap tile layer

Red marker: user's location

Green markers: each mosque found

Blue circle: search radius overlay

Popup on each mosque: name, distance in meters, OpenStreetMap directions link

Auto-recenters when location changes

Mosque List Panel (1/3 width)

Search input to filter by name

Numbered list sorted by distance (nearest first)

Gold badge for #1 (nearest)

Each item: mosque name, distance (meters if <1km, km if ≥1km), directions icon link

Clicking a list item opens its map popup

Empty state with "Increase radius" button

Data Source: Overpass API (OpenStreetMap) — queries amenity=place_of_worship + religion=muslim

3 mirror servers tried in sequence: overpass-api.de, overpass.kumi.systems, maps.mail.ru

15-second timeout per server via AbortSignal.timeout()

Error Handling: Location error banner, fetch error banner with retry button

API Calls: POST to Overpass API (external, not backend)

5.12 Payment Result Pages
Three dedicated pages for SSLCommerz payment callbacks:

Payment Success (/payment/success?tran_id=...)
Reads tran_id from URL query params

Fetches transaction details: GET /api/payment/transaction/:tranId

Shows: Transaction ID, Amount, Type (donation/zakat), Status, Project/Allocation

Quranic verse (2:261) displayed

Buttons: Go Home, Donate Again

Payment Failed (/payment/fail)
Static page — no API call

Error icon, message, buttons: Go Home, Try Again → /donate

Payment Cancelled (/payment/cancel)
Static page — no API call

Block icon, "No charges were made" message, buttons: Go Home, Donate Now → /donate

Part 6: Authentication Pages
6.1 Admin Login Page (/admin/login)
Layout: Split-screen (52% brand panel left, 48% form right on desktop; single column on mobile)

Left Panel (brand):

Islamic pattern background overlay

Logo: mosque icon + "Madinatul Ulum Tahfijul Quran Madrasah"

"Admin Portal" badge with pulsing dot

Hero text: "Manage Your Institution with Ease"

4 feature bullets: Students, Donations, Zakat, Reports

Arabic verse footer: "اقْرَأْ بِاسْمِ رَبِّكَ" with translation

Right Panel (form):

Top bar: mobile logo + language toggle (EN ↔ BN)

Email field with mail icon, autocomplete="email"

Password field with lock icon, show/hide toggle button

Submit button with spinner

Error banner (red, with error icon)

"Contact Support" mailto link

"Back to main website" link

Auth Flow: POST /api/auth/login → stores JWT + user in AuthContext (localStorage key: madrasa_admin) → redirects to location.state?.from or /admin

6.2 Donor Login / Register Page (/donor/login)
Layout: Centered card, max-width 448px

Tab Switcher: Sign In | Create Account (toggle between login and register modes)

Login Mode Fields:

Email (required)

Password (required)

Register Mode Fields (additional):

Full Name (required)

Phone (optional)

Email (required)

Password (required)

Demo Credentials Box:

Email: donor@madrasa.com (click to auto-fill)

Password: donor123 (click to auto-fill)

Auth Flow:

Login: POST /api/donor/login via donorService.login()

Register: POST /api/donor/register via donorService.register()

On success: stores donor + token in DonorAuthContext → redirects to /donor/dashboard

Part 7: Remaining Backend Controllers
7.1 Contact Controller (contactController.js)
Endpoint: POST /api/contact

Model: Contact (name, email, message, createdAt)

Behavior: Saves contact form submission to MongoDB. Used by both ContactPage and AdmissionPage inquiry form.

7.2 Donor Controller (donorController.js)
Endpoints:

POST /api/donor/register — creates Donor with bcrypt password

POST /api/donor/login — validates credentials, returns JWT

GET /api/donor/me — returns authenticated donor profile

GET /api/donor/donations — donor's own donation history

GET /api/donor/zakat — donor's own zakat records

Auth: Uses donorAuthMiddleware.js (separate JWT verification from admin auth)

7.3 Gold Controller (goldController.js)
Endpoint: GET /api/gold/price

Purpose: Fetches live gold price for Zakat calculator. Used by ZakatCalculatorPage to get current gold rate per gram in BDT.

7.4 Program Controller (programController.js)
Endpoints:

GET /api/programs — list all programs (public)

POST /api/programs — create program (admin)

PUT /api/programs/:id — update program (admin)

DELETE /api/programs/:id — delete program (admin)

Used by: ClassSelect shared component, StudentListPage add/edit modal, ProgramManagementPage

Part 8: Shared Components & Infrastructure
8.1 Layout Components
Navbar — Public site top navigation with links, language toggle, mobile hamburger menu

Footer — Public site footer with links, social icons, copyright

PublicLayout — Wraps all public pages with Navbar + Footer + ScrollToTop

AdminLayout — Wraps all admin pages with AdminSidebar + AdminHeader + main content area

AdminSidebar — Collapsible sidebar with all admin nav links, role-based visibility, active route highlighting

AdminHeader — Top bar with page title, user info, logout button

BottomNav — Mobile bottom navigation bar for public pages

8.2 Shared Components
ClassSelect — Reusable dropdown that fetches programs from /api/programs and renders as <select>

ErrorBoundary — React error boundary wrapper, catches render errors, shows fallback UI

PageLoader — Full-screen spinner shown during lazy-loaded route transitions

PrayerTimesWidget — Compact prayer times widget embedded in HomePage hero section

ScrollToTop — Scrolls window to top on route change

TitleManager — Sets document.title based on current route

8.3 Route Architecture
publicRoutes.jsx — All public routes wrapped in PublicLayout, lazy-loaded

adminRoutes.jsx — All admin routes wrapped in AdminLayout + ProtectedRoute

ProtectedRoute.jsx — Checks AuthContext for admin JWT; redirects to /admin/login if not authenticated

DonorProtectedRoute.jsx — Checks DonorAuthContext; redirects to /donor/login if not authenticated

GuestRoute.jsx — Redirects authenticated admins away from login page

lazyPages.js — All page components wrapped in React.lazy() for code splitting

8.4 Service Layer (/services/)
Service	Endpoints Called
authService.js	/api/auth/login, /api/auth/me, /api/auth/change-password
studentService.js	All /api/students endpoints
donationService.js	/api/donations, /api/donations/projects
zakatService.js	/api/zakat
paymentService.js	/api/payment/init, /api/payment/transaction/:id, /api/payment/all
donorService.js	/api/donor/*
goldService.js	/api/gold/price
dashboardService.js	/api/dashboard
reportService.js	/api/reports, /api/reports/export
userService.js	/api/users
programService.js	/api/programs
contactService.js	/api/contact
transactionService.js	/api/payment/all
axiosInstance.js	Base Axios instance with REACT_APP_API_BASE_URL, JWT interceptor
JWT Interceptor: axiosInstance.js automatically attaches Authorization: Bearer <token> header from localStorage on every request.

Summary: Complete Page & Feature Count
Portal	Pages	Key Features
Public	16 pages	Home, About, Admission, Contact, Gallery, Donate hub, 4 campaign pages, Zakat Calculator, Islamic Library, Book Reader, Prayer Times, Qibla Compass, Mosque Finder
Payment	3 pages	Success (with transaction lookup), Failed, Cancelled
Auth	2 pages	Admin Login (split-screen), Donor Login/Register
Donor	2 pages	Dashboard (KPIs, history), Login/Register
Admin	12 pages	Dashboard, Students, Student Details, Student Finance, Donations, Zakat, Reports, Export, Programs, Language, Users, Settings
Total	35 pages	Full-stack portal with SSLCommerz payments, live APIs (Aladhan, Overpass, Gold), bilingual EN/BN, JWT auth for 2 separate user types