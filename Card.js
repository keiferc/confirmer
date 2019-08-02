/*
 *      filename:       Card.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           29 July 2019
 *      description:    This module contains a Card object used in the
 *                      Confirmer GMail add-on
 *
 *      note:           This module is to be in a Google Script
 *                      and thus uses constructor functions
 *                      instead of Classes (due to GAS' lack of class
 *                      compatibility)
 */

/**
 * Card 
 *
 * @param       {String} cardName 
 * @param       {String} iconUrl 
 * @param       {String} iconAltText 
 * @param       {Array} sections 
 * @returns     {Object}
 */
function Card(cardName, iconUrl, iconAltText, sections)
{
        this.name = cardName;
        this.icon = iconUrl;
        this.alt = iconAltText;
        this.sections = sections;
        this.gCard = this.build(this.name, this.icon, 
                                this.alt, this.sections);
}

//////////////////////////////////////////
// Builders                             //
//////////////////////////////////////////
/**
 * build 
 *
 * @param       {String} header
 * @param       {String} iconUrl
 * @param       {String} alt
 * @param       {Array} sections
 * @returns     {Card}
 */
Card.prototype.build = function
(header, iconUrl, alt, sections)
{
        var card, i;

        Logger.log("new1");
        
        card = CardService.newCardBuilder();

        Logger.log("new2");

        card.setHeader(CardService.newCardHeader()
                .setTitle(header)
                .setImageUrl(iconUrl)
                .setImageAltText(alt)
        );

        Logger.log("new3");

        for (i = 0; i < sections.length; i++) {

                Logger.log("newloop");

                card.addSection(sections[i]);
        }

        Logger.log("new5");

        return card.build();
}

/**
 * buildSection 
 *
 * @param       {String} header 
 * @param       {Array} widgets
 * @param       {Boolean} collapsible
 * @returns     {CardSection}
 */
Card.prototype.buildSection = function
(header, widgets, collapsible)
{
        var section, i;
        
        section = CardService.newCardSection()
                .setCollapsible(collapsible);

        if (header != null)
                section.setHeader(header)

        for (i = 0; i < widgets.length; i++)
                section.addWidget(widgets[i]);

        return section;
}

//================ Widget Builders ================//
/**
 * buildTextInputWidget
 * 
 * @param       {String} key 
 * @param       {String} title 
 * @param       {String} hint 
 * @param       {any} value 
 * @param       {Function} callback
 * @returns     {Widget}
 */
Card.prototype.buildTextInputWidget = function
(key, title, hint, value, callback)
{
       var widget = CardService.newTextInput()
                        .setFieldName(key)
                        .setTitle(title);
        
        if (hint != null)
                widget.setHint(hint);
        if (value != null)
                widget.setValue(value);
        if (callback != null)
                widget.setOnChangeAction(callback);
        
        return widget;
}

/**
 * buildSwitchWidget 
 *
 * @param       {String} key 
 * @param       {String} label 
 * @param       {Boolean} selected
 * @param       {Function} callback 
 * @returns     {Widget}
 */
Card.prototype.buildSwitchWidget = function 
(key, label, selected, callback)
{
        var widget, switcher;

        switcher = CardService.newSwitch()
                .setFieldName(key)
                .setValue(true)
                .setSelected(selected);
                
        if (callback != null)
                switcher.setOnChangeAction(callback);
        
        widget = CardService.newKeyValue()
                .setContent(label)
                .setSwitch(switcher);
        
        return widget;
}

/**
 * buildDropdownWidget
 * 
 * @param       {String} key 
 * @param       {String} label 
 * @param       {Array} options
 * @param       {Function} callback 
 * @returns     {Widget}
 */
Card.prototype.buildDropdownWidget = function 
(key, label, options, callback)
{
        var widget, i;

        widget = CardService.newSelectionInput()
                .setType(CardService.SelectionInputType.DROPDOWN)
                .setFieldName(key)
                .addItem("Choose", null, false);
        
        if (label != null)
                widget.setTitle(label);
        if (callback != null)
                widget.setOnChangeAction(callback);
        
        for (i = 0; i < options.length; i++)
                widget.addItem(options[i].label, options[i].key,
                        options[i].selected);
        
        return widget;
}

/**
 * buildTextKeyValWidget
 * 
 * @param       {String} topLabel 
 * @param       {String} bottomLabel 
 * @param       {String} content 
 * @param       {Boolean} multiline 
 * @returns     {Widget}
 */
Card.prototype.buildTextKeyValWidget = function
(topLabel, bottomLabel, content, multiline)
{
        var widget = CardService.newKeyValue()
                .setContent(content)
                .setMultiline(multiline);
        
        if (topLabel != null)
                widget.setTopLabel(topLabel);
        if (bottomLabel != null)
                widget.setBottomLabel(Label);
        
        return widget;
}

/**
 * buildTextParagraphWidget 
 *
 * @param       {String} text 
 * @returns     {Widget}
 */
Card.prototype.buildTextParagraphWidget = function 
(text)
{
        return CardService.newTextParagraph().setText(text);
}

//////////////////////////////////////////
// Helpers                              //
//////////////////////////////////////////
/**
 * formatHeader
 *
 * @param       {String} header 
 * @param       {String} color // rgb hex
 * @returns     {String} 
 */
Card.prototype.formatHeader = function 
(header, color)
{
        return "<font color='" + color + "'>" + 
               "<b>" + header + "</b></font>"
}

/**
 * isUrl
 *
 * @param       {String} input
 * @returns     {Boolean}
 */
Card.prototype.isUrl = function 
(input)
{
        // Source: https://tools.ietf.org/html/rfc3986#appendix-A
        // Note:   Localhost URLs are not allowed
        // Valid: 
        //         https://duckduckgo.com/?q=test+regex&t=ffab&ia=web#sffqwefq
        //         https://stackoverflow.com/questions/161738/asdfasdf-fsda-ef
        //         https://developers.google.com/apps-sc/refce/spt/seet#nlah()
        //         https://255.255.255.255:80/s?q=f+s&s=c.mit:*i=U-8&&sI=&sP=1
        //         https://some-url.com?query=&name=joe?filter=.#some_anchor
        //         https://regex101.com:80/asdf$afljlijbqewfu
        //         https://asdah.gov/asdh-ah.as
        //         https://www3.google.com
        //         http://255.255.255.255:80/s?q=fd+s&s=c.mit:*i=U-8&&sI=&sP=
        //         http://hh-1.wut.blabla.com:80/test/t/test.aspx?dd=dd&id=dk
        //         http://sub.web-site.com/cgi-/perl.cgi?key1=v&key2=value2e
        //         http://foobar.net/casual/archive/2005/12/01/61722.aspx
        //         http://www.my.com/calendar#filter:year/2010/month/5k
        //         http://www.asdah.com/~joe
        //         255.255.255.255:80/s?q=fd+s&s=c.mit:*i=U-8&&sI=&sP=1
        //         i.imgur.com/98efqkp19ubfasdfbp1u2bfis.jpg==.
        //         flanders.co.nz/2009/11/08/blah-foo-bar-wut/
        //         www.m.google.com/help.php?a=5
        //         255.255.255.255
        //         google.ruhroh
        //         regex101.com/
        //         regex101.com
        //         192.52.193.0
        //         192.0.0.171
        //         100.64.0.0
        //         127.0.0.1
        //         10.0.0.0
        //         0.0.0.0
        //         432.3.s
        //         23.com
        // Invalid:
        //         https://some-url.com?query=&name=foo?filter=.#some_anchor
        //         http://hh-1hallo. msn.bla.cm:80800/t/test.aspx?dd=dd&id=d
        //         www.google.com/somthing"/somethingmore
        //         google.com?fdad
        //         255.24.10.1.1
        //         500.20.30.1
        //         asdf.com/%
        //         asdf
        //         a.1

        var regex = new RegExp(
                "^(http(s?):\/\/)?" + // protocol
                "((([a-z0-9\-]+\.)+([a-z\-]+[0-9]*))|" + // domain or
                "((((25[0-5])|(2[0-4]\d)|(1?\d\d?))\.){3}" + 
                "((25[0-5])|(2[0-4]\d)|(1?\d\d?))))" + // ipv4
                "(:(\d+))?" + // port
                "((\/([a-z0-9\-\._~!$&'()*+,;=:@]*(%[a-f0-9]{2})*)*)" + //path
                "(\?[a-z0-9\-\._~!$&'()*+,;=:@/?]*(%[a-f0-9]{2})*)?" + // query
                "((#[a-z0-9\-\._~!$&'()*+,;=:@/?]*(%[a-f0-9]{2})*$)?))*" // fragment
        , "im");

        return regex.test(input);
}

/**
 * sanitize
 *
 * @param       {String} input
 * @returns     {Array}
 */
Card.prototype.sanitize = function
(input)
{
        var sanitized, regex;
}
