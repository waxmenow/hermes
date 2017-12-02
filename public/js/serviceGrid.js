/*jslint
    browser
*/
/* eslint-env node, browser */

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
