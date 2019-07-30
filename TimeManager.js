/*
 *      filename:       TimeManager.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           29 July 2019
 *      description:    This module contains handles all time-related
 *                      processes involved with the Confirmer GMail
 *                      add-on
 *
 *      note:           This module is to be in a Google Script
 *                      and thus uses constructor functions
 *                      instead of Classes (due to GAS' lack of class
 *                      compatibility)
 */

/**
 * TimeManager
 *
 * @returns     {Object}
 */
function TimeManager() {};

//////////////////////////////////////////
// Schedule Calculations                //
//////////////////////////////////////////
/**
 * getNextDate
 *
 * Retrieves next scheduled date from sheet
 *
 * @returns     {Date}
 */
TimeManager.prototype.getNextDate = function ()
{
         var parser, next_dates, current_date, i;
         
         parser = new GSheetParser(volunteersSignupSheet);
         next_dates = parser.getColumn(dateColumnTitle);
         current_date = new Date();
 
         for (i in next_dates) {
                 if (next_dates[i] >= current_date)
                         return next_dates[i]
         }
 
         throw "Unable to retrieve next scheduled date.";
}

/**
 * formatDate
 *
 * Returns the given date in the app's format
 *
 * @param       {Date} date 
 */
TimeManager.prototype.formatDate = function 
(date)
{
        var date_format = {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric"
        };

        return date.toLocaleDateString("en-US", date_format);
}

//////////////////////////////////////////
// Time Trigger Management              //
//////////////////////////////////////////
/**
 * startTimeTrigger 
 *
 * Starts the Google Apps Script time trigger
 *
 * @param       {Number} frequency 
 * @param       {Number} time 
 */
TimeManager.prototype.startTimeTrigger = function 
(frequency, time)
{
        ScriptApp.newTrigger("main")
                .timeBased()
                .everyDays(frequency)
                .atHour(time)
                .inTimezone("America/New_York")
                .create();
}

/**
 * stopTimeTrigger
 *
 * Stops the Google Apps Script time trigger
 */
TimeManager.prototype.stopTimeTrigger = function ()
{
        var triggers, i;

        triggers = ScriptApp.getProjectTriggers();

        for (i = 0; i < triggers.length; i++) {
                if (triggers[i].getTriggerSource() == 
                    ScriptApp.TriggerSource.CLOCK)
                        ScriptApp.deleteTrigger(triggers[i]);
        }
}

/**
 * editTimeTrigger 
 *
 * Edits the time trigger with the given frequency and time
 * values
 *
 * @param       {Number} frequency 
 * @param       {Number} time 
 */
TimeManager.prototype.editTimeTrigger = function 
(frequency, time)
{
        stopTimeTrigger();
        startTimeTrigger(frequency, time);
}
