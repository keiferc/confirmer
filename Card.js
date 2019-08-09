/*
 *      filename:       Card.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           29 July 2019
 *      description:    This module contains a Card object used in the 
 *                      Confirmer GMail add-on
 *
 *      note:           This module is to be in a Google Script and thus uses
 *                      constructor functions instead of Classes (due to GAS' 
 *                      lack of class compatibility)
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
        
        card = CardService.newCardBuilder()
                .setHeader(CardService.newCardHeader()
                        .setTitle(header)
                        .setImageUrl(iconUrl)
                        .setImageAltText(alt)
                );

        for (i = 0; i < sections.length; i++)
                card.addSection(sections[i]);

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
 * updateCard
 *
 * Conducts an in-place update of the given card
 *
 * @param       {Google Apps Script Card} card
 * @returns     {ActionResponse}
 */
function updateCard(card) 
{
        var nav = CardService.newNavigation()
                .updateCard(card;

        return CardService.newActionResponseBuilder()
                .setStateChanged(true)
                .setNavigation(nav)
                .build();
}

/**
 * isValidUrl
 *
 * Returns true if the given string is a RFC 3986 compliant URL.
 * See https://tools.ietf.org/html/rfc3986#appendix-A
 *
 * @param       {String} input
 * @returns     {Boolean}
 */
function isValidUrl(input)
{
        var regex, match, unreserved, pctEncoded, subDelims, pchar, qf, e8, 
        pcharPct, qfPct, protocol, domain, ipv4, port, path, query, fragment;

        unreserved      = "a-z0-9\\-\\._~";
        pctEncoded      = "(%[a-f0-9]{2})";
        subDelims       = "!$&'()*+,;=";
        pchar           = unreserved + subDelims + ":@";
        qf              = pchar + "/?"; // query & fragment chars
        e8              = "((25[0-5])|(2[0-4]\\d)|(1?\\d\\d?))"; // 0 - 255

        pcharPct        = pctEncoded + "*[" + pchar + "]*";
        qfPct           = pctEncoded + "*[" + qf + "]*";

        protocol        = "^(http(s?):\\/\\/)?";
        domain          = "(([a-z0-9\\-]+\\.)+([a-z\\-]+[0-9]*))";
        ipv4            = "((" + e8 + "\\.){3}" + e8 + ")";
        port            = "(:(\\d+))?";

        path            = "(\\/(" + pcharPct + ")*)";
        query           = "(\\?(" + qfPct + ")*)?";
        fragment        = "((#(" + qfPct + ")*)$)?";

        regex = new RegExp(protocol + "(" + domain + "|" + ipv4 + ")" + port +
                "(" + path + query + fragment + ")*", "im");

        match = input.match(regex);

        if (match == null)
                return false;
        else
                return match[0] == input;
}

/**
 * sanitize
 *
 * Includes percent-encodings of special characters not included 
 * in encodeURIComponent. Used as a first-level sanitizer; outputs 
 * to be passed to content-specific, whitelist-using sanitizers.
 *
 * @param       {String} input
 * @returns     {String}
 */
function sanitize(input)
{
        var replacers, protocol, i;

        protocol = /(http(s?):\/\/)|(ftp:\/\/)|(mailto:\/\/)/ig; 
        replacers = [
                [/(\/?)\.\.(\/?)/ig, "%2E%2E"], // path traversal
                [/\-{2}/ig, "%2D%2D"], // SQL comments
                [/'/ig, "%27"] // single quotes
        ];

        if (isValidUrl(input))
                input = decodeURIComponent(input); // double encoding

        input = input.replace(protocol, ""); // remote file inclusion
        input = encodeURIComponent(input); // XSS and SQLi

        for (i = 0; i < replacers.length; i++)
                input = input.replace(replacers[i][0], replacers[i][1]);

        return input.toString();
}
