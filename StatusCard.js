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
        var settings, emailer, sections;
        
        settings = new SettingsManager();

        // debug
        Logger.log("here1");

        emailer = new Emailer(settings.getMain(), settings.getContacts(), 
                settings.getSchedule(), settings.getEmailContent());
        sections = [];

        // debug
        Logger.log("here2");

        sections.push(this.getScheduleSection(emailer));

        // debug
        Logger.log("here3");

        sections.push(this.getEmailSection(emailer));

        // debug
        Logger.log("here4");

        return sections;
}

/**
 * getScheduleSection
 */
StatusCard.prototype.getScheduleSection = function
(emailer)
{
        var header, widgets, nextEventDate, sendingDate;

        header = this.formatHeader("Schedule", PRIMARY_COLOR);
        widgets = [];

        widgets.push(this.buildNextEventDateWidget(emailer));
        widgets.push(this.buildSendingDateWidget(emailer));

        return this.buildSection(header, widgets, false);
}

/**
 * getEmailSection
 */
StatusCard.prototype.getEmailSection = function 
(emailer)
{
        var header, widgets, sender, bcc, subject, body;

        header = this.formatHeader("Email", PRIMARY_COLOR);
        widgets = [];

        widgets.push(this.buildSenderWidget(emailer));
        widgets.push(this.buildBccWidget(emailer));
        widgets.push(this.buildSubjectWidget(emailer));
        widgets.push(this.buildBodyWidget(emailer));

        return this.buildSection(header, widgets, false);
}

//////////////////////////////////////////
// Widget Builders                      //
//////////////////////////////////////////
//============== Schedule Section ==============/
StatusCard.prototype.buildNextEventDateWidget = function
(emailer)
{
        var calendar, topLabel, content;

        calendar = new TimeManager();
        topLabel = "Next Event Date";

        try {
                content = calendar.getNextDate();
        } catch(e) {
                return this.buildTextKeyValWidget(topLabel, null, 
                        "N/A", false);
        }

        return this.buildTextKeyValWidget(topLabel, null, content, false);
}

StatusCard.prototype.buildSendingDateWidget = function
(emailer)
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
(emailer)
{
        var calendar, date, topLabel, content;

        calendar = new TimeManager();
        topLabel = "BCC";

        try {
                date = calendar.formatDate(calendar.getNextDate());
                content = emailer.getRecipients(date);
        } catch(e) {
                return this.buildTextKeyValWidget(topLabel, null, "N/A", true);
        }

        return this.buildTextKeyValWidget(topLabel, null, content, true);
}

StatusCard.prototype.buildSubjectWidget = function 
(emailer)
{
        var topLabel, content;

        topLabel = "Subject";
        content = "TOFINISH";

        // TODO: get content

        return this.buildTextKeyValWidget(topLabel, null, content, false);
}

StatusCard.prototype.buildBodyWidget = function
(emailer)
{
        var content = "TOFINISH";

        // TODO: get content

        return this.buildTextParagraphWidget(content);
}

//////////////////////////////////////////
// TODO: Helpers                        //
//////////////////////////////////////////
