/*
 *      filename:       StatusCard.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           23 August 2019
 *      description:    This module contains a Google Card to be used for
 *                      displaying the status of the Confirmer GMail add-on
 */

/*------------------------------------------------------------
 *                         Functions
 *------------------------------------------------------------
 * ---- Object Constructor ---- 
 * StatusCard::StatusCard()
 *
 * ---- Section Builders ----
 * StatusCard::getSections()
 * StatusCard::getMainSection(Emailer)
 * StatusCard::getScheduleSection(TimeManager)
 * StatusCard::getEmailSection(Emailer, TimeManager)
 * StatusCard::getRefreshSection()
 *
 * ---- Widget Builders ----
 * StatusCard::buildPauseStatusWidget(Emailer)
 * StatusCard::buildNextEventDateWidget(TimeManager)
 * StatusCard::buildSendingDateWidget(TimeManager)
 * StatusCard::buildSenderWidget()
 * StatusCard::buildBccWidget(Emailer, TimeManager)
 * StatusCard::buildSubjectWidget(Emailer, TimeManager)
 * StatusCard::buildBodyWidget(Emailer, TimeManager)
 *
 ------------------------------------------------------------*/

/**
 * StatusCard
 *
 * Object constructor inhering from custom Card object. Displays status of
 * add-on.
 *
 * @returns     {StatusCard}
 */
function StatusCard()
{
        var header, iconUrl, iconAltText;

        header = "Status";
        iconUrl = "https://i.postimg.cc/mtjhvkm4/status.png";
        iconAltText = "Status Icon";

        Card.call(this, header, iconUrl, iconAltText, this.getSections()); 
}

StatusCard.prototype = Object.create(Card.prototype); 

//////////////////////////////////////////
// Section Builders                     //
//////////////////////////////////////////
/**
 * getSections
 *
 * Returns an array of sections.
 *
 * @returns     {Array}: Array of Google CardSections
 */
StatusCard.prototype.getSections = function ()
{
        var settings, emailer, calendar, sections;
        
        settings = new SettingsManager(); 
        emailer = new Emailer(settings); 
        calendar = new TimeManager(); 

        sections = [];

        sections.push(this.getMainSection(emailer));
        sections.push(this.getScheduleSection(calendar));
        sections.push(this.getEmailSection(emailer, calendar));
        sections.push(this.getRefreshSection());

        return sections;
}

/**
 * getMainSection
 *
 * Builds the main section.
 *
 * @param       {Emailer} emailer
 * @returns     {CardSection}
 */
StatusCard.prototype.getMainSection = function 
(emailer)
{
        var widgets = [];

        widgets.push(this.buildPauseStatusWidget(emailer));

        return this.buildSection(null, widgets, false);
}

/**
 * getScheduleSection
 *
 * Build schedule section
 *
 * @param       {TimeManager} calendar
 * @returns     {CardSection}
 */
StatusCard.prototype.getScheduleSection = function
(calendar)
{
        var header, widgets;

        header = this.formatHeader("Schedule", PRIMARY_COLOR); 
        widgets = [];

        widgets.push(this.buildNextEventDateWidget(calendar));
        widgets.push(this.buildSendingDateWidget(calendar));

        return this.buildSection(header, widgets, false);
}

/**
 * getEmailSection
 *
 * Build email section
 *
 * @param       {Emailer} emailer
 * @param       {TimeManager} calendar
 * @returns     {CardSection}
 */
StatusCard.prototype.getEmailSection = function 
(emailer, calendar)
{
        var header, widgets;

        header = this.formatHeader("Email", PRIMARY_COLOR); 
        widgets = [];

        widgets.push(this.buildSenderWidget());
        widgets.push(this.buildBccWidget(emailer, calendar));
        widgets.push(this.buildSubjectWidget(emailer, calendar));
        widgets.push(this.buildBodyWidget(emailer, calendar));

        return this.buildSection(header, widgets, true);
}

/**
 * getRefreshSection
 *
 * Build refresh button for refreshing status.
 *
 * @returns     {CardSection}
 */
StatusCard.prototype.getRefreshSection = function ()
{
        var action = CardService.newAction() 
                .setFunctionName("refreshStatus");

        return this.buildSection(null, 
                [CardService.newTextButton() 
                        .setText("Refresh")
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
//============== Main Section ==============/
/**
 * buildPauseStatusWidget
 *
 * Build pause status widget.
 *
 * @param       {Emailer} emailer: 
 * @returns     {Widget}
 */
StatusCard.prototype.buildPauseStatusWidget = function
(emailer)
{
        var topLabel, content;

        topLabel = "Confirmer Status";
        content = "Running";

        try {
                if (parseBool(emailer.main.pause)) 
                        content = "Paused";
        } catch(e) {
                return this.buildTextKeyValWidget(topLabel, null, 
                        "N/A", false); 
        }

        return this.buildTextKeyValWidget(topLabel, null, content, false); 
}

//============== Schedule Section ==============/
/**
 * buildNextEventDateWidget
 *
 * Builds next event date status widget.
 *
 * @param       {TimeManager} calendar
 * @returns     {Widget}
 */
StatusCard.prototype.buildNextEventDateWidget = function
(calendar)
{
        var topLabel, content;

        topLabel = "Next Event Date";

        try {
                content = calendar.formatDate(calendar.getNextDate());
        } catch(e) {
                return this.buildTextKeyValWidget(topLabel, null, 
                        "N/A", false);
        }

        return this.buildTextKeyValWidget(topLabel, null, content, false);
}

/**
 * buildSendingDateWidget
 *
 * Builds sending date status widget.
 *
 * @param       {TimeManager} calendar
 * @returns     {Widget}
 */
StatusCard.prototype.buildSendingDateWidget = function
(calendar)
{
        var topLabel, content;

        topLabel = "Reminder Email Sending Date";

        try {
                content = calendar.formatDate(calendar.getSendingDate());
        } catch(e) {
                return this.buildTextKeyValWidget(topLabel, null, 
                        "N/A", false); 
        }

        return this.buildTextKeyValWidget(topLabel, null, content, false);
}

//============== Email Section ==============/
/**
 * buildSenderWidget
 *
 * Builds sender status widget.
 *
 * @returns     {Widget}
 */
StatusCard.prototype.buildSenderWidget = function ()
{
        var topLabel, content;

        topLabel = "Sender";
        content = Session.getEffectiveUser().toString(); 

        return this.buildTextKeyValWidget(topLabel, null, content, false);
}

/**
 * buildBccWidget
 *
 * Builds BCC status widget.
 *
 * @param       {Emailer} emailer
 * @param       {TimeManager} calendar
 * @returns     {Widget}
 */
StatusCard.prototype.buildBccWidget = function
(emailer, calendar)
{
        var topLabel, content, date;

        topLabel = "BCC";

        try {
                date = calendar.getNextDate();
                content = emailer.getRecipients(date);
        } catch(e) {
                return this.buildTextKeyValWidget(topLabel, null, "N/A", true);
        }

        content = content.replace(/,/gi, "<br>");

        return this.buildTextKeyValWidget(topLabel, null, content, true);
}

/**
 * buildSubjectWidget
 *
 * Builds email subject line status widget.
 *
 * @param       {Emailer} emailer
 * @param       {TimeManager} calendar
 * @returns     {Widget}
 */
StatusCard.prototype.buildSubjectWidget = function 
(emailer, calendar)
{
        var topLabel, content, date;

        topLabel = "Subject";

        try {
                date = calendar.formatDate(calendar.getNextDate());
                content = emailer.generateSubject(date);
        } catch(e) {
                return this.buildTextKeyValWidget(topLabel, null, 
                        "N/A", false);
        } 

        return this.buildTextKeyValWidget(topLabel, null, content, true);
}

/**
 * buildBodyWidget
 *
 * Builds email body content status widget.
 *
 * @param       {Emailer} emailer
 * @param       {TimeManager} calendar
 * @returns     {Widget}
 */
StatusCard.prototype.buildBodyWidget = function
(emailer, calendar)
{
        var topLabel, content, date;

        topLabel = "Message";

        try {
                date = calendar.formatDate(calendar.getNextDate());
                content = emailer.generateEmailBody(date);
        } catch(e) {
                return this.buildTextKeyValWidget(topLabel, null, 
                        "N/A", false);
        } 

        return this.buildTextKeyValWidget(topLabel, null, content, true);
}
