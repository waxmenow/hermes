$(document).ready( function () {

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
d.innerHTML =  "<span class='boldgreySmallText'>"+ firstName +"</span> "   + "<span class='boldgreySmallText'>"+ lastName +"</span> "  + "is requesting to be waxed at address of <br><br>"+ "<span class='boldgreySmallText'>"+ street_number +"</span> " + " " + "<span class='boldgreySmallText'>"+ route +"</span> " + "<br>" + "<span class='boldgreySmallText'>"+ locality +"</span> " + "," + "<span class='boldgreySmallText'>"+ administrative_area_level_1 +"</span> " +
" " + "<span class='boldgreySmallText'>"+ postal_code +"</span> " + "<br><br>between the hours of " + "<span class='boldgreySmallText'>"+ startTime +"</span> " + " & "  + "<span class='boldgreySmallText'>"+ endTime +"</span> " + "<br>on " + "<span class='boldgreySmallText'>"+ startDate +"</span><br><br>Services Requested :  ";
confirmwax.appendChild(d);
  /* display services */
var d = document.createElement("div");
d.setAttribute("class", "greySmallText");

  for (var jj = 0; jj < waxes.length; jj++) {


    if(waxes[jj][2]) {
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
