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
 *
 * @returns     {Array}
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
 *
 * @returns     {CardSection}
 */
SettingsCard.prototype.getMainSection = function ()
{
        var settings, widgets;
        
        settings = new SettingsManager();
        widgets = [];

        widgets.push(this.buildSendToSelfWidget(settings));
        widgets.push(this.buildHourOfDayWidget(settings));

        return this.buildSection(null, widgets, false);
}

/**
 * getContactsSection
 *
 * @returns     {CardSection}
 */
SettingsCard.prototype.getContactsSection = function ()
{
        var settings, header, widgets;

        settings = new SettingsManager().getContacts();
        header = this.formatHeader("Contacts", PRIMARY_COLOR);
        widgets = [];

        widgets.push(this.buildUrlWidget(settings, "Contacts List"));
        widgets.push(this.buildColLabelWidget(settings, "nameColLabel", 
                "Names"));
        widgets.push(this.buildColLabelWidget(settings, "emailColLabel", 
                "Emails"));

        return this.buildSection(header, widgets, true);
}

/**
 * getScheduleSection
 *
 * @returns     {CardSection}
 */
SettingsCard.prototype.getScheduleSection = function ()
{
        var settings, header, widgets;

        settings = new SettingsManager().getSchedule();
        header = this.formatHeader("Schedule", PRIMARY_COLOR);
        widgets = [];

        widgets.push(this.buildUrlWidget(settings, "Schedule"));
        widgets.push(this.buildColLabelWidget(settings, "dateColLabel", 
                "Date"));

        return this.buildSection(header, widgets, true);
}

/**
 * getEmailContentSection
 *
 * @returns     {CardSection}
 */
SettingsCard.prototype.getEmailContentSection = function ()
{
        var settings, header, widgets;

        settings = new SettingsManager().getEmailContent();
        header = this.formatHeader("Email Content", PRIMARY_COLOR);
        widgets = [];

        widgets.push(this.buildUrlWidget(settings, "Email Content"));
        widgets.push(this.buildColLabelWidget(settings, "subjectColLabel",
                "Email Subject"));
        widgets.push(this.buildColLabelWidget(settings, "bodyColLabel",
                "Email Body"));

        return this.buildSection(header, widgets, true);
}

/**
 * getSubmitSection
 *
 * @returns     {CardSection}
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
//============== Main Section ==============//
/**
 * buildSendToSelfWidget
 *
 * @param       {SettingsManager} settings
 * @returns     {Widget}
 */
SettingsCard.prototype.buildSendToSelfWidget = function 
(settings)
{
        var label, switchKey, switchValue, 
            selected, callback;

        label = "Send a copy of email to self?";
        switchKey = "sendToSelf";
        switchValue = "switchValue";
        selected = settings.getMain().sendToSelf == "true";
        callback = null;

        return this.buildSwitchWidget(label, switchKey, switchValue,
                                      selected, callback);
}

/**
 * buildHourOfDayWidget
 *
 * @param       {SettingsManager} settings
 * @returns     {Widget}
 */
SettingsCard.prototype.buildHourOfDayWidget = function 
(settings)
{
        var key, label, options, callback;

        key = "hourOfDay";
        label = "Email Delivery Time";
        options = this.getTimes(), // TODO: figure out selected times
        callback = null;

        return this.buildDropdownWidget(key, label, options, callback);
}

//============== Section Agnostic ==============//
/**
 * buildUrlWidget
 *
 * @param       {Object} sectionSettings - section-specific settings object
 * @param       {String} sheetTitle - title of sheet
 * @returns     {Widget}
 */
SettingsCard.prototype.buildUrlWidget = function
(sectionSettings, sheetTitle)
{
        var key, value, callback;

        key = "url";
        label = "Google Sheets URL - " + sheetTitle;
        value = sectionSettings[key];
        callback = null;

        if (value == "null")
                value = null;

        return this.buildTextInputWidget(key, label, null, value, callback);
}

/**
 * buildColumnLabelWidget
 *
 * @param       {Object} sectionSettings - section-specific settings object
 * @param       {String} key - key of input value
 * @param       {String} columnLabel - section-specific column label
 * @returns     {Widget}
 */
SettingsCard.prototype.buildColLabelWidget = function 
(sectionSettings, key, columnLabel)
{
        var label, value, callback;

        label = "Column Label - " + columnLabel;
        value = sectionSettings[key];

        //debug
        Logger.log(value);

        callback = null;

        if (value == "null")
                value = null;

        return this.buildTextInputWidget(key, label, null, value, callback);
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
