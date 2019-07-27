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

        sectionsArr.push(getMainSettingsSection());
        sectionsArr.push(getContactsSettingsSection());
        sectionsArr.push(getScheduleSettingsSection());
        sectionsArr.push(getEmailContentSettingsSection());
        sectionsArr.push(submitSettingsSection());

        return sectionsArr;
}

function getMainSettingsSection()
{
        var widgetsArr, sendToSelf, hourOfDay;
        
        widgetsArr = [];
        
        sendToSelf = buildSwitchWidget("Send a copy of email to self?",
                "sendToSelf", null, null);
        hourOfDay = buildDropdownWidget("hourOfDay", "Email Delivery Time", 
                getDeliveryTimes(), null);
        
        widgetsArr.push(sendToSelf);
        widgetsArr.push(hourOfDay);

        return buildSection(null, widgetsArr, false);
}

function getContactsSettingsSection()
{
        var header, widgetsArr, url, nameColLabel, emailColLabel;

        header = formatSectionHeader("Contacts", PRIMARY_COLOR);
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

        header = formatSectionHeader("Schedule", PRIMARY_COLOR);
        widgetsArr = [];

        url = buildTextInputWidget("url", "Google Sheet URL - Schedule",
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

        header = formatSectionHeader("Email Content", PRIMARY_COLOR);
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


//hacky temp function for testing
function tempAction()
{
        return CardService.newActionResponseBuilder()
                .setStateChanged(true)
                .build();
}

function submitSettingsSection()
{
        // Temp hacky action for testing
        var action = CardService.newAction().
                setFunctionName("tempAction");

        return buildSection(null, 
                [CardService.newTextButton()
                        .setText("Save Settings")
                        .setTextButtonStyle(
                                CardService.TextButtonStyle.FILLED
                        )
                        .setOnClickAction(action) // TODO
                ],
                false);
}

//============== Widgets ================//
// For some reason, GAS doesn't like classes,
// so have to use object constructor functions
/**
 * @param       {Integer} hour 
 * @param       {Boolean} isAM 
 * @returns     {Object}
 */
function DeliveryTime(hour, isAM) {
        var time_period, opt;

        if (hour < 10)
                opt = "0";
        else
                opt = "";
        
        if (isAM && hour != 12)
                time_period = "am";
        else
                time_period = "pm";

        this.label = opt + hour.toString() + ":00 " + time_period;
        this.key = hour.toString() + time_period;
        this.selected = false;
}

function getDeliveryTimes()
{
        var times, amArr, pmArr;

        times = [];
        amArr = [];
        pmArr = [];

        for (i = 0; i < 12; i++) {
                amArr.push(new DeliveryTime((i + 1), true));
                pmArr.push(new DeliveryTime((i + 1), false));
        }

        times = amArr.concat(pmArr);

        return times;
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
 * @param       {Boolean} sendToSelf
 * @param       {Object}
 */
function setMainSettings(hourOfDay, everyXDays, sendToSelf)
{
        return {
                hourOfDay: hourOfDay,
                everyXDays: everyXDays, // pull times for check
                sendToSelf: sendToSelf
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
