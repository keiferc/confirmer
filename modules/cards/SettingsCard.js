/*
 *      filename:       SettingsCard.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           23 August 2019
 *      description:    This module contains a Google Card to be used for
 *                      managing the settings of the Confirmer GMail add-on.
 */

/*------------------------------------------------------------
 *                         Functions
 *------------------------------------------------------------
 * ---- Object Constructor ---- 
 * SettingsCard::SettingsCard()
 *
 * ---- Section Builders ----
 * SettingsCard::getSections()
 * SettingsCard::getMainSection(SettingsManager)
 * SettingsCard::getContactsSection(SettingsManager)
 * SettingsCard::getScheduleSection(SettingsManager)
 * SettingsCard::getEmailContentSection(SettingsManager)
 * SettingsCard::getSubmitSection()
 *
 * ---- Widget Builders ----
 * SettingsCard::buildPauseWidget(MainSettings)
 * SettingsCard::buildSendToSelfWidget(MainSettings)
 * SettingsCard::buildHourOfDayWidget(MainSettings)
 * SettingsCard::buildURLWidget(Object, string, string)
 * SettingsCard::buildColLabelWidget(Object, string, string)
 *
 * ---- Widget Helpers ----
 * SettingsCard::DeliveryTime(number, boolean, string)
 * SettingsCard::getTimes(string)
 *
 ------------------------------------------------------------*/

/**
 * SettingsCard
 *
 * Object constructor inheriting from custom Card object. Handles settings.
 *
 * @returns     {SettingsCard}
 */
function SettingsCard()
{
        var header, iconUrl, iconAltText;

        header = "Settings";
        iconUrl = "https://i.postimg.cc/87CsNGY6/settings.png";
        iconAltText = "Settings Icon";

        Card.call(this, header, iconUrl, iconAltText, this.getSections()); 
}

SettingsCard.prototype = Object.create(Card.prototype); 

//////////////////////////////////////////
// Section Builders                     //
//////////////////////////////////////////
/**
 * getSections
 *
 * Returns an array of sections
 *
 * @returns     {Array}: Array of Google CardSections
 */
SettingsCard.prototype.getSections = function ()
{
        var settings, sections;
        
        settings = new SettingsManager(); 
        sections = [];

        sections.push(this.getMainSection(settings));
        sections.push(this.getContactsSection(settings));
        sections.push(this.getScheduleSection(settings));
        sections.push(this.getEmailContentSection(settings));
        sections.push(this.getSubmitSection());

        return sections;
}

/**
 * getMainSection
 *
 * Builds the main section.
 *
 * @param       {SettingsManager} settings
 * @returns     {CardSection}
 */
SettingsCard.prototype.getMainSection = function 
(settings)
{
        var main, widgets;
        
        main = settings.getMain();
        widgets = [];

        widgets.push(this.buildPauseWidget(main));
        widgets.push(this.buildSendToSelfWidget(main));
        widgets.push(this.buildHourOfDayWidget(main));

        return this.buildSection(null, widgets, false);
}

/**
 * getContactsSection
 *
 * Builds the contacts section.
 *
 * @param       {SettingsManager} settings
 * @returns     {CardSection}
 */
SettingsCard.prototype.getContactsSection = function 
(settings)
{
        var contacts, header, widgets;

        contacts = settings.getContacts();
        header = this.formatHeader("Contacts", PRIMARY_COLOR); 
        widgets = [];

        widgets.push(this.buildUrlWidget(contacts, 
                "contactsId", "Contacts List"));
        widgets.push(this.buildColLabelWidget(contacts, 
                "nameColLabel", "Names"));
        widgets.push(this.buildColLabelWidget(contacts, 
                "emailColLabel", "Emails"));

        return this.buildSection(header, widgets, true);
}

/**
 * getScheduleSection
 *
 * Build the schedule section
 *
 * @param       {SettingsManager}
 * @returns     {CardSection}
 */
SettingsCard.prototype.getScheduleSection = function 
(settings)
{
        var schedule, header, widgets;

        schedule = settings.getSchedule();
        header = this.formatHeader("Schedule", PRIMARY_COLOR); 
        widgets = [];

        widgets.push(this.buildUrlWidget(schedule, 
                "scheduleId", "Schedule"));
        widgets.push(this.buildColLabelWidget(schedule, 
                "dateColLabel", "Date"));

        return this.buildSection(header, widgets, true);
}

/**
 * getEmailContentSection
 *
 * Builds email content section
 *
 * @param       {SettingsManager}
 * @returns     {CardSection}
 */
SettingsCard.prototype.getEmailContentSection = function 
(settings)
{
        var emailContent, header, widgets;

        emailContent = settings.getEmailContent();
        header = this.formatHeader("Email Content", PRIMARY_COLOR); 
        widgets = [];

        widgets.push(this.buildUrlWidget(emailContent, 
                "emailContentId", "Email Content"));
        widgets.push(this.buildColLabelWidget(emailContent, 
                "subjectColLabel", "Email Subject"));
        widgets.push(this.buildColLabelWidget(emailContent, 
                "bodyColLabel", "Email Body"));

        return this.buildSection(header, widgets, true);
}

/**
 * getSubmitSection
 *
 * Builds submit button for saving settings.
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
 * buildPauseWidget
 *
 * Build pause add-on widget.
 *
 * @param       {MainSettings} main
 * @returns     {Widget}
 */
SettingsCard.prototype.buildPauseWidget = function
(main)
{
        var key, label, selected;

        key = "pause";
        label = "Pause email confirmations?";
        selected = parseBool(main.pause); 

        return this.buildSwitchWidget(key, label, selected, null);
}

/**
 * buildSendToSelfWidget
 *
 * Builds send-to-self widget.
 *
 * @param       {MainSettings} main
 * @returns     {Widget}
 */
SettingsCard.prototype.buildSendToSelfWidget = function 
(main)
{
        var key, label, selected;

        key = "sendToSelf";
        label = "Send a copy of email to self?";
        selected = parseBool(main.sendToSelf); 

        return this.buildSwitchWidget(key, label, selected, null);
}

/**
 * buildHourOfDayWidget
 *
 * Build hour-of-day widget
 *
 * @param       {MainSettings} main
 * @returns     {Widget}
 */
SettingsCard.prototype.buildHourOfDayWidget = function 
(main)
{
        var key, label, options;

        key = "hourOfDay";
        label = "Email Delivery Time";
        options = this.getTimes(main[key]);

        return this.buildDropdownWidget(key, label, options, null);
}

//============== Section Agnostic ==============//
/**
 * buildUrlWidget
 *
 * Build URL input field widget.
 *
 * @param       {Object} sectionSettings: section-specific settings object
 * @param       {string} key: section-specific url key
 * @param       {string} sheetTitle: title of sheet
 * @returns     {Widget}
 */
SettingsCard.prototype.buildUrlWidget = function
(sectionSettings, key, sheetTitle)
{
        var label, value;

        label = "Google Sheets URL - " + sheetTitle;
        value = sectionSettings[key];

        if (isEmpty(value)) 
                value = null;
        else
                value = GSHEET_URL_FORMAT + value; 

        return this.buildTextInputWidget(key, label, null, value, null);
}

/**
 * buildColumnLabelWidget
 *
 * Builds column label input field widget.
 *
 * @param       {Object} sectionSettings: section-specific settings object
 * @param       {string} key: key of input value
 * @param       {string} columnLabel: section-specific column label
 * @returns     {Widget}
 */
SettingsCard.prototype.buildColLabelWidget = function 
(sectionSettings, key, columnLabel)
{
        var label, value;

        label = "Column Label - " + columnLabel;
        value = decodeURIComponent(sectionSettings[key]);

        if (isEmpty(value)) 
                value = null;

        return this.buildTextInputWidget(key, label, null, value, null);
}

//////////////////////////////////////////
// Widget Helpers                       //
//////////////////////////////////////////
//============== Dropdown Time Generation ==============//
/**
 * DeliveryTime
 *
 * Returns a DeliveryTime object containing values for use in the 
 * dropdown widget.
 *
 * @param       {number} hour 
 * @param       {boolean} isAM 
 * @param       {string} selected: Key representing selected time
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
        
        if ((isAM && hour != 12) || (!isAM && hour == 12))
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
 * getTimes
 *
 * Returns an array of DeliveryTime objects containing times for use
 * in the dropdown widget.
 *
 * @param       {string} selected: key representing the selected time   
 * @returns     {Array}: Array of DeliveryTime objects
 */
SettingsCard.prototype.getTimes = function
(selected)
{
        var times, amArr, pmArr, i;

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
