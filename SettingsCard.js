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
        
        settings = new SettingsManager().getMain();
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

        widgets.push(this.buildUrlWidget(settings, "contactsUrl", 
                "Contacts List"));
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

        widgets.push(this.buildUrlWidget(settings, "scheduleUrl", "Schedule"));
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

        widgets.push(this.buildUrlWidget(settings, "emailContentUrl", 
                "Email Content"));
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
        var action = CardService.newAction()
                .setFunctionName("submitButton");

        return this.buildSection(null, 
                [CardService.newTextButton()
                        .setText("Save Settings")
                        .setTextButtonStyle(
                                CardService.TextButtonStyle.FILLED
                        )
                        .setOnClickAction(action)
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
 * @param       {Object} sectionSettings - section-specific settings object
 * @returns     {Widget}
 */
SettingsCard.prototype.buildSendToSelfWidget = function 
(sectionSettings)
{
        var key, label, selected;

        key = "sendToSelf";
        label = "Send a copy of email to self?";
        selected = sectionSettings.sendToSelf == "true";

        return this.buildSwitchWidget(key, label, selected, null);
}

/**
 * buildHourOfDayWidget
 *
 * @param       {Object} sectionSettings - section-specific settings object
 * @returns     {Widget}
 */
SettingsCard.prototype.buildHourOfDayWidget = function 
(sectionSettings)
{
        var key, label, options;

        key = "hourOfDay";
        label = "Email Delivery Time";
        options = this.getTimes(sectionSettings[key]), 
        callback = null;

        return this.buildDropdownWidget(key, label, options, null);
}

//============== Section Agnostic ==============//
/**
 * buildUrlWidget
 *
 * @param       {Object} sectionSettings - section-specific settings object
 * @param       {String} key - section-specific url key
 * @param       {String} sheetTitle - title of sheet
 * @returns     {Widget}
 */
SettingsCard.prototype.buildUrlWidget = function
(sectionSettings, key, sheetTitle)
{
        var label, value;

        label = "Google Sheets URL - " + sheetTitle;
        value = sectionSettings[key];

        if (value == "null")
                value = null;

        return this.buildTextInputWidget(key, label, null, value, null);
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
        var label, value;

        label = "Column Label - " + columnLabel;
        value = sectionSettings[key];

        if (value == "null")
                value = null;

        return this.buildTextInputWidget(key, label, null, value, null);
}

//////////////////////////////////////////
// Settings Widget Helpers              //
//////////////////////////////////////////
//============== Submit Button ==============//
/**
 * submitSettings 
 *
 * Callback function from when settings submit
 * button is activated
 */
function submitButton(response)
{
        var manager, input, main, contacts, schedule, emailContent;

        // debug
        Logger.log("CLICK!");

        manager = new SettingsManager();
        input = response.formInputs;

        if (input == undefined) {
                // TODO: Error display. Push card?
        }

        main = new MainSettings(input.hourOfDay[0], 1,
                input.sendToSelf != undefined);
        contacts = new ContactsSettings("Contacts", input.contactsUrl[0],
                input.nameColLabel[0], input.emailColLabel[0]);
        schedule = new ScheduleSettings("Schedule", input.scheduleUrl[0],
                input.dateColLabel[0]);
        emailContent = new EmailContentSettings("Email Content", 
                input.emailContentUrl[0], input.subjectColLabel[0],
                input.bodyColLabel[0]);
        
        if (manager.checkMain(main) && manager.checkContacts(contacts) && 
            manager.checkSchedule(schedule) && 
            manager.checkEmailContent(emailContent))
                manager.setAll(main, contacts, schedule, emailContent);
        else {
                // TODO: Error display. Push card?
        }
}

//============== Dropdown Time Generation ==============//
/**
 * DeliveryTime
 *
 * @param       {Number} hour 
 * @param       {Boolean} isAM 
 * @param       {String} selected - key representing selected time
 * @returns     {DeliveryTime}
 */
SettingsCard.prototype.DeliveryTime = function 
(hour, isAM, selected) 
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

        if (this.key == selected)
                this.selected = true;
        else
                this.selected = false;
}

/**
 * @param       {String} selected - key representing the selected time   
 */
SettingsCard.prototype.getTimes = function
(selected)
{
        var times, amArr, pmArr;

        times = [];
        amArr = [];
        pmArr = [];

        for (i = 0; i < 12; i++) {
                amArr.push(new this.DeliveryTime((i + 1), true, selected));
                pmArr.push(new this.DeliveryTime((i + 1), false, selected));
        }

        times = amArr.concat(pmArr);

        return times;
}
