/*
 * TODO : Module documentation
 */

//////////////////////////////////////////
// Settings Management                  //
//////////////////////////////////////////
function setDefaultSettings()
{
}

//////////////////////////////////////////
// Settings Management                  //
//////////////////////////////////////////
/**
 * 
 * @param       {Object} mainSettings
 * @param       {Object} timeSettings 
 * @param       {Object} contactSettings 
 * @param       {Object} scheduleSettings 
 * @param       {Object} emailContentSettings 
 */
function setConfig(mainSettings, timeSettings, contactSettings, 
                   scheduleSettings, emailContentSettings)
{
        var settings = PropertiesService.getScriptProperties()

        settings.setProperties({
                main: mainSettings,
                time: timeSettings,
                contacts: contactSettings,
                schedule: scheduleSettings,
                emailContent: emailContentSettings,
        });
}

/**
 * 
 * @param       {String} hourOfDay
 * @param       {Integer} everyXDays
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
