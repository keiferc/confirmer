/*
 *      filename:       settings-manager.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           29 July 2019
 *      description:    This module contains an object that manages
 *                      the settings of the Confirmer GMail add-on
 *
 *      note:           This module is to be in a Google Script
 *                      and thus uses function object constructors
 *                      instead of Classes (due to GAS' lack of class
 *                      compatibility)
 */

function SettingsManager()
{
        this.module = "SettingsManager";
}

//////////////////////////////////////////
// Getters                              //
//////////////////////////////////////////
SettingsManager.prototype.getGASO = function ()
{
        return PropertiesService.getUserProperties();
}

SettingsManager.prototype.getAll = function ()
{
        //debug
        Logger.log(typeof(this.getGASO().getProperties()));

        return this.getGASO().getProperties();
}

SettingsManager.prototype.getMain = function ()
{
        // return JSON.parse(
        //         this.getAll()["main"]).replace(/=/g, ":");
        return this.getAll().main;
}

SettingsManager.prototype.getContacts = function ()
{
        return this.getAll().contacts;
}

SettingsManager.prototype.getSchedule = function ()
{
        return this.getAll().schedule;
}

SettingsManager.prototype.getEmailContent = function ()
{
        return this.getAll().emailContent;
}

//////////////////////////////////////////
// Setters                              //
//////////////////////////////////////////
SettingsManager.prototype.setDefault = function ()
{

        this.setMain("9am", 1, true);
        this.setContacts(formatSectionHeader("Contacts", PRIMARY_COLOR),
                null, "Contact Names", "Emails");
        this.setSchedule(formatSectionHeader("Schedule", PRIMARY_COLOR),
                null, "Event Date");
        this.setEmailContent(
                formatSectionHeader("EmailContent", PRIMARY_COLOR),
                null, "Subject Line", "Email Body");
}

/**
 * 
 * @param       {Object} main
 * @param       {Object} contacts
 * @param       {Object} schedule
 * @param       {Object} emailContent
 */
SettingsManager.prototype.setAll = function
(main, contacts, schedule, emailContent)
{
        this.getGASO().setProperties({
                main: main,
                contacts: contacts,
                schedule: schedule,
                emailContent: emailContent,
        });
}

SettingsManager.prototype.setMain = function
(hourOfDay, everyXDays, sendToSelf)
{
        this.getGASO().setProperty("main", 
                new this.Main(hourOfDay, everyXDays, sendToSelf));
}

SettingsManager.prototype.setContacts = function
(formattedHeader, url, nameColLabel, emailColLabel)
{
        this.getGASO().setProperty("contacts",
                new this.Contacts(formattedHeader, url, 
                                  nameColLabel, emailColLabel));
}

SettingsManager.prototype.setSchedule = function
(formattedHeader, url, dateColLabel)
{
        this.getGASO().setProperty("schedule", 
                new this.Schedule(formattedHeader, url, dateColLabel));
}

SettingsManager.prototype.setEmailContent = function
(formattedSectionHeader, url, subjectColLabel, bodyColLabel)
{
        this.getGASO().setProperty("emailContent",
                new this.EmailContent(formattedSectionHeader, url,
                                      subjectColLabel, bodyColLabel));
}

//////////////////////////////////////////
// Nested Object Constructors           //
//////////////////////////////////////////
/**
 * 
 * @param       {String} hourOfDay
 * @param       {Number} everyXDays
 * @param       {Boolean} sendToSelf
 * @param       {Object}
 */
SettingsManager.prototype.Main = function
(hourOfDay, everyXDays, sendToSelf)
{
        this.hourOfDay = hourOfDay; // Format: Xxx, e.g. 9am, 12pm
        this.everyXDays = everyXDays; // delivery time check
        this.sendToSelf = sendToSelf;
}

/**
 * 
 * @param       {Stinrg} formattedHeader
 * @param       {String} url 
 * @param       {String} nameColLabel 
 * @param       {String} emailColLabel 
 * @returns     {Object}
 */
SettingsManager.prototype.Contacts = function
(formattedHeader, url, nameColLabel, emailColLabel)
{
        this.header = formattedHeader;
        this.url = url;
        this.nameColLabel = nameColLabel;
        this.emailColLabel = emailColLabel;
}

/**
 * 
 * @param       {String} formattedHeader
 * @param       {String} url 
 * @param       {String} dateColLabel 
 * @returns     {Object}
 */
SettingsManager.prototype.Schedule = function
(formattedHeader, url, dateColLabel)
{
        this.header = formattedHeader;
        this.url = url;
        this.dateColLabel = dateColLabel;
}

/**
 *
 * @param       {String} formattedHeader
 * @param       {String} url
 * @param       {String} subjectColLabel
 * @param       {String} bodyColLabel
 * @returns     {Object} 
 */
SettingsManager.prototype.EmailContent = function
(formattedHeader, url, subjectColLabel, bodyColLabel)
{
        this.header = formattedHeader;
        this.url = url;
        this.subjectColLabel = subjectColLabel;
        this.bodyColLabel = bodyColLabel;
}
