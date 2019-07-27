/*
 * TODO: Module Documentation
 */

//////////////////////////////////////////
// Card Component Builders              //
//////////////////////////////////////////
/**
 * 
 * @param       {String} cardHeader
 * @param       {String} imageUrl
 * @param       {String} alt
 * @param       {Array} sectionsArr 
 * @returns     {Card}
 */
function buildCard(cardHeader, imageUrl, alt, sectionsArr)
{
        var card, i;
        
        card = CardService.newCardBuilder();
        card.setHeader(CardService.newCardHeader()
                .setTitle(cardHeader)
                .setImageUrl(imageUrl)
                .setImageAltText(alt)
        );

        for (i = 0; i < sectionsArr.length; i++)
                card.addSection(sectionsArr[i]);

        return card.build();
}

/**
 * 
 * @param       {String} sectionHeader 
 * @param       {Array} widgetsArr 
 * @param       
 * @returns     {Section}
 */
function buildSection(sectionHeader, widgetsArr, collapsible)
{
        var section,i;
        
        section = CardService.newCardSection()
                .setCollapsible(collapsible);

        if (sectionHeader != null)
                section.setHeader(sectionHeader)

        for (i = 0; i < widgetsArr.length; i++)
                section.addWidget(widgetsArr[i]);

        return section;
}

/**
 * 
 * @param       {String} header 
 * @param       {String} color
 * @returns     {String} 
 */
function formatSectionHeader(header, color)
{
        return "<font color='" + color + "'>" + 
               "<b>" + header + "</b></font>";
}

/**
 * 
 * @param       {String} key 
 * @param       {String} title 
 * @param       {String} hint 
 * @param       {any} value 
 * @param       {Function} callback
 * @returns     {Object}
 */
function buildTextInputWidget(key, title, hint, value, callback)
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
 * 
 * @param       {String} label 
 * @param       {String} switchKey 
 * @param       {String} switchValue 
 * @param       {Function} callback 
 * @returns     {Object}
 */
function buildSwitchWidget(label, switchKey, switchValue, callback)
{
        var widget, switcher;

        switcher = CardService.newSwitch()
                .setFieldName(switchKey);
        
        if (switchValue != null)
                switcher.setValue(switchValue);
        if (callback != null)
                switcher.setOnChangeAction(callback);
        
        widget = CardService.newKeyValue()
                .setContent(label)
                .setSwitch(switcher);
        
        return widget;
}

/**
 * 
 * @param       {String} key 
 * @param       {String} label 
 * @param       {Array} optionsArr 
 * @param       {Function} callback 
 * @returns     {Object}
 */
function buildDropdownWidget(key, label, optionsArr, callback)
{
        var widget, i;

        widget = CardService.newSelectionInput()
                .setType(CardService.SelectionInputType.DROPDOWN)
                .setFieldName(key)
                .addItem("Choose", null, false);
        
        if (label != null)
                widget.setTitle(label);
        
        for (i = 0; i < optionsArr.length; i++)
                widget.addItem(optionsArr[i].label, optionsArr[i].key,
                        optionsArr[i].selected);
        
        return widget;
}

/**
 * 
 * @param       {String} topLabel 
 * @param       {String} bottomLabel 
 * @param       {String} content 
 * @param       {Boolean} multiline 
 * @returns     {Object}
 */
function buildTextKeyValWidget(topLabel, bottomLabel, content, multiline)
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
 