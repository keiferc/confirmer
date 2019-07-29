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
        iconUrl = "https://www.maxpixel.net/static/photo/2x/" + 
                  "E-Mail-Icon-At-News-At-Sign-Email-1083508.png";
        iconAltText = "Status Card Icon";

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
        var sections = [];

        sections.push(this.getScheduleSection());
        sections.push(this.getEmailSection());

        return sections;
}

/**
 * getScheduleSection
 */
StatusCard.prototype.getScheduleSection = function ()
{
        var header, widgets, nextEventDate, sendingDate;

        header = this.formatHeader("Schedule", PRIMARY_COLOR);
        widgets = [];

        nextEventDate = this.buildTextKeyValWidget("Next Event Date", 
                null, "asdf", false);
        sendingDate = this.buildTextKeyValWidget("Reminder Email Sending Date", 
                null, "input here", false);
        
        widgets.push(nextEventDate);
        widgets.push(sendingDate);

        return this.buildSection(header, widgets, false);
}

/**
 * getEmailSection
 */
StatusCard.prototype.getEmailSection = function ()
{
        var header, widgets, sender, bcc, subject, body;

        header = this.formatHeader("Email", PRIMARY_COLOR);
        widgets = [];

        sender = this.buildTextKeyValWidget("Sender", null, 
                "Sender email here", false);
        bcc = this.buildTextKeyValWidget("BCC", null, 
                "bcc1<br>bcc2<br>bcc3", true);
        subject = this.buildTextKeyValWidget("Subject", null, 
                "Subject Line Here", false);
        body = this.buildTextParagraphWidget("here is the email body");

        widgets.push(sender);
        widgets.push(bcc);
        widgets.push(subject);
        widgets.push(body);

        return this.buildSection(header, widgets, false);
}

//////////////////////////////////////////
// Widget Builders                      //
//////////////////////////////////////////


//////////////////////////////////////////
// TODO: Helpers                        //
//////////////////////////////////////////
