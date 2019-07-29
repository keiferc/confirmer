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
        //////////////////////////////////////////
        // Methods                              //
        //////////////////////////////////////////
        //================ Getters ================//
        this.getGASO = function()
        {
                return PropertiesService.getUserProperties();
        }

        this.getAll = function()
        {
                //debug
                Logger.log(typeof(this.getGASO().getProperties()));

                return this.getGASOj().getProperties();
        }

        this.getMain = function()
        {
                // return JSON.parse(
                //         this.getAll()["main"]).replace(/=/g, ":");
                return this.getAll().main;
        }

        this.getContacts = function()
        {
                return this.getAll().contacts;
        }

        this.getSchedule = function()
        {
                return this.getAll().schedule;
        }

        this.getEmailContent = function()
        {
                return this.getAll().emailContent;
        }

        //================ Setters ================//
        /**
         * 
         * @param       {Object} main
         * @param       {Object} contacts
         * @param       {Object} schedule
         * @param       {Object} emailContent
         */
        this.setAll() = function(main, contacts, schedule, emailContent)
        {
                this.getGaso().setProperties({
                        main: main,
                        contacts: contacts,
                        schedule: schedule,
                        emailContent: emailContent,
                });
        }

        this.setDefault() = function()
        {
                var main, contacts, schedule, emailContent;

                main = new Main("9am", 1, true);
                contacts = new Contacts(
                        formatSectionHeader("Contacts", PRIMARY_COLOR),
                        null, "Contact Names", "Emails");
                schedule = new Schedule(
                        formatSectionHeader("Schedule", PRIMARY_COLOR),
                        null, "Event Date");
                emailContent = new EmailContent(
                        formatSectionHeader("Email Content", PRIMARY_COLOR),
                        null, "Subject Line", "Email Body");
                
                this.setAll(main, contacts, schedule, emailContent);
        }
}

//////////////////////////////////////////
// Settings Setters                     //
//////////////////////////////////////////
function setDefaultSettings()
{

}


function setAllSettings(mainSettings, contactsSettings, 
                        scheduleSettings, emailContentSettings)
{

}

function setMainSettings(hourOfDay, everyXDays, sendToSelf)
{
        getSettingsObj().setProperty("main", 
                new MainSettings(hourOfDay, everyXDays, sendToSelf));
}

function setContactsSettings(formattedHeader, url, nameColLabel, emailColLabel)
{
        getSettingsObj().setProperty("contacts",
                new ContactsSettings(formattedHeader, url, 
                                     nameColLabel, emailColLabel));
}

function setScheduleSettings(formattedHeader, url, dateColLabel)
{
        getSettingsObj().setProperty("schedule", 
                new ScheduleSettings(formattedHeader, url, dateColLabel));
}

function setEmailContentSettings(formattedSectionHeader, url, 
                                 subjectColLabel, bodyColLabel)
{
        getSettingsObj().setProperty("emailContent",
                new EmailContentSettings(formattedSectionHeader, url,
                                         subjectColLabel, bodyColLabel));
}

//////////////////////////////////////////
// Settings Constructors                //
//////////////////////////////////////////
/**
 * 
 * @param       {String} hourOfDay
 * @param       {Number} everyXDays
 * @param       {Boolean} sendToSelf
 * @param       {Object}
 */
function MainSettings(hourOfDay, everyXDays, sendToSelf)
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
function ContactsSettings(formattedHeader, url, nameColLabel, 
                          emailColLabel)
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
function ScheduleSettings(formattedHeader, url, dateColLabel)
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
function EmailContentSettings(formattedHeader, url, 
                              subjectColLabel, bodyColLabel)
{
        this.header = formattedHeader;
        this.url = url;
        this.subjectColLabel = subjectColLabel;
        this.bodyColLabel = bodyColLabel;
}
