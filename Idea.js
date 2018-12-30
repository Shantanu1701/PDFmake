var pie1;
var modaltable1;
var modaltable2;
$('#part1').show();

$('#part2').hide();

function getProfileData(query) {
    var mapObj = [];
    $.ajax({
        url: 'https://api.p3fy.com/api/analytics/table?q=' + JSON.stringify(query),
        method: 'GET',
        dataType: 'json',
        async: false,
        success: function(result) {
            mapObj = result.data;
        },
        error: function() {
            console.log("Error in getting profileData");
        }
    });
    return mapObj;
}

function filterData(data, filterArray, tagArray, tagElMapProgram) {
    if (filterArray.length == 0) {
        return data;
    }
    var filteredData = [];
    for (var j = 0; j < data.length; j++) {
        if (filterArray[0] == 'all') {
            if (data[j][tagArray[0]]) {
                filteredData.push(data[j]);
            }
        } else if (data[j][tagArray[0]]) {

            if (tagElMapProgram[parseInt(data[j][tagArray[0]])] == tagElMapProgram[filterArray[0]]) {
                //console.log(tagElMapProgram[data[j][tagArray[0]]].replace(/\s+/, ""));
                filteredData.push(data[j]);
            }

        }
    }


    filterArray.shift();
    tagArray.shift();
    return filterData(filteredData, filterArray, tagArray, tagElMapProgram);
}

function filterData1(data, filterArray, tagArray, tagElMapProgram, tagElMapProgram1) {
    if (filterArray.length == 0) {
        return data;
    }
    var filteredData = [];
    for (var j = 0; j < data.length; j++) {
        if (filterArray[0] == 'all') {
            if (data[j][tagArray[0]]) {
                filteredData.push(data[j]);
            }
        } else if (data[j][tagArray[0]]) {
            if (tagElMapProgram[parseInt(data[j][tagArray[0]])] == tagElMapProgram1[parseInt(filterArray[0])]) {
                //console.log(tagElMapProgram[data[j][tagArray[0]]].replace(/\s+/, ""));
                filteredData.push(data[j]);
            }

        }
    }
    filterArray.shift();
    tagArray.shift();
    return filterData1(filteredData, filterArray, tagArray, tagElMapProgram, tagElMapProgram1);
}

var myloc = {};
var mygal = {};
// var myIcon = L.icon({
//     iconUrl: "http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png",
//     iconSize: [40, 40],
//     iconAnchor: [20, 40]
// })
// L.mapbox.accessToken = 'pk.eyJ1Ijoic3JpcmFuZ3IiLCJhIjoiZDkwZmQyZWU2ZjczMjc4NDY3MjlhMzJjMDlmZWJlNDEifQ.KOGxA_ldJ-AQNd1LE_OwQA';
// var map1 = null;
// //var map2 = L.mapbox.map('cluster-map-2', 'mapbox.streets').setView([22.5833, 82.75], 3);
// var marker1 = null;
// //var marker2 = L.marker(new L.LatLng(12.9131707, 77.6237887), { icon: myIcon })
// $(document).ready(function(){
//     map1 = L.mapbox.map('cluster-map-1', 'mapbox.streets').setView([22.5833, 82.75], 3);;
//     marker1 = L.marker(new L.LatLng(12.9131707, 77.6237887), { icon: myIcon })
// })

var PROGRAM_ID2 = 233 // Tata comm
var tagElementMap = getTagElementMap(PROGRAM_ID2);
var PROGRAM_ID1 = 368
var tagElementMap1 = getTagElementMap(PROGRAM_ID1);

var query = {
    profileId: 3614 //PROJECT TARGETS (PROFILE)
};
var payload_3614 = getProfileData(query);

var query = {
    profileId: 1405 //PROJECT TARGETS (PROFILE)
};
var payload_1405 = getProfileData(query);

var query = {
    profileId: 1611 //PROJECT TARGETS (PROFILE)
};
var payload_1611 = getProfileData(query);

var query = {
    profileId: 31579
};
var payload_31579 = getProfileData(query)

var query = {
    profileId: 31578
};
var payload_31578 = getProfileData(query)
var query = {
    profileId: 1441 //Beneficiary Details from Helpage
};
var payload_1441 = getProfileData(query);
var query = {
    profileId: 4501 //Beneficiary Details from Helpage
};
var payload_4501 = getProfileData(query);
var query = {
    profileId: 4506 //Beneficiary Details from Helpage
};
var payload_4506 = getProfileData(query);
var query = {
    profileId: 4503 //Beneficiary Details from Helpage
};
var payload_4503 = getProfileData(query);

var query = {
    profileId: 31133 //Beneficiary Details from Helpage
};
var payload_31133 = getProfileData(query);
var query = {
    profileId: 31134 //Beneficiary Details from Helpage
};
var payload_31134 = getProfileData(query);

var query = {
    profileId: 31135 //Beneficiary Details from Helpage
};
var payload_31135 = getProfileData(query);
var query = {
    profileId: 31576 //Beneficiary Details from Helpage
};
var payload_31576 = getProfileData(query);

var query = {
    profileId: 4505 //Beneficiary Details from Helpage
};
var payload_4505 = getProfileData(query);


var query = {
    profileId: 4504 //Beneficiary Details from Helpage
};
var payload_4504 = getProfileData(query);
var cardsonfilter = { "where": { "profileId": 1579 } };
var arr = [];
var payload_1579 = $.get('https://api-gateway.p3fy.com:443/api/profileInstances?filter=' + JSON.stringify(cardsonfilter) + '&access_token=' + ACCESS_TOKEN, function(result) {
    for (var i in result) {
        arr.push(result[i]['data']);
    }
    // id = result[0]['id'];
});
$('#financialYear').select2();
$('#quarter').select2();
$('#gender').select2();
$('#gender1').select2();
$('#training').select2();
$('#courses').select2();
var tagIdYears = 975;
var listYears = getChildParentMapTag(tagIdYears)["null"];
yearsHtml = '';
for (i in listYears) {
    yearsHtml += '<option value="' + listYears[i] + '">' + tagElementMap[listYears[i]] + '</option>';
}
$('#financialYear').append(yearsHtml);
$("#financialYear").val(476685).trigger("change");
// $('#quartcer').val("all").trigger("change");
$("#gender").val("all").trigger("change");
$("#gender1").val("all").trigger("change");
$("#training").val("all").trigger("change");
// $("#financialYear").select2().select2("val", 14448)

var tagIdQuarter = 979;
var listQuarters = getChildParentMapTag(tagIdQuarter)["null"];
quarterHtml = '';
for (i in listQuarters) {
    quarterHtml += '<option value="' + listQuarters[i] + '">' + tagElementMap[listQuarters[i]] + '</option>';
}
$('#quarter').append(quarterHtml);

defaultYear = 476685;
defaultQuarter = 'all';
defaultgender = 'all';
defaultgender1 = 'all';
defaulttraining = 'all';
defaultcourses = 'all';
applyfilter();
$('#financialYear').on('select2:select', function() {
    defaultYear = this.value;

    if (defaultYear == 14448) {
        $('#part1').hide();

        $('#part2').show();
    } else if (defaultYear != 14448) {
        $('#part1').show();

        $('#part2').hide();
    }
    applyfilter();
});
$('#quarter').on('select2:select', function() {
    defaultQuarter = this.value;
    applyfilter();
});

$('#gender1').on('select2:select', function() {
    defaultgender1 = this.value;
    applyfilter();
});
$('#training').on('select2:select', function() {
    defaulttraining = this.value;
    applyfilter();
});
$('#courses').on('select2:select', function() {
    defaultcourses = this.value;
    applyfilter();
});

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

function applyfilter() {
    $.when(payload_31135, payload_31134, payload_31133, payload_4503, payload_4506, payload_1405, payload_3614, payload_4501, payload_4505, payload_4504, payload_1611, payload_1441, payload_1579, payload_31578, payload_31579).then(function() {

        var data1 = filterData1(payload_1611, [defaultYear], ["select_year"], tagElementMap1, tagElementMap);
        var data7 = filterData1(payload_1611, [defaultYear, defaultQuarter], ["select_year", "select_quarter"], tagElementMap1, tagElementMap);
        var data2 = filterData(payload_4501, [defaultYear, defaultQuarter], ["select_year", "select_quarter"], tagElementMap);
        var data6 = filterData(payload_4501, [defaultYear, defaultQuarter, defaulttraining], ["select_year", "select_quarter", "training_level"], tagElementMap);
        var data55 = filterData(payload_4501, [defaultYear, defaultQuarter, defaultcourses], ["select_year", "select_quarter", "course_enrolled"], tagElementMap);
        var data8 = filterData(payload_4505, [defaultYear, defaultQuarter], ["select_year", "select_quarter"], tagElementMap);
        var data9 = filterData(payload_4505, [defaultYear], ["select_year"], tagElementMap);
        var data10 = filterData(payload_4504, [defaultYear], ["select_year"], tagElementMap);
        var data4 = filterData(payload_4503, [defaultYear, defaultQuarter], ["select_year", "select_quarter"], tagElementMap);
        var data3 = filterData(payload_4506, [defaultYear, defaultQuarter], ["select_year", "select_quarter"], tagElementMap);
        var data12 = filterData(payload_4506, [defaultYear, defaultQuarter], ["select_year", "select_quarter"], tagElementMap);
        var data13 = filterData(payload_4506, [defaultYear, defaultQuarter, defaultgender1], ["select_year", "select_quarter", "gender"], tagElementMap);
        var data5 = filterData(payload_1405, [defaultYear], ["select_year"], tagElementMap);
        var data11 = filterData1(payload_3614, [defaultYear], ["year"], tagElementMap1, tagElementMap);
        var data14 = filterData(payload_4504, [defaultYear, defaultQuarter], ["select_year", "select_quarter"], tagElementMap);
        var data15 = filterData(payload_31579, [defaultYear, defaultQuarter], ["select_year", "select_quarter"], tagElementMap);
        var data18 = filterData(payload_31578, [defaultYear, defaultQuarter], ["select_year", "select_quarter"], tagElementMap);
        var data21 = filterData(payload_31576, [defaultYear, defaultQuarter], ["select_year", "select_quarter"], tagElementMap);
        var data22 = filterData(payload_31133, [defaultYear], ["financial_year"], tagElementMap);
        var data23 = filterData(payload_31134, [defaultYear], ["financial_year"], tagElementMap);
        var data24 = filterData(payload_31135, [defaultYear], ["financial_year"], tagElementMap);


        $.when(data24, data23, data22, data21, data18, data15, data12, data4, data6, data1, data2, data3, data5, payload_1441, payload_1579, data7, data11, data8, data9, data10, data55).then(function() {
            createCards(data24, data23, data22, data21, data18, data15, data12, data13, data14, data4, data6, data1, data2, data3, data5, payload_1441, arr, data7, data11, data8, data9, data10, data55);
        });
    });
}

function createCards(data24, data23, data22, data21, data18, data15, data12, data13, data14, data4, data6, data1, data2, data3, data5, data16, data17, data7, data11, data8, data9, data10, data55) {
    var card1 = 0;
    var card2 = 0;
    var card3 = 0;
    var card4 = 0;
    var card5 = 0;
    var card6 = 0;
    var card7 = 0;
    var card8 = 0;
    var card9 = 0;
    var card10 = 0;
    var avg = 0;
    var prog1 = 0;
    var prog2 = 0;
    var prog3 = 0;
    var prog4 = 0;
    var prog5 = 0;
    var prog6 = 0;
    var prog7 = 0;
    var prog8 = 0;
    var prog9 = 0;
    var prog10 = 0;
    var prog11 = 0;
    var prog12 = 0;
    var prog13 = 0;
    var prog14 = 0;
    var prog15 = 0;
    var prog16 = 0;
    var td1 = 0;
    var td2 = 0;
    var td3 = 0;
    var td4 = 0;
    var html = '';
    var htmlc = '';
    $('#maintable2').empty();
    $('#maintable3').empty();
    $('#carousel3').empty();
    $('#carousel2').empty();
    var tra1 = 0;
    var pla1 = 0;
    var cert1 = 0;
    var tra2 = 0;
    var pla2 = 0;
    var cert2 = 0;
    var tra3 = 0;
    var pla3 = 0;
    var cert3 = 0;
    var tra4 = 0;
    var pla4 = 0;
    var cert4 = 0;
    var tra5 = 0;
    var pla5 = 0;
    var cert5 = 0;
    var str1 = '';
    var temp1 = 0;
    var temp2 = 0;
    var temp3 = 0;
    var temp4 = 0;
    var temp5 = 0;
    var temp6 = 0;
    var temp7 = 0;
    var temp8 = 0;
    var temp11 = 0;
    var temp12 = 0;
    var temp13 = 0;
    var temp14 = 0;
    var temp15 = 0;
    var temp16 = 0;
    var temp17 = 0;
    var temp18 = 0;
    var temp21 = 0;
    var temp22 = 0;
    var temp23 = 0;
    var temp24 = 0;
    var temp25 = 0;
    var temp26 = 0;
    var temp27 = 0;
    var temp28 = 0;
    var temp29 = 0;
    var temp30 = 0;
    var temp31 = 0;
    var temp32 = 0;
    var temp33 = 0;
    var temp34 = 0;
    var temp35 = 0;
    var male = 0;
    var female = 0;
    var others = 0;
    var cardx1 = 0;
    var cardx2 = 0;
    var cardx3 = 0;
    var cardx4 = 0;
    var cardx5 = 0;
    var cardx6 = 0;
    var cardx7 = 0;
    var cardx8 = 0;
    var cardx9 = 0;
    var cardx10 = 0;
    var cardx11 = 0;
    // var c1 = 0
    // var c2 = 0;
    // var c3 = 0;
    // var c4 = 0;
    // var c5 = 0;
    var m1_count = 0;
    var m2_count = 0;

    if ($.fn.DataTable.isDataTable('#' + 'download-table')) {
        $('#' + 'download-table').DataTable().destroy();
    }
    if ($.fn.DataTable.isDataTable('#' + 'download-table1')) {
        $('#' + 'download-table1').DataTable().destroy();
    }
    /*    if ($.fn.DataTable.isDataTable('#' + 'download-table2')) {
            $('#' + 'download-table2').DataTable().destroy();
        }*/



    for (var i in data12) {
        if (data12[i]['candidate_name'])
            td1 += 1;
        if (data12[i]['trained'] == 15422)
            td2 += 1;
        if (data12[i]['certified'] == 15422)
            td3 += 1;
        if (data12[i]['dropout'] == 15422)
            td4 += 1;
        if (data12[i]['gender'] == 18959)
            male += 1;
        if (data12[i]['gender'] == 18960)
            female += 1;
        if (data12[i]['gender'] == 18961)
            others += 1;
    }
    for (var i in data13) {
        if (data13[i]['candidate_name']) {
            if (data13[i]['caste'] == 18964) {
                temp21 += 1
            }
            if (data13[i]['caste'] == 42697) {
                temp24 += 1
            }
            if (data13[i]['caste'] == 18962) {
                temp27 += 1
            }
            if (data13[i]['caste'] == 18963) {
                temp30 += 1
            }
            if (data13[i]['caste'] == 18965) {
                temp33 += 1
            }
        }
        if (data13[i]['trained'] == 15422) {
            if (data13[i]['caste'] == 18964) {
                temp22 += 1
            }
            if (data13[i]['caste'] == 42697) {
                temp25 += 1
            }
            if (data13[i]['caste'] == 18962) {
                temp28 += 1
            }
            if (data13[i]['caste'] == 18963) {
                temp31 += 1
            }
            if (data13[i]['caste'] == 18965) {
                temp34 += 1
            }
        }
        if (data13[i]['certified'] == 15422) {
            if (data13[i]['caste'] == 18964) {
                temp23 += 1
            }
            if (data13[i]['caste'] == 42697) {
                temp26 += 1
            }
            if (data13[i]['caste'] == 18962) {
                temp29 += 1
            }
            if (data13[i]['caste'] == 18963) {
                temp32 += 1
            }
            if (data13[i]['caste'] == 18965) {
                temp35 += 1
            }
        }
    }
    htmlc = '<tr><td>OBC</td><td>' + temp21 + '</td><td>' + temp22 + '</td><td>' + temp23 + '</td></tr>' + '<tr><td>Other</td><td>' + temp24 + '</td><td>' + temp25 + '</td><td>' + temp26 + '</td></tr>' + '<tr><td>SC</td><td>' + temp27 + '</td><td>' + temp28 + '</td><td>' + temp29 + '</td></tr>' + '<tr><td>ST</td><td>' + temp30 + '</td><td>' + temp31 + '</td><td>' + temp32 + '</td></tr>' + '<tr><td>General</td><td>' + temp33 + '</td><td>' + temp34 + '</td><td>' + temp35 + '</td></tr>';
    $('#maintable3').html(htmlc);
    var table3 = $("#download-table1").DataTable({
        "bDestroy": true,
        "scrollX": false,
        "searching": false,
        "paging": false,
        "info": false,
        /*"lengthMenu": [
            [5, 10, 25, 50, -1],
            [5, 10, 25, 50, "All"]
        ]*/
    });

    /*    var table3 = $("#download-table2").DataTable({
            "bDestroy": true,
            "scrollX": false,
            "searching": false,
            "paging": false,
            "info": false,
            /*"lengthMenu": [
                [5, 10, 25, 50, -1],
                [5, 10, 25, 50, "All"]
            ]
        });*/
    var fileeeee = null;
    for (var i in data8) {
        if (data8[i]['batches']) {
            card7 += data8[i]['batches']
        }
        if (data8[i]['reach_out']) {
            card4 += data8[i]['reach_out']
            card8 += data8[i]['reach_out']
        }
        if (data8[i]['entrepreneurship_groups']) {
            card9 += data8[i]['entrepreneurship_groups']
        }
        if (data8[i]['initiating_business']) {
            card10 += data8[i]['initiating_business']
        }
        if (data8[i]['edp_data']) {
            fileeeee = data8[i]['edp_data']
        }
    }
    if (fileeeee != null) {
        $('#upload').html('<a href="' + fileeeee + '" download><button type="button" style="width:100px" class="btn btn-block btn-primary">Download</button></a>')
    } else {
        $('#upload').html('');
    }
    for (var i in data9) {
        if (data9[i]['select_quarter'] == 14469) {
            if (data9[i]['exhibitions']) {
                temp1 += data9[i]['exhibitions']
            }
            if (data9[i]['revenue']) {
                temp2 += data9[i]['revenue']
            }
        }
        if (data9[i]['select_quarter'] == 14470) {
            if (data9[i]['exhibitions']) {
                temp3 += data9[i]['exhibitions']
            }
            if (data9[i]['revenue']) {
                temp4 += data9[i]['revenue']
            }
        }
        if (data9[i]['select_quarter'] == 14471) {
            if (data9[i]['exhibitions']) {
                temp5 += data9[i]['exhibitions']
            }
            if (data9[i]['revenue']) {
                temp6 += data9[i]['revenue']
            }
        }
        if (data9[i]['select_quarter'] == 14472) {
            if (data9[i]['exhibitions']) {
                temp7 += data9[i]['exhibitions']
            }
            if (data9[i]['revenue']) {
                temp8 += data9[i]['revenue']
            }
        }
    }
    var aarraa1 = [];
    var aarraa2 = [];
    var aarraa3 = [];
    var aarraa4 = [];
    for (var i in data10) {
        if (data10[i]['select_quarter'] == 14469) {
            if (data10[i]['session_number']) {
                var ccccc = data10[i]['topics']
                ccccc = ccccc.split(";");
                for (var j in ccccc) {
                    aarraa1.push(ccccc[j])
                }
                temp11 += data10[i]['session_number']
            }
            if (data10[i]['participation']) {
                temp12 += data10[i]['participation']
            }
        }
        if (data10[i]['select_quarter'] == 14470) {
            if (data10[i]['session_number']) {
                var ccccc = data10[i]['topics']
                ccccc = ccccc.split(";");
                for (var j in ccccc) {
                    aarraa2.push(ccccc[j])
                }
                temp13 += data10[i]['session_number']
            }
            if (data10[i]['participation']) {
                temp14 += data10[i]['participation']
            }
        }
        if (data10[i]['select_quarter'] == 14471) {
            if (data10[i]['session_number']) {
                var ccccc = data10[i]['topics']
                ccccc = ccccc.split(";");
                for (var j in ccccc) {
                    aarraa3.push(ccccc[j])
                }
                temp15 += data10[i]['session_number']
            }
            if (data10[i]['participation']) {
                temp16 += data10[i]['participation']
            }
        }
        if (data10[i]['select_quarter'] == 14472) {
            if (data10[i]['session_number']) {
                var ccccc = data10[i]['topics']
                ccccc = ccccc.split(";");
                for (var j in ccccc) {
                    aarraa4.push(ccccc[j])
                }
                temp17 += data10[i]['session_number']
            }
            if (data10[i]['participation']) {
                temp18 += data10[i]['participation']
            }
        }
    }
    for (var i in data6) {
        if (data6[i]['name']) {
            if (data6[i]['candidate_category'] == 18964) {
                tra1++;
            }
            if (data6[i]['candidate_category'] == 42697) {
                tra2++;
            }
            if (data6[i]['candidate_category'] == 18962) {
                tra3++;
            }
            if (data6[i]['candidate_category'] == 18963) {
                tra4++;
            }
            if (data6[i]['candidate_category'] == 18965) {
                tra5++;
            }
            if (data6[i]['candidate_trained'] == 15422 && data6[i]['candidate_category'] == 18964) {
                pla1++;
            }
            if (data6[i]['candidate_trained'] == 15422 && data6[i]['candidate_category'] == 42697) {
                pla2++;
            }
            if (data6[i]['candidate_trained'] == 15422 && data6[i]['candidate_category'] == 18962) {
                pla3++;
            }
            if (data6[i]['candidate_trained'] == 15422 && data6[i]['candidate_category'] == 18963) {
                pla4++;
            }
            if (data6[i]['candidate_trained'] == 15422 && data6[i]['candidate_category'] == 18965) {
                pla5++;
            }
        }
    }
    let catArr = [
        ['18-21', 0, 0, 0],
        ['22-25', 0, 0, 0],
        ['26-35', 0, 0, 0],
        ['Above 36', 0, 0, 0],
        ['Not disclosed', 0, 0, 0],
        ['Total', 0, 0, 0],
        ['Less than 18', 0, 0, 0]
    ]
    let count = 0
    for (var i in data4) {
        for (var j in data6) {
            if (data4[i]['candidate_name'] == data6[j]['recordId']) {
                if (data4[i].initiated_business == 15422) {
                    if (data6[j].candidate_age >= 0 && data6[j].candidate_age <= 17) {
                        catArr[6][3]++
                    }
                    if (data6[j].candidate_age >= 18 && data6[j].candidate_age <= 21) {
                        catArr[0][3]++
                    } else if (data6[j].candidate_age >= 22 && data6[j].candidate_age <= 25) {
                        catArr[1][3]++
                    } else if (data6[j].candidate_age >= 26 && data6[j].candidate_age <= 35) {
                        catArr[2][3]++
                    } else if (data6[j].candidate_age >= 36) {
                        catArr[3][3]++
                    } else if (data6[j].candidate_age == null) {
                        catArr[4][3]++
                    }
                }
            }
        }
    }
    for (var i in data6) {
        if (data6[i].name) {
            if (data6[i].candidate_age >= 0 && data6[i].candidate_age <= 17) {
                catArr[6][1]++
            } else if (data6[i].candidate_age >= 18 && data6[i].candidate_age <= 21) {
                catArr[0][1]++
            } else if (data6[i].candidate_age >= 22 && data6[i].candidate_age <= 25) {
                catArr[1][1]++
            } else if (data6[i].candidate_age >= 26 && data6[i].candidate_age <= 35) {
                catArr[2][1]++
            } else if (data6[i].candidate_age >= 36) {
                catArr[3][1]++
            } else if (data6[i].candidate_age == null) {
                catArr[4][1]++
            }
        }
        if (data6[i].candidate_trained == 15422) {
            if (data6[i].candidate_age >= 0 && data6[i].candidate_age <= 17) {
                catArr[6][2]++
            } else if (data6[i].candidate_age >= 18 && data6[i].candidate_age <= 21) {
                catArr[0][2]++
            } else if (data6[i].candidate_age >= 22 && data6[i].candidate_age <= 25) {
                catArr[1][2]++
            } else if (data6[i].candidate_age >= 26 && data6[i].candidate_age <= 35) {
                catArr[2][2]++
            } else if (data6[i].candidate_age >= 36) {
                catArr[3][2]++
            } else if (data6[i].candidate_age == null) {
                catArr[4][2]++
            }
        }
    }
    catArr[5][1] = catArr[0][1] + catArr[1][1] + catArr[2][1] + catArr[3][1] + catArr[4][1] + catArr[6][1]
    catArr[5][2] = catArr[0][2] + catArr[1][2] + catArr[2][2] + catArr[3][2] + catArr[4][2] + catArr[6][2]
    catArr[5][3] = catArr[0][3] + catArr[1][3] + catArr[2][3] + catArr[3][3] + catArr[4][3] + catArr[6][3]

    let table15 = $('#download-table4').DataTable({
        data: catArr,
        columns: [{
                title: 'Category'
            },
            {
                title: 'Candidates Enrolled'
            },
            {
                title: 'Candidates Trained'
            },
            {
                title: 'Candidates initiated business'
            }

        ],
        "lengthChange": false,
        "searching": false,
        "paging": false,
        "autoWidth": false,
        "bDestroy": true,
        "info": false,

    });

    for (var i in data4) {
        for (var j in data6) {
            if (data4[i]['candidate_name'] == data6[j]['recordId']) {
                //console.log(data4[i]['candidate_name'])
                if (data4[i]['initiated_business'] == 15422 && data6[j]['candidate_category'] == 18964)
                    cert1 += 1;
                if (data4[i]['initiated_business'] == 15422 && data6[j]['candidate_category'] == 42697)
                    cert2 += 1;
                if (data4[i]['initiated_business'] == 15422 && data6[j]['candidate_category'] == 18962)
                    cert3 += 1;
                if (data4[i]['initiated_business'] == 15422 && data6[j]['candidate_category'] == 18963)
                    cert4 += 1;
                if (data4[i]['initiated_business'] == 15422 && data6[j]['candidate_category'] == 18965)
                    cert5 += 1;
            }
        }
    }

    html = '<tr><td>OBC</td><td>' + tra1 + '</td><td>' + pla1 + '</td><td>' + cert1 + '</td></tr>' + '<tr><td>Other</td><td>' + tra2 + '</td><td>' + pla2 + '</td><td>' + cert2 + '</td></tr>' + '<tr><td>SC</td><td>' + tra3 + '</td><td>' + pla3 + '</td><td>' + cert3 + '</td></tr>' + '<tr><td>ST</td><td>' + tra4 + '</td><td>' + pla4 + '</td><td>' + cert4 + '</td></tr>' + '<tr><td>General</td><td>' + tra5 + '</td><td>' + pla5 + '</td><td>' + cert5 + '</td></tr>' + '<tr><td>Total</td><td>' + parseInt(tra1 + tra2 + tra3 + tra4 + tra5) + '</td><td>' + parseInt(pla1 + pla2 + pla3 + pla4 + pla5) + '</td><td>' + parseInt(cert1 + cert2 + cert3 + cert4 + cert5) + '</td></tr>';
    $('#maintable2').html(html);

    var table2 = $("#download-table").DataTable({
        "bDestroy": true,
        "scrollX": false,
        "searching": false,
        "paging": false,
        "info": false,
        /*"lengthMenu": [
            [5, 10, 25, 50, -1],
            [5, 10, 25, 50, "All"]
        ]*/
    });

    // for (var i in data1) {
    //     if (data1[i]['select_partner'] == 22723) {
    //         if (data1[i]['funds_allocated'])
    //             card1 += data1[i]['funds_allocated']
    //         if (data1[i]['funds_disbursed'])
    //             card2 += data1[i]['funds_disbursed']
    //         if (data1[i]['amount_spent_direct'])        //utilized
    //         card3 += data1[i]['amount_spent_direct']    //utilized
    //     }

    for (var i in data1) {
        if (data1[i]['select_partner'] == 22723) {
            if (data1[i]['funds_allocated'])
                card1 += data1[i]['funds_allocated']
            if (data1[i]['funds_disbursed'])
                card2 += data1[i]['funds_disbursed']
        }

    }

    for (var i in data7) {
        if (data7[i]['select_partner'] == 22723) {
            if (data7[i]['amount_spent_direct']) //utilized
                card3 += data7[i]['amount_spent_direct']; //utilized        
        }

    }




    for (var i in data2) {
        if (data2[i]['candidate_trained'] == 15422)
            card4 += 1
    }
    for (var i in data55) {

        if (data55[i]['name'] && data55[i]['training_level'] == 63185) {
            prog1 += 1
            prog4 += 1
            prog8 += 1
        }
        if (data55[i]['name'] && data55[i]['training_level'] == 63186) {
            prog9 += 1
            prog12 += 1
            prog16 += 1
        }
        if (data55[i]['dropout'] == 15422 && data55[i]['training_level'] == 63185) {
            prog7 += 1
        }
        if (data55[i]['dropout'] == 15422 && data55[i]['training_level'] == 63186) {
            prog15 += 1
        }
        if (data55[i]['candidate_trained'] == 15422 && data55[i]['training_level'] == 63185) {
            prog3 += 1
            prog6 += 1
        }
        if (data55[i]['candidate_trained'] == 15422 && data55[i]['training_level'] == 63186) {
            prog11 += 1
            prog14 += 1
        }
    }
    var counting1 = 0;
    var counting2 = 0;
    for (var i in data4) {
        for (var j in data2) {
            if (data4[i]['candidate_name'] == data2[j]['recordId']) {
                if (data4[i]['monthly_earning'] && data2[j]['training_level'] == 63185) {
                    counting1++;
                    card5 += data4[i]['monthly_earning']
                }
                if (data4[i]['monthly_earning'] && data2[j]['training_level'] == 63186) {
                    counting2++;
                    card6 += data4[i]['monthly_earning']
                }
            }
        }
    }
    for (var i in data4) {
        for (var j in data55) {
            if (data4[i]['candidate_name'] == data55[j]['recordId']) {
                if (data4[i]['initiated_business'] == 15422 && data55[j]['training_level'] == 63185) {
                    prog5 += 1;
                }
                if (data4[i]['initiated_business'] == 15422 && data55[j]['training_level'] == 63186) {
                    prog13 += 1;
                }

            }
        }
    }
    for (var i in data3) {
        if (data3[i]['trained'] == 15422)
            card4 += 1
    }
    for (var i in data5) {
        if (data5[i]['basic_training_target']) {
            prog2 += data5[i]['basic_training_target'];
        }
        if (data5[i]['advanced_training']) {
            prog10 += data5[i]['advanced_training'];
        }
    }

    var str = '';
    var l = 0;
    for (var i in data16) {
        if (data16[i]['partner'] == 42824) {
            if (data16[i].submissionLong && data16[i].submissionLat) {
                myloc[data16[i].recordId] = { 'lat': data16[i].submissionLat, 'lon': data16[i].submissionLong }
            }
            file = data16[i].case_study_file ? '<a href = "' + data16[i].case_study_file + '" target="_blank">' + '<img src = "../Uplon-v1.4/tatacomm_new/img/download.png" height = "30px">' + '</a>' : '';
            partner = data16[i].partner ? tagElementMap[data16[i].partner] : '';
            title = data16[i]['title'] ? data16[i]['title'] : '';
            //var str = '';
            if (l == 0) {
                l++;
                str += '<div class = "carousel-item active">' +
                    '<div class = "row">' +
                    '<div class = "col-sm-4 col-xs-12">' +
                    '<img class = "media-content" id = "img4" src = " ' + data16[i].case_pic + '"/>' +
                    '</div>' +
                    '<div class = "col-sm-8 col-xs-12">' +
                    '<center><h4> ' + partner + '</h4></center>' +
                    '<blockquote class = "p-20 desc-text" style = "padding-left:0px !important;" > ' + title + '</blockquote>' +
                    '<div class = "row" style = "width:180px">' +
                    '<div class = "col-md-4 col-xs-12">' + file +
                    '</div>' +
                    '<div class = "col-md-4 col-xs-12" >' +
                    '<a data-toggle = "modal" data-target = "#locationModal" href = "#locationModal" data-id = "' + data16[i].recordId + '" >' +
                    '<img src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwJ0w2g5Tzyo3WlNfPf5RhZSVKuNGsyxYhFz9127O2onDAzzlj8Q" height = "30px">' +
                    '</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            } else {
                str += '<div class = "carousel-item">' +
                    '<div class = "row">' +
                    '<div class = "col-sm-4 col-xs-12">' +
                    '<img class = "media-content" id = "img4" src = " ' + data16[i].case_pic + '"/>' +
                    '</div>' +
                    '<div class = "col-sm-8 col-xs-12">' +
                    '<center><h4> ' + partner + '</h4></center>' +
                    '<blockquote class = "p-20 desc-text" style = "padding-left:0px !important;" > ' + title + '</blockquote>' +
                    '<div class = "row" style = "width:180px">' +
                    '<div class = "col-md-4 col-xs-12">' + file +
                    '</div>' +
                    '<div class = "col-md-4 col-xs-12" >' +
                    '<a data-toggle = "modal" data-target = "#locationModal" href = "#locationModal" data-id = ' + data16[i].recordId + ' >' +
                    '<img src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwJ0w2g5Tzyo3WlNfPf5RhZSVKuNGsyxYhFz9127O2onDAzzlj8Q" height = "30px">' +
                    '</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
        }

    }
    $('#carousel2').html(str);
    var y = 0;

    for (i in data17) {
        if (data17[i]['partner'] == 42824) {
            if (data17[i].submissionLong && data17[i].submissionLat) {
                mygal[data17[i].recordId] = { 'lat': data17[i].submissionLat, 'lon': data17[i].submissionLong }
            }
            partner = data17[i].partner ? tagElementMap[data17[i].partner] : '';
            project = data17[i].project ? data17[i].project : '';
            name = data17[i].name ? data17[i].name : '';
            //var str1 = '';
            if (y == 0) {
                y++;
                str1 += '<div class = "carousel-item active">' +
                    '<div class = "row">' +
                    '<div class = "col-sm-4 col-xs-12">' +
                    '<img class = "media-content" id = "img4" src = " ' + data17[i].photo + '"/>' +
                    '</div>' +
                    '<div class = "col-sm-8 col-xs-12">' +
                    '<center><h4> ' + partner + '</h4></center>' +
                    '<blockquote class = "p-20 desc-text" style = "padding-left:0px !important;" > ' + project + '</blockquote>' +
                    '<blockquote class = "p-10 desc-text" style = "padding-left:0px !important;" > ' + name + '</blockquote>' +
                    '<div class = "row" style = "width:180px">' +
                    '<div class = "col-md-4 col-xs-12" >' +
                    '<a data-toggle = "modal" data-target = "#locationModal" href = "#locationModal" data-id = "' + data17[i].recordId + '" >' +
                    '<img src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwJ0w2g5Tzyo3WlNfPf5RhZSVKuNGsyxYhFz9127O2onDAzzlj8Q" height = "30px">' +
                    '</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            } else {
                str1 += '<div class = "carousel-item">' +
                    '<div class = "row">' +
                    '<div class = "col-sm-4 col-xs-12">' +
                    '<img class = "media-content" id = "img4" src = " ' + data17[i].photo + '"/>' +
                    '</div>' +
                    '<div class = "col-sm-8 col-xs-12">' +
                    '<center><h4> ' + partner + '</h4></center>' +
                    '<blockquote class = "p-20 desc-text" style = "padding-left:0px !important;" > ' + project + '</blockquote>' +
                    '<blockquote class = "p-10 desc-text" style = "padding-left:0px !important;" > ' + name + '</blockquote>' +
                    '<div class = "row" style = "width:180px">' +
                    '<div class = "col-md-4 col-xs-12" >' +
                    '<a data-toggle = "modal" data-target = "#locationModal" href = "#locationModal" data-id = ' + data17[i].recordId + ' >' +
                    '<img src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwJ0w2g5Tzyo3WlNfPf5RhZSVKuNGsyxYhFz9127O2onDAzzlj8Q" height = "30px">' +
                    '</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
            $('#carousel3').html(str1);
        }
    }



    // $('#locationModal').on('shown.bs.modal', function(event) {
    //     var id = $(event.relatedTarget).data('id')
    //     if (myloc[id] != undefined) {
    //         map1.invalidateSize()
    //         map1.removeLayer(marker1)
    //         marker1 = L.marker(new L.LatLng(myloc[id].lat, myloc[id].lon), { icon: myIcon })
    //         map1.addLayer(marker1)
    //         map1.setView([myloc[id].lat, myloc[id].lon], 10);
    //     } else if (mygal[id] != undefined) {
    //         map1.invalidateSize()
    //         map1.removeLayer(marker1)
    //         marker1 = L.marker(new L.LatLng(mygal[id].lat, mygal[id].lon), { icon: myIcon })
    //         map1.addLayer(marker1)
    //         map1.setView([mygal[id].lat, mygal[id].lon], 10);
    //     } else {
    //         map1.invalidateSize();
    //         map1.removeLayer(marker1);
    //         map1.setView([22.5833, 82.75], 3);
    //     }
    //     /*map1.invalidateSize()
    //     map1.removeLayer(marker1)
    //     marker1 = L.marker(new L.LatLng(21.6335856, 73.1508257), { icon: myIcon })
    //     map1.addLayer(marker1)*/
    //     //map1.setView([21.6335856, 73.1508257], 10);
    // });
    var name = '';
    var partner = '';
    var location = '';
    var funding_entity = '';
    var start_date = '';
    var description = '';
    var partner_logo = ''
    var end_date = '';
    var mou_start_date = '';
    var aades = '';
    var mou_end_date = '';
    //console.log(defaultYear)
    for (var i in data11) {
        if (data11[i]['partner'] == 'IDEA Foundation') {
            name = data11[i]['name'];
            partner = data11[i]['partner'];
            location = data11[i]['location'];
            funding_entity = data11[i]['funding_entity'];
            partner_logo = data11[i]['partner_logo'];
            aades = data11[i]['aa_component'];
            description = data11[i]['project_description'];
            start_date = moment(data11[i]['start_date']).format('DD-MM-YYYY') + " to";
            end_date = moment(data11[i]['end_date']).format('DD-MM-YYYY');
            mou_start_date = moment(data11[i]['mou_start_date']).format('DD-MM-YYYY') + " to";
            mou_end_date = moment(data11[i]['mou_end_date']).format('DD-MM-YYYY');
        }
    }
    $('#check1').html(name)
    $('#check2').html(partner)
    $('#check3').html(location)
    $('#check4').html(funding_entity)
    $('#check5').html(start_date);
    $('#check7').html(end_date)
    $('#check9').html(mou_start_date);
    $('#check10').html(mou_end_date)
    $('#check11').html(aades)
    $('#check6').html(description)
    $('#check8').attr("src", partner_logo);



    $('#card1').html(getCommas(card1));
    $('#heading').html("Total Budget Allocated");
    $('#card2').html(getCommas(card2));
    $('#card3').html(getCommas(card3));
    $('#card4').html(getCommas(card4));
    if (counting1 == 0) {
        $('#card5').html(0);

    } else {

        $('#card5').html((card5 / counting1).toFixed(0));
    }
    if (counting2 == 0) {
        $('#card6').html(0);

    } else {
        $('#card6').html((card6 / counting2).toFixed(0));
    }
    $('#card7').html(card7);
    $('#card8').html(card8);
    $('#card9').html(card9);
    $('#card10').html(card10);
    $('#td1').html(td1);
    $('#td2').html(td2);
    $('#td3').html(td3);
    $('#td4').html(td4);


    $("#enrolledP").text(prog1 + "/" + prog2);

    var x = "width: " + (prog1 / prog2) * 100 + "%";

    $('#enrolled').attr('value', prog1);
    $('#enrolled').attr('max', prog2);

    $("#enrolledP1").text(prog3 + "/" + prog4);

    var x = "width: " + (prog3 / prog4) * 100 + "%";

    $('#enrolled1').attr('value', prog3);
    $('#enrolled1').attr('max', prog4);

    $("#enrolledP2").text(prog5 + "/" + prog6);

    var x = "width: " + (prog5 / prog6) * 100 + "%";

    $('#enrolled2').attr('value', prog5);
    $('#enrolled2').attr('max', prog6);

    $("#enrolledP3").text(prog7 + "/" + prog8);

    var x = "width: " + (prog7 / prog8) * 100 + "%";
    var w = ((prog7 / prog8) * 100).toFixed(0) + '%';
    // $('#enrolled3').attr('value', prog7);
    // $('#enrolled3').attr('max', prog8);
    $('#enrolled3').css('width', w);
    $('#enrolled3').css(
        'background-color', '#ff0000');
    // $('#enrolled3').attr('width', prog8);


    $("#enrolledP4").text(prog9 + "/" + prog10);
    var x = "width: " + (prog9 / prog10) * 100 + "%";
    $('#enrolled4').attr('value', prog9);
    $('#enrolled4').attr('max', prog10);

    $("#enrolledP5").text(prog11 + "/" + prog12);
    var x = "width: " + (prog11 / prog12) * 100 + "%";
    $('#enrolled5').attr('value', prog11);
    $('#enrolled5').attr('max', prog12)

    $("#enrolledP6").text(prog13 + "/" + prog14);
    var x = "width: " + (prog13 / prog14) * 100 + "%";
    $('#enrolled6').attr('value', prog13);
    $('#enrolled6').attr('max', prog14);

    $("#enrolledP7").text(prog15 + "/" + prog16);
    var x = "width: " + (prog15 / prog16) * 100 + "%";
    var w = ((prog15 / prog16) * 100).toFixed(0) + '%';
    $('#enrolled7').css('width', w);
    $('#enrolled7').css(
        'background-color', '#ff0000');

    $('#q1').html('');
    var list = ''
    list = $("#q1").append('<ul></ul>').find('ul');
    for (var i = 0; i < aarraa1.length; i++) {
        list.append('<li>' + aarraa1[i] + '</li>');
    }
    $('#q1').html(list);

    $('#q2').html('');
    var list = ''
    list = $("#q2").append('<ul></ul>').find('ul');
    for (var i = 0; i < aarraa2.length; i++) {
        list.append('<li>' + aarraa2[i] + '</li>');
    }
    $('#q2').html(list);


    $('#q3').html('');
    var list = ''
    list = $("#q3").append('<ul></ul>').find('ul');
    for (var i = 0; i < aarraa3.length; i++) {
        list.append('<li>' + aarraa3[i] + '</li>');
    }
    $('#q3').html(list);


    $('#q4').html('');
    var list = ''
    list = $("#q4").append('<ul></ul>').find('ul');
    for (var i = 0; i < aarraa4.length; i++) {
        list.append('<li>' + aarraa4[i] + '</li>');
    }
    $('#q4').html(list);


    var chart1 = c3.generate({
        bindto: '#chart1',
        data: {
            columns: [
                ['Number of exhibitions conducted', temp1, temp3, temp5, temp7],
                ['Revenues', temp2, temp4, temp6, temp8]
            ],
            types: {
                'Number of exhibitions conducted': 'bar'
            }
        },
        axis: {
            x: {
                type: 'category',
                categories: ['Quarter1', 'Quarter2', 'Quarter3', 'Quarter4']
            }
        }
    });
    var chart2 = c3.generate({
        bindto: '#chart2',
        data: {
            columns: [
                ['Session number', temp11, temp13, temp15, temp17],
                ['Number of women who attend sessions', temp12, temp14, temp16, temp18]
            ],
            types: {
                'Number of women who attend sessions': 'bar'
            }
        },
        axis: {
            x: {
                type: 'category',
                categories: ['Quarter1', 'Quarter2', 'Quarter3', 'Quarter4']
            }
        }
    });

    var chart3 = c3.generate({
        bindto: '#chart3',
        data: {
            columns: [
                ['Male', male],
                ['Female', female],
                ['Others', others],

            ],

            type: 'pie'
        }
    });
    $('.nav-tabs a').on('shown.bs.tab', function() {
        chart1.flush();
        chart2.flush();
        chart3.flush();
    });



    for (var i in data2) {
        if (data2[i]["candidate_trained"] == 15422) {
            cardx1 += 1;

        }
    }

    for (var i in data12) {
        if (data12[i]["trained"] == 15422) {
            cardx2 += 1;
        }
    }

    for (var i in data8) {
        if (data8[i]["reach_out"] == 15422) {
            cardx3 += 1;
        }

    }

    var total = 0;
    total = cardx1 + cardx2 + cardx3;

    $('#card41').html(total);

    for (var i in data14) {
        if (data14[i]["participation"] > 0) {
            cardx4 += (data14[i]["participation"]);
        }

    }
    $("#card42").html(cardx4);




    for (var i in data15) {
        if (data15[i]["amount_disbursed"] > 0) {
            cardx5 += (data15[i]["amount_disbursed"]);
        }

    }
    $("#card75").html(getCommas(cardx5));


    for (var i in data15) {
        if (data15[i]["amount_disbursed"] > 0) {
            cardx6 += (data15[i]["reach_out"]);
        }

    }
    $("#card76").html(getCommas(cardx6));
    var r = 0;

    var groups_reached = 0;
    for (var i in data18) {
        if (data18[i]["shg_enterprise"] == 488162)
            cardx7 += (data18[i]["groups_reached"]);

    }
    $("#card60").html(cardx7)


    var women_reached = 0;
    for (var i in data18) {
        if (data18[i]["shg_enterprise"] == 488162)
            cardx8 += (data18[i]["women_reached"]);

    }
    $("#card61").html(cardx8)


    var amount_reached = 0;
    for (var i in data18) {
        if (data18[i]["shg_enterprise"] == 488162)
            if (data18[i]["amount_invested"])
                cardx9 += (data18[i]["amount_invested"]);

    }
    $("#card62").html(cardx9)


    var profit_generated = 0;
    for (var i in data18) {
        if (data18[i]["shg_enterprise"] == 488162)
            if (data18[i]["profit"])
                cardx10 += (data18[i]["profit"]);

    }
    $("#card99").html(cardx10)


    var m1_count = 0;
    var m2_count = 0;
    var m3_count = 0;
    map_4501 = {};
    for (var i in data2) {
        map_4501[data2[i]["recordId"]] = data2[i];
    }

    for (var i in data4) {
        if (map_4501[data4[i]['candidate_name']]) {
            if (map_4501[data4[i]['candidate_name']]['training_level'] == 63185) {
                m1_count++;
                if (data4[i]['placed'] == 15422) {
                    m2_count++;
                }
            }
        }

    }

    for (var i in data2) {
        if (data2[i]['training_level'] == 63185) {
            if (data2[i]["candidate_trained"]) {
                m3_count++;
            }
        }
    }
    // console.log(m1_count, " ", m3_count);

    $("#enrolledP8").text(m2_count + "/" + m3_count);
    var x = "width: " + (m2_count / m3_count) * 100 + "%";

    $('#enrolled8').attr('value', m2_count);
    $('#enrolled8').attr('max', m3_count);


    var m4_count = 0;
    var m5_count = 0;
    var m6_count = 0;
    map_4501 = {};
    for (var i in data2) {
        map_4501[data2[i]["recordId"]] = data2[i];
    }

    for (var i in data4) {
        if (map_4501[data4[i]['candidate_name']]) {
            if (map_4501[data4[i]['candidate_name']]['training_level'] == 63186) {
                m4_count++;
                if (data4[i]['placed'] == 15422) {
                    m5_count++;
                }
            }
        }

    }

    for (var i in data2) {
        if (data2[i]['training_level'] == 63186) {
            if (data2[i]["candidate_trained"]) {
                m6_count++;
            }
        }
    }
    // console.log(m1_count, " ", m3_count);

    $("#enrolledP9").text(m5_count + "/" + m3_count);
    var x = "width: " + (m5_count / m6_count) * 100 + "%";

    $('#enrolled9').attr('value', m5_count);
    $('#enrolled9').attr('max', m6_count);

    var hanu1 = 0;
    var hanu2 = 0;
    var hanu3 = 0;
    var hanu4 = 0;

    for (var i in data21) {
        hanu1 += data21[i].batches;
        hanu2 += data21[i].reach_out;
        if (data21[i].started_earning)
            hanu3 += data21[i].started_earning;
        if (data21[i].joined_edp)
            hanu4 += data21[i].joined_edp;
    }

    $("#card43").html(hanu1);
    $("#card44").html(hanu2);
    $("#card45").html(hanu3);
    $("#card46").html(hanu4);

    hanu5 = 0;
    hanu6 = 0;
    hanu7 = 0;
    hanu8 = 0;
    hanu9 = 0;
    hanu10 = 0;


    for (var i in data18) {
        if (data18[i]["shg_enterprise"] == 488161)
            hanu5 += data18[i]['groups_reached'];

    }

    $("#card77").html(getCommas(hanu5))

    for (var i in data18) {
        if (data18[i]["shg_enterprise"] == 488161)
            hanu6 += (data18[i]["women_reached"]);

    }

    $("#card78").html(hanu6)


    for (var i in data18) {
        if (data18[i]["shg_enterprise"] == 488161)
            if (data18[i]['amount_invested'])
                hanu7 += (data18[i]["amount_invested"]);

    }

    $("#card79").html(hanu7)

    var profit_generated = 0;
    for (var i in data18) {
        if (data18[i]["shg_enterprise"] == 488161)
            if (data18[i]['profit'])
                hanu8 += (data18[i]['profit']);

    }

    $("#card80").html(hanu8)


    for (var i in data1) {
        if (data1[i]["select_partner"] == 22723)
            if (data1[i]['funds_allocated'])
                hanu9 += (data1[i]['funds_allocated'])

        $("#card101").html(getCommas(hanu9));
    }

    for (var i in data1) {
        if (data1[i]["select_partner"] == 22723)
            if (data1[i]['funds_allocated'])
                hanu10 = (data1[i]['funds_disbursed'])

        $("#card102").html(getCommas(hanu10))
    }

    for (var i in data1) {
        if (data1[i]["select_partner"] == 22723)
            if (data1[i]['funds_allocated'])
                hanu11 = (data1[i]['amount_spent_direct'])

        $("#card103").html(getCommas(hanu11));
    }

    var hanu11 = 0;
    var hanu121 = 0;
    var hanu13 = 0;
    var hanu14 = 0;
    var hanu15 = 0;
    var hanu16 = 0;
    var hanu17 = "";
    var hanu122 = 0;


    for (var i in data22) {
        if (data22[i]['schools_covered'] != null)
            hanu11 = (data22[i]['schools_covered'])
        $("#card1041").text(getCommas(hanu11));
    }

    for (var i in data22) {
        if (data22[i]['boys_covered'] != null)
            hanu121 += (data22[i]['boys_covered'])
        if (data22[i]['girls_covered'] != null)
            hanu122 += (data22[i]['girls_covered'])
        $("#card1042").html(getCommas(hanu121 + hanu122));


    }

    for (var i in data24) {
        if (data24[i]["number_trained_participants"] != null)
            hanu13 += data24[i]["number_trained_participants"];
    }
    $("#card1051").text(getCommas(hanu13))
    for (var i in data24) {
        if (data24[i]["number_started_earning"] != null)
            hanu14 += data24[i]["number_started_earning"];
    }

    $("#card1052").text(getCommas(hanu14));

    for (var i in data23) {
        if (data23[i]["number_sessions_conducted"] != null)
            hanu15 += data23[i]["number_sessions_conducted"];

    }
    $("#card1061").text(getCommas(hanu15));
    for (var i in data23) {
        if (data23[i]["number_participant"] != null)
            hanu16 += data23[i]["number_participant"];

    }

    $("#card1062").text(getCommas(hanu16));
    if (data22[0] != undefined) {
        hanu17 += data22[0]["infrastructure_developed"]
        $("#card1067").html(hanu17.replace(/;/g, '<br>'));
    }


    pie1 = createPie([
        ['Girls', hanu122],
        ['Boys', hanu121]
    ], 'donut')

    function createPie(data, id) {
        var chart = c3.generate({
            bindto: '#' + id,
            data: {
                columns: data,
                type: 'pie'
            },
            tooltip: {
                format: {
                    value: function(value, ratio, id, index) {
                        return getCommas(value);
                    }
                }
            },
            color: {
                pattern: ['#8866a9', '#c694f6', "#d3bed0", "#f4adf6", '#aaa8c4']
            }
        });

        return chart;
    }
    for(var i in data24){
        if(data24[i]["number_started_earning"] == undefined)
           data24[i]["number_started_earning"] = 0;
     }   
    


    $("#myModal1").on("shown.bs.modal", function() {
        pie1.flush()
    });


    var TableOne = ""
    var counting = 1;
    for (var i in data24) {
        TableOne += "<tr>" +
            "<td>" + counting + "</td>" +
            "<td>" + tagElementMap[data24[i]["select_training"]] + "</td>" +
            "<td>" + data24[i]["number_trained_participants"] + "</td>" +
            "<td>" + data24[i]["number_aa_trained"] + "</td>" +
            "<td>" + data24[i]["number_started_earning"] + "</td>" +
            "</tr>";
        counting++;
    }
    

    $("#shan1").html(TableOne);
    modaltable1 = $("#table1").DataTable();

    $("#myModal2").on("shown.bs.modal", function() {
        modaltable1.columns.adjust().draw();
    });

    


    var TableTwo = " ";
    var p = 1;


    for (var j in data23) {
        TableTwo += "<tr>" +
            "<td>" + p + "</td>" +
            "<td>" + tagElementMap[data23[j]["sessions_conducted"]] + "</td>" +
            "<td>" + data23[j]["number_sessions_conducted"] + "</td>" +
            "<td>" + data23[j]["number_participant"] + "</td>" +
            "</tr>";
        p++;
    }

    $("#shan2").html(TableTwo);
    modaltable2 = $("#table2").DataTable(
        // dom: 'Bfrtip',
        // "scrollX": true,
        // "bDestroy": true
    );

    $("#myModal3").on("shown.bs.modal", function() {
        modaltable2.columns.adjust().draw();
    });
}