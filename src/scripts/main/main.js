//This is a starter template for writing plugins

(function($, window, document){
 
    $.WMSSearch = function(element, UserOptions){
        
        var plugin = this;
        
        var $element = $(element),
             element = element;
             
        //this is public
        plugin.options = $.extend( {}, $.fn.WMSSearch.options, UserOptions);             
        
        
        /**
         * 
         * New search variable objects
         * 
        */
        
        // first lever search box
        var wms_search_input = $('<div />')
                                .addClass('columns wms-row')
                                .attr('id', 'wms-search-for')
                                .append(
                                    $('<div />')
                                        .addClass('column is-2')
                                        .append(
                                            $('<h2 />')
                                                .addClass('wms-c-title')
                                                .text('Search For:')
                                            )
                                    )
                                .append(
                                    $('<div />')
                                        .addClass('column is-10')
                                        .append(
                                            $('<input />'). attr({
                                                id          : 'wms-c-keyword',
                                                type        : 'text',
                                                name        : 'keyword',
                                                placeholder : 'Start typing your search'
                                                })
                                                .addClass('wms-search')                                            
                                            )
                                    );
       
        //container for all the search settings
        var wms_search_rows = $('<div />').addClass('columns wms-row').attr('id', 'wms-search-rows');
                                   
        //submit button!
        var wms_search_submit = $('<div />')
                                    .addClass('column is-3')
                                    .attr('id', 'wms-search-button')
                                    .append(
                                        $('<button />')
                                            .attr({
                                                'id'    : 'wms-submit',
                                                'type'  : 'submit'
                                            })
                                            .addClass(' wms-button wms-search ')
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
                    {id: 'n2', name: 'ISSN', paramater: 'n2'}                
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
            var temp_li;
            
            
            //get selected updayed_select_list
            //if there is no primary set - then return the first item in options array
            var selected_primary_field = updated_select_list.filter(function(obj){
                if( obj.order == 'primary' ){
                    return  obj.order == 'primary';
                }else{
                    return updated_select_list[0];
                }

            });
            
           // console.log('this is the primary field', selected_primary_field[0]);
            
            //construct an array of options as an array
            $.each(updated_select_list, function(index, value){
               temp_li = $('<li />')
                            .attr({
                                'class'         : 'wms-select_attr',
                                'data-wms_attr' : value.paramater,
                                'role'          : 'menuitem',
                                'tabindex'      : '0',
                                'aria-hidden'   : 'true'
                            })
                            .text(value.name);
            
                html_select_list.push( temp_li );
                
            });
            //console.log(html_select_list);
            

            var wms_search_column = $('<div />')
                                        .addClass('column is-3 wms-row');
                                        
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
                                                        .text(search_prompt)
                                                    )
                                                    //div.wms-selected-item - second span for data and selected content
                                                .append(
                                                    $('<span />')
                                                        .addClass( 'wms-selected-item' )
                                                        .attr({
                                                            'data-wms_attr' : selected_primary_field[0].paramater,
                                                            'data-wms_type' : search_prefix
                                                            
                                                        })
                                                        .text( selected_primary_field[0].name )
                                                    )
                                            );
            //div.wms-items
            var wms_attr_dropdown_items = $('<div />')
                                                .addClass('wms-items')
                                                .append(
                                                    //ul.wms-list-options
                                                    $('<ul />').addClass('wms-list-options')
                                                        .attr({
                                                            'role'          : 'menu',
                                                            'aria-haspopup' : 'true'
                                                        })
                                                        //this will list out the options to be selected
                                                        .append(html_select_list)
                                                    );            
            
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

            //console.log(plugin_defaults);

            //return new array            
            return plugin_defaults;
        };
    
         // Public Method code
        plugin.foo_public_method = function() {

        };


        var construct_url = function(input_array){
            
            //input_array[attr][frmt][src]
            
            //build the URL
            var wms_params = {
                sortKey         : plugin.options.sortKey,
                databaseList    : plugin.options.databaseList,
                queryString     : input_array['attr'],
                Facet           : '',
                tricky_scope    : plugin.options.scope != '' ? plugin.options.scope     : input_array['src'] ,
                trick_format    : plugin.options.format != '' ? plugin.options.format   : input_array['frmt'],
                database        : plugin.options.database,
                author          : plugin.options.author,
                year            : plugin.options.year,
                yearFrom        : plugin.options.yearFrom,
                yearTo          : plugin.options.yearTo,
                language        : plugin.options.language,
                topic           : plugin.options.topic
                };
               
               //so here we've got to replace the scope 
                var clean_plugin = plugin.options.wms_base_url + $.param(wms_params);
                clean_plugin = clean_plugin.replace('&tricky_scope', "scope&subscope");
                clean_plugin = clean_plugin.replace('&tricky_format', "format&subformat");                
                return clean_plugin;
            
        };
        
        plugin.controller = function(){
            //this is the initializer  
            
            //create variables for search modules
            var attr_search = generate_search_field( 'attr' , 'AS', default_search_attrs, plugin.options.omit_attributes );
            var format_search = generate_search_field('frmt', 'FOR', default_search_formats , plugin.options.omit_formats  );
            var source_search = generate_search_field('src', 'IN', plugin.options.collections, plugin.options.omit_collections);
            
            //add search options to the coontainer
            wms_search_rows.append(attr_search, format_search, source_search, wms_search_submit);
            //add everything to the target element
            $element.append([wms_search_input, wms_search_rows]);
            
            $('body')
                //show dropdown
                .on('keypress click', '.wms-dropdown' , function(event){
                    if(event.keyCode == 13 || event.type == 'click'){
                        var $this = $( this );
                        console.log($this);
                        var selected_option = $this.find('.wms-list-options');
                        selected_option.slideToggle('fast');
                        $('.wms-list-options').not(selected_option).slideUp('fast');                       
                    }

                })
                //hide dropdown 
                .on('click', this, function(event){
                    var $clicked = $(event.target);
                    //console.log($clicked.parents());
                    if ( $clicked.parents('.wms-dropdown').length == 0 ){
                        $(".wms-list-options").slideUp('fast');
                    }
                })
                //select the item from the options list and set as data in the selected item
                .on('click keypress', 'li.wms-select_attr', function(event){
                    if(event.keyCode == 13 || event.type == 'click'){
                        //create variables of selected item
                        var selected_attr = $( event.target );
                        var selected_attr_data = selected_attr.attr('data-wms_attr');
                        var selected_attr_text = selected_attr.text();
                        //update the default with selected item
                        selected_attr
                            .parents('.wms-search')
                            .find('.wms-selected-item')
                            .text( selected_attr_text )
                            .attr('data-wms_attr', selected_attr_data );
 
                    }

                    
                })
                .on('click', '#wms-submit', function(event){
                    //ensure click event is cancelled
                    event.preventDefault();
                    //grab all elements

                    var selected_search_elements = '';
                    selected_search_elements = $('.wms-selected-item');
                    //console.log('new data', selected_search_elements);
                    //grab search input
                    var search_input = $('input[name="keyword"]').val();

                    //create array of selected settings to be passed. only one query to the dom
                    var scoped_search = [];
                    $.each(selected_search_elements, function(index, value){
                        if( $(value).attr('data-wms_type') == 'attr'){
                            scoped_search['attr'] = '';
                            scoped_search['attr'] = $(value).attr('data-wms_attr')+ ':' + search_input;
                            
                        }else if(  $(value).data('wms_type') == 'frmt' ){
                            scoped_search['frmt'] = '';                            
                            scoped_search['frmt'] = $(value).attr('data-wms_attr');
                            
                        }else if( $(value).data('wms_type') == 'src' ){
                            scoped_search['src'] = '';                            
                            scoped_search['src'] = $(value).attr('data-wms_attr');
                        }
                        
                    });
                    
                   var  wms_url = construct_url(scoped_search);
                   console.log(wms_url);
                   
                    //clear the variables
                    scoped_search = [];
                    selected_search_elements = '';
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
        search_box_only     : false,
        wms_base_url        : 'https://ccl.on.worldcat.org/search?',
        sortKey             : 'LIBRARY',
        databaseList        : '',
        scope               : '',
        subscope            : '',
        format              : '',
        subFormat           : '',
        database            : 'all', //required
        author              : '',
        year                : 'all', //required
        yearFrom            : '',
        yearTo              : '',
        language            : 'all', //required
        topic               : '', //topic may not be necessary
        subject             : '',
        collections         : [
            {id: 'all', name: 'General Collections', paramater: 'wz:519', order:'primary'},
            {id: 'spcl', name: 'Special Collections', paramater: 'wz:519::zs:36307'}            
            
        ],
        omit_collections    : [],
        omit_attributes     : ['n2'],
        omit_formats        : ['music'],
        searchbox_help      : 'Enter a keyword into the search box to get started',
        search_attr_help    : 'What are you searching as? Attributes help you narrow your search',
        search_source_attr  : 'Where would you like to search. Here are different collections materials to narrow your search'
    };
})(jQuery, window, document);