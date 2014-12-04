
var baseUrl = 'http://inf5750-9.uio.no/api/';

$( document ).ready(function() {

    /* jQuery AJAX call to get the list of APIs */
    $.ajax({
        url: baseUrl + "resources.json",
        data: {username: "admin", password: "district"},
        success: function( response ) {
            console.log(baseUrl + "resources.json");
            console.log( JSON.stringify(response, null, 4) );
            //alert(response);
        }
    });

    //$(".highlight").html(JSON.stringify(jsonCode, null, 4));

});

/*
var jsonCode = {
    "pager": {"page": 1, "pageCount": 1, "total": 5},
    "dataElementGroupSets": [{
        "id": "jp826jAJHUc",
        "created": "2011-12-24T11:24:25.124+0000",
        "name": "Diagnosis",
        "lastUpdated": "2013-03-20T12:15:08.002+0000",
        "href": "http://inf5750-9.uio.no/api/dataElementGroupSets/jp826jAJHUc"
    }, {
        "id": "XY1vwCQskjX",
        "created": "2011-12-24T11:24:25.124+0000",
        "name": "Main data element groups",
        "lastUpdated": "2013-03-20T11:59:54.664+0000",
        "href": "http://inf5750-9.uio.no/api/dataElementGroupSets/XY1vwCQskjX"
    }, {
        "id": "lv8UXn17ZOm",
        "created": "2011-12-24T11:24:25.124+0000",
        "name": "Morbidity/Mortality",
        "lastUpdated": "2013-03-15T15:08:57.586+0000",
        "href": "http://inf5750-9.uio.no/api/dataElementGroupSets/lv8UXn17ZOm"
    }, {
        "id": "d845J2iVqTO",
        "created": "2011-12-24T11:24:25.124+0000",
        "name": "PMTCT",
        "lastUpdated": "2013-03-15T15:08:57.591+0000",
        "href": "http://inf5750-9.uio.no/api/dataElementGroupSets/d845J2iVqTO"
    }, {
        "id": "VxWloRvAze8",
        "created": "2013-04-09T12:48:18.126+0000",
        "name": "Tracker-based data",
        "lastUpdated": "2013-04-09T12:48:18.126+0000",
        "href": "http://inf5750-9.uio.no/api/dataElementGroupSets/VxWloRvAze8"
    }]
};*/
