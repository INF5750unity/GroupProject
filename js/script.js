
var baseUrl = 'http://inf5750-9.uio.no/api/';

jQuery( document ).ready(function() {

    jQuery('#api-filter').fastLiveFilter('#api-list');
    hljs.initHighlightingOnLoad();


    /* jQuery AJAX call to get the list of APIs */
    jQuery.ajax({
        url: baseUrl + "resources.json",
        data: {username: "admin", password: "district"},
        success: function( response ) {

            response = JSON.stringify(response, null, 4);
            var dataObj = jQuery.parseJSON( response );
            dataObj = dataObj.resources;

            //console.log( response );
            //console.log( dataObj );
            var html = '';
            jQuery.each(dataObj, function(index, itemData) {
                html += '<li><a href="'+ itemData.href +'.json">'+ itemData.displayName +'</a></li>';
            });

            jQuery('#api-list').html(html);
            jQuery('#api-filter').fastLiveFilter('#api-list');


            /* handling click event to API List */
            jQuery('#api-list li a').on("click", function(event) {

                var apiUrl = jQuery(this).attr('href');
                var apiUrlHtml = 'API URL: <code>'+ apiUrl +'</code>';

                console.log( apiUrl );
                jQuery('#api-url').html(apiUrlHtml);
                jQuery('#api-url').show();

                /* jQuery AJAX call to get the API response */
                jQuery.ajax({
                    url: apiUrl,
                    data: {username: "admin", password: "district"},
                    success: function( response ) {

                        response = JSON.stringify(response, null, 4);
                        //var dataObj = jQuery.parseJSON( response );
                        //dataObj = dataObj.resources;

                        console.log( response );
                        //console.log( dataObj );
                        jQuery('#api-response').html(response);
                        jQuery('#api-response').parent().show();

                        jQuery('pre code').each(function(i, block) {
                            hljs.highlightBlock(block);
                        });

                    }
                });

                event.preventDefault();
            });
        }
    });

});
