/*
 * TODO: Module Documentation
 */

//////////////////////////////////////////
// Settings Card Builders               //
//////////////////////////////////////////
// TODO: Finish settings card
/**
 * 
 */
function buildSettingsCard()
{
        var card, icon, sectionsArr;

        icon = "https://cdn.pixabay.com/photo/" + 
               "2015/12/04/22/20/gear-1077550_960_720.png";

        sectionsArr = getSettingsSectionsArr();
        card = buildCard("Settings", icon, 
                         "Settings Cog", sectionsArr);

        return card;
}

//============== Sections ===============//
// TODO: Build Sections
function getSettingsSectionsArr()
{
        var sectionsArr = [];

        sectionsArr.push(getTimeSettingsSection());
        sectionsArr.push(getContactsSettingsSection());
        sectionsArr.push(getScheduleSettingsSection());
        sectionsArr.push(getEmailContentSettingsSection());
        // sectionsArr.push(getOtherSettingsSection());

        return sectionsArr;
}

function getTimeSettingsSection()
{
        var header, widgetsArr, hourOfDay;
        
        header = "<font color='#0294c9'><b>Time</b></font>";
        widgetsArr = [];
        
        hourOfDay = buildTextInputWidget("hourOfDay", "Email Delivery Time",
                "e.g. 09:00 am", null, null);
        
        widgetsArr.push(hourOfDay);

        return buildSection(header, widgetsArr, false);
}

function getContactsSettingsSection()
{
        var header, widgetsArr, url, nameColLabel, emailColLabel;

        header = "<font color='#0294c9'><b>Contacts</b></font>";
        widgetsArr = [];

        url = buildTextInputWidget("url", "Google Sheet URL - Contacts List",
                null, null, null);
        nameColLabel = buildTextInputWidget("nameColLabel", 
                "Column Label - Names", null, null, null);
        emailColLabel = buildTextInputWidget("emailColLabel",
                "Column Label - Emails", null, null, null);
        
        widgetsArr.push(url);
        widgetsArr.push(nameColLabel);
        widgetsArr.push(emailColLabel);

        return buildSection(header, widgetsArr, true);
}

function getScheduleSettingsSection()
{
        var header, widgetsArr, url, dateColLabel;

        header = "<font color='#0294c9'><b>Clinic Schedule</b></font>";
        widgetsArr = [];

        url = buildTextInputWidget("url", "Google Sheet URL - Clinic Schedule",
                null, null, null);
        dateColLabel = buildTextInputWidget("dateColLabel", 
                "Column Label - Date", null, null, null);
        
        widgetsArr.push(url);
        widgetsArr.push(dateColLabel);

        return buildSection(header, widgetsArr, true);
}

function getEmailContentSettingsSection()
{
        var header, widgetsArr, url, subjectColLabel, bodyColLabel;

        header = "<font color='#0294c9'><b>Email Content</b></font>";
        widgetsArr = [];

        url = buildTextInputWidget("url", "Google Sheet URL - Email Content",
                null, null, null);
        subjectColLabel = buildTextInputWidget("subjectColLabel",
                "Column Label - Email Subject", null, null, null);
        bodyColLabel = buildTextInputWidget("bodyColLabel", 
                "Column Label - Email Body", null, null, null);
        
        widgetsArr.push(url);
        widgetsArr.push(subjectColLabel);
        widgetsArr.push(bodyColLabel);

        return buildSection(header, widgetsArr, true);
}

function getOtherSettingsSection()
{
        var header, widgetsArr;

        header = "<font color='#0294c9'><b>Other/b></font>";
        widgetsArr = [];

        return buildSection(header, widgetsArr, false);
}

//============== Widgets ================//
function getSettingsWidgetsArr()
{
        var widgetsArr = [];

        widgetsArr.push(printSettingsWidget());

        return widgetsArr;
}

function printSettingsWidget()
{
        var widget, settings;

        widget = CardService.newTextParagraph();
        settings = PropertiesService.getScriptProperties();

        widget.setText(JSON.stringify(settings));

        return widget;
}


//////////////////////////////////////////
// Settings Management                  //
//////////////////////////////////////////
/**
 * 
 * @param       {Object} timeSettings 
 * @param       {Object} contactSettings 
 * @param       {Object} scheduleSettings 
 * @param       {Object} emailContentSettings 
 * @param       {Object} otherSettings 
 */
function setConfig(timeSettings, contactSettings, scheduleSettings,
                    emailContentSettings, otherSettings)
{
        var settings;

        settings = PropertiesService.getScriptProperties();
        settings.setProperties({
                header: "Add-On Settings",
                time: timeSettings,
                contacts: contactSettings,
                schedule: scheduleSettings,
                emailContent: emailContentSettings,
                other: otherSettings
        });
}

/**
 * 
 * @param       {Integer} hourOfDay 
 * @param       {Integer} everyXDays 
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
 * @param       {Boolean} sendToSelf
 * @returns     {Object} 
 */
function setOtherSettings(sendToSelf)
{
        return {
                header: "Other Settings",
                sendToSelf: sentToSelf
        }
}
