// $(document).ready(function() {
//     loading_screen.finish();
// });


function colorPal(val){
    val = parseInt(val)
    if ((val)%2 == 0) {
        return (val)/2;
    }
    else if ((val)%2 == 1){
        return (val+1)/2;
    }

}

function roundUpToK(number) {
     return parseFloat((number / 1000).toFixed(0)).toFixed(0) + ' K';
}

var PROGRAM_ID = 3006
var tagElementMap = getTagElementMap(PROGRAM_ID);


var project_hierarchy_name = getProjectNameMap(PROGRAM_ID);

var projectHierarchyMap;

var promiseObjabc = getProjectMapAsync(PROGRAM_ID);
$.when(promiseObjabc).then(function(value1) {
    projectHierarchyMap = createProjectMap(value1);

    generateFilters();

});

var getTagElementMap = function(programId) {
    var mapObj = {};
    $.ajax({
        url: 'https://api.p3fy.com/api/programs?filter={"include":{"tags":"tagElements"},"where":{"id":' + programId + '}}&access_token=' + ACCESS_TOKEN,
        method: 'GET',
        dataType: 'json',
        async: false,
        success: function(result) {
            for (var i = 0; i < result[0]["tags"].length; i++) {
                for (var j = 0; j < (result[0]["tags"][i]["tagElements"]).length; j++) {
                    if (mapObj.hasOwnProperty(result[0]["tags"][i]["tagElements"][j]["id"])) {} else {
                        mapObj[result[0]["tags"][i]["tagElements"][j]["id"]] = result[0]["tags"][i]["tagElements"][j]["name"];
                    }
                }
            }
        },
        error: function() {
            console.log("Error in getTagElementMap function.");
        }
    })
    return mapObj;
}

function flattendPayload(payload) {
    for(var index in payload) {
        var data = payload[index].data;
        payload[index]["project"] = payload[index].projectId;
        payload[index]["recordId"] = payload[index].id;

        delete payload[index].data;
        delete payload[index].projectId
        delete payload[index].id
        
        for(var dataIndex in data) {
            payload[index][dataIndex] = data[dataIndex];
        } 
    }
    //console.log("Result Payload :: " ,payload);
    return payload;
}

function truncateNumber(number) {
    if (number >= 1000 && number < 100000) {
        return (number / 1000).toFixed(2) + ' K'
    }
    else if (number >= 100000 && number < 10000000) {
        return (number / 100000).toFixed(2) + ' L'
    }
    else if (number >= 10000000) {
        return (number / 10000000).toFixed(2) + ' Cr'
    }
    else return (number)
}

function truncateNumber2(number) {
    if (number >= 1000 && number < 1000000) {
        return (number / 1000).toFixed(2) + ' K'
    }
    else if (number >= 1000000) {
        return (number / 1000000).toFixed(2) + ' M'
    }
    else return (number)
}

function getProfileInstanceDataAsync(input, fields, host)
{
    var countQuery = "";
    var finalQuery = "";
    var profileId = 0;
    var apiUrl = "";

    if(host != undefined)
    {
        apiUrl = host;
    }
    else
    {
        apiUrl = "thinker.goodera.com";
    }

    if(input != undefined)
    {
        if(Number.isInteger(input))
        {
            profileId = input;
            countQuery = '{"profileId":' + input + '}';
            finalQuery = '{"where":{"profileId":' + input + '}';
            if(fields != undefined && Array.isArray(fields) && fields.length > 0)
            {
                finalQuery += ',"fields":[' + '"' + fields.join('","') + '"' + ']';
            }
            finalQuery += '}';
            finalQuery = JSON.parse(finalQuery);
        }
        else if(input === Object(input) && input.hasOwnProperty("where"))
        {
            if(input.where.hasOwnProperty("profileId"))
            {
                profileId = input.where.profileId;
            }
            countQuery = JSON.stringify(input.where);
            finalQuery = input;
        }
        else
        {
            ErrorLog.print("Invalid input provided for getting Profile Instance Data");
        }
    }
    else
    {
        ErrorLog.print("No input provided for getting Profile Instance Data");
    }
    var getRecordCount = function(query) {
            var promise = $.ajax(
                        {
                            url: 'https://' + apiUrl + '/aggregate/count?where=' + query + '&access_token=' + ACCESS_TOKEN,
                            method: 'GET',
                            dataType: 'json',
                            async: true,
                            success: function(res) {
                            },
                            error: function(xhr, status, error) {
                                if(xhr.responseJSON != undefined)
                                {
                                    ErrorLog.print("Error in getting Number of ProfileInstances: " + xhr.responseJSON.error.status + " : " + xhr.responseJSON.error.message);
                                }
                                else
                                {
                                    ErrorLog.print("Error in getting data");
                                }
                            }
                        });
            return promise;
        };
    var getData = function(query, profileId) {
            var promise = $.ajax(
                        {
                            url: 'https://' + apiUrl + '/aggregate/find?filter=' + query + '&access_token=' + ACCESS_TOKEN,
                            method: 'GET',
                            dataType: 'json',
                            async: true,
                            success: function(res) {
                                if(res != undefined)
                                {
                                    var temp = [];
                                    temp[0] = "profileInstances";
                                    temp[1] = profileId;
                                    res.unshift(temp);
                                }
                            },
                            error: function(xhr, status, error) {
                                if(xhr.responseJSON != undefined)
                                {
                                    ErrorLog.print("Error in getting ProfileInstance Data: " + xhr.responseJSON.error.status + " : " + xhr.responseJSON.error.message);
                                }
                                else
                                {
                                    ErrorLog.print("Error in getting data");
                                }
                            }
                        });
            return promise;
        };
    var promiseObj;
    try
    {
        promiseObj = $.when(getRecordCount(countQuery)).then(function(response)
        {
            var count = 0;
            var promiseArray = [];
            if(response != undefined && response.count != undefined)
            {
                count = response.count;
            }
            for(var i = 0; i <= count; i = i + 1000)
            {
                finalQuery["skip"] = i;
                finalQuery["limit"] = 1000;
                promiseArray.push(getData(JSON.stringify(finalQuery), profileId));
            }
            return promiseArray;
        });
    }
    catch(error)
    {
        ErrorLog.print("Exception in getting Profile Instance Data: " + error);
    }
    return promiseObj;
}

function getProfileInstances(profileId) {
    var mapObj = [];
    $.ajax({
        url: 'https://api.p3fy.com/api/profileInstances?filter={"where":{"profileId":' + profileId + '}}&access_token=' + ACCESS_TOKEN,
        method: 'GET',
        dataType: 'json',
        async: false,
        success: function(result) {
            mapObj = result;
        },
        error: function() {
            console.log("Error in getting getProfileInstanceData");
        }
    });
    return mapObj;
}
//console.log(getProfileInstances(18714))

var profileArray = [18117, 17695, 40728, 36994];
var firstresolveArray = [];
var firstPromiseArray = [];

for (var i in profileArray) {
    firstPromiseArray.push(getProfileInstanceDataAsync(profileArray[i]));    
}
for (var i in firstPromiseArray) {
    firstresolveArray.push(firstPromiseArray[i]);
}

var payload_18117 = []
var payload_17695 = []
var payload_40728 = []
var payload_36994 = []

var profileIds = [18117];
var lastModifiedDate = getLastModifiedProfile(profileIds);
var tempDate = new Date(lastModifiedDate.slice(0, 10));
var finalModifiedDate = String(tempDate).slice(0, 15);
$('#lastUpdated').html(finalModifiedDate);


var budgetQuestTags = getSpecificTagData(23319)
var budgetCIITags = getSpecificTagData(22947)
var budgetAksharaTags = getSpecificTagData(23472)
var budgetPBTags = getSpecificTagData(23506)
var budgetSLFTags = getSpecificTagData(23552)
var budgetYFSTags = getSpecificTagData(27381)
var budgetEITags = getSpecificTagData(27437)
var budgetEPTags = getSpecificTagData(27919)
var budgetFNFTags = getSpecificTagData(27920)
var budgetIAHVTags = getSpecificTagData(27921)
////////////////////////////////
var stateTags = getSpecificTagData(23295)
var finYearTags = getChildParentMapTag(22857)["null"]
var quarterTags = getChildParentMapTag(23336)["null"]
var centerTags = getSpecificTagData(22940)
//console.log(centerTags);

function removeNull(val) {
    if (!val)
        return 0;
    else
        return val;
}

Promise.all(firstresolveArray).then(function(result) {
    var promiseArr = [];
    for (var i in result){
        promiseArr = promiseArr.concat(result[i]);
    }
    Promise.all(promiseArr).then(function(value) {
        for (var i in value) {
            if (Array.isArray(value[i])) {
                if (value[i][0][0] == "profileInstances") {
                    if (value[i][0][1] == 18117) {
                        value[i].shift();
                        payload_18117 = payload_18117.concat(value[i]);
                    }
                    if (value[i][0][1] == 17695) { 
                        value[i].shift();
                        payload_17695 = payload_17695.concat(value[i]);
                    }
                    if (value[i][0][1] == 40728) { 
                        value[i].shift();
                        payload_40728 = payload_40728.concat(value[i]);
                    }
                    if (value[i][0][1] == 36994) { 
                        value[i].shift();
                        payload_36994 = payload_36994.concat(value[i]);
                    }
                }
            }
        }
        payload_18117 = flattendPayload(payload_18117);
        payload_17695 = flattendPayload(payload_17695);
        payload_40728 = flattendPayload(payload_40728);
        payload_36994 = flattendPayload(payload_36994);

        generateFilters();
        create_big_card();
        generateCards();
        generateBars();
        generateTables();
        generateFunnel();
        generateCarousel()
    });
});

yearFilter = finYearTags[0];
themeFilter = "all";
// $("#to_hide").hide();

ngoFilter = "Quest Alliance";
currencyFilter = "Dollars";


$("#ngoFilter").on('change', function() {
    ngoFilter = this.value;
    // create_big_card();
    // generateCards();
    // generateBars();
    // generateMap();
    generateTables();
});


$("#currencyFilter").on('change', function() {
    currencyFilter = this.value;
    create_big_card();
    generateCards();
    generateBars();
    generateTables();
    generateFunnel();
});

$("#yearFilter").on('change', function() {
    yearFilter = this.value;
    create_big_card();
    generateCards();
    generateBars();
    generateTables();
    generateFunnel();
});

$("#themeFilter").on('change', function() {
    themeFilter = this.value;
    if (themeFilter == "all") {
        // $("#to_hide").hide();
        var tempHtmlx = '<option value="Quest Alliance">Quest Alliance</option>';
        tempHtmlx += '<option value="CII Foundation">CII Foundation</option>';
        tempHtmlx += '<option value="Akshara">Akshara</option>';
        tempHtmlx += '<option value="Pratham Books">Pratham Books</option>';
        tempHtmlx += '<option value="SaveLife Foundation">SaveLife Foundation</option>';
        tempHtmlx += '<option value="Youth For Seva">Youth For Seva</option>';
        tempHtmlx += '<option value="Enable India">Enable India</option>';
        tempHtmlx += '<option value="End Poverty">End Poverty</option>';
        tempHtmlx += '<option value="FICCI">FICCI</option>';
        tempHtmlx += '<option value="IAHV">IAHV</option>';
        $("#ngoFilter").html(tempHtmlx);
        $('#ngoFilter').val("Quest Alliance").trigger('change');
    } else {
        if (themeFilter == "Critical Human Needs") {
            var tempHtmlx = '<option value="SaveLife Foundation">SaveLife Foundation</option>';
            tempHtmlx += '<option value="IAHV">IAHV</option>';
            $("#ngoFilter").html(tempHtmlx);
            $('#ngoFilter').val("SaveLife Foundation").trigger('change');
        }
        if (themeFilter == "Economic Empowernment") {
            var tempHtmlx = '<option value="CII Foundation">CII Foundation</option>';
            tempHtmlx += '<option value="Quest Alliance">Quest Alliance</option>';
            tempHtmlx += '<option value="Enable India">Enable India</option>';
            tempHtmlx += '<option value="End Poverty">End Poverty</option>';
            tempHtmlx += '<option value="FICCI">FICCI</option>';

            $("#ngoFilter").html(tempHtmlx);
            $('#ngoFilter').val("CII Foundation").trigger('change');
        }
        if (themeFilter == "Education") {
            var tempHtmlx = '<option value="Akshara">Akshara</option>';
            tempHtmlx += '<option value="Pratham Books">Pratham Books</option>';
            tempHtmlx += '<option value="Youth For Seva">Youth For Seva</option>';
            $("#ngoFilter").html(tempHtmlx);
            $('#ngoFilter').val("Akshara").trigger('change');
        }
        // $("#to_hide").show();
    }
    create_big_card();
    generateCards();
    generateBars();
    generateTables();
    generateFunnel();
});

// $('#yearFilter').val(defaultYear).trigger('change');


function generateFilters() {
    var tempHtml1 = "";
    // for (i in finYearTags) {
    //     tempHtml1 += '<option value="' + finYearTags[i] + '">' + tagElementMap[finYearTags[i]] + '</option>';
    // }
    tempHtml1 += '<option value="' + finYearTags[0] + '">' + tagElementMap[finYearTags[0]] + '</option>';

    $("#yearFilter").html(tempHtml1);
    // $("#yearFilter").select2();
    ////////////////////////////////

    var array_theme = [];

    for (var i in projectHierarchyMap) {
        if (projectHierarchyMap[i].parent == 15054) {
            array_theme.push(projectHierarchyMap[i].name);
        }
    }
    array_theme.sort();
    // console.log(array_theme);
    var tempHtml3 = '<option value="all">All Themes</option>';
    // var tempHtml3 = "";
    for (i in array_theme) {
        tempHtml3 += '<option value="' + array_theme[i] + '">' + array_theme[i] + '</option>';
    }
    //console.log(tempHtml3);
    $("#themeFilter").html(tempHtml3);
    // $("#themeFilter").select2();
    //////////////////////////////////

    // $("#currencyFilter").select2();

}


function create_big_card() {

    if (currencyFilter == "INR") {


        var filter_18117 = payload_18117.filter(instance => (yearFilter == "all" || instance.financial_year == yearFilter));

        var total = 0;
        var utilised = 0;
        var repurposed = 0;
        var carried = 0;

        for (var i in filter_18117) {
            total += removeNull(filter_18117[i].proposed_amount);
            utilised += removeNull(filter_18117[i].actual_expense)
            repurposed += removeNull(filter_18117[i].amount_repurposed)
            carried += removeNull(filter_18117[i].amt_carried_fwd)
        }


        // $("#disb").html('$' + getCommas(total));
        // $("#allo").html('$' + getCommas(total));
        ////////////////////////////////////////////////////////////////////////


        var bar_col = [
            ['Total amount', total, total, utilised, repurposed, carried]
        ];

        var bar_qtr = ['Grant amount', 'Disbursed amount', 'Utilized amount', 'Un utilized amount', 'Carried forward'];


        // var chart = c3.generate({
        //     bindto: '#chartx',
        //     data: {
        //         columns: bar_col,
        //         type: 'bar'
        //     },
        //     axis: {
        //         x: {
        //             type: 'category',
        //             categories: bar_qtr
        //         },
        //         y: {
        //             tick: {

        //                 format: function(d) {
        //                     return ('₹ ' + (d / 1000).toFixed(0) + 'K');
        //                 }
        //             }
        //         },
        //         rotated: true
        //     },
        //     padding: {
        //         bottom: 40
        //     },
        //     color: {
        //         pattern: ['#4472C4']
        //     }
        // });
        

    var chartm = c3.generate({
        bindto: '#chartx',
        data: {
            columns: bar_col,
            type: 'bar',
            labels: {
                format: function(d) {
                    return ('₹ ' + truncateNumber(d));
                }
            },
        //     labels: {
        //     format: {
        //         'Grant amount': function (v, id, i, j) { 
        //             var format = d3.format(',');
        //             var locale = 'en-IN';
        //             return v.toLocaleString(locale);
        //         },

        //         'Disbursed amount': function (v, id, i, j) { 
        //             var format = d3.format(',');
        //             var locale = 'en-IN';
        //             return v.toLocaleString(locale);
        //         },

        //         'Utilized amount': function (v, id, i, j) { 
        //             var format = d3.format(',');
        //             var locale = 'en-IN';
        //             return v.toLocaleString(locale);
        //         }
        //     }
        // },

        },
        axis: {
            x: {
                type: 'category',
                categories: bar_qtr
            },
            y: {
                tick: {

                    format: function(d) {
                        return ('₹ ' + putCommas(d));
                    }
                }
            },
            rotated: true
        },
        
        tooltip: {
            format: {
                value: function(value, ratio, id) {
                    var format = d3.format(',');
                    var locale = 'en-IN';
                    return '₹ '+ value.toLocaleString(locale);
                }
            }
        },
        padding: {
            bottom: 20
        },
        color: {
            pattern: ['#4472C4']
        }
    });
        /////////////////////////////////////////////////////////////////////////


        var pie_col = [];

        for (var i in projectHierarchyMap) {
            if (projectHierarchyMap[i].parent == 15054) {
                pie_col.push([projectHierarchyMap[i].name, 0])
            }
        }

        for (var i in filter_18117) {

            if (ifChildItself(filter_18117[i].project, pie_col[0][0])) {
                pie_col[0][1] += removeNull(filter_18117[i].proposed_amount);
            }

            if (ifChildItself(filter_18117[i].project, pie_col[1][0])) {
                pie_col[1][1] += removeNull(filter_18117[i].proposed_amount);
            }

            if (ifChildItself(filter_18117[i].project, pie_col[2][0])) {
                pie_col[2][1] += removeNull(filter_18117[i].proposed_amount);
            }

        }

        var chart = c3.generate({
            bindto: '#chart1',
            data: {
                // iris data from R
                columns: pie_col,
                type: 'donut',
            },
            // tooltip: {
            //     format: {
            //         value: function(value, ratio, id) {
            //             var format = d3.format('s');
            //             return format(value);
            //         }
            //     },
            //     format: {
            //         value: function(value, ratio, id) {
            //             // if ($('#currfilter').val() == 'dol') {
            //             return ('₹ ' + (value / 1000).toFixed(1) + 'K');
            //             // } else {
            //             //     if (conversion[$('#yearfilter').val()]) {
            //             //         return ('₹ ' + (value * conversion[$('#yearfilter').val()] / 1000).toFixed(1) + 'k');
            //             //     } else {
            //             //         return ('₹ ' + (value / 1000).toFixed(1) + 'k');
            //             //     }
            //             // }
            //         }
            //     }
            // },
        tooltip: {
            format: {
                value: function(value, ratio, id) {
                    var format = d3.format(',');
                    var locale = 'en-IN';
                    return '₹ ' + value.toLocaleString(locale);
                }
            }
        },
            color: {
                pattern: ['#21618C', '#2E86C1', '#5DADE2']
            }
        });
        //////////////////////////Progress bar donuts//////////////////////////////////

        var filter_40728 = payload_40728.filter(instance => (yearFilter == "all" || instance.financial_year == yearFilter));
        var filter_36994 = payload_36994.filter(instance => (yearFilter == "all" || instance.financial_year == yearFilter));

        var direct_utilized_sum = [0,0,0]
        var overheads_utilized_sum = [0,0,0]
        var total_utilized_sum = [0,0,0]
        var budget_sum = [0,0,0]
        var pie1_col = [['Utilized',0],['Unutilized',0]]
        var pie2_col = [['Utilized',0],['Unutilized',0]]
        var pie3_col = [['Utilized',0],['Unutilized',0]]

        var data_columns = [ ['1', 1], ['2', 1], ['3', 1],['4', 1],['5', 1],['6', 1],['7', 1],['8', 1],['9', 1],['10', 1],['11', 1],['12', 1],['13', 1],['14', 1],['15', 1],['16', 1],['17', 1],['18', 1],['19', 1],['20', 1],['21', 1],['22', 1],['23', 1],['24', 1],['25', 1],['26', 1],['27', 1],['28', 1],['29', 1],['30', 1],['31', 1],['32', 1],['33', 1],['34', 1],['35', 1],['36', 1],['37', 1],['38', 1],['39', 1],['40', 1],['41', 1],['42', 1],['43', 1],['44', 1],['45', 1],['46', 1],['47', 1],['48', 1],['49', 1],['50', 1] ]
        
        for(var i in filter_40728){
            if (filter_40728[i].theme == 568631) {
                direct_utilized_sum[0] += removeNull(filter_40728[i].direct_utilized)
                overheads_utilized_sum[0] += removeNull(filter_40728[i].overheads_utilized)
            }
            if (filter_40728[i].theme == 568632) {
                direct_utilized_sum[1] += removeNull(filter_40728[i].direct_utilized)
                overheads_utilized_sum[1] += removeNull(filter_40728[i].overheads_utilized)
            }
            if (filter_40728[i].theme == 568633) {
                direct_utilized_sum[2] += removeNull(filter_40728[i].direct_utilized)
                overheads_utilized_sum[2] += removeNull(filter_40728[i].overheads_utilized)
            }
        }

        for(var i in filter_36994){
            if (filter_36994[i].theme == 568631) {
                budget_sum[0] += removeNull(filter_36994[i].budget)
            }
            if (filter_36994[i].theme == 568632) {
                budget_sum[1] += removeNull(filter_36994[i].budget)
            }
            if (filter_36994[i].theme == 568633) {
                budget_sum[2] += removeNull(filter_36994[i].budget)
            }
        }
        
        total_utilized_sum[0] = removeNull((direct_utilized_sum[0]+overheads_utilized_sum[0]))
        pie1_col[0][1] = removeNull(total_utilized_sum[0]/budget_sum[0])
        pie1_col[1][1] = removeNull(1-pie1_col[0][1])

        total_utilized_sum[1] = removeNull((direct_utilized_sum[1]+overheads_utilized_sum[1]))
        pie2_col[0][1] = removeNull(total_utilized_sum[1]/budget_sum[1])
        pie2_col[1][1] = removeNull(1-pie2_col[0][1])

        total_utilized_sum[2] = removeNull((direct_utilized_sum[2]+overheads_utilized_sum[2]))
        pie3_col[0][1] = removeNull(total_utilized_sum[2]/budget_sum[2])
        pie3_col[1][1] = removeNull(1-pie3_col[0][1])
        
        
        var temp = [pie1_col[0][1]*100, pie2_col[0][1]*100, pie3_col[0][1]*100]

        var dataColor = [
            ['#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0'],
            ['#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0'],
            ['#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0']
        ]
        
        var colorFilled = []
        for (var i in temp){
            colorFilled = colorFilled.concat(colorPal(temp[i].toFixed(0)))
            
        }
       
        for(i = 0; i < colorFilled[0]; i++){
            dataColor[0][i] = "#7395D3";
        }
        for(i = 0; i < colorFilled[1]; i++){
            dataColor[1][i] = "#21618C";
        }
        for(i = 0; i < colorFilled[2]; i++){
            dataColor[2][i] = "#2E86C1";
        }

        var chart_a = c3.generate({
            bindto: "#chart_a",
            data: {
                columns: data_columns,
                type : 'donut',
                order: null
                
            },
            tooltip: {
                show: false
            },
            color: {
                    pattern: dataColor[0]
            },
            donut: {
              label: {
                show: false
              },
              title: '₹ '+ truncateNumber(total_utilized_sum[0]) + ' (' + temp[0].toFixed(0)+"%" +')'
            },
            legend: {
              show: false
            },
            interaction: {
              enabled: false
            }
        });

        var chart_b = c3.generate({
            bindto: "#chart_b",
            data: {
                columns: data_columns,
                type : 'donut',
                order: null
                
            },
            tooltip: {
                show: false
            },
            color: {
                pattern: dataColor[1]
            },
            donut: {
              label: {
                show: false
              },
              title: '₹ '+truncateNumber(total_utilized_sum[1]) + ' (' + temp[1].toFixed(0)+"%" +')'
            },
            legend: {
              show: false
            },
            interaction: {
              enabled: false
            }
        });

        var chart_c = c3.generate({
            bindto: "#chart_c",
            data: {
                columns: data_columns,
                type : 'donut',
                order: null
                
            },
            tooltip: {
                show: false
            },
            color: {
                pattern: dataColor[2],
            },
            donut: {
              label: {
                show: false
              },
              title: '₹ '+truncateNumber(total_utilized_sum[2]) + ' (' + temp[2].toFixed(0)+"%" +')'
            },
            legend: {
              show: false
            },
            interaction: {
              enabled: false
            }
        });

       
        ////////////////////////////////////////////////////////////
        var bar_col = [
            ['Grant'],
            ['Utilized'],
            ['Carried Forward'],
            ['Un utilized']
        ];

        var bar_qtr = [];

        var projectThemes = [];

        for(var payload in payload_18117){
            if(payload_18117[payload].financial_year && payload_18117[payload].financial_year == 337022){
                if(projectThemes.indexOf(payload_18117[payload].project + "") < 0){
                    projectThemes.push(payload_18117[payload].project + "");
                }
            }
        }

        for (var i in projectHierarchyMap) {
            if (themeFilter == "all") {
                if (project_hierarchy_name[projectHierarchyMap[i].parent] == "Critical Human Needs" || project_hierarchy_name[projectHierarchyMap[i].parent] == "Economic Empowernment" || project_hierarchy_name[projectHierarchyMap[i].parent] == "Education") {
                    if(projectThemes.indexOf(i+"") > -1){
                        bar_col[0].push(0);
                        bar_col[1].push(0);
                        bar_col[2].push(0);
                        bar_col[3].push(0);
                        bar_qtr.push(projectHierarchyMap[i].name);
                    }

                }
            } else if (project_hierarchy_name[projectHierarchyMap[i].parent] == themeFilter) {
                if(projectThemes.indexOf(i+"") > -1){
                    bar_col[0].push(0);
                    bar_col[1].push(0);
                    bar_col[2].push(0);
                    bar_col[3].push(0);
                    bar_qtr.push(projectHierarchyMap[i].name);
                }
            }
        }

        for (var i in filter_18117) {
            for (var j in bar_qtr.sort()) {
                if (ifChildItself(filter_18117[i].project, bar_qtr[j])) {
                    bar_col[0][1 + parseInt(j)] += removeNull(filter_18117[i].proposed_amount);
                    bar_col[1][1 + parseInt(j)] += removeNull(filter_18117[i].actual_expense);
                    bar_col[2][1 + parseInt(j)] += removeNull(filter_18117[i].amt_carried_fwd);
                    bar_col[3][1 + parseInt(j)] += removeNull(filter_18117[i].amount_repurposed);
                }
            }
        }

        // var chart = c3.generate({
        //     bindto: '#chart2',
        //     data: {
        //         columns: bar_col,
        //         type: 'bar'
        //     },
        //     axis: {
        //         x: {
        //             type: 'category',
        //             categories: bar_qtr
        //         },
        //         y: {
        //             // label: {
        //             //     text: 'In Thousands',
        //             //     position: 'outer-middle'
        //             // },
        //             tick: {

        //                 format: function(d) {
        //                     // return (d / 1000).toFixed(1) + 'k';
        //                     // if ($('#currfilter').val() == 'dol') {
        //                     return ('₹ ' + (d / 1000).toFixed(2) + 'K');
        //                     // } else {
        //                     //     if (conversion[$('#yearfilter').val()]) {
        //                     //         return ('₹ ' + (d * conversion[$('#yearfilter').val()] / 1000).toFixed(2) + 'k');
        //                     //     } else {
        //                     //         return ('₹ ' + (d / 1000).toFixed(2) + 'k');
        //                     //     }
        //                     // }
        //                 }
        //             }
        //         }
        //     },
        //     padding: {
        //         bottom: 40
        //     },
        //     color: {
        //         pattern: ['#A5A5A5', '#5B9BD5', '#4472C4']
        //     }
        // });


    var chartm = c3.generate({
        bindto: '#chart2',
        data: {
            columns: bar_col,
            type: 'bar',
            // labels: {
            //     format: function(d) {
            //         return ('₹ ' + truncateNumber(d));
            //     }
            // },
        },
        axis: {
            x: {
                type: 'category',
                categories: bar_qtr
            },
            y: {
                tick: {

                    format: function(d) {
                        return ('₹ ' + putCommas(d));
                    }
                }
            }
        },
        
        tooltip: {
            format: {
                value: function(value, ratio, id) {
                    if(id=='Grant'){
                        data=100;
                        grantval=value;
                    }
                    if(id=='Utilized'){
                        data=(value*100/grantval).toFixed(0);
                        
                    }if(id=='Carried Forward'){
                        data=(value*100/grantval).toFixed(0);
                    }if(id=='Un utilized'){
                        data=(value*100/grantval).toFixed(0);
                        
                    }console.log(value)
                    var format = d3.format(',');
                    var locale = 'en-IN';
                    return '₹ '+ value.toLocaleString(locale)  + ' ' + '(' + data +'%' + ')';
                }
            }
        },
        padding: {
            bottom: 20
        },
        color: {
            pattern: ['#A5A5A5', '#5B9BD5', '#4472C4', '#2B5592']
        }
    });

    } else {


        var filter_18117 = payload_18117.filter(instance => (yearFilter == "all" || instance.financial_year == yearFilter));

        var total = 0;
        var utilised = 0;
        var repurposed = 0;
        var carried = 0;

        for (var i in filter_18117) {
            total += removeNull(filter_18117[i].proposed_amount);
            utilised += removeNull(filter_18117[i].actual_expense)
            repurposed += removeNull(filter_18117[i].amount_repurposed)
            carried += removeNull(filter_18117[i].amt_carried_fwd)
        }


        // $("#disb").html('$' + getCommas(total));
        // $("#allo").html('$' + getCommas(total));
        ////////////////////////////////////////////////////////////////////////


        var bar_col = [
            ['Total amount', (total / 65).toFixed(2), (total / 65).toFixed(2), (utilised / 65).toFixed(2), (repurposed / 65).toFixed(2), (carried / 65).toFixed(2)]
        ];

        var bar_qtr = ['Grant amount', 'Disbursed amount', 'Utilized amount', 'Un utilized amount', 'Carried forward'];


        // var chart = c3.generate({
        //     bindto: '#chartx',
        //     data: {
        //         columns: bar_col,
        //         type: 'bar'
        //     },
        //     axis: {
        //         x: {
        //             type: 'category',
        //             categories: bar_qtr
        //         },
        //         y: {
        //             // label: {
        //             //     text: 'In Thousands',
        //             //     position: 'outer-middle'
        //             // },
        //             tick: {

        //                 format: function(d) {
        //                     // return (d / 1000).toFixed(1) + 'k';
        //                     // if ($('#currfilter').val() == 'dol') {
        //                     return ('$ ' + (d / 1000).toFixed(0) + 'K');
        //                     // } else {
        //                     //     if (conversion[$('#yearfilter').val()]) {
        //                     //         return ('₹ ' + (d * conversion[$('#yearfilter').val()] / 1000).toFixed(2) + 'k');
        //                     //     } else {
        //                     //         return ('₹ ' + (d / 1000).toFixed(2) + 'k');
        //                     //     }
        //                     // }
        //                 }
        //             }
        //         },
        //         rotated: true
        //     },
        //     padding: {
        //         bottom: 40
        //     },
        //     color: {
        //         pattern: ['#4472C4']
        //     }
        // });
       // console.log(bar_col);
    var chartm = c3.generate({
        bindto: '#chartx',
        data: {
            columns: bar_col,
            type: 'bar',
            labels: {
                format: function(d) {
                    return ('$ ' + truncateNumber2(d));
                }
            },
        //     labels: {
        //     format: {
        //         'Grant amount': function (v, id, i, j) { 
        //             var format = d3.format(',');
        //             var locale = 'en-US';
        //             return v.toLocaleString(locale);
        //         },

        //         'Disbursed amount': function (v, id, i, j) { 
        //             var format = d3.format(',');
        //             var locale = 'en-US';
        //             return v.toLocaleString(locale);
        //         },

        //         'Utilized amount': function (v, id, i, j) { 
        //             var format = d3.format(',');
        //             var locale = 'en-US';
        //             return v.toLocaleString(locale);
        //         }
        //     }
        // },

        },
        axis: {
            x: {
                type: 'category',
                categories: bar_qtr
            },
            y: {
                //ticks: 3,
                tick: {

                    format: function(d) {
                        return ('$ ' + roundUP(d));
                    },
                    count:8
                }
            },
            rotated: true
        },
        
        tooltip: {
            format: {
                value: function(value, ratio, id) {
                    var format = d3.format(',');
                    var locale = 'en-US';
                    var value2 = parseInt(value.toFixed(0))
                    return '$ '+ value2.toLocaleString(locale);
                },
                
             
            },
        },
        padding: {
            bottom: 20
        },
        color: {
            pattern: ['#4472C4']
        }
    });
        /////////////////////////////////////////////////////////////////////////


        var pie_col = [];

        for (var i in projectHierarchyMap) {
            if (projectHierarchyMap[i].parent == 15054) {
                pie_col.push([projectHierarchyMap[i].name, 0])
            }
        }

        for (var i in filter_18117) {

            if (ifChildItself(filter_18117[i].project, pie_col[0][0])) {
                pie_col[0][1] += removeNull(filter_18117[i].proposed_amount);
            }

            if (ifChildItself(filter_18117[i].project, pie_col[1][0])) {
                pie_col[1][1] += removeNull(filter_18117[i].proposed_amount);
            }

            if (ifChildItself(filter_18117[i].project, pie_col[2][0])) {
                pie_col[2][1] += removeNull(filter_18117[i].proposed_amount);
            }

        }
        pie_col[0][1] = (pie_col[0][1] / 65).toFixed(2);
        pie_col[1][1] = (pie_col[1][1] / 65).toFixed(2);
        pie_col[2][1] = (pie_col[2][1] / 65).toFixed(2);


        var chart = c3.generate({
            bindto: '#chart1',
            data: {
                // iris data from R
                columns: pie_col,
                type: 'donut',
            },
            // tooltip: {
            //     format: {
            //         value: function(value, ratio, id) {
            //             var format = d3.format('s');
            //             return format(value);
            //         }
            //     },
            //     format: {
            //         value: function(value, ratio, id) {
            //             // if ($('#currfilter').val() == 'dol') {
            //             return ('$ ' + (value / 1000).toFixed(1) + 'K');
            //             // } else {
            //             //     if (conversion[$('#yearfilter').val()]) {
            //             //         return ('₹ ' + (value * conversion[$('#yearfilter').val()] / 1000).toFixed(1) + 'k');
            //             //     } else {
            //             //         return ('₹ ' + (value / 1000).toFixed(1) + 'k');
            //             //     }
            //             // }
            //         }
            //     }
            // },
            tooltip: {
            format: {
                value: function(value, ratio, id) {
                    var format = d3.format(',');
                    var locale = 'en-US';
                    return '$ ' + value.toLocaleString(locale);
                }
            }
        },
            color: {
                pattern: ['#21618C', '#2E86C1', '#5DADE2']
            }
        });
        //////////////////////////Progress bar donuts//////////////////////////////////

        var filter_40728 = payload_40728.filter(instance => (yearFilter == "all" || instance.financial_year == yearFilter));
        var filter_36994 = payload_36994.filter(instance => (yearFilter == "all" || instance.financial_year == yearFilter));

        var direct_utilized_sum = [0,0,0]
        var overheads_utilized_sum = [0,0,0]
        var total_utilized_sum = [0,0,0]
        var budget_sum = [0,0,0]
        var pie1_col = [['Utilized',0],['Unutilized',0]]
        var pie2_col = [['Utilized',0],['Unutilized',0]]
        var pie3_col = [['Utilized',0],['Unutilized',0]]


        var data_columns = [ ['1', 1], ['2', 1], ['3', 1],['4', 1],['5', 1],['6', 1],['7', 1],['8', 1],['9', 1],['10', 1],['11', 1],['12', 1],['13', 1],['14', 1],['15', 1],['16', 1],['17', 1],['18', 1],['19', 1],['20', 1],['21', 1],['22', 1],['23', 1],['24', 1],['25', 1],['26', 1],['27', 1],['28', 1],['29', 1],['30', 1],['31', 1],['32', 1],['33', 1],['34', 1],['35', 1],['36', 1],['37', 1],['38', 1],['39', 1],['40', 1],['41', 1],['42', 1],['43', 1],['44', 1],['45', 1],['46', 1],['47', 1],['48', 1],['49', 1],['50', 1] ]
        
        for(var i in filter_40728){
            if (filter_40728[i].theme == 568631) {
                direct_utilized_sum[0] += removeNull(filter_40728[i].direct_utilized/65)
                overheads_utilized_sum[0] += removeNull(filter_40728[i].overheads_utilized/65)
            }
            if (filter_40728[i].theme == 568632) {
                direct_utilized_sum[1] += removeNull(filter_40728[i].direct_utilized/65)
                overheads_utilized_sum[1] += removeNull(filter_40728[i].overheads_utilized/65)
            }
            if (filter_40728[i].theme == 568633) {
                direct_utilized_sum[2] += removeNull(filter_40728[i].direct_utilized/65)
                overheads_utilized_sum[2] += removeNull(filter_40728[i].overheads_utilized/65)
            }
        }

        for(var i in filter_36994){
            if (filter_36994[i].theme == 568631) {
                budget_sum[0] += removeNull(filter_36994[i].budget/65)
            }
            if (filter_36994[i].theme == 568632) {
                budget_sum[1] += removeNull(filter_36994[i].budget/65)
            }
            if (filter_36994[i].theme == 568633) {
                budget_sum[2] += removeNull(filter_36994[i].budget/65)
            }
        }
        
        total_utilized_sum[0] = removeNull((direct_utilized_sum[0]+overheads_utilized_sum[0]))
        pie1_col[0][1] = removeNull(total_utilized_sum[0]/budget_sum[0])
        pie1_col[1][1] = removeNull(1-pie1_col[0][1])

        total_utilized_sum[1] = removeNull((direct_utilized_sum[1]+overheads_utilized_sum[1]))
        pie2_col[0][1] = removeNull(total_utilized_sum[1]/budget_sum[1])
        pie2_col[1][1] = removeNull(1-pie2_col[0][1])

        total_utilized_sum[2] = removeNull((direct_utilized_sum[2]+overheads_utilized_sum[2]))
        pie3_col[0][1] = removeNull(total_utilized_sum[2]/budget_sum[2])
        pie3_col[1][1] = removeNull(1-pie3_col[0][1])
        
     //console.log(total_utilized_sum);    
        var temp = [pie1_col[0][1]*100, pie2_col[0][1]*100, pie3_col[0][1]*100]

        var dataColor = [
            ['#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0'],
            ['#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0'],
            ['#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0','#E5E0E0']
        ]
        
        var colorFilled = []
        for (var i in temp){
            colorFilled = colorFilled.concat(colorPal(temp[i].toFixed(0)))
            
        }
       
        for(i = 0; i < colorFilled[0]; i++){
            dataColor[0][i] = "#7395D3";
        }
        for(i = 0; i < colorFilled[1]; i++){
            dataColor[1][i] = "#21618C";
        }
        for(i = 0; i < colorFilled[2]; i++){
            dataColor[2][i] = "#2E86C1";
        }

        var chart_a = c3.generate({
            bindto: "#chart_a",
            data: {
                columns: data_columns,
                type : 'donut',
                order: null
                
            },
            tooltip: {
                show: false
            },
            color: {
                    pattern: dataColor[0]
            },
            donut: {
              label: {
                show: false
              },
              title: '$ '+truncateNumber2(total_utilized_sum[0]) + ' (' + temp[0].toFixed(0)+"%" +')'
            },
            legend: {
              show: false
            },
            interaction: {
              enabled: false
            }
        });

        var chart_b = c3.generate({
            bindto: "#chart_b",
            data: {
                columns: data_columns,
                type : 'donut',
                order: null
                
            },
            tooltip: {
                show: false
            },
            color: {
                pattern: dataColor[1]
            },
            donut: {
              label: {
                show: false
              },
              title: '$ '+truncateNumber2(total_utilized_sum[1]) + ' (' + temp[1].toFixed(0)+"%" +')'
            },
            legend: {
              show: false
            },
            interaction: {
              enabled: false
            }
        });

        var chart_c = c3.generate({
            bindto: "#chart_c",
            data: {
                columns: data_columns,
                type : 'donut',
                order: null
                
            },
            tooltip: {
                show: false
            },
            color: {
                pattern: dataColor[2],
            },
            donut: {
              label: {
                show: false
              },
              title: '$ '+truncateNumber2(total_utilized_sum[2]) + ' (' + temp[2].toFixed(0)+"%" +')'
            },
            legend: {
              show: false
            },
            interaction: {
              enabled: false
            }
        });



       var n1 =100;
       var n2 =[];
        ////////////////////////////////////////////////////////////

        var bar_col = [
            ['Grant'],
            ['Utilized'],
            ['Carried Forward'],
            ['Un utilized']
        ];

        var bar_qtr = [];

        var projectThemes = [];

        for(var payload in payload_18117){
            if(payload_18117[payload].financial_year && payload_18117[payload].financial_year == 337022){
                if(projectThemes.indexOf(payload_18117[payload].project + "") < 0){
                    projectThemes.push(payload_18117[payload].project + "");
                }
            }
        }

        for (var i in projectHierarchyMap) {
            if (themeFilter == "all") {
                if (project_hierarchy_name[projectHierarchyMap[i].parent] == "Critical Human Needs" || project_hierarchy_name[projectHierarchyMap[i].parent] == "Economic Empowernment" || project_hierarchy_name[projectHierarchyMap[i].parent] == "Education") {
                    if(projectThemes.indexOf(i+"") > -1){
                        bar_col[0].push(0);
                        bar_col[1].push(0);
                        bar_col[2].push(0);
                        bar_col[3].push(0);
                        bar_qtr.push(projectHierarchyMap[i].name);
                    }

                }
            } else if (project_hierarchy_name[projectHierarchyMap[i].parent] == themeFilter) {
                if(projectThemes.indexOf(i+"") > -1){
                    bar_col[0].push(0);
                    bar_col[1].push(0);
                    bar_col[2].push(0);
                    bar_col[3].push(0);
                    bar_qtr.push(projectHierarchyMap[i].name);
                }
            }
        }

         console.log(bar_qtr)
        // console.log(bar_col)
        var data1 = [];
        var data2 = [];
        var data3 = [];
        var data4 = [];
        for (var i in filter_18117) {
            for (var j in bar_qtr.sort()) {
                if (ifChildItself(filter_18117[i].project, bar_qtr[j])) {
                    bar_col[0][1 + parseInt(j)] += removeNull(filter_18117[i].proposed_amount);
                    bar_col[1][1 + parseInt(j)] += removeNull(filter_18117[i].actual_expense);
                    bar_col[2][1 + parseInt(j)] += removeNull(filter_18117[i].amt_carried_fwd);
                    bar_col[3][1 + parseInt(j)] += removeNull(filter_18117[i].amount_repurposed);       
                }
            }
        }
        
     
        // percentage on tooltip

      
        for (var i in bar_col) {
            for (var j in bar_col[i]) {
                if (j != 0){
                    bar_col[i][j] = (bar_col[i][j] / 65).toFixed(2);
                }
            }
        }


    console.log(bar_col);    


    var chartm = c3.generate({
        bindto: '#chart2',
        data: {
            columns: bar_col,
            type: 'bar',
            // labels: {
            //     format: function(d) {
            //         return ('$ ' + truncateNumber2(d));
            //     }
            // },
        },
        axis: {
            x: {
                type: 'category',
                categories: bar_qtr
            },
            y: {
                tick: {

                    format: function(d) {
                        return ('$ ' + putCommasD(d));
                    }
                }
            }
        },
        
        tooltip: {
            format: {
                value: function(value, ratio, id) {
                    if(id=='Grant'){
                        data=100;
                        grantval=value;
                    }
                    if(id=='Utilized'){
                        data=(value*100/grantval).toFixed(0);
                        
                    }if(id=='Carried Forward'){
                        data=(value*100/grantval).toFixed(0);
                    }if(id=='Un utilized'){
                        data=(value*100/grantval).toFixed(0);
                        
                    }console.log(value)
                    var format = d3.format(',');
                    var locale = 'en-US';
                    var value2 = parseInt(value.toFixed(0))
                    return '$ '+ value2.toLocaleString(locale) + ' ' + '(' + data +'%' + ')';
                    console.log(value,ratio,id);
                },
            },
        },
        padding: {
            bottom: 20
        },
        color: {
            pattern: ['#A5A5A5', '#5B9BD5', '#4472C4', '#2B5592']
        }
    });

        // var chart = c3.generate({
        //     bindto: '#chart2',
        //     data: {
        //         columns: bar_col,
        //         type: 'bar'
        //     },
        //     axis: {
        //         x: {
        //             type: 'category',
        //             categories: bar_qtr
        //         },
        //         y: {
        //             // label: {
        //             //     text: 'In Thousands',
        //             //     position: 'outer-middle'
        //             // },
        //             tick: {

        //                 format: function(d) {
        //                     // return (d / 1000).toFixed(1) + 'k';
        //                     // if ($('#currfilter').val() == 'dol') {
        //                     return ('$ ' + (d / 1000).toFixed(2) + 'K');
        //                     // } else {
        //                     //     if (conversion[$('#yearfilter').val()]) {
        //                     //         return ('₹ ' + (d * conversion[$('#yearfilter').val()] / 1000).toFixed(2) + 'k');
        //                     //     } else {
        //                     //         return ('₹ ' + (d / 1000).toFixed(2) + 'k');
        //                     //     }
        //                     // }
        //                 }
        //             }
        //         }
        //     },
        //     padding: {
        //         bottom: 40
        //     },
        //     color: {
        //         pattern: ['#A5A5A5', '#5B9BD5', '#4472C4']
        //     }
        // });

    }



}

function ifChildItself(check, parent) { //parent is text
    var nameChild = project_hierarchy_name[check];
    if (nameChild == parent) {
        return true;
    } else if (projectHierarchyMap[check].parent != null && project_hierarchy_name[projectHierarchyMap[check].parent] == parent) {
        return true;
    } else if (projectHierarchyMap[check].parent != null && projectHierarchyMap[projectHierarchyMap[check].parent].parent != null && project_hierarchy_name[projectHierarchyMap[projectHierarchyMap[check].parent].parent] == parent) {
        return true;
    } else return false;
}

function putCommas(number) {
    if (number >= 10000000) {
        return (number / 10000000).toFixed(2) + ' Cr.';
    } else return (number / 100000).toFixed(2) + ' L.';
}
function putCommasD(number) {
    if (number >= 1000000) {
        return (number / 1000000).toFixed(2) + ' M';
    } else return (number / 1000).toFixed(2) + ' K';
}
function returnQuarter(date) {
    var date_taken = new Date(date);
    month = date_taken.getMonth() + 1;
    //console.log(month);
    if (month == 1 || month == 2 || month == 3)
        return 343277;
    else if (month == 4 || month == 5 || month == 6)
        return 343274
    else if (month == 7 || month == 8 || month == 9)
        return 343275
    else if (month == 10 || month == 11 || month == 12)
        return 343276

}

function generateFunnel() {


}

function generateCards() {}

function generateBars() {


}

function makeBarGraph(barx_col, barx_qtr, id) {
    // console.log(barx_col);
    // console.log(barx_qtr);
    var chartx = c3.generate({
        bindto: '#' + id,
        data: {
            columns: barx_col,
            type: 'bar'
        },
        axis: {
            x: {
                type: 'category',
                categories: barx_qtr
            }
        },
        padding: {
            bottom: 20
        },
        color: {
            pattern: ['#1f77b4', '#aec7e8']
        }

    });
}
function checkString(checkItem) {
    return checkItem || ' ';
}

function generateTables() {

    if (currencyFilter == "INR") {

        var filter_18117 = payload_18117.filter(instance => (yearFilter == "all" || instance.financial_year == yearFilter));
        // var filter_17695 = payload_17695.filter(instance => (yearFilter == "all" || instance.financial_year == yearFilter));


        var project_array2 = [];
        var prop_array2 = [];
        var act_array2 = [];
        var comments_array2 = [];
        var diff_array2 = [];

        var project_array = [];
        var prop_array = [];
        var act_array = [];
        var comments_array = [];
        //var diff_array = [];
        for (var i in filter_18117) {
            if (project_array.indexOf(filter_18117[i].project_code) > -1) {
                prop_array[project_array.indexOf(filter_18117[i].project_code)] += removeNull(filter_18117[i].proposed_amount);
                act_array[project_array.indexOf(filter_18117[i].project_code)] += removeNull(filter_18117[i].actual_expense);
                comments_array[project_array.indexOf(filter_18117[i].project_code)] += checkString(filter_18117[i].comment);
            } else {
                project_array.push(filter_18117[i].project_code);
                prop_array.push(removeNull(filter_18117[i].proposed_amount));
                act_array.push(removeNull(filter_18117[i].actual_expense));
                comments_array.push("");
            }
        }

        // for (var i in filter_17695) {
        //     if (filter_17695[i].uc_file)
        //         files_array[project_array.indexOf(filter_17695[i].project_code)] = filter_17695[i].uc_file;
        // }
        // console.log(project_array);
        // console.log(comments_array);



        if (themeFilter == "all") {
            for (var i = project_array.length - 1; i >= 0; i--) {
                project_array2.push(project_array[i]);
                prop_array2.push(prop_array[i]);
                act_array2.push(act_array[i]);
                diff_array2.push(prop_array[i]-act_array[i])
                comments_array2.push(comments_array[i]);
                
            }
           console.log(prop_array2);
           console.log(act_array2); 
           console.log(diff_array2);
        } else {
            if (themeFilter == "Critical Human Needs") {
                for (var i = project_array.length - 1; i >= 0; i--) {
                    if (project_array[i] == "SaveLife Foundation" || project_array[i] == "IAHV") {
                        project_array2.push(project_array[i]);
                        prop_array2.push(prop_array[i]);
                        act_array2.push(act_array[i]);
                        diff_array2.push(prop_array[i]-act_array[i])
                        comments_array2.push(comments_array[i]);
                    }
                }
            }
            if (themeFilter == "Economic Empowernment") {

                for (var i = project_array.length - 1; i >= 0; i--) {
                    if (project_array[i] == "CII Foundation" || project_array[i] == "Quest Alliance" || project_array[i] == "Enable India" || project_array[i] == "End Poverty" || project_array[i] == "FICCI") {
                        project_array2.push(project_array[i]);
                        prop_array2.push(prop_array[i]);
                        act_array2.push(act_array[i]);
                        diff_array2.push(prop_array[i]-act_array[i])
                        comments_array2.push(comments_array[i]);
                    }
                }
            }
            if (themeFilter == "Education") {

                for (var i = project_array.length - 1; i >= 0; i--) {
                    if (project_array[i] == "Akshara Foundation" || project_array[i] == "Pratham Books" || project_array[i] == "Youth For Seva") {
                        project_array2.push(project_array[i]);
                        prop_array2.push(prop_array[i]);
                        act_array2.push(act_array[i]);
                        diff_array2.push(prop_array[i]-act_array[i])
                        comments_array2.push(comments_array[i]);
                    }
                }
            }
        }

        // console.log(project_array2);


        var body = `<thead class="thead-default"><tr>' +
                                                    <th class="thead-custom"><center>Implementing partner</center></th>
                                                    <th class="thead-custom"><center>Amount disbursed</center></th>
                                                    <th class="thead-custom"><center>Amount utilized</center></th>
                                                    <th class="thead-custom"><center>Variance</center></th>
                                                    <th class="thead-custom"><center>Comments</center></th>
                                                </tr>
                                            </thead>
                                            <tbody>`
        for (var i in project_array2) {
            var tr = "<tr>";
            //tr += "<td><center>31-March-2017</center></td>";
            tr += "<td><center>" + project_array2[i] + "</center></td>";
            tr += "<td><center>₹ " + getCommas(prop_array2[i]) + "</center></td>";
            tr += "<td><center>₹ " + getCommas(act_array2[i]) + "</center></td>";
            tr += "<td><center>₹ " + getCommas(diff_array2[i]) + "</center></td>";
            tr += "<td><center>" + comments_array2[i] + "</center></td>";
            tr += "</tr>";
            body += tr;
        }

        $('#t1').empty();

        body += '</tbody>';

        $('#t1').html(body);


        var table = $('#t1').DataTable({
        //dom: 'Bfrtip',
        //"dom": '<"top"i>rt<"bottom"flp><"clear">',
        "columnDefs": [
        { "orderable": true, "targets": [0, 3] },
        { "orderable": false, "targets": [1, 2, 4] },
        { "width": "40%", "targets": 4 }
        ],
        "order": [[1, 'asc']],
        "pageLength": 10,
        "paging": false,
        "autoWidth": false,
        "scrollX": true,
        "destroy": true
        });

////////////////////////////////////////////////////////////////////////////////////////////////////
        var componentMap = {};
        var temp_name = "";

        if (ngoFilter == "Quest Alliance") {
            for (var i in budgetQuestTags) {
                if (budgetQuestTags[i].parent == null) {
                    temp_name = tagElementMap[i];
                    componentMap[temp_name] = {};
                }
            }
            for (var i in budgetQuestTags) {
                temp_name = tagElementMap[i];
                if (budgetQuestTags[i].parent != null)
                    if (componentMap[tagElementMap[budgetQuestTags[i].parent]] != undefined) {
                        componentMap[tagElementMap[budgetQuestTags[i].parent]][temp_name] = [0, 0];
                    }

            }
            for (var i in filter_18117) {
                temp_name = tagElementMap[filter_18117[i].budget_quest];

                for (var j in componentMap) {
                    for (var k in componentMap[j]) {
                        if (k == temp_name) {
                            componentMap[j][k][0] += removeNull(filter_18117[i].proposed_amount);
                            componentMap[j][k][1] += removeNull(filter_18117[i].actual_expense);
                        }
                    }
                }
            }
            var t = '';
            for (var i in componentMap) {
                var temp_number = Object.keys(componentMap[i]).length;
                var flag = 1;
                // console.log(temp_number);
                for (var j in componentMap[i]) {
                    var tr = "<tr>";
                    if (flag == 1) {
                        tr += "<td rowspan='" + temp_number + "'>" + i + "</td>";
                        flag = 0;
                    }
                    tr += "<td>" + j + "</td>";
                    tr += "<td>₹ " + getCommas(componentMap[i][j][0]) + "</td>";
                    tr += "<td>₹ " + getCommas(componentMap[i][j][1]) + "</td>";
                    tr += "</tr>";
                    t += tr;
                }
            }
            $('#table2').html(t);
        }
        // console.log(componentMap)

        if (ngoFilter == "CII Foundation") {
            for (var i in budgetCIITags) {
                if (budgetCIITags[i].parent == null) {
                    temp_name = tagElementMap[i];
                    componentMap[temp_name] = [0, 0];
                }
            }
            // for (var i in budgetCIITags) {
            //     temp_name = tagElementMap[i];
            //     if (budgetCIITags[i].parent != null)
            //         if (componentMap[tagElementMap[budgetCIITags[i].parent]] != undefined) {
            //             componentMap[tagElementMap[budgetCIITags[i].parent]][temp_name] = [0, 0];
            //         }
            // }
            for (var i in filter_18117) {
                temp_name = tagElementMap[filter_18117[i].budget_niit];

                for (var j in componentMap) {
                    if (j == temp_name) {
                        componentMap[j][0] += removeNull(filter_18117[i].proposed_amount);
                        componentMap[j][1] += removeNull(filter_18117[i].actual_expense);
                    }
                }
            }
            var t = '';
            for (var i in componentMap) {
                var tr = "<tr>";
                tr += "<td>" + i + "</td>";
                tr += "<td>" + i + "</td>";
                tr += "<td>₹ " + getCommas(componentMap[i][0]) + "</td>";
                tr += "<td>₹ " + getCommas(componentMap[i][1]) + "</td>";
                tr += "</tr>";
                t += tr;
            }
            $('#table2').html(t);
        }


        if (ngoFilter == "Akshara") {
            for (var i in budgetAksharaTags) {
                if (budgetAksharaTags[i].parent == null) {
                    temp_name = tagElementMap[i];
                    componentMap[temp_name] = {};
                }
            }
            for (var i in budgetAksharaTags) {
                temp_name = tagElementMap[i];
                if (budgetAksharaTags[i].parent != null)
                    if (componentMap[tagElementMap[budgetAksharaTags[i].parent]] != undefined) {
                        componentMap[tagElementMap[budgetAksharaTags[i].parent]][temp_name] = [0, 0];
                    }

            }
            for (var i in filter_18117) {
                temp_name = tagElementMap[filter_18117[i].budget_akshara];

                for (var j in componentMap) {
                    for (var k in componentMap[j]) {
                        if (k == temp_name) {
                            componentMap[j][k][0] += removeNull(filter_18117[i].proposed_amount);
                            componentMap[j][k][1] += removeNull(filter_18117[i].actual_expense);
                        }
                    }
                }
            }
            var t = '';
            for (var i in componentMap) {
                var temp_number = Object.keys(componentMap[i]).length;
                var flag = 1;
                // console.log(temp_number);
                for (var j in componentMap[i]) {
                    var tr = "<tr>";
                    if (flag == 1) {
                        tr += "<td rowspan='" + temp_number + "'>" + i + "</td>";
                        flag = 0;
                    }
                    tr += "<td>" + j + "</td>";
                    tr += "<td>₹ " + getCommas(componentMap[i][j][0]) + "</td>";
                    tr += "<td>₹ " + getCommas(componentMap[i][j][1]) + "</td>";
                    tr += "</tr>";
                    t += tr;
                }
            }
            $('#table2').html(t);
        }

        if (ngoFilter == "Pratham Books") {
            for (var i in budgetPBTags) {
                if (budgetPBTags[i].parent == null) {
                    temp_name = tagElementMap[i];
                    componentMap[temp_name] = {};
                }
            }
            for (var i in budgetPBTags) {
                temp_name = tagElementMap[i];
                if (budgetPBTags[i].parent != null)
                    if (componentMap[tagElementMap[budgetPBTags[i].parent]] != undefined) {
                        componentMap[tagElementMap[budgetPBTags[i].parent]][temp_name] = [0, 0];
                    }

            }
            for (var i in filter_18117) {
                temp_name = tagElementMap[filter_18117[i].budget_pb];

                for (var j in componentMap) {
                    for (var k in componentMap[j]) {
                        if (k == temp_name) {
                            componentMap[j][k][0] += removeNull(filter_18117[i].proposed_amount);
                            componentMap[j][k][1] += removeNull(filter_18117[i].actual_expense);
                        }
                    }
                }
            }
            var t = '';
            for (var i in componentMap) {
                var temp_number = Object.keys(componentMap[i]).length;
                var flag = 1;
                // console.log(temp_number);
                for (var j in componentMap[i]) {
                    var tr = "<tr>";
                    if (flag == 1) {
                        tr += "<td rowspan='" + temp_number + "'>" + i + "</td>";
                        flag = 0;
                    }
                    tr += "<td>" + j + "</td>";
                    tr += "<td>₹ " + getCommas(componentMap[i][j][0]) + "</td>";
                    tr += "<td>₹ " + getCommas(componentMap[i][j][1]) + "</td>";
                    tr += "</tr>";
                    t += tr;
                }
            }
            $('#table2').html(t);
        }


        if (ngoFilter == "SaveLife Foundation") {
            for (var i in budgetSLFTags) {
                if (budgetSLFTags[i].parent == null) {
                    temp_name = tagElementMap[i];
                    componentMap[temp_name] = {};
                }
            }
            for (var i in budgetSLFTags) {
                temp_name = tagElementMap[i];
                if (budgetSLFTags[i].parent != null)
                    if (componentMap[tagElementMap[budgetSLFTags[i].parent]] != undefined) {
                        componentMap[tagElementMap[budgetSLFTags[i].parent]][temp_name] = [0, 0];
                    }

            }
            for (var i in filter_18117) {
                temp_name = tagElementMap[filter_18117[i].budget_slf];

                for (var j in componentMap) {
                    for (var k in componentMap[j]) {
                        if (k == temp_name) {
                            componentMap[j][k][0] += removeNull(filter_18117[i].proposed_amount);
                            componentMap[j][k][1] += removeNull(filter_18117[i].actual_expense);
                        }
                    }
                }
            }
            var t = '';
            for (var i in componentMap) {
                var temp_number = Object.keys(componentMap[i]).length;
                var flag = 1;
                // console.log(temp_number);
                for (var j in componentMap[i]) {
                    var tr = "<tr>";
                    if (flag == 1) {
                        tr += "<td rowspan='" + temp_number + "'>" + i + "</td>";
                        flag = 0;
                    }
                    tr += "<td>" + j + "</td>";
                    tr += "<td>₹ " + getCommas(componentMap[i][j][0]) + "</td>";
                    tr += "<td>₹ " + getCommas(componentMap[i][j][1]) + "</td>";
                    tr += "</tr>";
                    t += tr;
                }
            }
            $('#table2').html(t);
        }



        if (ngoFilter == "Youth For Seva") {
            for (var i in budgetYFSTags) {
                if (budgetYFSTags[i].parent == null) {
                    temp_name = tagElementMap[i];
                    componentMap[temp_name] = {};
                }
            }
            for (var i in budgetYFSTags) {
                temp_name = tagElementMap[i];
                if (budgetYFSTags[i].parent != null)
                    if (componentMap[tagElementMap[budgetYFSTags[i].parent]] != undefined) {
                        componentMap[tagElementMap[budgetYFSTags[i].parent]][temp_name] = [0, 0];
                    }

            }
            for (var i in filter_18117) {
                temp_name = tagElementMap[filter_18117[i].budget_yfs];

                for (var j in componentMap) {
                    for (var k in componentMap[j]) {
                        if (k == temp_name) {
                            componentMap[j][k][0] += removeNull(filter_18117[i].proposed_amount);
                            componentMap[j][k][1] += removeNull(filter_18117[i].actual_expense);
                        }
                    }
                }
            }
            var t = '';
            for (var i in componentMap) {
                var temp_number = Object.keys(componentMap[i]).length;
                var flag = 1;
                // console.log(temp_number);
                for (var j in componentMap[i]) {
                    var tr = "<tr>";
                    if (flag == 1) {
                        tr += "<td rowspan='" + temp_number + "'>" + i + "</td>";
                        flag = 0;
                    }
                    tr += "<td>" + j + "</td>";
                    tr += "<td>₹ " + getCommas(componentMap[i][j][0]) + "</td>";
                    tr += "<td>₹ " + getCommas(componentMap[i][j][1]) + "</td>";
                    tr += "</tr>";
                    t += tr;
                }
            }
            $('#table2').html(t);
        }



        if (ngoFilter == "Enable India") {
            for (var i in budgetEITags) {
                if (budgetEITags[i].parent == null) {
                    temp_name = tagElementMap[i];
                    componentMap[temp_name] = {};
                }
            }
            for (var i in budgetEITags) {
                temp_name = tagElementMap[i];
                if (budgetEITags[i].parent != null)
                    if (componentMap[tagElementMap[budgetEITags[i].parent]] != undefined) {
                        componentMap[tagElementMap[budgetEITags[i].parent]][temp_name] = [0, 0];
                    }

            }
            for (var i in filter_18117) {
                temp_name = tagElementMap[filter_18117[i].budget_ei];

                for (var j in componentMap) {
                    for (var k in componentMap[j]) {
                        if (k == temp_name) {
                            componentMap[j][k][0] += removeNull(filter_18117[i].proposed_amount);
                            componentMap[j][k][1] += removeNull(filter_18117[i].actual_expense);
                        }
                    }
                }
            }
            var t = '';
            for (var i in componentMap) {
                var temp_number = Object.keys(componentMap[i]).length;
                var flag = 1;
                // console.log(temp_number);
                for (var j in componentMap[i]) {
                    var tr = "<tr>";
                    if (flag == 1) {
                        tr += "<td rowspan='" + temp_number + "'>" + i + "</td>";
                        flag = 0;
                    }
                    tr += "<td>" + j + "</td>";
                    tr += "<td>₹ " + getCommas(componentMap[i][j][0]) + "</td>";
                    tr += "<td>₹ " + getCommas(componentMap[i][j][1]) + "</td>";
                    tr += "</tr>";
                    t += tr;
                }
            }
            $('#table2').html(t);
        }


        if (ngoFilter == "End Poverty") {
            for (var i in budgetEPTags) {
                if (budgetEPTags[i].parent == null) {
                    temp_name = tagElementMap[i];
                    componentMap[temp_name] = {};
                }
            }
            for (var i in budgetEPTags) {
                temp_name = tagElementMap[i];
                if (budgetEPTags[i].parent != null)
                    if (componentMap[tagElementMap[budgetEPTags[i].parent]] != undefined) {
                        componentMap[tagElementMap[budgetEPTags[i].parent]][temp_name] = [0, 0];
                    }

            }
            for (var i in filter_18117) {
                temp_name = tagElementMap[filter_18117[i].budget_ep];

                for (var j in componentMap) {
                    for (var k in componentMap[j]) {
                        if (k == temp_name) {
                            componentMap[j][k][0] += removeNull(filter_18117[i].proposed_amount);
                            componentMap[j][k][1] += removeNull(filter_18117[i].actual_expense);
                        }
                    }
                }
            }
            var t = '';
            for (var i in componentMap) {
                var temp_number = Object.keys(componentMap[i]).length;
                var flag = 1;
                // console.log(temp_number);
                for (var j in componentMap[i]) {
                    var tr = "<tr>";
                    if (flag == 1) {
                        tr += "<td rowspan='" + temp_number + "'>" + i + "</td>";
                        flag = 0;
                    }
                    tr += "<td>" + j + "</td>";
                    tr += "<td>₹ " + getCommas(componentMap[i][j][0]) + "</td>";
                    tr += "<td>₹ " + getCommas(componentMap[i][j][1]) + "</td>";
                    tr += "</tr>";
                    t += tr;
                }
            }
            $('#table2').html(t);
        }



        if (ngoFilter == "FICCI") {
            for (var i in budgetFNFTags) {
                if (budgetFNFTags[i].parent == null) {
                    temp_name = tagElementMap[i];
                    componentMap[temp_name] = {};
                }
            }
            for (var i in budgetFNFTags) {
                temp_name = tagElementMap[i];
                if (budgetFNFTags[i].parent != null)
                    if (componentMap[tagElementMap[budgetFNFTags[i].parent]] != undefined) {
                        componentMap[tagElementMap[budgetFNFTags[i].parent]][temp_name] = [0, 0];
                    }

            }
            for (var i in filter_18117) {
                temp_name = tagElementMap[filter_18117[i].budget_fnf];

                for (var j in componentMap) {
                    for (var k in componentMap[j]) {
                        if (k == temp_name) {
                            componentMap[j][k][0] += removeNull(filter_18117[i].proposed_amount);
                            componentMap[j][k][1] += removeNull(filter_18117[i].actual_expense);
                        }
                    }
                }
            }
            var t = '';
            for (var i in componentMap) {
                var temp_number = Object.keys(componentMap[i]).length;
                var flag = 1;
                // console.log(temp_number);
                for (var j in componentMap[i]) {
                    var tr = "<tr>";
                    if (flag == 1) {
                        tr += "<td rowspan='" + temp_number + "'>" + i + "</td>";
                        flag = 0;
                    }
                    tr += "<td>" + j + "</td>";
                    tr += "<td>₹ " + getCommas(componentMap[i][j][0]) + "</td>";
                    tr += "<td>₹ " + getCommas(componentMap[i][j][1]) + "</td>";
                    tr += "</tr>";
                    t += tr;
                }
            }
            $('#table2').html(t);
        }


        if (ngoFilter == "IAHV") {
            for (var i in budgetIAHVTags) {
                if (budgetIAHVTags[i].parent == null) {
                    temp_name = tagElementMap[i];
                    componentMap[temp_name] = {};
                }
            }
            for (var i in budgetIAHVTags) {
                temp_name = tagElementMap[i];
                if (budgetIAHVTags[i].parent != null)
                    if (componentMap[tagElementMap[budgetIAHVTags[i].parent]] != undefined) {
                        componentMap[tagElementMap[budgetIAHVTags[i].parent]][temp_name] = [0, 0];
                    }

            }
            for (var i in filter_18117) {
                temp_name = tagElementMap[filter_18117[i].budget_iahv];

                for (var j in componentMap) {
                    for (var k in componentMap[j]) {
                        if (k == temp_name) {
                            componentMap[j][k][0] += removeNull(filter_18117[i].proposed_amount);
                            componentMap[j][k][1] += removeNull(filter_18117[i].actual_expense);
                        }
                    }
                }
            }
            var t = '';
            for (var i in componentMap) {
                var temp_number = Object.keys(componentMap[i]).length;
                var flag = 1;
                // console.log(temp_number);
                for (var j in componentMap[i]) {
                    var tr = "<tr>";
                    if (flag == 1) {
                        tr += "<td rowspan='" + temp_number + "'>" + i + "</td>";
                        flag = 0;
                    }
                    tr += "<td>" + j + "</td>";
                    tr += "<td>₹ " + getCommas(componentMap[i][j][0]) + "</td>";
                    tr += "<td>₹ " + getCommas(componentMap[i][j][1]) + "</td>";
                    tr += "</tr>";
                    t += tr;
                }
            }
            $('#table2').html(t);
        }

    } /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    else {

        var filter_18117 = payload_18117.filter(instance => (yearFilter == "all" || instance.financial_year == yearFilter));
        // var filter_17695 = payload_17695.filter(instance => (yearFilter == "all" || instance.financial_year == yearFilter));


        var project_array2 = [];
        var prop_array2 = [];
        var act_array2 = [];
        var comments_array2 = [];
        var diff_array2 = [];

        var project_array = [];
        var prop_array = [];
        var act_array = [];
        var comments_array = [];

        for (var i in filter_18117) {
            if (project_array.indexOf(filter_18117[i].project_code) > -1) {
                prop_array[project_array.indexOf(filter_18117[i].project_code)] += removeNull(filter_18117[i].proposed_amount);
                act_array[project_array.indexOf(filter_18117[i].project_code)] += removeNull(filter_18117[i].actual_expense);
                comments_array[project_array.indexOf(filter_18117[i].project_code)] += checkString(filter_18117[i].comment);
            } else {
                project_array.push(filter_18117[i].project_code);
                prop_array.push(removeNull(filter_18117[i].proposed_amount));
                act_array.push(removeNull(filter_18117[i].actual_expense));
                comments_array.push("");
            }
        }

        // for (var i in filter_17695) {
        //     if (filter_17695[i].uc_file)
        //         files_array[project_array.indexOf(filter_17695[i].project_code)] = filter_17695[i].uc_file;
        // }
        // console.log(project_array);
        // console.log(files_array);



        if (themeFilter == "all") {
            for (var i = project_array.length - 1; i >= 0; i--) {
                project_array2.push(project_array[i]);
                prop_array2.push(prop_array[i]);
                act_array2.push(act_array[i]);
                diff_array2.push(prop_array[i]-act_array[i]);
                if(diff_array2[i < 0]){
                            getCommas(diff_array2);
                        }
                comments_array2.push(comments_array[i]);
            }
        } else {
            if (themeFilter == "Critical Human Needs") {
                for (var i = project_array.length - 1; i >= 0; i--) {
                    if (project_array[i] == "SaveLife Foundation" || project_array[i] == "IAHV") {
                        project_array2.push(project_array[i]);
                        prop_array2.push(prop_array[i]);
                        act_array2.push(act_array[i]);
                        diff_array2.push(prop_array[i]-act_array[i]);
                        if(diff_array2[i < 0]){
                            getCommas(diff_array2);
                        }
                        comments_array2.push(comments_array[i]);
                    }
                }
            }
            if (themeFilter == "Economic Empowernment") {

                for (var i = project_array.length - 1; i >= 0; i--) {
                    if (project_array[i] == "CII Foundation" || project_array[i] == "Quest Alliance" || project_array[i] == "Enable India" || project_array[i] == "End Poverty" || project_array[i] == "FICCI") {
                        project_array2.push(project_array[i]);
                        prop_array2.push(prop_array[i]);
                        act_array2.push(act_array[i]);
                        diff_array2.push(prop_array[i]-act_array[i]);
                        if(diff_array2[i < 0]){
                            getCommas(diff_array2);
                        }
                        comments_array2.push(comments_array[i]);
                    }
                }
            }
            if (themeFilter == "Education") {

                for (var i = project_array.length - 1; i >= 0; i--) {
                    if (project_array[i] == "Akshara Foundation" || project_array[i] == "Pratham Books" || project_array[i] == "Youth For Seva") {
                        project_array2.push(project_array[i]);
                        prop_array2.push(prop_array[i]);
                        act_array2.push(act_array[i]);
                        diff_array2.push(prop_array[i]-act_array[i]);
                        if(diff_array2[i < 0]){
                            getCommas(diff_array2);
                        }
                        comments_array2.push(comments_array[i]);
                    }
                }
            }
        }
//        console.log(diff_array2)

        var body = `<thead class="thead-default"><tr>' +
                                                    <th class="thead-custom"><center>Implementing partner</center></th>
                                                    <th class="thead-custom"><center>Amount disbursed</center></th>
                                                    <th class="thead-custom"><center>Amount utilized</center></th>
                                                     <th class="thead-custom"><center>Variance</center></th>
                                                    <th class="thead-custom"><center>Comments</center></th>
                                                </tr>
                                            </thead>
                                            <tbody>`
        for (var i in project_array2) {
            var tr = "<tr>";
            //tr += "<td><center>31-March-2017</center></td>";
            tr += "<td><center>" + project_array2[i] + "</center></td>";
            tr += "<td><center>$ " + getCommasD(prop_array2[i] / 65) + "</center></td>";
            tr += "<td><center>$ " + getCommasD(act_array2[i] / 65) + "</center></td>";
            tr += "<td><center>$ " + getCommasD(diff_array2[i] / 65) + "</center></td>";
            tr += "<td><center>" + comments_array2[i] + "</center></td>";
            tr += "</tr>";
            body += tr;
        }

        $('#t1').empty();

        body += '</tbody>';

        $('#t1').html(body);


        var table = $('#t1').DataTable({
        //dom: 'Bfrtip',
        //"dom": '<"top"i>rt<"bottom"flp><"clear">',
        "columnDefs": [
        { "orderable": true, "targets": [0, 3] },
        { "orderable": false, "targets": [1, 2, 4] },
        { "width": "40%", "targets": 4 }
        ],
        "order": [[1, 'asc']],
        "pageLength": 10,
        "paging": false,
        "autoWidth": false,
        "scrollX": true,
        "destroy": true
        });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var componentMap = {};
        var temp_name = "";

        if (ngoFilter == "Quest Alliance") {
            for (var i in budgetQuestTags) {
                if (budgetQuestTags[i].parent == null) {
                    temp_name = tagElementMap[i];
                    componentMap[temp_name] = {};
                }
            }
            for (var i in budgetQuestTags) {
                temp_name = tagElementMap[i];
                if (budgetQuestTags[i].parent != null)
                    if (componentMap[tagElementMap[budgetQuestTags[i].parent]] != undefined) {
                        componentMap[tagElementMap[budgetQuestTags[i].parent]][temp_name] = [0, 0];
                    }

            }
            for (var i in filter_18117) {
                temp_name = tagElementMap[filter_18117[i].budget_quest];

                for (var j in componentMap) {
                    for (var k in componentMap[j]) {
                        if (k == temp_name) {
                            componentMap[j][k][0] += removeNull(filter_18117[i].proposed_amount);
                            componentMap[j][k][1] += removeNull(filter_18117[i].actual_expense);
                        }
                    }
                }
            }
            var t = '';
            for (var i in componentMap) {
                var temp_number = Object.keys(componentMap[i]).length;
                var flag = 1;
                // console.log(temp_number);
                for (var j in componentMap[i]) {
                    var tr = "<tr>";
                    if (flag == 1) {
                        tr += "<td rowspan='" + temp_number + "'>" + i + "</td>";
                        flag = 0;
                    }
                    tr += "<td>" + j + "</td>";
                    tr += "<td>$ " + getCommasD(componentMap[i][j][0] / 65) + "</td>";
                    tr += "<td>$ " + getCommasD(componentMap[i][j][1] / 65) + "</td>";
                    tr += "</tr>";
                    t += tr;
                }
            }
            $('#table2').html(t);
        }
        // console.log(componentMap)

        if (ngoFilter == "CII Foundation") {
            for (var i in budgetCIITags) {
                if (budgetCIITags[i].parent == null) {
                    temp_name = tagElementMap[i];
                    componentMap[temp_name] = [0, 0];
                }
            }
            // for (var i in budgetCIITags) {
            //     temp_name = tagElementMap[i];
            //     if (budgetCIITags[i].parent != null)
            //         if (componentMap[tagElementMap[budgetCIITags[i].parent]] != undefined) {
            //             componentMap[tagElementMap[budgetCIITags[i].parent]][temp_name] = [0, 0];
            //         }
            // }
            for (var i in filter_18117) {
                temp_name = tagElementMap[filter_18117[i].budget_niit];

                for (var j in componentMap) {
                    if (j == temp_name) {
                        componentMap[j][0] += removeNull(filter_18117[i].proposed_amount);
                        componentMap[j][1] += removeNull(filter_18117[i].actual_expense);
                    }
                }
            }
            var t = '';
            for (var i in componentMap) {
                var tr = "<tr>";
                tr += "<td>" + i + "</td>";
                tr += "<td>" + i + "</td>";
                tr += "<td>$ " + getCommasD(componentMap[i][0] / 65) + "</td>";
                tr += "<td>$ " + getCommasD(componentMap[i][1] / 65) + "</td>";
                tr += "</tr>";
                t += tr;
            }
            $('#table2').html(t);
        }


        if (ngoFilter == "Akshara") {
            for (var i in budgetAksharaTags) {
                if (budgetAksharaTags[i].parent == null) {
                    temp_name = tagElementMap[i];
                    componentMap[temp_name] = {};
                }
            }
            for (var i in budgetAksharaTags) {
                temp_name = tagElementMap[i];
                if (budgetAksharaTags[i].parent != null)
                    if (componentMap[tagElementMap[budgetAksharaTags[i].parent]] != undefined) {
                        componentMap[tagElementMap[budgetAksharaTags[i].parent]][temp_name] = [0, 0];
                    }

            }
            for (var i in filter_18117) {
                temp_name = tagElementMap[filter_18117[i].budget_akshara];

                for (var j in componentMap) {
                    for (var k in componentMap[j]) {
                        if (k == temp_name) {
                            componentMap[j][k][0] += removeNull(filter_18117[i].proposed_amount);
                            componentMap[j][k][1] += removeNull(filter_18117[i].actual_expense);
                        }
                    }
                }
            }
            var t = '';
            for (var i in componentMap) {
                var temp_number = Object.keys(componentMap[i]).length;
                var flag = 1;
                // console.log(temp_number);
                for (var j in componentMap[i]) {
                    var tr = "<tr>";
                    if (flag == 1) {
                        tr += "<td rowspan='" + temp_number + "'>" + i + "</td>";
                        flag = 0;
                    }
                    tr += "<td>" + j + "</td>";
                    tr += "<td>$ " + getCommasD(componentMap[i][j][0] / 65) + "</td>";
                    tr += "<td>$ " + getCommasD(componentMap[i][j][1] / 65) + "</td>";
                    tr += "</tr>";
                    t += tr;
                }
            }
            $('#table2').html(t);
        }

        if (ngoFilter == "Pratham Books") {
            for (var i in budgetPBTags) {
                if (budgetPBTags[i].parent == null) {
                    temp_name = tagElementMap[i];
                    componentMap[temp_name] = {};
                }
            }
            for (var i in budgetPBTags) {
                temp_name = tagElementMap[i];
                if (budgetPBTags[i].parent != null)
                    if (componentMap[tagElementMap[budgetPBTags[i].parent]] != undefined) {
                        componentMap[tagElementMap[budgetPBTags[i].parent]][temp_name] = [0, 0];
                    }

            }
            for (var i in filter_18117) {
                temp_name = tagElementMap[filter_18117[i].budget_pb];

                for (var j in componentMap) {
                    for (var k in componentMap[j]) {
                        if (k == temp_name) {
                            componentMap[j][k][0] += removeNull(filter_18117[i].proposed_amount);
                            componentMap[j][k][1] += removeNull(filter_18117[i].actual_expense);
                        }
                    }
                }
            }
            var t = '';
            for (var i in componentMap) {
                var temp_number = Object.keys(componentMap[i]).length;
                var flag = 1;
                // console.log(temp_number);
                for (var j in componentMap[i]) {
                    var tr = "<tr>";
                    if (flag == 1) {
                        tr += "<td rowspan='" + temp_number + "'>" + i + "</td>";
                        flag = 0;
                    }
                    tr += "<td>" + j + "</td>";
                    tr += "<td>$ " + getCommasD(componentMap[i][j][0] / 65) + "</td>";
                    tr += "<td>$ " + getCommasD(componentMap[i][j][1] / 65) + "</td>";
                    tr += "</tr>";
                    t += tr;
                }
            }
            $('#table2').html(t);
        }


        if (ngoFilter == "SaveLife Foundation") {
            for (var i in budgetSLFTags) {
                if (budgetSLFTags[i].parent == null) {
                    temp_name = tagElementMap[i];
                    componentMap[temp_name] = {};
                }
            }
            for (var i in budgetSLFTags) {
                temp_name = tagElementMap[i];
                if (budgetSLFTags[i].parent != null)
                    if (componentMap[tagElementMap[budgetSLFTags[i].parent]] != undefined) {
                        componentMap[tagElementMap[budgetSLFTags[i].parent]][temp_name] = [0, 0];
                    }

            }
            for (var i in filter_18117) {
                temp_name = tagElementMap[filter_18117[i].budget_slf];

                for (var j in componentMap) {
                    for (var k in componentMap[j]) {
                        if (k == temp_name) {
                            componentMap[j][k][0] += removeNull(filter_18117[i].proposed_amount);
                            componentMap[j][k][1] += removeNull(filter_18117[i].actual_expense);
                        }
                    }
                }
            }
            var t = '';
            for (var i in componentMap) {
                var temp_number = Object.keys(componentMap[i]).length;
                var flag = 1;
                // console.log(temp_number);
                for (var j in componentMap[i]) {
                    var tr = "<tr>";
                    if (flag == 1) {
                        tr += "<td rowspan='" + temp_number + "'>" + i + "</td>";
                        flag = 0;
                    }
                    tr += "<td>" + j + "</td>";
                    tr += "<td>$ " + getCommasD(componentMap[i][j][0] / 65) + "</td>";
                    tr += "<td>$ " + getCommasD(componentMap[i][j][1] / 65) + "</td>";
                    tr += "</tr>";
                    t += tr;
                }
            }
            $('#table2').html(t);
        }



        if (ngoFilter == "Youth For Seva") {
            for (var i in budgetYFSTags) {
                if (budgetYFSTags[i].parent == null) {
                    temp_name = tagElementMap[i];
                    componentMap[temp_name] = {};
                }
            }
            for (var i in budgetYFSTags) {
                temp_name = tagElementMap[i];
                if (budgetYFSTags[i].parent != null)
                    if (componentMap[tagElementMap[budgetYFSTags[i].parent]] != undefined) {
                        componentMap[tagElementMap[budgetYFSTags[i].parent]][temp_name] = [0, 0];
                    }

            }
            for (var i in filter_18117) {
                temp_name = tagElementMap[filter_18117[i].budget_yfs];

                for (var j in componentMap) {
                    for (var k in componentMap[j]) {
                        if (k == temp_name) {
                            componentMap[j][k][0] += removeNull(filter_18117[i].proposed_amount);
                            componentMap[j][k][1] += removeNull(filter_18117[i].actual_expense);
                        }
                    }
                }
            }
            var t = '';
            for (var i in componentMap) {
                var temp_number = Object.keys(componentMap[i]).length;
                var flag = 1;
                // console.log(temp_number);
                for (var j in componentMap[i]) {
                    var tr = "<tr>";
                    if (flag == 1) {
                        tr += "<td rowspan='" + temp_number + "'>" + i + "</td>";
                        flag = 0;
                    }
                    tr += "<td>" + j + "</td>";
                    tr += "<td>$ " + getCommasD(componentMap[i][j][0] / 65) + "</td>";
                    tr += "<td>$ " + getCommasD(componentMap[i][j][1] / 65) + "</td>";
                    tr += "</tr>";
                    t += tr;
                }
            }
            $('#table2').html(t);
        }



        if (ngoFilter == "Enable India") {
            for (var i in budgetEITags) {
                if (budgetEITags[i].parent == null) {
                    temp_name = tagElementMap[i];
                    componentMap[temp_name] = {};
                }
            }
            for (var i in budgetEITags) {
                temp_name = tagElementMap[i];
                if (budgetEITags[i].parent != null)
                    if (componentMap[tagElementMap[budgetEITags[i].parent]] != undefined) {
                        componentMap[tagElementMap[budgetEITags[i].parent]][temp_name] = [0, 0];
                    }

            }
            for (var i in filter_18117) {
                temp_name = tagElementMap[filter_18117[i].budget_ei];

                for (var j in componentMap) {
                    for (var k in componentMap[j]) {
                        if (k == temp_name) {
                            componentMap[j][k][0] += removeNull(filter_18117[i].proposed_amount);
                            componentMap[j][k][1] += removeNull(filter_18117[i].actual_expense);
                        }
                    }
                }
            }
            var t = '';
            for (var i in componentMap) {
                var temp_number = Object.keys(componentMap[i]).length;
                var flag = 1;
                // console.log(temp_number);
                for (var j in componentMap[i]) {
                    var tr = "<tr>";
                    if (flag == 1) {
                        tr += "<td rowspan='" + temp_number + "'>" + i + "</td>";
                        flag = 0;
                    }
                    tr += "<td>" + j + "</td>";
                    tr += "<td>$ " + getCommasD(componentMap[i][j][0] / 65) + "</td>";
                    tr += "<td>$ " + getCommasD(componentMap[i][j][1] / 65) + "</td>";
                    tr += "</tr>";
                    t += tr;
                }
            }
            $('#table2').html(t);
        }


        if (ngoFilter == "End Poverty") {
            for (var i in budgetEPTags) {
                if (budgetEPTags[i].parent == null) {
                    temp_name = tagElementMap[i];
                    componentMap[temp_name] = {};
                }
            }
            for (var i in budgetEPTags) {
                temp_name = tagElementMap[i];
                if (budgetEPTags[i].parent != null)
                    if (componentMap[tagElementMap[budgetEPTags[i].parent]] != undefined) {
                        componentMap[tagElementMap[budgetEPTags[i].parent]][temp_name] = [0, 0];
                    }

            }
            for (var i in filter_18117) {
                temp_name = tagElementMap[filter_18117[i].budget_ep];

                for (var j in componentMap) {
                    for (var k in componentMap[j]) {
                        if (k == temp_name) {
                            componentMap[j][k][0] += removeNull(filter_18117[i].proposed_amount);
                            componentMap[j][k][1] += removeNull(filter_18117[i].actual_expense);
                        }
                    }
                }
            }
            var t = '';
            for (var i in componentMap) {
                var temp_number = Object.keys(componentMap[i]).length;
                var flag = 1;
                // console.log(temp_number);
                for (var j in componentMap[i]) {
                    var tr = "<tr>";
                    if (flag == 1) {
                        tr += "<td rowspan='" + temp_number + "'>" + i + "</td>";
                        flag = 0;
                    }
                    tr += "<td>" + j + "</td>";
                    tr += "<td>$ " + getCommasD(componentMap[i][j][0] / 65) + "</td>";
                    tr += "<td>$ " + getCommasD(componentMap[i][j][1] / 65) + "</td>";
                    tr += "</tr>";
                    t += tr;
                }
            }
            $('#table2').html(t);
        }



        if (ngoFilter == "FICCI") {
            for (var i in budgetFNFTags) {
                if (budgetFNFTags[i].parent == null) {
                    temp_name = tagElementMap[i];
                    componentMap[temp_name] = {};
                }
            }
            for (var i in budgetFNFTags) {
                temp_name = tagElementMap[i];
                if (budgetFNFTags[i].parent != null)
                    if (componentMap[tagElementMap[budgetFNFTags[i].parent]] != undefined) {
                        componentMap[tagElementMap[budgetFNFTags[i].parent]][temp_name] = [0, 0];
                    }

            }
            for (var i in filter_18117) {
                temp_name = tagElementMap[filter_18117[i].budget_fnf];

                for (var j in componentMap) {
                    for (var k in componentMap[j]) {
                        if (k == temp_name) {
                            componentMap[j][k][0] += removeNull(filter_18117[i].proposed_amount);
                            componentMap[j][k][1] += removeNull(filter_18117[i].actual_expense);
                        }
                    }
                }
            }
            var t = '';
            for (var i in componentMap) {
                var temp_number = Object.keys(componentMap[i]).length;
                var flag = 1;
                // console.log(temp_number);
                for (var j in componentMap[i]) {
                    var tr = "<tr>";
                    if (flag == 1) {
                        tr += "<td rowspan='" + temp_number + "'>" + i + "</td>";
                        flag = 0;
                    }
                    tr += "<td>" + j + "</td>";
                    tr += "<td>$ " + getCommasD(componentMap[i][j][0] / 65) + "</td>";
                    tr += "<td>$ " + getCommasD(componentMap[i][j][1] / 65) + "</td>";
                    tr += "</tr>";
                    t += tr;
                }
            }
            $('#table2').html(t);
        }


        if (ngoFilter == "IAHV") {
            for (var i in budgetIAHVTags) {
                if (budgetIAHVTags[i].parent == null) {
                    temp_name = tagElementMap[i];
                    componentMap[temp_name] = {};
                }
            }
            for (var i in budgetIAHVTags) {
                temp_name = tagElementMap[i];
                if (budgetIAHVTags[i].parent != null)
                    if (componentMap[tagElementMap[budgetIAHVTags[i].parent]] != undefined) {
                        componentMap[tagElementMap[budgetIAHVTags[i].parent]][temp_name] = [0, 0];
                    }

            }
            for (var i in filter_18117) {
                temp_name = tagElementMap[filter_18117[i].budget_iahv];

                for (var j in componentMap) {
                    for (var k in componentMap[j]) {
                        if (k == temp_name) {
                            componentMap[j][k][0] += removeNull(filter_18117[i].proposed_amount);
                            componentMap[j][k][1] += removeNull(filter_18117[i].actual_expense);
                        }
                    }
                }
            }
            var t = '';
            for (var i in componentMap) {
                var temp_number = Object.keys(componentMap[i]).length;
                var flag = 1;
                // console.log(temp_number);
                for (var j in componentMap[i]) {
                    var tr = "<tr>";
                    if (flag == 1) {
                        tr += "<td rowspan='" + temp_number + "'>" + i + "</td>";
                        flag = 0;
                    }
                    tr += "<td>" + j + "</td>";
                    tr += "<td>$ " + getCommasD(componentMap[i][j][0] / 65) + "</td>";
                    tr += "<td>$ " + getCommasD(componentMap[i][j][1] / 65) + "</td>";
                    tr += "</tr>";
                    t += tr;
                }
            }
            $('#table2').html(t);
        }


    }





}

function generateCarousel() {}



function getCommasD(currency) {
    if (currency == 0)
        return '0'
    else if (!currency)
        return '-'
    else if(currency < 0){
        return currency.toFixed(0);
    }
    else {
        x = (Math.round(currency)).toString();
        var lastThree = x.substring(x.length - 3);
        var otherNumbers = x.substring(0, x.length - 3);
        if (otherNumbers != '')
            lastThree = ',' + lastThree;
        var res = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + lastThree;
        return res
    }
}
function roundUP(number) {
    if (number >= 1000000) {
        return parseFloat((number / 1000000).toFixed(1)).toFixed(2) + ' M';
    } else return parseFloat((number / 1000).toFixed(0)).toFixed(2) + ' K';
}


function getCommas(currency) {
    if (currency == 0)
        return '0'
    else if (!currency)
        return '-'
    else {
        x = (Math.round(currency)).toString();
        var lastThree = x.substring(x.length - 3);
        var otherNumbers = x.substring(0, x.length - 3);
        if (otherNumbers != '')
            lastThree = ',' + lastThree;
        var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        return res
    }
}

window.onscroll = function() { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


$('#financialtab').find('a').css('color', 'rgb(57, 125, 184)');
$('#financialtab').css('background-color', '#D3D3D3');

// $('#teach').removeClass('header-title1').addClass('teach-title')
function sortTable(id,row) {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = id;
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = row.trim()
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("td")[0];
      y = rows[i + 1].getElementsByTagName("td")[0];
      //check if the two rows should switch place:
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}