/*
 *      filename:       SettingsManager.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           29 July 2019
 *      description:    This module contains an object that manages
 *                      the settings of the Confirmer GMail add-on
 */

/**
 * SettingsManager
 *
 * A class that handles all processes
 * involving add-on settings
 *
 * @returns     {Object}
 */
function SettingsManager() {}

//////////////////////////////////////////
// Getters                              //
//////////////////////////////////////////
/**
 * getGASO
 *
 * Returns the Google Apps Script Object containing
 * user settings for the Confirmer add-on
 *
 * @returns     {UserProperties}
 */
SettingsManager.prototype.getGASO = function ()
{
        return PropertiesService.getUserProperties();
}

/**
 * getAll
 *
 * Returns saved user properties in a GASO format
 *
 * @returns     {Google Apps Script Object}
 */
SettingsManager.prototype.getAll = function ()
{
        return this.getGASO().getProperties();
}

/**
 * getEmailStatus
 */
SettingsManager.prototype.getEmailStatus = function ()
{
        if (isEmpty(this.getAll().emailStatus))
                throw "Error: 'Email Status' settings are undefined.";
        
        return new GasoParser().toJSO(this.getAll().emailStatus);
}

/**
 * getMain
 *
 * @returns     {Object}
 */
SettingsManager.prototype.getMain = function ()
{
        if (isEmpty(this.getAll().main))
                throw "Error: 'Main' settings are undefined.";

        return new GasoParser().toJSO(this.getAll().main);
}

/**
 * getContacts
 *
 * @returns     {Object}
 */
SettingsManager.prototype.getContacts = function ()
{
        if (isEmpty(this.getAll().contacts)) 
                throw "Error: 'Contacts' settings are undefined.";

        return new GasoParser().toJSO(this.getAll().contacts);
}

/**
 * getSchedule
 *
 * @returns     {JSON}
 */
SettingsManager.prototype.getSchedule = function ()
{
        if (isEmpty(this.getAll().schedule))
                throw "Error: 'Schedule' settings are undefined.";

        return new GasoParser().toJSO(this.getAll().schedule);
}

/**
 * getEmailContent
 *
 * @returns     {JSON}
 */
SettingsManager.prototype.getEmailContent = function ()
{
        if (isEmpty(this.getAll().emailContent))
                throw "Error: 'Email Content' settings are undefined.";

        return new GasoParser().toJSO(this.getAll().emailContent);
}

//////////////////////////////////////////
// Setters                              //
//////////////////////////////////////////
/**
 * setDefault
 */
SettingsManager.prototype.setDefault = function ()
{
        this.setEmailStatus(null, null, null, false, false);
        this.setMain("9am", 1, true, true);
        this.setContacts("Contacts", null, 
                "e.g. Contact Names", "e.g. Emails");
        this.setSchedule("Schedule", null, "e.g. Event Date");
        this.setEmailContent("Email Content",null, 
                "e.g. Subject Line", "e.g. Email Body");
}

/**
 * setAll 
 *
 * @param       {MainSettings} main
 * @param       {ContactsSettings} contacts
 * @param       {ScheduleSettings} schedule
 * @param       {EmailContentSettings} emailContent
 */
SettingsManager.prototype.setAll = function
(main, contacts, schedule, emailContent)
{
        this.getGASO().setProperties({
                main: main,
                contacts: contacts,
                schedule: schedule,
                emailContent: emailContent
        });
}

/**
 * setEmailStatus
 * 
 * @param       {Date} nextDate
 * @param       {Date} sendingDate
 * @param       {boolean} sentWarning
 * @param       {boolean} confirmed
 */
SettingsManager.prototype.setEmailStatus = function
(nextDate, sendingDate, sentWarning, confirmed)
{
        this.getGASO().setProperty("emailStatus",
                new EmailStatusSettings(nextDate, sendingDate, 
                        sentWarning, confirmed));
}

/**
 * setMain
 *
 * @param       {String} hourOfDay
 * @param       {Number} everyXDays
 * @param       {boolean} pause
 * @param       {Boolean} sendToSelf
 */
SettingsManager.prototype.setMain = function
(hourOfDay, everyXDays, pause, sendToSelf)
{
        this.getGASO().setProperty("main", 
                new MainSettings(hourOfDay, everyXDays, 
                        pause, sendToSelf));
}

/**
 * setContacts
 *
 * @param       {String} header
 * @param       {String} id
 * @param       {String} nameColLabel
 * @param       {String} emailColLabel
 */
SettingsManager.prototype.setContacts = function
(header, id, nameColLabel, emailColLabel)
{
        this.getGASO().setProperty("contacts",
                new ContactsSettings(header, id, 
                        nameColLabel, emailColLabel));
}

/**
 * setSchedule
 *
 * @param       {String} header
 * @param       {String} id
 * @param       {String} dateColLabel
 */
SettingsManager.prototype.setSchedule = function
(header, id, dateColLabel)
{
        this.getGASO().setProperty("schedule", 
                new ScheduleSettings(header, id, dateColLabel));
}

/**
 * setEmailContent
 *
 * @param       {String} header
 * @param       {String} id
 * @param       {String} subjectColLabel
 * @param       {String} bodyColLabel
 */
SettingsManager.prototype.setEmailContent = function
(header, id, subjectColLabel, bodyColLabel)
{
        this.getGASO().setProperty("emailContent",
                new EmailContentSettings(header, id, 
                        subjectColLabel, bodyColLabel));
}

//////////////////////////////////////////
// Object Constructors                  //
//////////////////////////////////////////
function EmailStatusSettings(nextDate, sendingDate, sentWarning, confirmed)
{
        this.nextDate = cleanInputSetting(nextDate, false);
        this.sendingDate = cleanInputSetting(sendingDate, false);
        this.sentWarning = cleanInputSetting(sentWarning, false);
        this.confirmed = cleanInputSetting(confirmed, false);
}

/**
 * MainSettings
 * 
 * @param       {String} hourOfDay
 * @param       {Number} everyXDays
 * @param       {boolean} pause
 * @param       {Boolean} sendToSelf
 * @param       {MainSettings}
 */
function MainSettings(hourOfDay, everyXDays, pause, sendToSelf)
{
        // hourOfDay format: [1-12][am|pm]; e.g. 9am
        this.hourOfDay = cleanInputSetting(hourOfDay, false); 
        this.everyXDays = cleanInputSetting(everyXDays, false);
        this.pause = cleanInputSetting(pause, false);
        this.sendToSelf = cleanInputSetting(sendToSelf, false);
}

/**
 * ContactsSettings
 *
 * @param       {String} header
 * @param       {String} id 
 * @param       {String} nameColLabel 
 * @param       {String} emailColLabel 
 * @returns     {ContactsSettings}
 */
function ContactsSettings(header, id, nameColLabel, emailColLabel)
{
        this.header = header;
        this.contactsId = id;
        this.nameColLabel = nameColLabel;
        this.emailColLabel = emailColLabel;
}

/**
 * ScheduleSettings
 *
 * @param       {String} header
 * @param       {String} id 
 * @param       {String} dateColLabel 
 * @returns     {ScheduleSettings}
 */
function ScheduleSettings(header, id, dateColLabel)
{
        this.header = header;
        this.scheduleId = id;
        this.dateColLabel = dateColLabel;
}

/**
 * EmailContentSettings
 *
 * @param       {String} header
 * @param       {String} id
 * @param       {String} subjectColLabel
 * @param       {String} bodyColLabel
 * @returns     {EmailContentSettings} 
 */
function EmailContentSettings(header, id, subjectColLabel, bodyColLabel)
{
        this.header = header
        this.emailContentId = id;
        this.subjectColLabel = subjectColLabel;
        this.bodyColLabel = bodyColLabel;
}

//////////////////////////////////////////
// Helpers                              //
//////////////////////////////////////////
SettingsManager.prototype.updateEmailStatus = function 
(sendingBuffer)
{
        var calendar, status, currDate, nextDate, 
                sendingDate, sentWarning, confirmed;

        calendar = new TimeManager();
        status = this.getEmailStatus();
        sentWarning = status.sentWarning;
        confirmed = status.confirmed;
        nextDate = calendar.setNextDate();

        if (!isEmpty(status.nextDate)) {
                currDate = calendar.getNextDate();

                if (parseBool(confirmed) &&
                    ((isEmpty(nextDate) || isEmpty(currDate)) ||
                    (!calendar.sameDay(nextDate, currDate))))
                        confirmed = false;
        }

        sendingDate = calendar.setDate(nextDate, sendingBuffer);
        this.setEmailStatus(nextDate, sendingDate, sentWarning, confirmed);
}

SettingsManager.prototype.setSentStatus = function
(sentWarning, sentConfirmed)
{
        var status, warning, confirmed;

        status = this.getEmailStatus();
        warning = sentWarning;
        confirmed = sentConfirmed;

        if (isEmpty(warning))
                warning = status.sentWarning;
        if (isEmpty(confirmed))
                confirmed = status.confirmed;

        this.setEmailStatus(
                decodeURIComponent(status.nextDate), 
                decodeURIComponent(status.sendingDate),
                warning, confirmed);
}
