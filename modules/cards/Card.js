/*
 *      filename:       Card.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           12 August 2019
 *      description:    This module contains a Card object constructor used in 
 *                      the Confirmer GMail add-on.
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
 * Card::formatHeader(string, string);
 *
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
                widget.setBottomLabel(bottomLabel);
        
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
