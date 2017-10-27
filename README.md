# WMS Searchbox generator plugin

This plugin is a fully customizable searchbox generator that allows WMS users to insert a searchbox anywhere.  

## Table of Contents

- [Installation](#installation)
- [Customization](#Customization)
- [Usage](#usage)
- [Support](#support)
- [Contributing](#contributing)

## Installation

Download or clone this project to your project directory, add `README.md`, and commit:

```sh
git clone {insert url here}
git add README.md
git commit -m "Initial commit"
```

## Customization:
- Framework: This plugin contains a fully customizable Flexbox grid framework provided by [Vivid-WebSolutions, Peter van Meijgaard ](https://flexboxgrid.vivid-websolutions.nl/), MIT Lisence. Note the source files for this are SASS. But the compiled CSS is included in the `dist/styles.style.css` folder.  This is exclusively a grid, and contains no other styling (other than the searchbox styling of course).  
- Styling: Searchbox styling is located in `src/styles/components/_searchbox.scss`, or you can style the compliled CSS file.
- Elements: There is no native HTML in this plugin, to make changes to any elements rendered, do so in the main.js document. 

## Usage

###Setup
- Required defaults (without this, nothing works)
..* At the bare minimum, the plugin needs the base URL of your WMS site, ie. https://{xyz}.on.worldcat.org/search? (xyz is your institution ID)
..* You also need the collections set: Each WMS collection contains a scope id for the main collection, ie. "wz:519", and a subscope for collections within the main collection, ie. "wz:519::zs:36307" You can find this in the URL as: "scope&subscope=wz%3A519%3A%3Azs%3A36307". For each collection, add a line to the collections array like so:
```javascript
    collections         : [
        {id: 'all', name: 'General Collections', paramater: 'wz:519', order:'primary'},
        {id: 'spcl', name: 'Special Collections', paramater: 'wz:519::zs:36307'}            
    ]
```
*Set the primary collection with this:* `order:'primary'`

###Scoped Search setup
- Scoped search is used to create a single search box that is scoped to specific paramaters. The users input will be prepended with the scoped search query in WMS.
..*  To turn on the scoped search box, set scoped_searchbox to `true` 

###Plugin Options

**Plugin Options descriptions**
```
$.fn.WMSSearch.options = {
    defaults                :{
        wms_base_url        : [string, URL parameter, REQUIRED] The base of your WMS Discover configuration, this is the URL root,
        sortKey             : [string, URL parameter, REQUIRED] Determine whether results will be sorted by. Options include "LIBRARY", "BEST_MATCH", "RECENCY"
        databaseList        : [string, URL parameter, optional] List of databases prescoped in your search. If left blank, the search       will default to your default database configuration
        collections         : [Array, Object, URL paramater, REQUIRED] Configure the collections to be searched in WMS. For each            collection added, insert an object: ` {id: 'all', name: 'General Collections', paramater: 'wz:519'}`. If no primary is set,     the plugin will default to to the first collection in this array.
    },
    scoped_search_settings      : {
        scoped_searchbox        : [boolean: TRUE or FALSE, optional] Setting this to TRUE will turn on the scoped searchbox interface
        scoped_search_title     : [string, optional] This is the title of your scoped searchbox
        scoped_search_desc      : [string, optional] Description that adds additional contextual information to the scoped searchbox
        scoped_search_scoping   : [string, search paramater, REQUIRED] !important - this is the paramater that will prepend the user's     search 
        scoped_search_collection  : [string, search paramater] ID location of the collection you are targeting
        scoped_search_format    : [string, search paramater] Attribute type for searching. ie. keyword, title, author, etc. the             resulting search query will be prepended with that attribute search type.
        scoped_search_boolean   : [string, search paramater] Standard boolean (AND, NOT, OR)
    },
    additional_settings :{
        database            : [string, search paramater, REQUIRED] Set default to 'all'. Or use this to scope to a  specific database
        author              : [string, search paramater, optional facet] scope in facets to a specific author
        year                : [string/number, facet parameter, REQUIRED ] Set detault to 'all'. Scope to specific year
        yearFrom            : [string/number, facet parameter, optional facet] Set start of scoping by year
        yearTo              : [string/number, facet parameter, optional facet] Set end of scoping by year
        language            : [string, facet parameter, REQUIRED] Set detault to 'all'. Scope to specific language
        topic               : [string, facet parameter, optional] May not be necessary, but scope to specific subject heading

        omit_attributes     : [string, search parameters list, optional] To remove an attribute option from the dropdown menu, add the     attribute ID to the array here. These values correspond to the OCLC search attribute options. Options include:
                                kw = Keyword
                                ti = Title
                                au = Author
                                bn = ISBN
                                su = Subject
                                no = OCLC Number
                                so = Journal Source
                                yr = Year
                                n2 = ISSN
                                nu = Call number
                                
        omit_formats        : [string, search paramaters list, optional] To remove a search format from the dropdown menu, add the         attribute ID to the array here. Options include:
                                all = Everything, all format types
                                book = Print books
                                ebook = eBooks
                                dvd = DVDs
                                journal = Journal/Magazine
                                music = Musical Scores
                                
        searchbox_help      : 'Enter a keyword into the search box to get started',
        search_attr_help    : 'What are you searching as? Attributes help you narrow your search',
        search_source_attr  : 'Where would you like to search. Here are different collections materials to narrow your search'
    }
};
```

**Example of a typical plugin options setup**
```javascript
$.fn.WMSSearch.options = {
    defaults                :{
        wms_base_url        : 'https://ccl.on.worldcat.org/search?',
        sortKey             : 'LIBRARY',
        databaseList        : '',
        collections         : [
            {id: 'all', name: 'General Collections', paramater: 'wz:519', order:'primary'},
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
        omit_collections    : [],
        searchbox_help      : 'Enter a keyword into the search box to get started',
        search_attr_help    : 'What are you searching as? Attributes help you narrow your search',
        search_source_attr  : 'Where would you like to search. Here are different collections materials to narrow your search'
    }
};
```

###Call the plugin
- Calling the plugin is super easy to do in your code editor
```javascript
<script type="text/javascript">
    
(function(window, $){

    $(document).ready(function(){

       $('.loadWMS').WMSSearch({
            /*
            *Your custom settings here
            */
       }); 
    });        

})(this, jQuery);

```
## Support

Please [open an issue](https://github.com/fraction/readme-boilerplate/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/fraction/readme-boilerplate/compare/).
