#!/usr/bin/env node
/**
 * Seed script: throwaway teacher + admin for the CI accessibility scan.
 *
 * Idempotent: upserts by phone/schoolId and resets PIN + lockout state.
 *
 * Usage:
 *   MONGO_URL=... PIN_SECRET_KEY=... TEST_USER_PHONE=... TEST_USER_OTP=... \
 *   TEST_ADMIN_PHONE=... TEST_ADMIN_OTP=... node scripts/seed-ci-users.js
 */
'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');
const User = require('../models/user.model');
const School = require('../models/school.model');
const SchoolClass = require('../models/school.class.model');
const builtinRoles = require('../config/builtin_roles.json');

const required = ['MONGO_URL', 'PIN_SECRET_KEY', 'TEST_USER_PHONE', 'TEST_USER_OTP', 'TEST_ADMIN_PHONE', 'TEST_ADMIN_OTP'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing env vars: ${missing.join(', ')}`);
  process.exit(1);
}

const roleId = (name) => builtinRoles.find((r) => r.name === name)._id;

async function upsertUser(phone, pin, fields) {
  await User.updateOne(
    { 'identity.phone': phone },
    {
      $set: {
        ...fields,
        otp: CryptoJS.AES.encrypt(pin, process.env.PIN_SECRET_KEY).toString(),
        isLoginAllowed: true,
        isDeleted: false,
        loginAttempts: [],
      },
      $unset: { recovery: 1 },
    },
    { upsert: true, runValidators: true },
  );
  console.log(`Seeded user ${phone}`);
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URL);

  const school = await School.findOneAndUpdate(
    { schoolId: 999001 },
    {
      name: 'CI Test School', schoolId: 999001, boards: ['KSEEB'], mediums: ['English'],
      state: 'Karnataka', zone: 'CI Zone', district: 'CI District', block: 'CI Block',
    },
    { upsert: true, new: true },
  );

  // Profile page looks up the teacher's board/medium/standard here and 500s if missing.
  await SchoolClass.updateOne(
    { schoolId: school._id, board: 'KSEEB', medium: 'English' },
    {
      start: 6, end: 6,
      classDetails: [{ standard: 6, girlsStrength: 10, boysStrength: 10, totalStrength: 20 }],
    },
    { upsert: true },
  );

  await upsertUser(process.env.TEST_USER_PHONE, process.env.TEST_USER_OTP, {
    identity: { name: 'CI Teacher', phone: process.env.TEST_USER_PHONE },
    roles: [{ role: roleId('Teacher'), dep: school._id }],
    profiles: {
      teacher: {
        isProfileCompleted: true,
        classes: [{ board: 'KSEEB', class: 6, medium: 'English', subject: 'English', name: 'English', sem: 1 }],
      },
    },
  });

  await upsertUser(process.env.TEST_ADMIN_PHONE, process.env.TEST_ADMIN_OTP, {
    identity: { name: 'CI Admin', phone: process.env.TEST_ADMIN_PHONE },
    roles: [{ role: roleId('Admin') }],
    profiles: { admin: { state: 'Karnataka' } },
  });

  console.log('Seed complete');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
