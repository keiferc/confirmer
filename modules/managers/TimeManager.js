/*
 *      filename:       TimeManager.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           23 August 2019
 *      description:    This module contains handles all time-related
 *                      processes involved with the Confirmer GMail
 *                      add-on.
 */

/*------------------------------------------------------------
 *                         Functions
 *------------------------------------------------------------
 * ---- Object Constructor ---- 
 * TimeManager::TimeManager()
 *
 * ---- Getters ----
 * TimeManager::getNextDate()
 * TimeManager::getSendingDate()
 *
 * ---- Setters ----
 * TimeManager::setDate(Date, number)
 * TimeManager::setNextDate()
 *
 * ---- Helpers ---- 
 * TimeManager::getDateHelper(string)
 * TimeManager::sameDay(Date, Date)
 * TimeManager::formatDate(Date)
 *
 * ---- Time Trigger Management ----
 * TimeManager::startTimeTrigger(number, number)
 * TimeManager::stopTimeTrigger()
 * TimeManager::editTimeTrigger(number, number, boolean)
 *
 ------------------------------------------------------------*/

/**
 * TimeManager
 *
 * Object constructor for TimeManager object. Handles all time-related
 * processes for the add-on.
 *
 * @returns     {Object}
 */
function TimeManager() {}

//////////////////////////////////////////
// Getters                              //
//////////////////////////////////////////
/**
 * getNextDate
 *
 * Retrieves saved next scheduled date from EmailStatus. 
 * Calls nextDateHelper.
 *
 * @returns     {Date}
 */
TimeManager.prototype.getNextDate = function ()
{
        return this.getDateHelper(
                new SettingsManager().getEmailStatus().nextDate 
        )
}

/**
 * getSendingDate
 *
 * Returns saved next email sending date. Calls nextDateHelper.
 *
 * @returns {Date}
 */
TimeManager.prototype.getSendingDate = function ()
{
        return this.getDateHelper(
                new SettingsManager().getEmailStatus().sendingDate 
        );
}

//////////////////////////////////////////
// Setters                              //
//////////////////////////////////////////
/**
 * setDate
 *
 * Returns a date `days` before the given `nextDate`.
 *
 * @param       {Date} nextDate
 * @param       {number} days
 * @returns     {Date|null}
 */
TimeManager.prototype.setDate = function
(nextDate, days)
{
        if (isEmpty(nextDate)) 
                return null;

        return new Date(new Date().setDate(
                nextDate.getDate() - days
        ));
}

/**
 * setNextDate
 *
 * Returns next listed valid event date from Google Sheet. Returns null
 * if not found.
 *
 * @returns     {Date|null}
 */
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

//////////////////////////////////////////
// Helpers                              //
//////////////////////////////////////////
/**
 * getDateHelper
 *
 * Returns a JS Date object from the given percent-encoded string.
 *
 * @param       {string} rawDate: Percent-encoded string representing Date
 * @returns     {Date}
 */
TimeManager.prototype.getDateHelper = function 
(rawDate)
{
        if (!isEmpty(rawDate)) 
                return new Date(decodeURIComponent(rawDate));

        throw "Unable to retrieve next scheduled date. Please check " + 
        "that there is an event scheduled after today's date: " + 
        this.formatDate(getToday()) + "."; 
}

/**
 * sameDay
 *
 * Returns true if the given dates have the same date number,
 * day-of-the-week, month, and year.
 *
 * @param       {Date} date1
 * @param       {Date} date2
 * @returns     {boolean}
 */
TimeManager.prototype.sameDay = function
(date1, date2)
{
        return (date1.getUTCDate() === date2.getUTCDate()) &&
               (date1.getUTCDay() === date2.getUTCDay()) &&
               (date1.getUTCMonth() === date2.getUTCMonth()) &&
               (date1.getUTCFullYear() === date2.getUTCFullYear());
}

/**
 * formatDate
 *
 * Returns the given date in the app's format.
 *
 * @param       {Date} date 
 * @returns     {string}
 */
TimeManager.prototype.formatDate = function 
(date)
{
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
/**
 * startTimeTrigger 
 *
 * Starts the Google Apps Script time trigger. Calls sendConfirm 
 * as callback function.
 *
 * @param       {number} frequency: How often to run sendConfirm
 * @param       {number} time: At what time to run sendConfirm
 */
TimeManager.prototype.startTimeTrigger = function 
(frequency, time)
{
        ScriptApp.newTrigger("sendConfirm") 
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
