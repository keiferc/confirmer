/*
 *      filename:       SettingsCard.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           29 July 2019
 *      description:    This module contains a Google Card to be used for
 *                      managing the settings of the Confirmer GMail add-on
 *
 *      note:           This module is to be in a Google Script
 *                      and thus uses constructor functions
 *                      instead of Classes (due to GAS' lack of class
 *                      compatibility)
 */

/**
 * SettingsCard
 *
 * @returns     {Object}
 */
function SettingsCard()
{
        var header, iconUrl, iconAltText;

        header = "Settings";
        iconUrl = "https://cdn.pixabay.com/photo/2015/12/04/22/20/" +
                  "gear-1077550_960_720.png";
        iconAltText = "Settings Card Icon";

        Card.call(this, header, iconUrl, iconAltText, this.getSections());
}

SettingsCard.prototype = Object.create(Card.prototype);

//////////////////////////////////////////
// Section Builders                     //
//////////////////////////////////////////
/**
 * getSections
 */
SettingsCard.prototype.getSections = function ()
{
        var sections = [];

        sections.push(this.getMainSection());
        sections.push(this.getContactsSection());
        sections.push(this.getScheduleSection());
        sections.push(this.getEmailContentSection());
        sections.push(this.getSubmitSection());

        return sections;
}

/**
 * getMainSection
 */
SettingsCard.prototype.getMainSection = function ()
{
        var settings, widgets, hourOfDay;
        
        settings = new SettingsManager();
        widgets = [];
        
        // sendToSelf = this.buildSwitchWidget("Send a copy of email to self?",
        //         "sendToSelf", "switchValue", true, null);


        hourOfDay = this.buildDropdownWidget("hourOfDay", 
                "Email Delivery Time", this.getTimes(), null);
        
        widgets.push(this.buildSendToSelfWidget(settings));
        widgets.push(hourOfDay);

        return this.buildSection(null, widgets, false);
}

/**
 * getContactsSection
 */
SettingsCard.prototype.getContactsSection = function ()
{
        var settings, header, widgets, url, nameColLabel, emailColLabel;

        settings = new SettingsManager();
        header = this.formatHeader("Contacts", PRIMARY_COLOR);
        widgets = [];

        url = this.buildTextInputWidget("url", 
                "Google Sheet URL - Contacts List", null, null, null);
        nameColLabel = this.buildTextInputWidget("nameColLabel", 
                "Column Label - Names", null, null, null);
        emailColLabel = this.buildTextInputWidget("emailColLabel",
                "Column Label - Emails", null, null, null);
        
        widgets.push(url);
        widgets.push(nameColLabel);
        widgets.push(emailColLabel);

        return this.buildSection(header, widgets, true);
}

/**
 * getScheduleSection
 */
SettingsCard.prototype.getScheduleSection = function ()
{
        var settings, header, widgets, url, dateColLabel;

        settings = new SettingsManager();
        header = this.formatHeader("Schedule", PRIMARY_COLOR);
        widgets = [];

        url = this.buildTextInputWidget("url", 
                "Google Sheet URL - Schedule", null, null, null);
        dateColLabel = this.buildTextInputWidget("dateColLabel", 
                "Column Label - Date", null, null, null);
        
        widgets.push(url);
        widgets.push(dateColLabel);

        return this.buildSection(header, widgets, true);
}

/**
 * getEmailContentSection
 */
SettingsCard.prototype.getEmailContentSection = function ()
{
        var settings, header, widgets, url, subjectColLabel, bodyColLabel;

        settings = new SettingsManager();
        header = this.formatHeader("Email Content", PRIMARY_COLOR);
        widgets = [];

        url = this.buildTextInputWidget("url", 
                "Google Sheet URL - Email Content", null, null, null);
        subjectColLabel = this.buildTextInputWidget("subjectColLabel",
                "Column Label - Email Subject", null, null, null);
        bodyColLabel = this.buildTextInputWidget("bodyColLabel", 
                "Column Label - Email Body", null, null, null);
        
        widgets.push(url);
        widgets.push(subjectColLabel);
        widgets.push(bodyColLabel);

        return this.buildSection(header, widgets, true);
}

/**
 * getSubmitSection
 */
SettingsCard.prototype.getSubmitSection = function ()
{
        // debug: Temp hacky action for testing
        var action = CardService.newAction().
                setFunctionName("tempAction");
        function tempAction()
        {
                return CardService.newActionResponseBuilder()
                        .setStateChanged(true)
                        .build();
        }

        return this.buildSection(null, 
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
// Widget Builders                      //
//////////////////////////////////////////
/**
 * buildSendToSelfWidget
 *
 * @param       {SettingsManager} settings
 * @returns     {Widget}
 */
SettingsCard.prototype.buildSendToSelfWidget = function (settings)
{
        var settings, label, switchKey, switchValue, 
            selected, callback;
        settings = new SettingsManager();
        label = "Send a copy of email to self?";
        switchKey = "sendToSelf";
        switchValue = "switchValue";
        selected = settings.getMain().sendToSelf == "true";
        callback = null;

        return this.buildSwitchWidget(label, switchKey, switchValue,
                                      selected, callback);
}

/**
* bui
*/


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
SettingsCard.prototype.DeliveryTime = function 
(hour, isAM) 
{
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

SettingsCard.prototype.getTimes = function()
{
        var times, amArr, pmArr;

        times = [];
        amArr = [];
        pmArr = [];

        for (i = 0; i < 12; i++) {
                amArr.push(new this.DeliveryTime((i + 1), true));
                pmArr.push(new this.DeliveryTime((i + 1), false));
        }

        times = amArr.concat(pmArr);

        return times;
}
