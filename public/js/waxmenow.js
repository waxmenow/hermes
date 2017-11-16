/*eslint-env browser */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50  */
/*global $ */
/*jshint strict:false*/
//var POSTHOST = "https://free.waxmenow.com"
var POSTHOST = "http://waxmenow.us-east-1.elasticbeanstalk.com";
//gitch.com testing
//  var POSTHOST = "https://localhost";
//var POSTHOST = "https://imminent-walker.glitch.me";
//var POSTHOST = "https://grandiose-ink.glitch.me";
//var POSTHOST = "";


var total = 0;


var waxes = [
        ["Chin", 10, 0, "recJALmb9iXd7ym6T"],
        ["Nose", 10, 0, "recJkiYYRy7Bq32NZ"],
        ["Eyebrow", 10, 0, "reccNPXtLhqcjuD8e"],
        ["Lips", 10, 0, "recVMYCbGaBCH2HCO"],
        ["Sideburns", 10, 0, "recZIIqrFlWowy8Sn"],
        ["Full Face", 50, 0, "rec3CtXb1F4hTwztU"],
        ["Full Arm", 40, 0, "recLoXEuxo7EcC0bH"],
        ["Half Arm", 30, 0, "recFftA0SI7kNVA6R"],
        ["Underarm", 15, 0, "recITvPFZWg3Xao21"],
        ["Back", 55, 0, "recswcsmjyXb3U6gu"],
        ["Torso", 30, 0, "recyx7S50EjYkcqF3"],
        ["Legs-Full", 65, 0, "rec8spOOiDQyVZSan"],
        ["Legs-Half", 65, 0, "recjmsHYphaIGlirG"],
        ["Bikini", 65, 0, "recJTVkF9yXUe02r7"],
        ["Stomach Strip", 30, 0, "recnL5aXa6Jyv13IO"],
        ["Brazilian", 40, 0, "recpfmG9uS1BQSCtS"],
        ["Buttocks", 20, 0, "recTR9HZ6r5IqAGC2"],
        ["Buttocks Strip", 10, 0, "recsOxXQ3OMO1I3xl"]
    ];

// function to load a grid with the array containing the menu of
function makeSvcGrid() {
    "use strict";
    var clicked_id;
    var i;
    var d = document.createElement("div");
    d.setAttribute("class", "uk-grid uk-grid-medium");

    for (i = 0; i < waxes.length; i++) {

        var dd = document.createElement("div");

        dd.setAttribute("class", "uk-width-1-4 uk-grid-medium noselect");
        dd.setAttribute("id", "col" + i);

        //addEventListener to determine what was clicked in the service grid.
        dd.addEventListener("click", function () {

            clicked_id = parseInt(this.id.replace(/[^\d]/g, ''), 10);
            //document.getElementById("flagella").innerHTML = waxes[clicked_id][2];

            if (!waxes[clicked_id][2]) {

                this.style.backgroundColor = "#202f60";

                document.getElementById('play').play();

                total += waxes[clicked_id][1];
                waxes[clicked_id][2] = 1;

                document.getElementById("tot").innerHTML = "  TOTAL= $" + total;
            } else {
                this.style.backgroundColor = "#000000";
                total -= waxes[clicked_id][1];
                waxes[clicked_id][2] = 0;
                document.getElementById("tot").innerHTML = "  TOTAL= $" + total;
            }
        });
        //end addEventListener


        dd.setAttribute("style", "background-color: black;");

        dd.innerHTML = "<h3  style='font-size: 1em' class='waxMeColor'>" + waxes[i][0] + "</h3>" + "<p style='font-size: .7em' class='waxMeColor'>$" + waxes[i][1] + "</p>" + "<i class='fa fa-question-circle'></i>"; /* "<button id="+ i + " onClick=reply_click(this.id)>Take IT!</button>"; */

        d.appendChild(dd);
        d.setAttribute("id", "answerdiv" + i);
        d.setAttribute("style", "opacity:.5;");

        //  d.setAttribute("margin-left", "50%");
        serviceGrid.appendChild(d);
        //  serviceGrid.style.display="none";
    }
}


window.onload = function () {

    //since always testing different post addresses, parameterize the host fields for the forms here
    //production

    document.getElementById('contact-form').action = POSTHOST + "/registeruser";
    console.log("STREET NUMER: " + document.getElementById('street_number').value);
    console.log(POSTHOST + "/registeruser");

    document.getElementById('schedule-form').action = POSTHOST + "/createScheduleRecord";
    document.getElementById('location-form').action = POSTHOST + "/setLocation";
};


$(document).ready(function () {





    $.validate({

        form: '#contact-form',
        modules: 'html5',
        errorElementClass: 'uk-form-danger',
        errorMessageClass: 'uk-text-danger'
        // 複数クラス指定できない！
    });

    $.validate({
        form: '#schedule-form',
        modules: 'html5',
        errorElementClass: 'uk-form-danger',
        errorMessageClass: 'uk-text-danger'
        // 複数クラス指定できない！
    });

    $.validate({
        form: '#address-form',
        modules: 'html5',
        errorElementClass: 'uk-form-danger',
        errorMessageClass: 'uk-text-danger'
        // 複数クラス指定できない！
    });
    $("form").bind("keypress", function (e) {
        if (e.keyCode === 13) {
            return false;
        }
    });

    makeSvcGrid();


    /*document.getElementById('serviceGrid').style.display="none";*/
    document.getElementById('sales').style.display = "none";
    document.getElementById('whoareyou').style.display = "none";
    document.getElementById('whenwax').style.display = "none";
    document.getElementById('wherewax').style.display = "none";
    document.getElementById('confirmwax').style.display = "none";
    document.getElementById('johnny').style.display = "none";
    document.getElementById('transact').style.display = "none";
    /*document.getElementByClassName("round-corners").onclick = function(){gotoSection('serviceGrid');}*/

});


function updateServices() {
    var dest = '"' + POSTHOST + "/updateServices" + '"';
    console.log("***dest***: " + dest);

    var a = JSON.stringify(waxes);
    a = a.replace(/ /g, "%20");
    console.log('waxes: ', a);
    //a = a.replace(/"/g, "'");

    console.log('waxes parsed: ' + a);

    document.body.innerHTML += '<form id="dynForm" target="servicesTarget" action=' + dest + ' method="post"><input type="hidden" name="serviceString" id="serviceString" value=' + a + '></form>';
    console.log(dynForm.innerHTML);
    document.getElementById("dynForm").submit();
}


function validateSection() {
    $("#contact-form").validate({
        modules: 'html5',
        errorElementClass: 'uk-form-danger',
        errorMessageClass: 'uk-text-danger',

        invalidHandler: function (event, validator) {
            // 'this' refers to the form
            var errors = validator.numberOfInvalids();
            if (errors) {
                var message = errors == 1 ?
                    'You missed 1 field. It has been highlighted' :
                    'You missed ' + errors + ' fields. They have been highlighted';
                $("div.error span").html(message);
                $("div.error").show();
            } else {
                $("div.error").hide();
            }
        }

    });

}
//function to reveal sections on click of continue button
function revealSection(a) {
    var e = document.getElementById(a);
    if (!e) return true;
    if (e.style.display == "none") {
        e.style.display = "block";
    } else {
        //e.style.display="none"
    }
    return true;
}


function gotoSection(a) {
    var s = document.getElementById(a);
    if (!s) return true;
    if (a == "confirmwax") {
        document.getElementById('johnny').style.display = "block";
    }
    UIkit.Utils.scrollToElement(UIkit.$(s, {
        duration: 800
    }));
}




/*function get_services() {

    //use later to dynamically load the waxes array from database
    var jsonData = '{"0":"1","1":"2","2":"3","3":"4"}';

    var parsed = JSON.parse(json);

    var arr = [];

    for (var x in parsed) {
        arr.push(parsed[x]);
    }

}*/


// function to determine what grid element was clicked and set the array flag to 1 when on and 0 when off
function reply_click(clicked_id) {

    var area = "col" + clicked_id;

    if (!waxes[clicked_id][2]) {
        document.getElementById(area).style.backgroundColor = "#b3b5b7";
        total += waxes[clicked_id][1];
        waxes[clicked_id][2] = 1;
        document.getElementById("tot").innerHTML = "TOTAL= $" + total;
    } else {
        document.getElementById(area).style.backgroundColor = "#000000";
        total -= waxes[clicked_id][1];
        waxes[clicked_id][2] = 0;
        document.getElementById("tot").innerHTML = "TOTAL= $" + total;
    }

}



function createConfirmScreen() {
    /* display name and address */

    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var street_number = document.getElementById('street_number').value;
    var route = document.getElementById('route').value;
    var locality = document.getElementById('locality').value;
    var administrative_area_level_1 = document.getElementById('administrative_area_level_1').value;
    var postal_code = document.getElementById('postal_code').value;
    var startTime = document.getElementById('startTime').value;
    var startDate = document.getElementById('startDate').value;
    var endTime = document.getElementById('endTime').value;
    var d = document.createElement("div");
    d.setAttribute("class", "greySmallText");
    d.innerHTML = "<span class='boldgreySmallText'>" + firstName + "</span> " + "<span class='boldgreySmallText'>" + lastName + "</span> " + "is requesting to be waxed at address of <br><br>" + "<span class='boldgreySmallText'>" + street_number + "</span> " + " " + "<span class='boldgreySmallText'>" + route + "</span> " + "<br>" + "<span class='boldgreySmallText'>" + locality + "</span> " + "," + "<span class='boldgreySmallText'>" + administrative_area_level_1 + "</span> " +
        " " + "<span class='boldgreySmallText'>" + postal_code + "</span> " + "<br><br>between the hours of " + "<span class='boldgreySmallText'>" + startTime + "</span> " + " & " + "<span class='boldgreySmallText'>" + endTime + "</span> " + "<br>on " + "<span class='boldgreySmallText'>" + startDate + "</span><br><br>Services Requested :  ";
    confirmwax.appendChild(d);
    /* display services */
    var d = document.createElement("div");
    d.setAttribute("class", "greySmallText");

    for (var jj = 0; jj < waxes.length; jj++) {


        if (waxes[jj][2]) {
            var dd = document.createElement("div");
            dd.setAttribute("class", "greySmallText");
            dd.innerHTML = waxes[jj][0] + "  " + waxes[jj][1];
            d.appendChild(dd);
            confirmwax.appendChild(d);
        }


    }
    var ddd = document.createElement("div");
    ddd.setAttribute("class", "greySmallText");
    ddd.innerHTML = "TOTAL " + total;
    confirmwax.appendChild(ddd);
}


// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var placeSearch, autocomplete;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    postal_code: 'short_name'
};



function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementById('autocomplete')), {
            types: ['geocode']
        });

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

    for (var component in componentForm) {
        document.getElementById(component).value = '';
        document.getElementById(component).disabled = false;
    }

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
        }
    }
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}


/* function goGo(e) {
  revealSection(e);
  gotoSection(e);
}*/

/*function goGo(a) {
    var s = document.getElementById(a);
    if (!s) return true;

    UIkit.Utils.scrollToElement(UIkit.$(s, {
        duration: 800
    }));
}*/
