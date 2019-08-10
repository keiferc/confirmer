/*
 *      filename:       StatusCard.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           29 July 2019
 *      description:    This module contains a Google Card to be used for
 *                      displaying the status of the Confirmer GMail add-on
 *
 *      note:           This module is to be in a Google Script
 *                      and thus uses constructor functions
 *                      instead of Classes (due to GAS' lack of class
 *                      compatibility)
 */

//////////////////////////////////////////
// Status Card Builders                 //
//////////////////////////////////////////
/**
 * StatusCard
 *
 * @returns     {Object}
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
 */
StatusCard.prototype.getSections = function ()
{
        var settings, emailer, calendar, sections;
        
        settings = new SettingsManager();
        emailer = new Emailer(settings.getMain(), settings.getContacts(), 
                settings.getSchedule(), settings.getEmailContent());
        calendar = new TimeManager();

        sections = [];

        sections.push(this.getScheduleSection(emailer, calendar));
        sections.push(this.getEmailSection(emailer, calendar));
        sections.push(this.getRefreshSection());

        return sections;
}

/**
 * getScheduleSection
 */
StatusCard.prototype.getScheduleSection = function
(emailer, calendar)
{
        var header, widgets;

        header = this.formatHeader("Schedule", PRIMARY_COLOR);
        widgets = [];

        widgets.push(this.buildNextEventDateWidget(emailer, calendar));
        widgets.push(this.buildSendingDateWidget(emailer, calendar));

        return this.buildSection(header, widgets, false);
}

/**
 * getEmailSection
 */
StatusCard.prototype.getEmailSection = function 
(emailer, calendar)
{
        var header, widgets;

        header = this.formatHeader("Email", PRIMARY_COLOR);
        widgets = [];

        widgets.push(this.buildSenderWidget(emailer, calendar));
        widgets.push(this.buildBccWidget(emailer, calendar));
        widgets.push(this.buildSubjectWidget(emailer, calendar));
        widgets.push(this.buildBodyWidget(emailer, calendar));

        return this.buildSection(header, widgets, true);
}

/**
 * getRefreshSection
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
//============== Schedule Section ==============/
StatusCard.prototype.buildNextEventDateWidget = function
(emailer, calendar)
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

StatusCard.prototype.buildSendingDateWidget = function
(emailer, calendar)
{
        var topLabel, content;

        topLabel = "Reminder Email Sending Date";
        content = "TOFINISH";

        // TODO: get content
        
        return this.buildTextKeyValWidget(topLabel, null, content, false);
}

//============== Email Section ==============/
StatusCard.prototype.buildSenderWidget = function
(emailer)
{
        var topLabel, content;

        topLabel = "Sender";
        content = Session.getEffectiveUser().toString();

        return this.buildTextKeyValWidget(topLabel, null, content, false);
}

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

StatusCard.prototype.buildSubjectWidget = function 
(emailer, calendar)
{
        var topLabel, content;

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

StatusCard.prototype.buildBodyWidget = function
(emailer, calendar)
{
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

//////////////////////////////////////////
// Widget Helpers                       //
//////////////////////////////////////////
/**
 * refreshStatus
 */
function refreshStatus(response)
{
        return updateCard(new StatusCard().gCard, false)
}
