/**
 * WMS Searchbox plugin
 * Author: Gabriel Ortiz
 * College: Claremont Colleges Library
 * Output: A general fully customizable search box or a scoped searchbox
 * 
 */

(function($, window, document){
'use strict';
    $.WMSSearch = function(element, UserOptions){

        var plugin = this;
        
        var $element = $(element),
             element = element;
             
        //this is public
        plugin.options = $.extend( true, $.fn.WMSSearch.options, UserOptions);             
        
        
        /**
         * 
         * New search variable objects
         * 
        */
        
        //column width
        var column_width;
        var search_width;
        //change column width if searchbox only
        if( plugin.options.scoped_search_settings.scoped_searchbox === true ){
            search_width = 'col--md-6';
            column_width = 'col--md-3';
        }else{
            search_width = 'col--md-10';
            column_width = 'col--md-3';                
        }        
        
        //single search row and input
        var wms_scoped_row_desc = $('<div />')
                                .addClass('row wms-row')
                                .append(
                                    //append full width column
                                    $('<div />')
                                        .addClass('col col--md-12')
                                        .append(
                                            $('<h3 />')
                                                .addClass('wms-c-title')
                                                .text("Search for " + plugin.options.scoped_search_settings.scoped_search_title)
                                            )    
                                        .append(
                                            $('<div />')
                                                .addClass('wms-c-scoped-description')
                                                .text(plugin.options.scoped_search_settings.scoped_search_desc)
                                            )                                            

                                );
        
        //searchbox row input field goes here
        var wms_scoped_row_search_input = $('<div />')
                                            .addClass('row wms-row')
                                            .append(
                                                //add the search input for scoped
                                                $('<input />'). attr({
                                                    type        : 'text',
                                                    name        : 'keyword',
                                                    placeholder : 'Start typing your search'
                                                    })
                                                    .addClass('col '+ search_width + ' wms-search wms-c-keyword')
                                            );

        // first level searchbox
        var wms_search_input = $('<div />')
                                .addClass('row wms-row')
                                .attr('id', 'wms-search-for')
                                .append(
                                    $('<div />')
                                        .addClass('col col--md-2')
                                        .append(
                                            $('<h3 />')
                                                .addClass('wms-c-title')
                                                .text('Search For:')
                                            )
                                    )
                                .append(
                                    //append search input field
                                    $('<input />'). attr({
                                        type        : 'text',
                                        name        : 'keyword',
                                        placeholder : 'Start typing your search'
                                        })
                                        .addClass("col " + search_width + " wms-search wms-c-keyword")                                            

                                    );
       
        //container for all the search settings
        var wms_search_rows = $('<div />').addClass('row wms-row').attr('id', 'wms-search-rows');
                                   
        //submit button!
        var wms_search_submit = $('<div />')
                                    .addClass("col " + column_width + " wms-row")
                                    .append(
                                        $('<button />')
                                            .attr({
                                                'type'  : 'submit'
                                            })
                                            .addClass(' wms-button wms-search wms-submit wms-search-button')
                                            .text('Search')
                                        );

            /**
             * 
             * WMS Search Attributes
             */
            var default_search_attrs = [
                    {id: 'kw', name: 'Keyword', paramater: 'kw', order:'primary'},
                    {id: 'ti', name: 'Title', paramater: 'ti'},
                    {id: 'au', name: 'Author', paramater: 'au'},
                    {id: 'bn', name: 'ISBN', paramater: 'bn'},
                    {id: 'su', name: 'Subject', paramater: 'su'},
                    {id: 'no', name: 'OCLC Number', paramater: 'no'},
                    {id: 'so', name: 'Journal Source', paramater: 'so'},
                    {id: 'yr', name: 'Year', paramater: 'yr'},
                    {id: 'n2', name: 'ISSN', paramater: 'n2'},
                    {id: 'nu', name: 'Call Number', paramater: 'nu'}                     
                ];
            
            /**
             * 
             * WMS Search Formats
             * 
             * id's are the singular name of the item, lowercased
             */
            var default_search_formats  =  [
                    {id: 'all', name: 'Everything', paramater: 'all', order:'primary'},
                    {id: 'book', name: 'Print Books', paramater: 'Book'},
                    {id: 'ebook', name: 'eBooks', paramater: 'Book::book_digital'},
                    {id: 'dvd', name: 'DVDs', paramater: 'Video::video_dvd'},
                    {id: 'journal', name: 'Journal/Magazine', paramater: 'Artchap::artchap_artcl'},
                    {id: 'music', name: 'Musical Scores', paramater: 'Msscr'}
                ];

                
        
        /**
         * Generate search field with code with list options
         * 
         * @return compiled code to be appended to the column container
         * search_prefix: the word that goes before dropdown menu
         * search_clie: I don't remember what this is... figure out later
         * default_select_options: list of default select for the options
         * omitted_select_options: list of objects from plugin settings
         */
        var generate_search_field = function( search_prefix, search_prompt, default_select_options, omitted_select_options) {

            //check for omitted select items
            var updated_select_list = check_for_omited(default_select_options, omitted_select_options);
            
            //declare variables
            //  {id: 'kw', name: 'Keyword', paramater: 'kw'},
            var html_select_list = [];
            var temp_label, temp_input, primary_field;
            
            
            for ( var obj in updated_select_list){

                if( updated_select_list[obj].hasOwnProperty('order') ){
                    primary_field = updated_select_list[obj];
                    break;
                }else {
                    primary_field = updated_select_list[0];   
                }
            }
            
            
            console.log(primary_field);
            
            //construct an array of options as an array
            $.each(updated_select_list, function(index, value){
                
                temp_input =    $('<input />')
                                    .attr({
                                        'type'  : 'radio',
                                        'id'    : value.paramater,
                                        'name'  : search_prefix,
                                    })
                                    .val(value.paramater);
                                    
                if( value.hasOwnProperty('order') ){
                    temp_input.attr('checked', 'checked');
                }else if( index == 0 ){
                    temp_input.attr('checked', 'checked');
                }
        
               temp_label = $('<label />')
                            .attr({
                                'class'         : 'wms-select_attr',
                                'role'          : 'menuitem',
                                'tabindex'      : '0',
                                'aria-hidden'   : 'true',
                                'for'           : value.paramater
                            })
                            .text(value.name)
                            .append(temp_input);

                html_select_list.push( temp_label );
                
            });
            
            var wms_search_column = $('<div />')
                                        .addClass("col " + column_width + " wms-row");
                                        
            //div.wms-dropdown - outer level div    
            var wms_attr_dropdown = $('<div />')
                                        .addClass('wms-dropdown wms-search')
                                        .attr({
                                            'tabindex'      : '0',
                                            'role'          : 'button',
                                            'aria-label'    : 'Search Attribute'
                                        })
                                        .append(
                                            //div.wms-c-selected
                                            $('<div />')
                                                .addClass('wms-c-selected')
                                                // first span with prompt and dropdown arrow
                                                .append(
                                                    $('<span />')
                                                        .addClass('wms-prompt')
                                                        .text(search_prompt + ":")
                                                    )
                                                    //div.wms-selected-item - second span for data and selected content
                                                .append(
                                                    $('<span />')
                                                        .addClass( 'wms-selected-item type-'+search_prefix )
                                                        .attr({
                                                            'data-wms_attr' : primary_field.paramater,
                                                            'data-wms_type' : search_prefix
                                                            
                                                        })
                                                        .text( primary_field.name )
                                                    )
                                                .append(
                                                    $('<span />')
                                                        .addClass('wms-arrow__toggle')
                                                        .html('&#10097;')
                                                    )  
                                            );
            //div.wms-items
            var wms_attr_dropdown_items = $('<div />').addClass('wms-list-options')
                                                .attr({
                                                    'role'          : 'menu',
                                                    'aria-haspopup' : 'true'
                                                })
                                                //this will list out the options to be selected
                                                .append(html_select_list);
            
            //return appended object to column
            //append dropdown items to div.wms-l-column wms-l-span-3-md wms-dropdown wms-search
            wms_attr_dropdown.append(wms_attr_dropdown_items);
            //append everything to the second row
            wms_search_column.append(wms_attr_dropdown);
            
            return wms_search_column;

        };       
        
        //check to see if items there are omitted properties
        //@return array of options, remove omitted options from user
        var check_for_omited = function(plugin_defaults, omited_list){
            
            //foreach item in of omitted list
            $.each( omited_list, function(key, value){
                plugin_defaults = plugin_defaults.filter(function(obj){
                    //if the value of the omitted list does not match the plugin defualt id,
                    //then return it, if it does match, don't return
                    return value !== obj.id; 
                });
            });


            //return new array            
            return plugin_defaults;
        };
    

        var construct_url = function(input_array){
             
             //define variables
            var search_string, format_key, source_location, source_key, format_value;
            
            //if scoped searchbox is turned on, the append the scope to string
            if( plugin.options.scoped_search_settings.scoped_searchbox === true && plugin.options.scoped_search_settings.scoped_search_scoping == '' ){

                search_string = input_array['attr'];
                
                source_location = plugin.options.scoped_search_settings.scoped_search_collection;
                
            }else if ( plugin.options.scoped_search_settings.scoped_searchbox === true){
                
                search_string = "(" + plugin.options.scoped_search_settings.scoped_search_scoping +") " + plugin.options.scoped_search_settings.scoped_search_boolean +" "+ input_array['attr'];
                
                source_location = plugin.options.scoped_search_settings.scoped_search_collection;
            }else{
                
                search_string = input_array['attr'];
                
                source_location = input_array['src'];
            }
            
            
            //check if subformat is set
            if( input_array['frmt'].match( /(digital|dvd|artchap_artcl)/) 
                && plugin.options.scoped_search_settings.scoped_searchbox !== true  ){
                //check to see if frmt exists and contains subformat
                format_key      = 'subformat';
                format_value    = input_array['frmt'];
            }else{
                format_key      = 'format';
                format_value    = input_array['frmt'];                
            }            

            //check if we are dealing with scope (another library collection)
            if(source_location.match( /::zs:/) ){
                source_key = 'subscope';
            }else{
                source_key = 'scope';
            }
            
            
            //build the URL
            var wms_params = {
                sortKey         : plugin.options.defaults.sortKey,
                databaseList    : plugin.options.defaults.databaseList,
                queryString     : search_string,
                Facet           : '',
                //scope added below
                //format added below
                database        : plugin.options.additional_settings.database || 'all',
                author          : plugin.options.additional_settings.author,
                year            : plugin.options.additional_settings.year || 'all',
                yearFrom        : plugin.options.additional_settings.yearFrom,
                yearTo          : plugin.options.additional_settings.yearTo,
                language        : plugin.options.additional_settings.language || 'all',
                topic           : plugin.options.additional_settings.topic
                };
               
               //add the format scoping outside of initial params
                wms_params[source_key] = source_location;
                wms_params[format_key] = format_value;
                
                
               //so here we've got to replace encoded ampersands
                var clean_plugin = plugin.options.defaults.wms_base_url + $.param(wms_params);
                clean_plugin    = clean_plugin.replace('%26', "&");
                
                return clean_plugin;
            
        };
        
        plugin.controller = function(){
            //this is the initializer  

            //check if scoped search has been activiated
            if( plugin.options.scoped_search_settings.scoped_searchbox === true ){
                //create attribute search module
                var attr_search_single = generate_search_field( 'attr' , 'AS', default_search_attrs, plugin.options.additional_settings.omit_attributes );
                
                //append the search scoping to input row
                wms_scoped_row_search_input
                    .append(attr_search_single, wms_search_submit);
                
                //append to container
                $element
                    .addClass("grid grid--container")
                    .append(wms_scoped_row_desc, wms_scoped_row_search_input); 
                    
            }else{
                //run the full search functionality
                //create variables for search modules
                var attr_search = generate_search_field( 'attr' , 'AS', default_search_attrs, plugin.options.additional_settings.omit_attributes );
                var format_search = generate_search_field('frmt', 'FOR', default_search_formats , plugin.options.additional_settings.omit_formats  );
                var source_search = generate_search_field('src', 'IN', plugin.options.defaults.collections, plugin.options.additional_settings.omit_collections);

                
                //add search options to the coontainer
                wms_search_rows.append(attr_search, format_search, source_search, wms_search_submit);
                //add everything to the target element
                $element.append([wms_search_input, wms_search_rows]).addClass("grid grid--container");                
            }
            

            //event handlers for all actions, attached to container to ensure that DOM added elements will work
            $element
                //show dropdown
                .on('keypress click', '.wms-dropdown' , function(event){
                    
                    if(event.keyCode == 13 || event.type == 'click'){
                        var $this = $( this );
                        //console.log( $this );
                        var selected_option = $this.find('.wms-list-options');
                        var toggle_arrow = $this.find('.wms-arrow__toggle');
                        toggle_arrow.toggleClass('toggle-up');
                        $('.wms-arrow__toggle').not(toggle_arrow).removeClass('toggle-up');
                        
                        selected_option.slideToggle('fast');
                        $('.wms-list-options').not(selected_option).slideUp('fast');
                        //console.log('first event fired');
                        
                    }
                    


                })
                //select the item from the options list and set as data in the selected item
                .on('click keypress', 'label.wms-select_attr', function(event){
                    if(event.keyCode == 13 || event.type == 'click'){

                        //create variables of selected item
                        if(event.target.tagName == 'LABEL'){

                            var $this = $(this);
                            var selected_attr_name = $this.text();
                            var selected_attr_data = $this.find("input").val();
                                
                            //console.log( selected_attr_data );
                            //update the default with selected item
                            $this
                                .parents('.wms-search')
                                .find('.wms-selected-item')
                                .text( selected_attr_name );
                        
                            //stop label from triggering the slidetoggle from opening again
                            event.stopPropagation();
                        }
                        

                    }

                    
                })
                .on('click', '.wms-submit', function(event){
                    //ensure click event is cancelled
                    event.preventDefault();
                    //grab all elements

                    var selected_search_elements = '';
                    selected_search_elements = $('.wms-list-options');
                    //console.log('new data', selected_search_elements.find('input[name="attr"]:checked') );
                    
                    //grab search input
                    var search_input = $('input[name="keyword"]').val();

                    //create array of selected settings to be passed. only one query to the dom
                    var scoped_search = [];
                    
                    if( plugin.options.scoped_search_settings.scoped_searchbox === true ){
                        scoped_search['attr']   = selected_search_elements.find('input[name="attr"]:checked').attr('value') + ':' + search_input;
                        scoped_search['frmt']   = plugin.options.scoped_search_settingsscoped_search_format || 'all';
                        scoped_search['src']    = plugin.options.scoped_search_settings.scoped_search_scoping || '';
                    }
                    
                    $.each(selected_search_elements, function(index, value){

                        var temp_radio = $(value).find('input[type="radio"]:checked');

                        if( temp_radio.attr('name') == 'attr'){
                            scoped_search['attr'] = '';
                            scoped_search['attr'] = temp_radio.val()+ ':' + search_input;
                            
                        }else if(  temp_radio.attr('name') == 'frmt' ){
                            scoped_search['frmt'] = '';                            
                            scoped_search['frmt'] = temp_radio.val();
                            
                        }else if( temp_radio.attr('name') == 'src' ){
                            scoped_search['src'] = '';                            
                            scoped_search['src'] = temp_radio.val();
                        }
                        
                    });
                    
                    
                   var  wms_url = construct_url(scoped_search);
                   console.log(wms_url);
                   
                    //clear the variables
                    scoped_search = [];
                    selected_search_elements = '';
                });
                
            //close the dropdown if user clicks somwehere else    
            $('body').on('click', function(event){
                        if( $(event.target).parents('.wms-dropdown').length === 0 ){
                            $('.wms-list-options').slideUp('fast');
                            $('.wms-arrow__toggle').removeClass('toggle-up');
                        }
            });
    
                
        };        
        
        
    };
    
    $.fn.WMSSearch = function(UserOptions){
        return this.each(function(){
            if (undefined == $(this).data('WMSSearch')) {
                var newPlugin = new $.WMSSearch(this, UserOptions);
                    newPlugin.controller();    
                
                    $(this).data('WMSSearch', newPlugin);
            }
        });
    };
    
    
    $.fn.WMSSearch.options = {
        defaults                :{
            wms_base_url        : 'https://ccl.on.worldcat.org/search?', //required
            sortKey             : 'LIBRARY', //required
            databaseList        : '',
            collections         : [
                {id: 'all', name: 'General Collections', paramater: 'wz:519', order:'primary'}, //required
                {id: 'spcl', name: 'Special Collections', paramater: 'wz:519::zs:36307'},
                {id: 'oclc', name: 'Libraries Worldwide', paramater: '&scope=wz:519'} //required 
            ]            
        },
        scoped_search_settings      : {
            scoped_searchbox        : false,
            scoped_search_title     : '',
            scoped_search_desc      : '',
            scoped_search_scoping   : '',
            scoped_search_collection  : '',
            scoped_search_format    : 'all',
            scoped_search_boolean   : 'AND'
        },
        additional_settings :{
            database            : 'all', //required
            author              : '',
            year                : 'all', //required
            yearFrom            : '',
            yearTo              : '',
            language            : 'all', //required
            topic               : '', //topic may not be necessary
    
            omit_attributes     : ['n2'],
            omit_formats        : ['music'],
            searchbox_help      : 'Enter a keyword into the search box to get started',
            search_attr_help    : 'What are you searching as? Attributes help you narrow your search',
            search_source_attr  : 'Where would you like to search. Here are different collections materials to narrow your search'
        }
    };
})(jQuery, window, document);