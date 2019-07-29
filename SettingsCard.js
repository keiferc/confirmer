/*
 *      filename:       SettingsCard.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           29 July 2019
 *      description:    This module contains an object that manages
 *                      the settings of the Confirmer GMail add-on
 *
 *      note:           This module is to be in a Google Script
 *                      and thus uses constructor functions
 *                      instead of Classes (due to GAS' lack of class
 *                      compatibility)
 */

function buildSettingsCard(settings)
{
        var card, icon, sectionsArr;

        icon = "https://cdn.pixabay.com/photo/" + 
               "2015/12/04/22/20/gear-1077550_960_720.png";

        sectionsArr = getSettingsSectionsArr(settings);
        card = buildCard("Settings", icon, 
                         "Settings Cog", sectionsArr);

        return card;
}

//////////////////////////////////////////
// Settings Section Builders            //
//////////////////////////////////////////
function getSettingsSectionsArr(settings)
{
        var sectionsArr = [];

        sectionsArr.push(getMainSettingsSection(settings));
        sectionsArr.push(getContactsSettingsSection(settings));
        sectionsArr.push(getScheduleSettingsSection(settings));
        sectionsArr.push(getEmailContentSettingsSection(settings));
        sectionsArr.push(submitSettingsSection(settings));

        return sectionsArr;
}

function getMainSettingsSection(settings)
{
        var widgetsArr, sendToSelf, hourOfDay;
        
        widgetsArr = [];
        
        sendToSelf = buildSwitchWidget("Send a copy of email to self?",
                "sendToSelf", "switchValue", true, null);

//buildSendToSelf(settings);

        hourOfDay = buildDropdownWidget("hourOfDay", "Email Delivery Time", 
                getDeliveryTimes(), null);
        
        widgetsArr.push(sendToSelf);
        widgetsArr.push(hourOfDay);

        return buildSection(null, widgetsArr, false);
}

function getContactsSettingsSection(settings)
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

function getScheduleSettingsSection(settings)
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

function getEmailContentSettingsSection(settings)
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

//////////////////////////////////////////
// Settings Widget Builders             //
//////////////////////////////////////////
function buildSendToSelf(settings)
{
        var label, switchKey, switchValue, 
            selected, callback;

        label = "Send a copy of email to self?";
        switchKey = "sendToSelf";
        switchValue = "switchValue";
        selected = settings["main"][switchKey];
        callback = null;

        Logger.log(selected);

        return buildSwitchWidget(label, switchKey, switchValue,
                                 selected, callback);
}


//////////////////////////////////////////
// Settings Widget Helpers              //
//////////////////////////////////////////
// For some reason, GAS doesn't like classes,
// so have to use object constructor functions
/**
 * @param       {Number} hour 
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