# Campaign Update Migration Guide

## Overview
This guide explains how to sync the new donation campaign names between frontend and backend.

## New Campaign Names

| Old Name | New Name | Goal |
|---|---|---|
| Mosque Expansion | Masjid and Madrasha Complex | ৳2,000,000 |
| Madrasa Development | An Nusrah Skill Development | ৳200,000 |
| Student Support | Poor Student Support | ৳150,000 |
| (New) | Ifter Fund | ৳100,000 |

## Changes Made

### Backend Changes

1. **Donation Model** (`src/models/Donation.js`)
   - Added enum validation for projectType field
   - Valid values: `['Masjid and Madrasha Complex', 'Poor Student Support', 'An Nusrah Skill Development', 'Ifter Fund']`

2. **Seed Data** (`src/seed.js`)
   - Updated all 20 sample donations with new campaign names
   - Distributed across all 4 campaigns

3. **Migration Script** (`src/migrate.js`)
   - Created script to update existing database records
   - Maps old campaign names to new ones

4. **Package.json**
   - Added `npm run migrate` script

### Frontend Changes

1. **Donation Pages**
   - `MosqueDonationPage.jsx` → "Masjid and Madrasha Complex" (₹2M)
   - `MadrasaDonationPage.jsx` → "An Nusrah Skill Development" (₹200K)
   - `StudentSupportDonationPage.jsx` → "Poor Student Support" (₹150K)
   - `IfterFundDonationPage.jsx` → NEW page (₹100K)

2. **Routes**
   - Added `DONATE_IFTER: '/donate/ifter-fund'` to paths.js
   - Added IfterFundDonationPage to lazy imports
   - Added route to publicRoutes.jsx

3. **HomePage & DonationPage**
   - Updated PROJECT_META with new campaign names and goals
   - Updated Ifter Fund link to use correct path

## Migration Steps

### For Fresh Database (Development)

```bash
cd madrasa-backend
npm run seed
```

This will create a fresh database with the new campaign names.

### For Existing Database (Production)

```bash
cd madrasa-backend
npm run migrate
```

This will update existing donation records to use the new campaign names.

## Verification

After migration, verify:

1. **Backend API** - Check `/api/donations/projects` returns correct campaign names
2. **Frontend Pages** - All 4 donation pages load correctly
3. **Admin Panel** - Donation overview shows new campaign names
4. **Homepage Slider** - All 4 campaigns display with correct data

## Rollback

If you need to rollback, run the seed script again:

```bash
cd madrasa-backend
npm run seed
```

Note: This will clear all data and reseed with sample data.

## Notes

- The migration script is idempotent (safe to run multiple times)
- Admin panel dynamically fetches project types, so no changes needed there
- All donation forms now validate against the new campaign names
- The enum validation ensures only valid campaign names can be saved
