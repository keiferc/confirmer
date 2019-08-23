/*
 *      filename:       SettingsManager.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           23 August 2019
 *      description:    This module contains an object that manages
 *                      the settings of the Confirmer GMail add-on
 */

/*------------------------------------------------------------
 *                         Functions
 *------------------------------------------------------------
 * ---- Object Constructor ---- 
 * SettingsManager::SettingsManager()
 *
 * ---- Nested Object Constructors ----
 * SettingsManager::EmailStatusSettings(Date, Date, boolean, boolean)
 * SettingsManager::MainSettings(string, number, boolean, boolean)
 * SettingsManager::ContactsSettings(string, string, string, string)
 * SettingsManager::ScheduleSettings(string, string, string)
 * SettingsManager::EmailContentSettings(string, string, string, string)
 *
 * ---- Getters ----
 * SettingsManager::getGASO()
 * SettingsManager::getAll()
 * SettingsManager::getEmailStatus()
 * SettingsManager::getMain()
 * SettingsManager::getContacts()
 * SettingsManager::getSchedule()
 * SettingsManager::getEmailContent()
 *
 * ---- Setters ----
 * SettingsManager::setDefault()
 * SettingsManager::setAll(MainSettings, ContactsSettings, ScheduleSettings,
 *      EmailContentSettings)
 * SettingsManager::setEmailStatus(Date, Date, boolean, boolean)
 * SettingsManager::setMain(string, number, boolean, boolean)
 * SettingsManager::setContacts(string, string, string, string)
 * SettingsManager::setSchedule(string, string, string)
 * SettingsManager::setEmailContent(string, string, string, string)
 *
 * ---- Helpers ---- 
 * SettingsManager::updateEmailStatus(number)
 * SettingsManager::setSentStatus(boolean|null, boolean|null)
 *
 ------------------------------------------------------------*/

/**
 * SettingsManager
 *
 * Object construct that handles all processes involving add-on settings.
 * Works with Google's PropertiesService.
 *
 * @returns     {SettingsManager}
 */
function SettingsManager() {}

//////////////////////////////////////////
// Nested Object Constructors           //
//////////////////////////////////////////
/**
 * EmailStatusSettings
 *
 * Returns an EmailStatusSettings object. 
 *
 * @param       {Date} nextDate 
 * @param       {Date} sendingDate 
 * @param       {boolean} sentWarning 
 * @param       {boolean} confirmed 
 * @returns     {EmailStatusSettings}
 */
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
 * Returns MainSettings object.
 *
 * @param       {string} hourOfDay
 * @param       {number} everyXDays
 * @param       {boolean} pause
 * @param       {boolean} sendToSelf
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
 * Returns ContactsSettings object. Sanitization occurs on submit.
 *
 * @param       {string} header
 * @param       {string} id 
 * @param       {string} nameColLabel 
 * @param       {string} emailColLabel 
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
 * Returns ScheduleSettings object. Sanitization occurs on submit.
 *
 * @param       {string} header
 * @param       {string} id 
 * @param       {string} dateColLabel 
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
 * Returns EmailContentSettings object. Sanitization occurs on submit.
 *
 * @param       {string} header
 * @param       {string} id
 * @param       {string} subjectColLabel
 * @param       {string} bodyColLabel
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
// Getters                              //
//////////////////////////////////////////
/**
 * getGASO
 *
 * Returns the Google Apps Script Object containing user settings for 
 * the Confirmer add-on
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
 *
 * Returns saved EmailStatusSettings.
 *
 * @returns     {EmailStatusSettings}
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
 * Returns saved MainSettings.
 *
 * @returns     {MainSettings}
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
 * Returns saved ContactsSettings.
 *
 * @returns     {ContactsSettings}
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
 * Returns saved ScheduleSettings.
 *
 * @returns     {ScheduleSettings}
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
 * Returns saved EmailContentSettings.
 *
 * @returns     {EmailContentSettings}
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
 *
 * Saves default settings into Google's PropertiesService on first init.
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
 * Sets all settings objects into Google's PropertiesService.
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
 * Saves EmailStatusSettings into Google's PropertiesService.
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
 * Saves MainSettings into Google's PropertiesService.
 *
 * @param       {string} hourOfDay
 * @param       {number} everyXDays
 * @param       {boolean} pause
 * @param       {boolean} sendToSelf
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
 * Saves ContactsSettings into Google's PropertiesService.
 *
 * @param       {string} header
 * @param       {string} id
 * @param       {string} nameColLabel
 * @param       {string} emailColLabel
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
 * Saves ScheduleSettings into Google's PropertiesService.
 *
 * @param       {string} header
 * @param       {string} id
 * @param       {string} dateColLabel
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
 * Saves EmailContentSettings into Google's PropertiesService.
 *
 * @param       {string} header
 * @param       {string} id
 * @param       {string} subjectColLabel
 * @param       {string} bodyColLabel
 */
SettingsManager.prototype.setEmailContent = function
(header, id, subjectColLabel, bodyColLabel)
{
        this.getGASO().setProperty("emailContent",
                new EmailContentSettings(header, id, 
                        subjectColLabel, bodyColLabel));
}

//////////////////////////////////////////
// Helpers                              //
//////////////////////////////////////////
/**
 * updateEmailStatus
 *
 * Saves updated EmailStatus with date checking.
 *
 * @param       {number} sendingBuffer: # of days before event to send email
 */
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

/**
 * setSentStatus
 *
 * Saves updated sent messages status. If parameter is null,
 * status does not change from previously saved status.
 *
 * @param       {boolean|null} sentWarning
 * @param       {boolean|null} sentConfirmed
 */
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
