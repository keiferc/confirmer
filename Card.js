/*
 *      filename:       Card.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           12 August 2019
 *      description:    This module contains a Card object constructor used in 
 *                      the Confirmer GMail add-on
 */

/*------------------------------------------------------------
 *                         Functions
 *------------------------------------------------------------
 * ---- Object Constructor ---- 
 * Card::Card(string, string, string, Array)
 *
 * ---- Builders ----
 * Card::build(string, string, string, Array)
 * Card::buildSection(string, Array, boolean)
 *
 *      ---- Widget Builders ----
 *      Card::buildTextInputWidget(string, string, string, any, Function)
 *      Card::buildSwitchWidget(string, string, boolean, Function)
 *      Card::buildDropDownWidget(string, string, Array, Function)
 *      Card::buildTextKeyValWidget(string, string, string, Boolean)
 *      Card::buildTextParagraphWidget(string)
 *
 * ---- Helpers ----
 * updateCard(Google Card, boolean);
 * printError(string);
 * Card::formatHeader(string, string);
 *              
 * ---- Sanitizers ----
 * sanitize(string)
 * cleanInputUrl(any)
 *
 * ---- Checkers ----
 * isEmpty(any)
 * isValidUrl(string)
 ------------------------------------------------------------*/

/**
 * Card 
 *
 * Custom object constructor wrapping around a Google Card object.
 *
 * @param       {string} cardName: Name of Google Card
 * @param       {string} iconUrl: URL of Google Card icon
 * @param       {string} iconAltText: Alt text for Google Card icon
 * @param       {Array} sections: Array of Google CardSections
 * @returns     {Card}: Object instance wrapping a Google Card object
 */
function Card(cardName, iconUrl, iconAltText, sections)
{
        this.name = cardName;
        this.icon = iconUrl;
        this.alt = iconAltText;
        this.sections = sections;
        this.gCard = this.build(this.name, this.icon, this.alt, this.sections);
}

//////////////////////////////////////////
// Builders                             //
//////////////////////////////////////////
/**
 * build 
 *
 * Returns a Google Card object.
 *
 * @param       {string} header: Google Card header
 * @param       {string} iconUrl: URL of Google Card icon
 * @param       {string} alt: Alt text of Google Card icon
 * @param       {Array} sections: Array of Google CardSections
 * @returns     {Google Card}: Google Card object
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
 * Returns a Google CardSection.
 *
 * @param       {string} header: Google CardSection header
 * @param       {Array} widgets: Array of Google Card Widgets
 * @param       {boolean} collapsible: True if section is collapsible
 * @returns     {Google CardSection}: Google CardSection object
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
 * Returns a Google Text Input Widget
 * 
 * @param       {string} key: Key for the input field
 * @param       {string} label: Label for the input field
 * @param       {string} hint: Hint for the input field
 * @param       {any} value: Default value in input field
 * @param       {Function} callback: State-change callback function
 * @returns     {Widget}: Google Text Input Widget object
 */
Card.prototype.buildTextInputWidget = function
(key, label, hint, value, callback)
{
       var widget = CardService.newTextInput()
                        .setFieldName(key)
                        .setTitle(label);
        
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
 * Returns a Google Switch Key-Value Widget.
 *
 * @param       {string} key: Key for the switch
 * @param       {string} label: Value for activated switch
 * @param       {boolean} selected: True if switch is activated by default
 * @param       {Function} callback: State-change callback function
 * @returns     {Widget}: Google Switch Key Value Widget
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
 * Returns a Google Dropdown Selection Input Widget.
 * 
 * @param       {string} key: Key for the selection field
 * @param       {string} label: Label for the selection field
 * @param       {Array} options: Array of dropdown option objects
 * @param       {Function} callback: State-change callback function
 * @returns     {Widget}: Google Dropdown Selection Input Widget
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
 * Returns a Google Text Key-Value Widget.
 * 
 * @param       {string} topLabel: Label above value
 * @param       {string} bottomLabel: Label below value
 * @param       {string} content: Value to be displayed
 * @param       {boolean} multiline: True if allow line breaks for value
 * @returns     {Widget}: Google Text Key-Value Widget
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
 * Returns a Google Text Paragraph Widget.
 *
 * @param       {string} text: Text to display
 * @returns     {Widget}: Google Test Paragraph Widget
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
 * updateCard
 *
 * Conducts an in-place update of the given card.
 *
 * @param       {Google Card} card: Google Card to update
 * @returns     {Google ActionResponse}: ActionResponse that updates Card
 */
function updateCard(card, pop) 
{
        var nav = CardService.newNavigation().updateCard(card);

        if (pop)
                nav.popToRoot();

        return CardService.newActionResponseBuilder()
                .setStateChanged(true)
                .setNavigation(nav)
                .build();
}

/**
 * printError
 *
 * Pushes a Google Card on the add-on stack displaying error messages.
 *
 * @param       {string} error: Errors to display
 * @returns     {Google ActionResponse}: ActionResponse that pushes Card
 */
function printError(error)
{
        var errorCard, nav;
        
        errorCard = CardService.newCardBuilder()
                .setHeader(CardService.newCardHeader()
                        .setTitle("Oops! Something went wrong!")
                )
                .addSection(CardService.newCardSection()
                        .addWidget(CardService.newTextParagraph()
                                        .setText(error))
                )
                .build();

        nav = CardService.newNavigation().pushCard(errorCard);

        return CardService.newActionResponseBuilder()
                .setStateChanged(true)
                .setNavigation(nav)
                .build();
}

/**
 * formatHeader
 *
 * Helper function used for formatting the given header with the given color.
 *
 * @param       {string} header: Section header text to format
 * @param       {string} color: Font color of header in RGB hex
 * @returns     {string} HTML string of formatted section header
 */
Card.prototype.formatHeader = function 
(header, color)
{
        return "<font color='" + color + "'>" + 
               "<b>" + header + "</b></font>"
}

//////////////////////////////////////////
// Sanitizers                           //
//////////////////////////////////////////
/**
 * sanitize
 *
 * Includes percent-encodings of special characters not included 
 * in encodeURIComponent. Used as a first-level sanitizer; outputs 
 * to be passed to content-specific, whitelist-using sanitizers.
 *
 * @param       {string} input: User input to be sanitized
 * @returns     {string} Sanitized user input
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

/**
 * cleanInputUrl
 *
 * Returns a sanitized version of the given URL
 *
 * @param       {any} url: Input URL to sanitize
 * @returns     {string}: Sanitized input URL
 */
function cleanInputUrl(url)
{
        if (isGSheetUrl(url.toString()))
                return sanitizeGSheetUrl(url.toString());
        else if (isValidUrl(url.toString()))
                return sanitize(url.toString());
        
        throw "\""+ url.toString() + "\" is not a valid URL.";
}

//////////////////////////////////////////
// Checkers                             //
//////////////////////////////////////////
/**
 * isEmpty
 *
 * Helper function that handles multiple return types from Google.
 * Returns true if the value is "empty" or null.
 *
 * @param       {any} input: Input to be evaluated
 * @returns     {boolean}: True if input is empty / null
 */
function isEmpty(input)
{
        return input == null || input == undefined || 
               input.toString() === "" || input.toString() == "null" ||
               input.toString() == "undefined";
}

/**
 * isValidUrl
 *
 * Returns true if the given string is a RFC 3986 compliant URL.
 * See https://tools.ietf.org/html/rfc3986#appendix-A.
 *
 * @param       {string} input: User input to check
 * @returns     {boolean}: True if input is a RFC 3986 compliant URL
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
