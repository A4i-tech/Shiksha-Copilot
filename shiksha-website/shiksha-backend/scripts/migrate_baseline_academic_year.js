require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const dbService = require('../config/db');
const BaselineSurvey = require('../models/baselineSurvey.model');

/**
 * Migration Script: Update baseline survey data from 'year' to 'academicYear'
 * 
 * Academic Year Logic:
 * - June-Dec: Academic Year = Current Year
 * - Jan-Mar: Academic Year = Current Year - 1
 * - Apr-May: Survey window closed
 */

async function migrateBaselineData() {
    console.log("Starting baseline survey data migration...");
    await dbService.connect();

    try {
        // Find all baseline surveys that still have 'year' field
        const surveysWithYear = await BaselineSurvey.find({ 
            year: { $exists: true },
            academicYear: { $exists: false }
        });

        console.log(`Found ${surveysWithYear.length} surveys to migrate`);

        for (const survey of surveysWithYear) {
            const surveyYear = survey.year;
            const surveyDate = survey.createdAt;
            
            // Calculate academic year based on creation date
            const academicYear = calculateAcademicYear(surveyDate);
            
            console.log(`Migrating survey for user ${survey.userId}:`);
            console.log(`  - Original year: ${surveyYear}`);
            console.log(`  - Created: ${surveyDate.toISOString()}`);
            console.log(`  - Academic year: ${academicYear}`);
            
            // Update the document
            await BaselineSurvey.updateOne(
                { _id: survey._id },
                { 
                    $set: { academicYear: academicYear },
                    $unset: { year: 1 } // Remove old year field
                }
            );
            
            console.log(`  ✅ Migrated successfully`);
        }

        // Verify migration
        const remainingWithYear = await BaselineSurvey.countDocuments({ 
            year: { $exists: true }
        });
        
        const withAcademicYear = await BaselineSurvey.countDocuments({ 
            academicYear: { $exists: true }
        });

        console.log("\n=== Migration Summary ===");
        console.log(`Surveys with academicYear: ${withAcademicYear}`);
        console.log(`Surveys still with 'year' field: ${remainingWithYear}`);
        
        if (remainingWithYear === 0) {
            console.log("✅ Migration completed successfully!");
        } else {
            console.log("⚠️  Some surveys could not be migrated");
        }

    } catch (error) {
        console.error("Migration Error:", error);
    } finally {
        mongoose.disconnect();
    }
}

function calculateAcademicYear(date) {
    const month = date.getMonth(); // 0-11
    const year = date.getFullYear();

    // Academic Year Logic:
    // June-Dec: Academic Year = Current Year
    // Jan-Mar: Academic Year = Current Year - 1
    // Apr-May: Survey window closed (but we still calculate)
    
    if (month >= 5) { // June (5) onwards
        return year;
    } else { // Jan-Mar
        return year - 1;
    }
}

// Run the migration
migrateBaselineData();
