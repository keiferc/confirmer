/*
 * TODO : Module documentation
 * //Prototype this?
 */

//////////////////////////////////////////
// Settings Getters                     //
//////////////////////////////////////////
function getSettingsObj()
{
        return PropertiesService.getUserProperties();
}

function getAllSettings()
{
        //debug
        Logger.log(typeof(getSettingsObj().getProperties().main));
        // TODO : string parser to convert back to JSON object

        return getSettingsObj().getProperties();
}

function getMainSettings()
{
        // return JSON.parse(
        //         getAllSettings()["main"]).replace(/=/g, ":");
        return getAllSettings().main;
}

function getContactsSettings()
{
        return getAllSettings()["contacts"];
}

function getScheduleSettings()
{
        return getAllSettings()["schedule"];
}

function getEmailContentSettings()
{
        return getAllSettings()["emailContent"];
}

//////////////////////////////////////////
// Settings Setters                     //
//////////////////////////////////////////
function setDefaultSettings()
{
        var main, contacts, schedule, emailContent;

        main = new MainSettings("9am", 1, true);
        contacts = new ContactsSettings(
                formatSectionHeader("Contacts", PRIMARY_COLOR),
                null, "Contact Names", "Emails");
        schedule = new ScheduleSettings(
                formatSectionHeader("Schedule", PRIMARY_COLOR),
                null, "Event Date");
        emailContent = new EmailContentSettings(
                formatSectionHeader("Email Content", PRIMARY_COLOR),
                null, "Subject Line", "Email Body");
        
        setAllSettings(main, contacts, schedule, emailContent);
}

/**
 * 
 * @param       {Object} mainSettings
 * @param       {Object} contactsSettings 
 * @param       {Object} scheduleSettings 
 * @param       {Object} emailContentSettings 
 */
function setAllSettings(mainSettings, contactsSettings, 
                        scheduleSettings, emailContentSettings)
{
        var settings = getSettingsObj();

        settings.setProperties({
                main: mainSettings,
                contacts: contactsSettings,
                schedule: scheduleSettings,
                emailContent: emailContentSettings,
        });
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
