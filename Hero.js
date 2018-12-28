var Text = '';
var tab11 = [];
(function() {
    var profileVal = {}
    var profileVal1 = {};
    var profileVal2 = {};
    var profileVal3 = {};
    var Batch = [];
    var Registration = [];
    var map29017_1 = {};
    var map29017_2 = {};
    var map29017_3 = {};
    var MapObjectValue = [];
    var tab1 = [];
    var tab2 = [];
    var tab3 = [];
    var tab4 = [];
    var tab5 = [];
    var tab6 = [];
    var tab7 = [];
    var tab8 = [];
    var tab9 = [];
    var tab10 = [];
    var details = {};
    var Text = '';
    var Text1 = '';
    var Text2 = '';
    var Text3 = '';
    var b = [];

    var ekPahal = {
        programId: 2501,
        project: 20386,
        profileIds: [14580, 14583, 27740, 28961, 28962, 28963, 29017, 29200, 29011, 29037, 29040, 29017, 29200],
        tagElMap: {},
        projectMap: {},
        payload: {},
        listYears: [],
        listStates: [],
        listInstitutes: [],
        listBatches: [],
        listStudentRegistration: [],
        listGender: [],
        yearFilter: document.getElementById('financialYear'),
        stateFilter: document.getElementById('state'),
        instituteFilter: document.getElementById('institute'),
        batchFilter: document.getElementById('batch'),
        reportYear: document.getElementById('reportYear'),
        reportState: document.getElementById('reportState'),
        reportInstitute: document.getElementById('reportInstitute'),
        reportBatch: document.getElementById('reportBatch'),
        report_Batch_Student_Number: document.getElementById('report_Batch_Student_Number'),

        year: 314389,
        state: 'all',
        institute: 'all',
        batch: 'all',
        studentNameMap: {},
        year1: '314389',
        state1: '20387',
        institute1: '5afd6d298162538505c81bb9',
        batch1: '5b069340ce11f46e0518c552',
        init() {
            _this = this;
            L.mapbox.accessToken = 'pk.eyJ1Ijoic3JpcmFuZ3IiLCJhIjoiZDkwZmQyZWU2ZjczMjc4NDY3MjlhMzJjMDlmZWJlNDEifQ.KOGxA_ldJ-AQNd1LE_OwQA';
            map31 = L.mapbox.map('map', 'mapbox.streets').setView([21, 72], 3);
            markers31 = new L.MarkerClusterGroup();
            map32 = L.mapbox.map('cluster-map', 'mapbox.streets').setView([21, 72], 3);
            markers32 = new L.MarkerClusterGroup();

            myIcon = L.icon({
                iconUrl: "http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png",
                iconSize: [40, 40],
                iconAnchor: [20, 40]
            });
            table1 = '';
            $(".filt").select2();

            this.tagElMap = getTagElementMap(this.programId);
            ////console.log(this.tagElMap);
            this.projectMap = getProjectNameMap(this.programId);
            ////console.log(this.projectMap)
            this.listYears = getChildParentMapTag(20095).null;
            this.listGender = getChildParentMapTag(21177).null;
            this.listStates = getProjectChildren(this.programId, this.project)[0];
            console.log(this.listStates)
            listStudentRegistration = getProfileInstanceMap(29017);
            ////console.log(listStudentRegistration)
            ////console.log(_this.listStudentRegistration)
            ////console.log(this.studentNameMap)
            this.get(28962).then(function(result) {
                _this.listInstitutes = result;
                _this.get(28963).then(function(result) {
                    _this.listBatches = result;

                    _this.get(29017).then(function(result) {
                        _this.listStudentRegistration = result;
                        // //console.log(_this.listInstitutes)
                        ////console.log(_this.listBatches)
                        //console.log(_this.listStudentRegistration)

                        _this.buildFilters();
                        _this.reportFilters();


                    });
                });
            });
            this.cacheData();
        },

        compare(a, b) {
            if (moment(a.date).diff(b.date) < 0)
                return 1;
            if (moment(a.date).diff(b.date) > 0)
                return -1;

            return 0;
        },
        buildFilters() {
            var el;
            this.listYears.forEach((obj, index) => {
                if (this.tagElMap[obj] == '2017 - 2018' || this.tagElMap[obj] == '2018 - 2019') {
                    el = document.createElement('OPTION');
                    el.setAttribute("value", obj);
                    el.appendChild(document.createTextNode(this.tagElMap[obj]));

                    if (this.tagElMap[obj] == getFinancialYearFromDate(new moment())) {
                        this.year = obj;
                        $('.year-label').text(this.tagElMap[this.year]);
                        el.selected = true;
                    }
                    this.yearFilter.appendChild(el);
                }
            });

            this.listStates.forEach((obj, index) => {
                el = document.createElement('OPTION');
                el.setAttribute("value", obj);
                if (index == 0) {
                    this.state = obj;
                    el.selected = true;
                }
                el.appendChild(document.createTextNode(this.projectMap[obj]));
                this.stateFilter.appendChild(el);
            });

            this.listInstitutes.filter((instance) => (instance.project == this.state)).forEach((obj, index) => {
                el = document.createElement('OPTION');
                el.setAttribute("value", obj.recordId);
                //////console.log(obj.recordId,obj.name)
                MapObjectValue.push(obj.name)
                el.appendChild(document.createTextNode(obj.name));
                this.instituteFilter.appendChild(el);
            });
        },
        reportFilters() {
            var el;
            this.listYears.forEach((obj, index) => {
                if (this.tagElMap[obj] == '2017 - 2018' || this.tagElMap[obj] == '2018 - 2019') {
                    el = document.createElement('OPTION');
                    el.setAttribute("value", obj);
                    el.appendChild(document.createTextNode(this.tagElMap[obj]));

                    if (this.tagElMap[obj] == getFinancialYearFromDate(new moment())) {
                        this.year = obj;
                        $('.year-label').text(this.tagElMap[this.year]);
                        el.selected = true;
                    }
                    this.reportYear.appendChild(el);
                }
            });

            this.listStates.forEach((obj, index) => {
                el = document.createElement('OPTION');
                el.setAttribute("value", obj);
                if (index == 0) {
                    this.state = obj;
                    el.selected = true;
                }
                el.appendChild(document.createTextNode(this.projectMap[obj]));
                this.reportState.appendChild(el);
            });

            this.listInstitutes.filter((instance) => (instance.project == this.state1)).forEach((obj, index) => {
                el = document.createElement('OPTION');
                el.setAttribute("value", obj.recordId);
                MapObjectValue.push(obj.name)
                el.appendChild(document.createTextNode(obj.name));
                this.reportInstitute.appendChild(el);
            });

            this.listBatches.filter((instance) => (instance.institute == this.institute1)).forEach((obj, index) => {
                el = document.createElement('OPTION');
                el.setAttribute("value", obj.recordId);
                // /MapObjectValue.push(obj.name);
                el.appendChild(document.createTextNode(obj.name));
                this.reportBatch.appendChild(el);
            });
            details.push(this.year1)
            details.push(this.institute1)
            details.push(this.batch1)
            console.log(details);
        },
        get(profileId) {
            var promiseObject = new Promise(function(resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://api-gateway.p3fy.com/api/analytics/table?q={"profileId":' + profileId + ',"globalFilters":{"project":[' + [_this.project, ..._this.listStates] + ']}}', true);
                xhr.send();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        var res = xhr.responseText;
                        return resolve(JSON.parse(res).data);
                    } else {
                        return xhr.status;
                    }
                }
            });
            return promiseObject;
        },
        cacheData() {
            var promArr = [];
            this.profileIds.forEach((obj, index) => {
                promArr.push(this.get(obj));
            });
            Promise.all(promArr).then(function(result) {
                for (i = 0; i < result.length; i++) {
                    if (Array.isArray(result[i]) && result[i].length != undefined) {
                        _this.payload[_this.profileIds[i]] = result[i];
                    }
                }
                profileVal = _this.payload[29017];
                profileVal1 = _this.payload[28962];
                profileVal2 = _this.payload[29200];
                profileVal3 = _this.payload[28963]
                getDatafromRecordId();


                _this.makeBanner(_this.payload[14580]);
                _this.render();
                _this.bindEvents();
            })
        },
        calculateAge(doj, dob) {
            let age = moment(doj).diff(dob, 'years');
            return age;
        },
        makeBanner(data) {
            var banner = document.getElementById('card1');
            var logo = document.getElementById('cardp1');
            var el, el2, x;
            data.forEach((obj, i) => {
                el = document.createElement('P');
                el2 = document.createElement('STRONG');

                el2.appendChild(document.createTextNode('Partner: '));
                x = obj.partner ? document.createTextNode(this.tagElMap[obj.partner]) : document.createTextNode("-");
                el.appendChild(el2);
                el.appendChild(x);
                banner.appendChild(el);

                el = document.createElement('P');
                el2 = document.createElement('STRONG');

                el2.appendChild(document.createTextNode('Name: '));
                x = obj.name ? document.createTextNode(obj.name) : document.createTextNode("-");
                el.appendChild(el2);
                el.appendChild(x);
                banner.appendChild(el);

                // el = document.createElement('P');
                // el2 = document.createElement('STRONG');
                //
                // el2.appendChild(document.createTextNode('Start Date: '));
                // x = obj.start_date?document.createTextNode(moment(obj.start_date).format("DD-MM-YYYY")):document.createTextNode("-");
                // el.appendChild(el2);
                // el.appendChild(x);
                // banner.appendChild(el);
                //
                // el = document.createElement('P');
                // el2 = document.createElement('STRONG');
                //
                // el2.appendChild(document.createTextNode('End Date: '));
                // x = obj.end_date?document.createTextNode(moment(obj.end_date).format("DD-MM-YYYY")):document.createTextNode("-");
                // el.appendChild(el2);
                // el.appendChild(x);
                // banner.appendChild(el);

                el = document.createElement('P');
                el2 = document.createElement('STRONG');

                el2.appendChild(document.createTextNode('Description: '));
                x = obj.project_description ? document.createTextNode(obj.project_description) : document.createTextNode("-");
                el.appendChild(el2);
                el.appendChild(x);
                banner.appendChild(el);

                el = document.createElement('P');
                el2 = document.createElement('STRONG');

                el2.appendChild(document.createTextNode('Location: '));
                x = obj.location ? document.createTextNode(obj.location) : document.createTextNode("-");
                el.appendChild(el2);
                el.appendChild(x);
                banner.appendChild(el);

                el3 = document.createElement('IMG');

                el3.className += 'pull-right ';
                el3.setAttribute('width', '15%');
                el3.setAttribute('height', 'auto');
                obj.logo ? el3.setAttribute('src', obj.logo) : el3.setAttribute("src", '');
                logo.appendChild(el3);
            });
        },
        saveFile(url) {
            // Get file name from url.
            var filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function() {
                var a = document.createElement('a');
                a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
                a.download = filename; // Set the file name.
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                delete a;
            };
            url = url + "?redirect=false";
            xhr.open('GET', url);
            xhr.send();
        },
        createCarousel(...args) {
            var html = '<div class="carousel-item ">' +
                '<div class="row">' +
                '<div class="col-md-4 col-xs-4">' +
                '<img src="' + args[0]["pic"] + '" class="media-content" />' +
                '<p class="p-0 desc-text"><center>' + args[0]["caption"] + '</center></p>' +
                '</div>' +
                '<div class="col-md-offset-1 col-xs-offset-1 col-md-6 col-xs-6">' +
                '<p class="p-0 desc-text">' + args[0]["title"] + '</p>' +
                '<p class="p-0 desc-text"></p>' +
                '<p class="p-0 desc-text"></p>' +
                '<p class="p-0 desc-text">' + args[0]["description"] + '</p>' +
                '</div>' +
                '</div>' + '<br>' +

                '<div class="col-md-5"></div>';

            html += '<div class="col-md-1 col-xs-12 " style="padding-right:30px;">' +
                ' <a data-toggle="modal" data-target="#profileModal" href="#" data-id=' + args[0]['record_id'] + '>' +
                '<img src="http://www.travellers.web.id/wp-content/uploads/2012/08/Profile-Icon.png" height="32px" href="#">' +
                // '<i class="fa fa-user fa-2x" aria-hidden="true"></i>' +
                '</a>' +
                '</div>';

            html += '<div class="col-md-1 col-xs-12" style="padding-left: 30px;padding-right: 30px;">' +
                '<a data-toggle="modal" data-target="#gallaryModal" href="#" data-id=' + args[0]["record_id"] + ' data-profileid=' + args[0]['profileId'] + '>' +
                '<img src="../Uplon-v1.4/hero/assets/images/gallery.ico" height="32px" href="#">' +
                '</a>' +
                '</div>';

            html += '<div class="col-md-1 col-xs-12" style="padding-left:30px;">' +
                '<a href="' + args[0]['doc'] + '" download>' +
                '<i class="fa fa-file-pdf-o fa-2x" aria-hidden="true"></i>' +
                '<img src="../Uplon-v1.4/hero/assets/images/document.png" height="30px" href="#">' +
                '</a>' +
                '</div>';

            return html;
        },
        createGallery(...args) {
            var html = '<div class="carousel-item ">' +
                '<div class="row">'+
                '<div class="col-md-12 col-xs-12">' +
                '<center><h4 class="header-title m-t-0">' + args[0]["title"] + '</h4></center>' +
                '<center><img src="' + args[0]["pic"] + '" class="media-content" /></center>' +
                '<p class="p-0 desc-text" style="position:absolute;right:85px;">'+'<center>' + args[0]["date"] +'</center>' + '</p>' +
                '<p class="p-10 desc-text"><center>' + args[0]["caption"] + '</center></p>' +
                '</div>' +
                '</div>' + '<br>' +

                '<div class="col-md-5"></div>';
                html += 
                '<div class="row">'+
                '<div class="col-md-1 col-xs-12" style="padding-left: 10px;padding-right: 30px;">' +
                '<center><a data-toggle="modal" data-target="#locationModal" href="#" data-id=' + args[0]["record_id"] + ' data-profileid=' + args[0]["profileId"] + '>' +
                '<i class="fa fa-map-marker fa-2x" aria-hidden="true"></i>' +
                '</a></center>' +
                '</div>';
              html += '<div class="col-md-1 col-xs-12" style="padding-left: 30px;padding-right: 30px;">' +
                '<center><a data-toggle="modal" data-target="#gallaryModal" href="#" data-id=' + args[0]["record_id"] + ' data-profileid=' + args[0]['profileId'] + '>' +
                '<img src="../Uplon-v1.4/hero/assets/images/gallery.ico" height="32px" href="#">' +
                '</a></center>' +
                '</div>' +
                '</div>';
                '</div>';
            return html;
        },
        bindEvents() {
            var docModals = '';
            var modalId = 0;
            var fileType = '';
            var doc = '';
            details = [];
            ////console.log(InstituteMap["5afd6d2ac1255998056ab054"].institut
            this.yearFilter.onchange = function() {
                _this.year = this.value;
                if (_this.year == 'all') {
                    $('.year-label').text("all years")
                } else {
                    $(".year-label").text(_this.tagElMap[this.value])
                }
                _this.render();
            }
            // New 1
            this.reportYear.onchange = function() {
                _this.year1 = this.value;
                details[0] = this.value;
                if (_this.year1 == 'all') {
                    $('.year-label').text("all years")
                } else {
                    $(".year-label").text(_this.tagElMap[this.value])
                }
                _this.render();
            }

            this.stateFilter.onchange = function() {
                _this.state = this.value;
                _this.instituteFilter.innerHTML = '';
                var el = document.createElement('OPTION');
                el.setAttribute("value", "all");
                el.appendChild(document.createTextNode("ALL"));
                _this.instituteFilter.appendChild(el);

                if (_this.state != 'all') {
                    let institutes = _this.listInstitutes.filter((instance) => (instance.project == _this.state));
                    institutes.forEach((obj, index) => {
                        el = document.createElement('OPTION');
                        el.setAttribute("value", obj.recordId);
                        el.appendChild(document.createTextNode(obj.name));
                        _this.instituteFilter.appendChild(el);
                    })
                } else {
                    _this.institute = 'all';
                }
                _this.render();
            }
            //New 2
            this.reportState.onchange = function() {
                _this.state1 = this.value;
                _this.reportInstitute1.innerHTML = '';
                let institutes = _this.listInstitutes.filter((instance) => (instance.project == _this.state1));
                institutes.forEach((obj, index) => {
                    el = document.createElement('OPTION');
                    el.setAttribute("value", obj.recordId);
                    el.appendChild(document.createTextNode(obj.name));
                    _this.reportInstitute.appendChild(el);

                })

                _this.render();
            }


            this.instituteFilter.onchange = function() {
                _this.institute = this.value;
                _this.batchFilter.innerHTML = '';
                var el = document.createElement('OPTION');
                el.setAttribute("value", "all");
                el.appendChild(document.createTextNode("ALL"));
                _this.batchFilter.appendChild(el);

                if (_this.institute != 'all') {
                    let batches = _this.listBatches.filter(instance => (instance.institute == _this.institute) && (instance.project == _this.state));
                    batches.forEach((obj, index) => {
                        el = document.createElement('OPTION');

                        el.setAttribute("value", obj.recordId);
                        el.appendChild(document.createTextNode(obj.name));
                        _this.batchFilter.appendChild(el);

                    })
                } else {
                    _this.batch = 'all';
                }
                _this.render();
            }
            //New 3
            this.reportInstitute.onchange = function() {
                _this.institute1 = this.value;
                details[1] = this.value
                _this.reportBatch.innerHTML = '';


                let batches = _this.listBatches.filter(instance => (instance.institute == _this.institute1) && (instance.project == _this.state1));
                batches.forEach((obj, index) => {
                    el = document.createElement('OPTION');
                    el.setAttribute("value", obj.recordId);
                    el.appendChild(document.createTextNode(obj.name));
                    _this.reportBatch.appendChild(el);

                })
                _this.render();
            }
            this.batchFilter.onchange = function() {
                _this.batch = this.value;
                details.push(this.value)
                console.log(details)
                _this.render();

            }
            //New 4
            // this.reportBatch.onchange = function() {
            //   _this.batch = this.value;
            //   Details.push(this.value)
            //   //console.log(Details)
            //   //console.log(this.value);
            //   _this.render();
            // }

            this.reportBatch.onchange = function() {
                    _this.batch1 = this.value;
                    details[2] = this.value
                    console.log(details);
                    //console.log(this.value);
                    //console.log(details);
                    _this.render();
                },



                $('#profileModal').on('show.bs.modal', function(event) {
                    var id = $(event.relatedTarget).data('id')
                    name = '';
                    var tablehtml = ''

                    var stories = _this.payload[14583];
                    for (var i in stories) {
                        if (id == stories[i].recordId) {
                            if (stories[i].about != undefined) {
                                tablehtml += '<tr><td>' + "Date" + '</td><td>' + _this.tagElMap[stories[i].about] + '</td></tr>';
                            }
                            if (stories[i].brief_person != undefined) {
                                tablehtml += '<tr><td>' + "Brief" + '</td><td>' + stories[i].brief_person + '</td></tr>';
                            }
                            if (stories[i].beneficiary_name != undefined) {
                                tablehtml += '<tr><td>' + "Name" + '</td><td>' + stories[i].beneficiary_name + '</td></tr>';
                            }
                        }
                        ////console.log(tablehtml);
                        $('#profile-table').html(tablehtml)
                    }
                });
            $('#gallaryModal').on('show.bs.modal', function(event) {
                var id = $(event.relatedTarget).data('id');
                var profileid = $(event.relatedTarget).data('profileid');
                $('#images').html();
                if (profileid == 14583) {
                    var stories = _this.payload[profileid];
                    ////console.log(stories);
                    for (var i in stories) {
                        if (id == stories[i].recordId) {
                            if (stories[i].pic_2 != undefined || stories[i].pic_3 != undefined || stories[i].caption_2 || stories[i].caption_3) {
                                $('#images').html('<div class="col-md-6" id="image1"><img src="' + stories[i].pic_2 + '" style="width:300px;height:300px;"  /><center><p class="p-0 desc-text">' + stories[i].caption_2 + '</p></center></div><div class="col-md-6" id="image2"><img src="' + stories[i].pic_3 + '" style="width:300px;height:300px;"  /><center><p class="p-0 desc-text">' + stories[i].caption_3 + '</p></center></div>');
                                // $('#image2').html('<img src="'+stories[i].photo_3+'" style="width:300px;height:300px;"/>');
                            } else {
                                $('#images').html('<div class="col-md-12" id="image1" height:100px;"><center><h2>No Image Found</h2></center></div>');
                                //$('#image2').html('No image found' );
                            }
                        }
                    }
                } else if (profileid == 29040) {
                    var stories = _this.payload[profileid];
                    for (var i in stories) {
                        if (id == stories[i].recordId) {
                            if (stories[i].photo2 != undefined || stories[i].photo3 != undefined) {
                                $('#images').html('<div class="col-md-6" id="image2"><center><img src="' + stories[i].photo2 + '" style="width:150px;height:200px;"  /><p class="p-0 desc-text text-md-center">' + (stories[i].caption2 ? stories[i].caption2 : "-") + '</p></center></div><div class="col-md-6" id="image3"><center><img src="' + stories[i].photo3 + '" style="width:150px;height:200px;"  /><p class="p-0 desc-text text-md-center">' + (stories[i].caption3 ? stories[i].caption3 : "-") + '</p></center></div></div>');
                            } else {
                                $('#images').html('<div class="col-md-12" id="image1" height:100px;"><center><h2>No Image Found</h2></center></div>');
                            }
                        }
                    }
                }
            });
            $('#locationModal').on('show.bs.modal', function(event) {
                var id = $(event.relatedTarget).data('id');
                var profile = $(event.relatedTarget).data('profileid');
                var mapData = _this.payload[profile].filter(instance => instance.recordId == id);
                mapData[0].lat = mapData[0].submissionLat;
                mapData[0].long = mapData[0].submissionLong;
                let marker = _this.createMap(null, mapData[0]);
                //console.log(marker);
                markers32.addLayer(marker);
                map32.addLayer(markers32);
            });
            $('#locationModal').on('shown.bs.modal', function() {
                map32.invalidateSize();
            });
            $('#locationModal').on('hidden.bs.modal', function() {
                map32.removeLayer(markers32);
                markers32.clearLayers();
            });
            $('#docModal').on('show.bs.modal', function(event) {
                var id = $(event.relatedTarget).data('id');
                var stories = _this.payload[14583];
                for (var i in stories) {
                    if (id == stories[i].recordId) {
                        if (stories[i].doc != undefined) {
                            doc = stories[i].doc;
                            docModals = makeDocFileModals(modalId, doc);
                        }
                        modalId++;
                    }
                }
                $("#document").html(docModals)
            });
            $('#mapd').on('click', function() {
                var jsonArr = $.extend(true, [], _this.payload[28961]);
                jsonArr.forEach((obj, index) => {
                    obj.institute = _this.listInstitutes.filter(instance => instance.recordId == obj.institute)[0].name;
                    delete obj["recordId"];
                    delete obj["project"];
                    delete obj["submissionLat"];
                    delete obj["submissionLong"];
                    delete obj["created"];
                    delete obj["modified"];
                });
                _this.JSONToCSVConvertor(jsonArr, "Ek Pahal Institute Details", true);
            });
            $('#bar2d').on('click', function() {
                var jsonArr = $.extend(true, [], _this.payload[29017]);
                jsonArr.forEach((obj, index) => {
                    obj.institute = _this.listInstitutes.filter(instance => (instance.recordId == obj.institute))[0].name;
                    obj.batch = _this.listBatches.filter(instance => (instance.recordId == obj.batch))[0].name;
                    obj.fy = _this.tagElMap[obj.fy];
                    obj.certified = _this.tagElMap[obj.certified];
                    delete obj["recordId"];
                    delete obj["test"];
                    delete obj["project"];
                    delete obj["submissionLat"];
                    delete obj["submissionLong"];
                    delete obj["created"];
                    delete obj["modified"];
                });
                _this.JSONToCSVConvertor(jsonArr, "Ek Pahal candidate Details", true);
            });
            $('#bar3d').on('click', function() {
                var jsonArr = $.extend(true, [], _this.payload[29037]);
                jsonArr.forEach((obj, index) => {
                    obj.institute = _this.listInstitutes.filter(instance => (instance.recordId == obj.institute))[0].name;
                    obj.batch = _this.listBatches.filter(instance => (instance.recordId == obj.batch))[0].name;
                    obj.fy = _this.tagElMap[obj.fy];
                    if (!obj.absentees || obj.absentees.length == 0) obj.absentees = "";
                    else {
                        obj.absentees = obj.absentees.map(instance => _this.studentNameMap[instance]).join(',');
                    }
                    delete obj["recordId"];
                    delete obj["test"];
                    delete obj["project"];
                    delete obj["submissionLat"];
                    delete obj["submissionLong"];
                    delete obj["created"];
                    delete obj["modified"];
                });
                _this.JSONToCSVConvertor(jsonArr, "Ek Pahal Attendance", true);
            });

            function makeDocFileModals(modalId, doc) {
                return '<div class="modal-header document-modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                    '</div>' +
                    '<div class="modal-body document-modal-body">' +
                    '<object data="' + doc + '" type="application/pdf" width="100%" height="100%"></object>' +
                    '</div>';
            }
            $('.tablinks').click(function() {
                setTimeout(function() {
                    window.onresize();
                }, 500);
                map31.invalidateSize();
                map32.invalidateSize();
                table1.columns.adjust();
            });

            $('#certificate').on('click', _this.createCertificate);
        },
        createChart(type, bindId, data, categories, subTypes = []) {
            var chartJson = {
                bindto: bindId,
                data: {
                    columns: data,
                    labels: true,
                    type: type,
                },
                color: {
                    pattern: defaultColors
                },
                tooltip: {
                    format: {
                        value: function(value, ratio, id) {
                            return value;
                        }
                    }
                }
            };

            if (type == 'bar') {
                chartJson['axis'] = {
                    x: {
                        type: 'category',
                        categories: categories
                    }
                }
            };
            if (subTypes.length != 0) {
                chartJson['data']['types'] = subTypes[0]
            }
            c3.generate(chartJson);
        },
        createTable(bindId, tableData, columnHeaders, title) {
            return ($(bindId).DataTable({
                "columns": columnHeaders,
                "data": tableData,
                "scrollY": true,
                "scrollX": true,
                "bDestroy": true,
                "pageLength": 5,
                "order": [
                    [0, 'asc']
                ],
                dom: 'Bfrtip',
                buttons: [{
                    extend: 'excelHtml5',
                    title: title
                }]
            }));
            // .on('order.dt search.dt', function() {
            //     this.column(0, { search: 'applied', order: 'applied' }).nodes().each(function(cell, i) {
            //         cell.innerHTML = i + 1;
            //     });
            // }).draw();
        },
        createMap(name, dataObj) {
            var xlat = null;
            var xlong = null;
            var marker;
            if (dataObj.lat != null && dataObj.long != null && dataObj.lat != undefined && dataObj.long != undefined) {
                xlat = dataObj.lat;
                xlong = dataObj.long;
            }
            if (xlat && xlong) {
                marker = L.marker(new L.LatLng(xlat, xlong), {
                    icon: myIcon
                });
                if (name != null) {
                    var tempmap = "<div class = 'row'><div class='col-xs-3'>"
                    tempmap += "<p class='description'><img src='" + dataObj.photo + "/></p></div><div class='col-xs-9'>"
                    tempmap += "<p class='description'>Name of the Institute: " + name + "</p>"
                    tempmap += "<p class='description'>Address: " + dataObj.address + "</p>"
                    tempmap += "<p class='description'>Name of the Principal: " + dataObj.contact_name + "</p>"
                    tempmap += "<p class='description'>Contact Number of the Principal: " + dataObj.contact_number + "</p>"
                    tempmap += "<p class='description'>E-mail ID of Principal: " + dataObj.email + "</p>"
                    tempmap += '</div></div>';

                    marker.bindPopup(tempmap);
                }
                return marker;
            }
        },
        // Batch_To_StudentName(){
        //       for(var j in profileVal)
        //       {
        //           if(profileVal[j].batch == details[2])
        //             tab1.push(profileVal[j].candidate_name)
        //       }
        //           console.log(tab1);  
        //     }
        createCertificate() {
            var c = 0;

            for (var k in profileVal1) {
                map29017_1[profileVal1[k].recordId] = profileVal1[k].name
            }

            for (var l in profileVal3) {
                map29017_2[profileVal3[l].recordId] = profileVal3[l].name;
            }
            for (var j in profileVal) {
                tab1 = "";
                tab2 = "";
                if (profileVal[j].batch == details[2]) {
                    var Text = profileVal[j].candidate_name.replace(/[0-9]/g, '');
                    //tab1 = Text;
                    // var Pic = profileVal[j].photo
                    var Text1 = profileVal[j].batch_start
                    //tab2 = Text1
                    c++;
                }
            }


            for (var u in profileVal2) {
                
                if (profileVal2[u].batch == details[2]) {
                    if (profileVal2[u].certified == 313525) {
                        var Text2 = profileVal2[u].cert_date;
                        //tab6 = Text2;
                    }
                }
            }


            for (var i = 0; i < c; i++) {
                var tab3 = 0;
                var tab4 = 0;
                var tab5 = 0;
                var date = new Date(Text1);
                var day = date.getDate(); //Date of the month: 2 in our example
                var month = date.getMonth(); //Month of the Year: 0-based index, so 1 in our example
                var year = date.getFullYear()
                tab3 = day;
                tab4 = month;
                tab5 = year;
            }

            for (var i = 0; i < c; i++) {
                tab7 = 0;
                tab8 = 0;
                tab9 = 0;
                var date = new Date(Text2);
                var day = date.getDate(); //Date of the month: 2 in our example
                var month = date.getMonth(); //Month of the Year: 0-based index, so 1 in our example
                var year = date.getFullYear()
                tab7 = day;
                tab8 = month;
                tab9 = year;
            }
            var text=[];
            var lambda=0;
            var flag=0;
            for (var j in profileVal) {
                if (profileVal[j].institute == details[1]) {
                    if (profileVal[j].batch == details[2]) {
                       
                        var Pic = profileVal[j].photo
                        tab11 = ""
                        tab10 = ""
                        
                        if (Pic != undefined) {
                            text.push(profileVal[j].candidate_name.replace(/[0-9]/g, ''));
                            tab10 = Pic;
                            console.log("Image available")
                            toDataURL(Pic, function(dataUrl) {
                                tab11 = dataUrl
                                Promise.all(dataUrl).then(function() {
                                    tabnew(text[lambda]);
                                    lambda++;
                                    flag=1;
                                })
                            })
                        }
                         else {
                            text.push(profileVal[j].candidate_name.replace(/[0-9]/g, ''));
                             tab11 = defaultImage
                             console
                    }
                    }
                }
            }
            if(flag==0){
                for(var ind in text){
                    tabnew(text[ind]);
                }
            }

            function tabnew(bhamda) {
                    var docDefinition = {
                        pageSize: {
                            height: 612,
                            width: 792
                        },
                        pageOrientation: 'landscape',
                        background: [{
                            image: certificateTemplate,
                            marginLeft: 3,
                            width: 792,
                            height: 612,
                        }],
                        content: [{
                                columns: [{
                                    // auto-sized columns have their widths based on their media-content
                                    width: 'auto',
                                    text: [{ text: 'REGN. No', alignment: 'center', bold: true }, { text: '\n' + map29017_2[details[2]], alignment: 'center' }],
                                    marginTop: 36,
                                    alignment: "left"
                                }, ],
                                // optional space between columns
                                columnGap: 10,
                                fontSize: 12,
                                marginLeft: 55,
                                marginRight: 90,
                                fontStyle: 'Calibre',
                                marginTop: 70,
                                marginBottom: 30
                            },
                            {
                                style: 'tableExample',
                                table: {
                                    widths: [350, 100],
                                    body: [

                                        [

                                            {
                                                text: ' of participation awarded to ',
                                                bold: true
                                            },
                                            {
                                                rowSpan: 6,
                                                image: tab11,
                                                width: 100,
                                                height: 125,
                                                border: [true, true, true, true],
                                                marginLeft: 10
                                            }
                                        ],
                                        [
                                            bhamda

                                        ],
                                        [
                                            ' on successful completion of ',
                                            ''
                                        ],
                                        [{
                                            text: '‘Learn to Ride 2-Wheeler Programme’',
                                            bold: true,
                                            fontSize: 16,
                                        }, ],
                                        [
                                            'held at ' + map29017_1[details[1]] + ' ,Haryana',
                                        ],
                                        [
                                            'from ' + tab3 + '-' + tab4 + '-' + tab5 + ' to  ' + tab7 + '-' + tab8 + '-' + tab9,
                                            ''
                                        ],
                                    ]
                                },
                                layout: {
                                    defaultBorder: false,
                                }
                            },


                            {
                                columns: [{
                                        // auto-sized columns have their widths based on their content
                                        width: '50%',
                                        text: ['________________________________________________', { text: '\nSignature', bold: true, fontSize: 14 }, { text: '\nRiding Instructor', fontSize: 12 }],
                                        alignment: 'center'
                                    },
                                    {
                                        // star-sized columns fill the remaining space
                                        // if there's more than one star-column, available width is divided equally
                                        width: '50%',
                                        text: ['________________________________________________', { text: '\nSignature', bold: true, fontSize: 14 }, { text: '\nNodal Officer', fontSize: 12 }],
                                        alignment: 'center',

                                    }
                                ],
                                // optional space between columns
                                columnGap: 10,
                                fontSize: 8,
                                marginTop: 30,
                                marginLeft: 85,
                                marginRight: 120,
                                fontStyle: 'Calibre',
                            }
                        ],
                        styles: {
                            subheader: {
                                fontSize: 12,
                                bold: true
                            },
                            tableExample: {
                                fontSize: 14,
                                marginTop: 45,
                                marginLeft: 176,
                                marginRight: 0,
                                alignment: 'center',
                                fontStyle: 'Calibre',
                                width: '100%'
                            },
                        },
                    };

                    pdfMake.createPdf(docDefinition).download(docDefinition["content"][1]["table"]["body"][1]+'.pdf')
                    // pdfMake.createPdf(docDefinition).open()
                // }
            }
        },

        JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
            //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
            //console.log(arrData);
            var CSV = '';
            let headers = [];
            //This condition will generate the Label/Header
            if (ShowLabel) {
                var row = "";

                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {
                    //Now convert each value to string and comma-seprated
                    row += index + ',';
                }
                row = row.slice(0, -1);
                headers = row.split(',');
                //append Label row with line break
                CSV += row + '\r\n';
            }
            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";
                //2nd loop will extract each column and convert it in string comma-seprated
                for (var j = 0; j < headers.length; j++) {
                    row += '"' + arrData[i][headers[j]] + '",';
                    // for (var index in arrData[i]) {
                    //   headers[i]
                    // }
                }
                row.slice(0, row.length - 1);
                //add a line break after each row
                CSV += row + '\r\n';
            }

            if (CSV == '') {
                alert("Invalid data");
                return;
            }
            //this trick will generate a temp "a" tag
            var link = document.createElement("a");
            link.id = "lnkDwnldLnk";

            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);

            var csv = CSV;
            blob = new Blob([csv], {
                type: 'text/csv'
            });
            var csvUrl = window.webkitURL.createObjectURL(blob);
            var filename = "";
            filename += ReportTitle.replace(/ /g, "_");
            filename = filename + ".csv";
            $("#lnkDwnldLnk").attr({
                'download': filename,
                'href': csvUrl
            });

            $('#lnkDwnldLnk')[0].click();
            document.body.removeChild(link);
        },
        renderTab1(tabData) {
            let card2 = 0;
            let card3 = 0;
            let cardp3 = 0;
            let card4 = 0;
            let card5 = 0;

            let bar1Categories = ['20 and Less', '21-25', '26-30', '31-35', '36 and Above'];
            let bar1Data = [
                ["Number of Trainers", ...new Array(bar1Categories.length).fill(0)]
            ];

            let pie1Data = [
                ["Male", 0],
                ["Female", 0]
            ];

            let mapData = {};
            map31.removeLayer(markers31);
            markers31.clearLayers();

            var table1Data = [];
            var sno = 1;
            var table1Headers = [
                { "className": "dt[-head|-body]-center", "title": "S.No" },
                { "className": "dt[-head|-body]-center", "title": "Name of the Trainer" },
                { "className": "dt[-head|-body]-center", "title": "Date of Joining" },
                { "className": "dt[-head|-body]-center", "title": "Institute" },
                { "className": "dt[-head|-body]-center", "title": "Age" },
                { "className": "dt[-head|-body]-center", "title": "Gender" },
                { "className": "dt[-head|-body]-center", "title": "Father/Husband's Name" },
                { "className": "dt[-head|-body]-center", "title": "Relation to the Trainer" },
                { "className": "dt[-head|-body]-center", "title": "Contact Number" },
                { "className": "dt[-head|-body]-center", "title": "Emergency Contact Number" },
                { "className": "dt[-head|-body]-center", "title": "Email ID" },
                { "className": "dt[-head|-body]-center", "title": "Contact Address" },
                { "className": "dt[-head|-body]-center", "title": "Educational Qualification" }
            ];

            filter_28961 = this.payload[28961].filter((instance) => (this.state == 'all' || this.state == instance.project) && (this.institute == 'all' || this.institute == instance.institute));
            filter_29011 = this.payload[29011].filter((instance) => (this.state == 'all' || this.state == instance.project) && (this.institute == 'all' || this.institute == instance.institute));
            filter_29017 = tabData[29017].filter(instance => (this.state == 'all' || this.state == instance.project) && (this.institute == 'all' || this.institute == instance.institute));
            filter_29200 = tabData[29200].filter(instance => (this.state == 'all' || this.state == instance.project) && (this.institute == 'all' || this.institute == instance.institute));

            filter_28961.forEach((obj, index) => {
                if (obj.name) {
                    card2++;
                }
                if (!mapData[obj.name]) {
                    mapData[obj.name] = {
                        lat: obj.submissionLat,
                        long: obj.submissionLong,
                        photo: obj.photo,
                        institute: obj.institute,
                        enrolled: 0,
                        certified: 0,
                        trainers: 0,
                        address: obj.address,
                        principal_name: obj.principal_name,
                        contact_number: obj.principal_contact,
                        email: obj.principal_email
                    }
                }
            })
            card3 =0 ;
            filter_29017.forEach((obj, index) => {
                if (obj.name) {
                    card3++;
                    console.log(card3)
                    console.log(obj.name)
                }
                for (var obj1 in mapData) {
                    if (mapData[obj1].institute == obj.institute) {
                        mapData[obj1].enrolled++;
                    }
                }
            })
            let cardp4 = card3;
            filter_29200.forEach((obj, index) => {
                if (this.tagElMap[obj.certified] == 'Yes') {
                    card4++;
                    for (var obj1 in mapData) {
                        if (mapData[obj1].institute == obj.institute) {
                            mapData[obj1].certified++;
                        }
                    }
                }
            })
            filter_29011.forEach((obj, index) => {
                var rowArr = [];
                rowArr.push(sno);
                obj.trainer_name ? rowArr.push(obj.trainer_name) : rowArr.push("-");
                obj.doj ? rowArr.push(moment(obj.doj).format('DD-MM-YYYY')) : rowArr.push("-");
                obj.institute ? rowArr.push(this.listInstitutes.filter(instance => instance.recordId == obj.institute)[0].name) : rowArr.push("-");
                (obj.doj && obj.dob) ? rowArr.push(this.calculateAge(obj.doj, obj.dob)): rowArr.push("-");
                obj.gender ? rowArr.push(this.tagElMap[obj.gender]) : rowArr.push("-");
                obj.father_husband ? rowArr.push(obj.father_husband) : rowArr.push("-");
                obj.relation ? rowArr.push(obj.relation) : rowArr.push("-");
                obj.contact ? rowArr.push(obj.contact) : rowArr.push("-");
                obj.emergency ? rowArr.push(obj.emergency) : rowArr.push("-");
                obj.email ? rowArr.push(obj.email) : rowArr.push("-");
                obj.address ? rowArr.push(obj.address) : rowArr.push("-");
                obj.qualification ? rowArr.push(obj.qualification) : rowArr.push("-");

                table1Data.push(rowArr);
                sno++;
                if (obj.dropout == undefined || this.tagElMap[obj.dropout] == 'Yes') {
                    card5++;
                    for (var obj1 in mapData) {
                        if (mapData[obj1].institute == obj.institute) {
                            mapData[obj1].trainers++;
                        }
                    }
                    if (this.tagElMap[obj.gender] == "Male") {
                        pie1Data[0][1]++;
                    } else if (this.tagElMap[obj.gender] == 'Female') {
                        pie1Data[1][1]++;
                    }
                }
                if (obj.doj && obj.dob) {
                    if (this.calculateAge(obj.doj, obj.dob) <= 20) {
                        bar1Data[0][1]++;
                    } else if (this.calculateAge(obj.doj, obj.dob) > 20 && this.calculateAge(obj.doj, obj.dob) <= 25) {
                        bar1Data[0][2]++;
                    } else if (this.calculateAge(obj.doj, obj.dob) > 25 && this.calculateAge(obj.doj, obj.dob) <= 30) {
                        bar1Data[0][3]++;
                    } else if (this.calculateAge(obj.doj, obj.dob) > 30 && this.calculateAge(obj.doj, obj.dob) <= 35) {
                        bar1Data[0][4]++;
                    } else if (this.calculateAge(obj.doj, obj.dob) > 35) {
                        bar1Data[0][5]++;
                    }
                }
            })

            tabData[27740].forEach((obj, index) => {
                if (obj.target_benef) {
                    cardp3 += obj.target_benef;
                }
            })
            for (var i in mapData) {
                let marker = this.createMap(i, mapData[i]);
                if (marker) {
                    markers31.addLayer(marker);
                    map31.addLayer(markers31);
                }
            }
            table1 = this.createTable('#table1r', table1Data, table1Headers, "Trainer Details");
            document.getElementById('card2').textContent = withCommas(card2);
            document.getElementById('card3').textContent = withCommas(card3);
            if (cardp3 != 0) {
                $("#card3percent").html((card3 / cardp3 * 100).toFixed(2) + "%");
                $("#card3target").html(cardp3);
                $("#cardp3").attr("aria-valuenow", (card3 / cardp3) * 100);
                $("#cardp3").css("width", (card3 / cardp3) * 100 + "%");
                var p2 = (card3 / cardp3) * 100;
                if (p2 >= 0 && p2 <= 30) {
                    $("#cardp3").css("background-color", "red");
                } else if (p2 > 30 && p2 <= 60) {
                    $("#cardp3").css("background-color", "#FFC200");
                } else if (p2 > 60 && p2 <= 100) {
                    $("#cardp3").css("background-color", "green");
                } else if (p2 > 100) {
                    $("#cardp3").css("background-color", "green");
                }
            } else {
                $("#card3percent").html(((0) * 100).toFixed(2) + "%");
                $("#card3target").html(cardp3);
                $("#cardp3").attr("aria-valuenow", (0) * 100);
                $("#cardp3").css("width", (0) * 100 + "%");
            }
            document.getElementById('card4').textContent = withCommas(card4);
            if (cardp4 != 0) {
                $("#card4percent").html((card4 / cardp4 * 100).toFixed(2) + "%");
                $("#card4target").html(cardp4);
                $("#cardp4").attr("aria-valuenow", (card4 / cardp4) * 100);
                $("#cardp4").css("width", (card4 / cardp4) * 100 + "%");
                var p2 = (card4 / cardp4) * 100;
                if (p2 >= 0 && p2 <= 30) {
                    $("#cardp4").css("background-color", "red");
                } else if (p2 > 30 && p2 <= 60) {
                    $("#cardp4").css("background-color", "#FFC200");
                } else if (p2 > 60 && p2 <= 100) {
                    $("#cardp4").css("background-color", "green");
                } else if (p2 > 100) {
                    $("#cardp4").css("background-color", "green");
                }
            } else {
                $("#card3percent").html(((0) * 100).toFixed(2) + "%");
                $("#card3target").html(card5);
                $("#cardp3").attr("aria-valuenow", (0) * 100);
                $("#cardp3").css("width", (0) * 100 + "%");
            }
            document.getElementById('card5').textContent = withCommas(card5);
            this.createChart("bar", "#bar1", bar1Data, bar1Categories);
            this.createChart("pie", "#pie1", pie1Data);

        },
        renderTab2(tabData) {
            var card6 = 0;
            var card7 = 0;
            var card8 = 0;

            let bar2Categories = ['20 and Less', '21-25', '26-30', '31-35', '36 and Above'];
            let bar2Data = [
                ["Number of Ek Pahal Learners", ...new Array(bar2Categories.length).fill(0)]
            ];

            let bar3Categories = ['0-10%', '11-20%', '21-30%', '31-40%', '41-50%', '51-60%', '61-70%', '71-80%', '81-90%', '91-100%'];
            let bar3Data = [
                ["Attendance Percentage", ...new Array(bar3Categories.length).fill(0)]
            ];

            filter_29017 = tabData[29017].filter(instance => (this.state == 'all' || this.state == instance.project) && (this.institute == 'all' || this.institute == instance.institute) && (this.batch == 'all' || this.batch == instance.batch));
            filter_29037 = tabData[29037].filter(instance => (this.state == 'all' || this.state == instance.project) && (this.institute == 'all' || this.institute == instance.institute) && (this.batch == 'all' || this.batch == instance.batch));
            filter_29200 = tabData[29200].filter(instance => (this.state == 'all' || this.state == instance.project) && (this.institute == 'all' || this.institute == instance.institute) && (this.batch == 'all' || this.batch == instance.batch));
            filter_29040 = tabData[29040].filter(instance => (this.state == 'all' || this.state == instance.project) && (this.institute == 'all' || this.institute == instance.institute) && (this.batch == 'all' || this.batch == instance.batch));

            filter_29017.forEach((obj, index) => {
                card6++;

                if (obj.batch_start && obj.dob) {
                    if (this.calculateAge(obj.batch_start, obj.dob) <= 20) {
                        bar2Data[0][1]++;
                    } else if (this.calculateAge(obj.batch_start, obj.dob) > 20 && this.calculateAge(obj.batch_start, obj.dob) <= 25) {
                        bar2Data[0][2]++;
                    } else if (this.calculateAge(obj.batch_start, obj.dob) > 25 && this.calculateAge(obj.batch_start, obj.dob) <= 30) {
                        bar2Data[0][3]++;
                    } else if (this.calculateAge(obj.batch_start, obj.dob) > 30 && this.calculateAge(obj.batch_start, obj.dob) <= 35) {
                        bar2Data[0][4]++;
                    } else if (this.calculateAge(obj.batch_start, obj.dob) > 35) {
                        bar2Data[0][5]++;
                    }
                }
            })
            filter_29200.forEach((obj, index) => {
                if (this.tagElMap[obj.certified] == 'Yes') {
                    card7++;
                }
                if (this.tagElMap[obj.not_cert] == 'Dropped Out') {
                    card8++;
                }
            })
            let totalDays = 0;
            let studentsAttendance = new Map();
            filter_29037.forEach((obj, index) => {
                totalDays++;
                if (obj.absentees && Array.isArray(obj.absentees) && obj.absentees.length != 0) {
                    obj.absentees.forEach((obj1, index1) => {
                        if (studentsAttendance.has(obj1)) {
                            studentsAttendance.set(obj1, studentsAttendance.get(obj1) + 1);
                        } else {
                            studentsAttendance.set(obj1, 1);
                        }
                    })
                }
            })
            for ([key, value] of studentsAttendance) {
                let percent = (((totalDays - value) / totalDays) * 100).toFixed(2);
                if (percent <= 10) {
                    bar3Data[0][1]++;
                } else if (percent > 10 && percent <= 20) {
                    bar3Data[0][2]++;
                } else if (percent > 20 && percent <= 30) {
                    bar3Data[0][3]++;
                } else if (percent > 30 && percent <= 40) {
                    bar3Data[0][4]++;
                } else if (percent > 40 && percent <= 50) {
                    bar3Data[0][5]++;
                } else if (percent > 50 && percent <= 60) {
                    bar3Data[0][6]++;
                } else if (percent > 60 && percent <= 70) {
                    bar3Data[0][7]++;
                } else if (percent > 70 && percent <= 80) {
                    bar3Data[0][8]++;
                } else if (percent > 80 && percent <= 90) {
                    bar3Data[0][9]++;
                } else if (percent > 90 && percent <= 100) {
                    bar3Data[0][10]++;
                }
            }
            ////console.log(bar3Data);
            $("#impactCarousel1").html('');
            filter_29040.forEach((obj, index) => {
                // if (this.institute != "all") {
                    // if(this.batch != "all"){
                    var argArray = [];
                    argArray["title"] = obj.name;
                    argArray["pic"] = obj.photo1;
                    argArray["caption"] = (obj.caption1 ? obj.caption1 : '-');
                    argArray["date"] = (obj.date ? moment(obj.date).format("DD-MM-YYYY") : '-');
                    argArray['record_id'] = obj.recordId;
                    argArray["profileId"] = 29040;
                    $("#impactCarousel1").append(this.createGallery(argArray));
                
            // }
        });

            $('.impactCarousel1').children().first().addClass('active');
            $('#impactCarousel1').carousel();

            document.getElementById("card6").textContent = withCommas(card6);
            document.getElementById("card7").textContent = withCommas(card7);
            document.getElementById("card8").textContent = withCommas(card8);
            this.createChart("bar", "#bar2", bar2Data, bar2Categories);
            this.createChart("bar", "#bar3", bar3Data, bar3Categories);
        },
        renderTab3(tabData) {
            $("#impactCarousel2").html('');
            tabData.forEach((obj, index) => {
                var argArray = [];
                argArray["title"] = obj.name;
                argArray["description"] = obj.description;
                argArray["pic"] = obj.pic;
                argArray["caption"] = obj.caption;
                argArray["doc"] = obj.doc;
                argArray["profileId"] = 14583;
                argArray["record_id"] = obj.recordId;
                $("#impactCarousel2").append(this.createCarousel(argArray));
            });

            $('.impactCarousel2').children().first().addClass('active');
            $('#impactCarousel2').carousel();
        },
        render() {
            var filter_payload = {};
            for (var obj in this.payload) {
                if (obj != 14580 && obj != 28961 && obj != 29011) {
                    filter_payload[obj] = this.payload[obj].filter(instance => (instance.fy != null) && (this.tagElMap[instance.fy] == '2017 - 2018' || this.tagElMap[instance.fy] == '2018 - 2019') && (instance.fy == this.year || this.year == 'all'));
                }
            }
            this.renderTab1(filter_payload);
            this.renderTab2(filter_payload);
            this.renderTab3(filter_payload[14583]);
        },
    }

    function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    function getDatafromRecordId() {
        for (var k in profileVal1) {
            map29017_1[profileVal1[k].recordId] = profileVal1[k].name
        }
        for (var l in profileVal3) {
            map29017_2[profileVal3[l].recordId] = profileVal3[l].Name
            // map29017_3[map29017_2[profileVal3[l].recordId]];
        }
    }
    toDataURL('../Uplon-v1.4/hero_new/assets/images/Certificate_Ek_Pahal.jpg', function(dataUrl) {})
    ekPahal.init();
})();