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

// TODO: Handle time-zones
// userTimezone.id—The user's timezone identifier. 
// For example, America/New_York.

/**
 * TimeManager
 *
 * @returns     {Object}
 */
function TimeManager() {};

//////////////////////////////////////////
// Getters                              //
//////////////////////////////////////////
//TODO
// Getters should retrieve from EmailStatusSettings
/**
 * getNextDate
 *
 * Retrieves next scheduled date from sheet
 *
 * @returns     {Date}
 */
TimeManager.prototype.getNextDate = function ()
{
        var schedule, parser, next_dates, current_date, i;
        
        schedule = new SettingsManager().getSchedule();
        parser = new GSheetParser(schedule.scheduleId);
        next_dates = parser.getColumn(schedule.dateColLabel);
        current_date = new Date();

        for (i in next_dates) {
                if (next_dates[i] >= current_date)
                        return next_dates[i];
        }

        throw "Error: Unable to retrieve next scheduled date. Please check" + 
              "that there is an event scheduled after today's date: " + 
              this.formatDate(current_Date) + ".";
}

TimeManager.prototype.getSendingDate = function ()
{
        return new Date(new Date().setDate(this.getNextDate().getDate() - 3));
}

TimeManager.prototype.getWarningDate = function ()
{
        return new Date(new Date().setDate(this.getNextDate().getDate() - 7));
}

//////////////////////////////////////////
// Setters                              //
//////////////////////////////////////////
// TODO: Figure out how users should customize this
TimeManager.prototype.setDate = function
(days)
{
        return new Date(new Date().setDate(this.getNextDate().getDate() - days));
}

//////////////////////////////////////////
// Helpers                              //
//////////////////////////////////////////

// TODO
TimeManager.prototype.checkDate = function 
(emailer)
{
        var today, nextDate, sendingDate, warningDate;
        today = new Date();

        try {
                nextDate = this.getNextDate();
        } catch(e) {
                emailer.emailError(e);
        }

        sendingDate = this.getSendingDate();
        warningDate = this.getWarningDate();
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
// debugging
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
        ScriptApp.newTrigger("confirm")
                .timeBased()
                //.everyDays(frequency)
                .everyHours(frequency) // debug
                //.everyMinutes(frequency) // debug
                //.atHour(time)
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
 * values.
 *
 * @param       {number} frequency 
 * @param       {number} time 
 * @param       {boolean} pause
 */
TimeManager.prototype.editTimeTrigger = function 
(frequency, time, pause)
{
        this.stopTimeTrigger();

        if (!pause)
                this.startTimeTrigger(frequency, time);
}
