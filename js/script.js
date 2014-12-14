
var baseUrl = 'http://inf5750-9.uio.no/api/';

jQuery( document ).ready(function() {

    jQuery('#api-filter').fastLiveFilter('#apiListDiv ul');
    hljs.initHighlightingOnLoad();
    jQuery(".chosen-select").chosen({
        no_results_text: "Nothing found!",
        width: "100%"
    });


    /* jQuery AJAX call to get the list of APIs */
    jQuery.ajax({
        url: baseUrl + "resources.json",
        data: {username: "admin", password: "district"},
        success: function( response ) {

            response = JSON.stringify(response, null, 4);
            var dataObj = jQuery.parseJSON( response );
            dataObj = dataObj.resources;

            var html = '';
            jQuery.each(dataObj, function(index, itemData) {
                html += '<li><a href="'+ itemData.href +'.json">'+ itemData.displayName +'</a></li>';
            });
            html = '<ul class="list-unstyled">'+ html +'</ul>';

            jQuery('#apiListDiv').html(html);

            jQuery('.nano').css('height', (window.innerHeight - 114)+'px');
            jQuery('.nano').nanoScroller({ preventPageScrolling: true });
            jQuery('#api-filter').fastLiveFilter('#apiListDiv ul');

            /* handling click event to API List */
            jQuery(document).on("click", "#apiListDiv li a", function(event) {
                loadPageWithApiResponse(jQuery(this).attr('href'));
                populateNextLevelMenu(jQuery(this), jQuery(this).attr('href'));
                event.preventDefault();
            });

            jQuery(document).on("click", ".apiLink", function(event) {
                loadPageWithApiResponse(jQuery(this).attr('href'));
                event.preventDefault();
            });

            /* handling click event on Parameter submit button */
            jQuery('#button-submit').on("click", function(event) {
                var baseUrl = jQuery('#baseApiUrl').val();
                var paramName = jQuery('#paramName').val();
                var paramFields = jQuery('#paramFields').val();
                var paramUrl = '';

                if (paramName != '') {
                    paramUrl = 'query='+ paramName;
                }
                if (paramFields != null) {
                    if (paramUrl != '') { paramUrl = paramUrl +'&'; }
                    paramUrl += 'fields=';
                    for (var i=0; i<paramFields.length; i++) {
                        if (i>0) { paramUrl += ','; }
                        paramUrl += paramFields[i];
                    }
                }

                if (paramUrl != '') { paramUrl = '?'+ paramUrl; }
                loadPageWithApiResponse(baseUrl+paramUrl);

                event.preventDefault();
            });

            /* handling click event on Parameter reset button */
            jQuery('#button-reset').on("click", function(event) {
                var baseUrl = jQuery('#baseApiUrl').val();
                jQuery('#paramName').val('');
                jQuery("#paramFields").val([]);
                loadPageWithApiResponse(baseUrl);
                event.preventDefault();
            });
        }
    });

    /* json post */
    jQuery('#button-post').on("click", function(event) {

        jQuery("#post-view .message").hide();
        jQuery("#post-view .busy").hide();
        jQuery("#post-view #json_response").hide();
        var jsonUrl = jQuery('#json_href').val();
        var jsonData = jQuery('#json_data').val();

        /* validating form */
        if (jsonUrl == '') {
            jQuery("#post-view .message").html('<span class="label label-danger">Request URL is not set.</span>');
            jQuery("#post-view .message").show();
            return false;
        }
        if (/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(jsonUrl) == false) {
            jQuery("#post-view .message").html('<span class="label label-danger">Request URL is not a valid URL.</span>');
            jQuery("#post-view .message").show();
            return false;
        }
        if (jsonData == '') {
            jQuery("#post-view .message").html('<span class="label label-danger">JSON Data is not set.</span>');
            jQuery("#post-view .message").show();
            return false;
        }
        try {
            jsonData = jQuery.parseJSON(jsonData);
        } catch (e) {
            jQuery("#post-view .message").html('<span class="label label-danger">JSON Data is not in valid format.</span>');
            jQuery("#post-view .message").show();
            return false;
        }

        /* send post request to the server */
        jQuery.ajax({
            url: jsonUrl,
            type: "POST",
            data: JSON.stringify(jsonData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function( response ) {
                try {
                    var postResponse = JSON.stringify(response, null, 4);
                    var postResponseData = jQuery.parseJSON( postResponse );
                    if (postResponseData.status == 'SUCCESS') {
                        jQuery("#post-view .message").html('<span class="label label-success">JSON Data posted successfully.</span>');
                        jQuery("#post-view .message").show();
                        jQuery("#post-view #json_response p").html('<pre>'+ postResponse +'</pre>');
                        jQuery("#post-view #json_response").show();
                    }
                } catch (e) {}
            }
        });

        event.preventDefault();
    });

    /* json post */
    jQuery(document).on("click", ".delete-item", function(event) {

        var thisObject = jQuery(this);
        var dataId = jQuery(this).attr('data-id');
        var dataUrl = jQuery(this).attr('href');

        /* send post request to the server */
        jQuery.ajax({
            url: dataUrl,
            type: "DELETE",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function( response ) {
                jQuery(thisObject).parent().parent().remove();
            }
        });

        event.preventDefault();
    });

});

jQuery( window ).resize(function() {
    jQuery('.nano').css('height', (window.innerHeight - 114)+'px');
});

/* handling click event to API List */
function loadPageWithApiResponse(apiUrl) {

    /* preparing stage */
    jQuery('#welcome').hide();
    jQuery('#apiPresentation').show();
    jQuery('#paramName').val('');
    jQuery("#paramFields").val([]);

    jQuery("#json_href").val('');
    jQuery("#json_data").val('');
    jQuery("#post-view .message").hide();
    jQuery("#post-view .busy").hide();
    jQuery("#post-view #json_response").hide();

    jQuery("#table-view").html('<div class="alert alert-warning" role="alert">Loading, please wait...</div>');
    jQuery("#api-response").html('<div class="alert alert-warning" role="alert">Loading, please wait...</div>');


    /* Set API URL */
    jQuery('#api-url .url').html(apiUrl);


    /* Set Document Link */
    if (docLink.hasOwnProperty(getApiNameFromUrl(apiUrl))) {
        var documentLink = docLink[getApiNameFromUrl(apiUrl)];
        var documentLinkHtml = '<a href="'+ documentLink +'" target="_blank" title="Find API documentation for '+ getApiNameFromUrl(apiUrl) +'">'+ documentLink +'</a>';
        jQuery('#api-url .documentation').html(documentLinkHtml);
        jQuery('#api-url .documentation').parent().show();
    } else {
        jQuery('#api-url .documentation').parent().hide();
    }

    /* Set Sample Code */
    jQuery('#code-snippet code').html("&lt;script type=\"text/javascript\" src=\"https://code.jquery.com/jquery-1.11.1.min.js\"&gt;&lt;/script&gt;\n&lt;script type=\"text/javascript\"&gt;\njQuery.ajax({ \n\t url: \""+ apiUrl +"\", \n\t success: function( response ) { \n\t\t /* do your stuffs */ \n\t } \n}); \n&lt;/script&gt;");


    /* jQuery AJAX call to get the API response */
    jQuery.ajax({
        url: apiUrl,
        data: {username: "admin", password: "district"},
        success: function( response ) {

            response = JSON.stringify(response, null, 4);

            jQuery('#apiPresentationTab a:first').tab('show');
            jQuery('#api-response').html(response);

            /* JSON presentation */
            jQuery('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });
            if (jQuery('#code-snippet code span').hasClass('xml')) {
                jQuery('#code-snippet code span').removeClass('xml');
            }

            jQuery('#json_href').val(getBaseApiUrl(apiUrl));


            /* HTML table presentation */
            var apiName = getApiNameFromUrl(apiUrl);
            var dataObj = jQuery.parseJSON( response );
            dataObj = dataObj[apiName];

            if (typeof dataObj === "undefined") {

                configureCollapsible('single');
                var dataObj = jQuery.parseJSON( response );

                /* generate HTML for single Object */
                var htmlTable = '<div class="table-responsive"><table class="table single-table table-condensed table-bordered">';

                jQuery.each(dataObj, function(key, value) {

                    var printValue = '';
                    if (typeof(value) === 'object') {
                        printValue = '<pre>'+ JSON.stringify(value, null, 4) +'</pre>';
                    } else {
                        if (/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value)) {
                            printValue = '<a href="' + value + '.json" class="apiLink">' + value + '</a>';
                        } else if (isDateString(value)) {
                            printValue = isDateString(value);
                        } else {
                            printValue = value.toString();
                        }
                    }

                    htmlTable += '<tr>';
                        htmlTable += '<th>'+ toTitleCase(key) +'</th>';
                        htmlTable += '<td>'+ printValue +'</td>';
                    htmlTable += '</tr>';
                });

                htmlTable += '</table></div>';
                jQuery('#table-view').html(htmlTable);

            } else {

                /* Set Parameter Form */
                configureCollapsible('array');
                jQuery('#baseApiUrl').val(getBaseApiUrl(apiUrl));
                setFieldsSelectBox(apiUrl);


                var htmlTable = '<div class="table-responsive"><table class="table table-hover table-condensed table-bordered">';
                var htmlTableHeader = '';

                /* header */
                var headerColumnNo = 0;
                var nodeName = [];
                for(i=0; i<dataObj.length; i++) {
                    var currentHeaderColumnNo = Object.keys(dataObj[i]).length;
                    if (currentHeaderColumnNo > headerColumnNo) {
                        headerColumnNo = currentHeaderColumnNo;
                        htmlTableHeader = '';
                        nodeName = [];
                        jQuery.each(dataObj[i], function (key, value) {
                            nodeName.push(key);
                            htmlTableHeader += '<th>' + toTitleCase(key) + '</th>';
                        });
                    }
                }
                htmlTableHeader = '<thead><tr>'+ htmlTableHeader +'<th width="50">&nbsp;</th></tr></thead>';

                /* body */
                htmlTable += htmlTableHeader;
                htmlTable += '<tbody>';
                jQuery.each(dataObj, function(index, itemData) {
                    htmlTable += '<tr>';
                    currentIndex = 0;
                    jQuery.each(itemData, function(key, value) {
                        if (typeof(value) === 'object') {
                            htmlTable += '<td>'+ JSON.stringify(value); +'</td>';
                        } else {
                            if (key == nodeName[currentIndex]) {
                                if (/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value)) {
                                    value = '<a href="' + value + '.json" class="apiLink">' + value + '</a>';
                                } else if (isDateString(value)) {
                                    value = isDateString(value);
                                }
                                htmlTable += '<td>' + value + '</td>';
                            } else {
                                htmlTable += '<td>&nbsp;</td>';
                                currentIndex++;
                                if (key == nodeName[currentIndex]) {
                                    if (/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value)) {
                                        value = '<a href="' + value + '.json">' + value + '</a>';
                                    } else if (isDateString(value)) {
                                        value = isDateString(value);
                                    }
                                    htmlTable += '<td>' + value + '</td>';
                                }
                            }
                        }
                        currentIndex++;
                    });
                    /* delete column */
                    if (typeof itemData.href !== "undefined" && typeof itemData.href !== "undefined") {
                        htmlTable += '<td width="50" align="center"><a href="'+ itemData.href +'" data-id="'+ itemData.id +'" class="delete-item" onclick="return confirm(\'Do you really want to delete the item?\')"><span class="glyphicon glyphicon-trash"></span></a></td>';
                    } else {
                        htmlTable += '<td width="50">&nbsp;</td>';
                    }


                    htmlTable += '</tr>';
                });
                htmlTable += '</tbody>';

                htmlTable += '</table></div>';

                jQuery('#table-view').html(htmlTable);

            }
        }
    });
}

function populateNextLevelMenu(obj, url) {

    /* check if already loaded */
    if (jQuery(obj).parent().find('ul').length > 0) {
        jQuery(obj).parent().find('ul').slideToggle();
        return false;
    }

    url += '?paging=false';
    jQuery.ajax({
        url: url,
        success: function( response ) {

            response = JSON.stringify(response, null, 4);

            var listHtml = '';
            var apiName = getApiNameFromUrl(url);
            var dataObj = jQuery.parseJSON( response );
            dataObj = dataObj[apiName];

            if (typeof dataObj !== "undefined") {
                jQuery.each(dataObj, function (index, itemData) {
                    listHtml += '<li><a href="' + itemData.href + '.json">' + itemData.name + '</a></li>';
                });

                if (listHtml != '') { listHtml = '<ul>' + listHtml + '</ul>'; }
                listHtml = jQuery(obj).parent().html() + listHtml;
                jQuery(obj).parent().html(listHtml);

                jQuery('#api-filter').fastLiveFilter('#apiListDiv ul');
            }
        }
    });
}

function configureCollapsible(type) {
    if (type == 'single') {
        jQuery('#accordion .first').hide();
        jQuery('#accordion .last').css('border-top', '1px solid #dddddd');
        jQuery('#accordion .last').css('-webkit-border-radius', '4px 4px 4px 4px');
        jQuery('#accordion .last').css('-moz-border-radius', '4px 4px 4px 4px');
        jQuery('#accordion .last').css('border-radius', '4px 4px 4px 4px');
    } else if (type == 'array') {
        jQuery('#accordion .first').show();
        jQuery('#accordion .last').css('border-top', '0');
        jQuery('#accordion .last').css('-webkit-border-radius', '0 0 4px 4px');
        jQuery('#accordion .last').css('-moz-border-radius', '0 0 4px 4px');
        jQuery('#accordion .last').css('border-radius', '0 0 4px 4px');
    }
}

function getApiNameFromUrl(url) {
    var apiName = url.split('/');
    apiName = apiName[apiName.length - 1];
    apiName = apiName.split('.json');
    apiName = apiName[0];

    return apiName;
}

function getBaseApiUrl(url) {
    var apiName = url.split('.json');
    apiName = apiName[0] +'.json';

    return apiName;
}

function setFieldsSelectBox(url) {

    var allNodeName = [];

    // get current fields


    // get all fields name
    var baseApiUrl = getBaseApiUrl(url) +'?fields=:all&pageSize=1';
    jQuery.ajax({
        url: baseApiUrl,
        success: function( response ) {

            response = JSON.stringify(response, null, 4);

            var apiName = getApiNameFromUrl(url);
            var dataObj = jQuery.parseJSON( response );
            dataObj = dataObj[apiName];

            if (typeof dataObj !== "undefined") {
                for (i = 0; i < dataObj.length; i++) {
                    jQuery.each(dataObj[i], function (key, value) {
                        allNodeName.push(key);
                    });
                }

                /* populating select box */
                var optionHtml = '';
                for (i = 0; i < allNodeName.length; i++) {
                    optionHtml += '<option value="' + allNodeName[i] + '">' + toTitleCase(allNodeName[i]) + '</option>';
                }
                //console.log(optionHtml);
                jQuery('#paramFields').html(optionHtml);
                jQuery("#paramFields").trigger("chosen:updated");
            }
        }
    });
}

function toTitleCase(str) {
    str =  str.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
    return str.replace(/([a-z])([A-Z])/g, '$1 $2');
}

function isDateString(str) {
    if (typeof str == 'string') {
        var dateMatch = str.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/g);
        if (dateMatch) {
            return Date.parse(dateMatch[0]).toString("d MMM yyyy, hh:mm tt");
        } else {
            return false;
        }
    } else {
        return false;
    }
}

/* Documentation links */
var docLink = [];
docLink['charts'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s18.html#d5e2282';
docLink['dashboardItems'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s20.html#d5e2705';
docLink['dashboards'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s20.html';
docLink['dataApprovalLevels'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s14.html';
docLink['dataElementGroupSets'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch03s02.html#d5e4275';
docLink['dataElementGroup'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch03s02.html#d5e4275';
docLink['dataElementOperands'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch03s02.html#d5e4275';
docLink['dataElements'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch03s02.html#d5e4275';
docLink['dataSets'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s12.html';
docLink['eventCharts'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s10.html';
docLink['eventReports'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s10.html#d5e1405';
docLink['interpretationComments'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s16.html#d5e2045';
docLink['itnerpretaions'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s16.html';
docLink['maps'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s18.html#d5e2448';
docLink['mapLayers'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s18.html#d5e2448';
docLink['mapLegendSets'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s18.html#d5e2448';
docLink['mapLegends'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s18.html#d5e2448';
docLink['mapViews'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s18.html#d5e2448';
docLink['messageConversations'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s15.html';
docLink['optionSets'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch03s02.html#d5e4163';
docLink['organisationUnitGroupSets'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s35.html#d5e3721';
docLink['organisationUnitGroups'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s35.html#d5e3721';
docLink['organisationUnitLevels'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s35.html#d5e3721';
docLink['organisationUnits'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s35.html#d5e3721';
docLink['reportTables'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch03.html#reportTable';
docLink['reports'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch03.html';
docLink['trackedEntities'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s33.html';
docLink['trackedEntityAttributeGroups'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s35.html#d5e3656';
docLink['trackedEntityAttributes'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s33.html';
docLink['trackedEntityInstances'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s35.html#d5e3656';
docLink['userGroups'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s27.html';
docLink['userRoles'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s29.html';
docLink['users'] = 'https://www.dhis2.org/doc/snapshot/en/developer/html/ch01s29.html';

