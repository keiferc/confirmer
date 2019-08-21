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
//Used for setting emailStatus
TimeManager.prototype.setNextDate = function ()
{
        var schedule, parser, nextDates, currentDate, i;
        
        schedule = new SettingsManager().getSchedule();
        parser = new GSheetParser(schedule.scheduleId);
        nextDates = parser.getColumn(schedule.dateColLabel);
        currentDate = getToday();

        for (i in nextDates) {
                if ((typeof(nextDates[i]) == typeof(currentDate)) &&
                    ((this.sameDay(nextDates[i], currentDate)) || 
                    (nextDates[i] > currentDate)))
                        return nextDates[i];
        }

        return null;
}

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
        var emailStatus = new SettingsManager().getEmailStatus();

        if (!isEmpty(emailStatus.nextDate))
                return new Date(decodeURIComponent(emailStatus.nextDate));

        throw "Unable to retrieve next scheduled date. Please check " + 
              "that there is an event scheduled after today's date: " + 
              this.formatDate(getToday()) + ".";
}

//TODO: Abstract it ^
TimeManager.prototype.getSendingDate = function ()
{
        var rawDate = new SettingsManager().getEmailStatus().sendingDate;

        if (!isEmpty(rawDate))
                return new Date(decodeURIComponent(rawDate));

        throw "Unable to retrieve next scheduled date. Please check " + 
              "that there is an event scheduled after today's date: " + 
              this.formatDate(getToday()) + ".";
}

//TODELETE
TimeManager.prototype.getWarningDate = function ()
{
        var rawDate = new SettingsManager().getEmailStatus().warningDate;

        return new Date(decodeURIComponent(
                rawDate
        ));
}

//////////////////////////////////////////
// Setters                              //
//////////////////////////////////////////
// TODO: Figure out how users should customize this
TimeManager.prototype.setDate = function
(nextDate, days)
{
        if (isEmpty(nextDate))
                return null;

        return new Date(new Date().setDate(nextDate.getDate() - 
                days));
}

//////////////////////////////////////////
// Helpers                              //
//////////////////////////////////////////
TimeManager.prototype.sameDay = function
(date1, date2)
{
        return date1.getUTCDate() === date2.getUTCDate() &&
                date1.getUTCDay() === date2.getUTCDay() &&
                date1.getUTCMonth() === date2.getUTCMonth() &&
                date1.getUTCFullYear() === date2.getUTCFullYear();
}

TimeManager.prototype.nextDateExists = function ()
{
        try {
                this.getNextDate();
        } catch (e) {
                return false;
        }

        return true;
}

TimeManager.prototype.sent = function 
(warning)
{
        if (isEmpty(warning) || warning === "false")
                return false;
        if (warning === "true")
                return true;
        
        throw "Error: Unable to parse Email Status warning.";
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
        //TODO: customize time zone
        var date_format = {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                timeZone: "America/New_York"
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
                //.everyHours(frequency) // debug
                .everyMinutes(frequency) // debug
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
