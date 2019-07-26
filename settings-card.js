/*
 * TODO: Module Documentation
 */

//////////////////////////////////////////
// Settings Card Builders               //
//////////////////////////////////////////
// TODO: Finish settings card
/**
 * 
 * @param       {Object} config 
 */
function buildSettingsCard(config)
{
        var card = CardService.newCardBuilder();
        var section = CardService.newCardSection();

        section.addWidget(CardService.newTextParagraph()
                .setText(config));

        card.addSection(section);
        card.setHeader(CardService.newCardHeader()
                .setTitle('Settings'));
                
        return card.build();
}

//============== Widgets ================//
// TODO: Build widgets

//============== Sections ===============//
// TODO: Build Sections

//////////////////////////////////////////
// Settings Management                  //
//////////////////////////////////////////
function getConfig()
{
        var settings = PropertiesService.getScriptProperties();
        var str_props = JSON.stringify(props);
        Logger.log(str_props);
        return str_props;
}

/**
 * 
 * @param       {Object} timeSettings 
 * @param       {Object} contactSettings 
 * @param       {Object} scheduleSettings 
 * @param       {Object} emailContentSettings 
 * @param       {Object} otherSettings 
 * @returns     {Object}
 */
function setConfig(timeSettings, contactSettings, scheduleSettings,
                    emailContentSettings, otherSettings)
{
        return {
                header: "Add-On Settings",
                time: timeSettings,
                contacts: contactSettings,
                schedule: scheduleSettings,
                emailContent: emailContentSettings,
                other: otherSettings
        }
}

/**
 * 
 * @param       {int} hourOfDay 
 * @param       {int} everyXDays 
 * @param       {Object}
 */
function setTimeSettings(hourOfDay, everyXDays)
{
        return {
                header: "Time Settings",
                hourOfDay: hourOfDay,
                everyXDays: everyXDays
        }
}

/**
 * 
 * @param       {String} url 
 * @param       {String} nameColLabel 
 * @param       {String} emailColLabel 
 * @returns     {Object}
 */
function setContactsSettings(url, nameColLabel, emailColLabel)
{
        return {
                header: "Contacts Settings",
                url: url,
                nameColLabel: nameColLabel,
                emailColLabel: emailColLabel
        }
}

/**
 * 
 * @param       {String} url 
 * @param       {String} dateColLabel 
 * @returns     {Object}
 */
function setScheduleSettings(url, dateColLabel)
{
        return {
                header: "Schedule Settings",
                url: url,
                dateColLabel: dateColLabel
        }
}
/**
 *
 * @param       {String} url
 * @param       {String} subjectColLabel
 * @param       {String} bodyColLabel
 * @returns     {Object} 
 */
function setEmailContentSettings(url, subjectColLabel, bodyColLabel)
{
        return {
                header: "Email Content Settings",
                url: url,
                subjectColLabel: subjectColLabel,
                bodyColLabel: bodyColLabel
        }
}

/**
 * 
 * @param       {bool} sendToSelf
 * @returns     {Object} 
 */
function setOtherSettings(sendToSelf)
{
        return {
                header: "Other Settings",
                sendToSelf: sentToSelf
        }
}
