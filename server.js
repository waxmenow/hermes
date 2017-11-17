// server.js
// BASE SETUP
// ==============================================
var Airtable = require('airtable');
var base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

//hacking insanity here with result.. 
//result[0] is variable for memberIDrecord, 
//result[1] is variable for record for appointment.. (these not needed ultimately i think!!)
//result[2] is variable for locationID
// or change this to an object re: https://stackoverflow.com/questions/1168807/how-can-i-add-a-key-value-pair-to-a-javascript-object
var result =[];



var express = require('express');
var session = require('express-session');
var MemcachedStore = require('connect-memcached')(session);
var app = express();
var port = process.env.PORT || 8080;
var router = express.Router();
// ROUTES
// ==============================================
let MEMCACHE_URL = process.env.MEMCACHE_URL || 'mc3.dev.ec2.memcachier.com:11211';


var memjs = require('memjs');

var mc = memjs.Client.create('mc3.dev.ec2.memcachier.com:11211', {
    username: 'F53955',
    password: '73AAAEEECFF4C7A65977B169C76FEF2F'
});

// the body parser is what reads post requests.
var bodyParser = require('body-parser');

app.use(session({ 
  secret: 'my-name-is-ozymandias-king-of-kings', 
  cookie: { maxAge: 60000 },
  proxy   : 'true',
  secure: false,
 //store   : new MemcachedStore({
      //  hosts: ['waxmenowmem.24l8cc.0001.use1.cache.amazonaws.com:11211'], 
 //  hosts: ['mc3.dev.ec2.memcachier.com:11211'], //this should be where your Memcached server is running
  //    secret: 'memcached-secret-key',
 //   username: 'F53955',
  // password: '73AAAEEECFF4C7A65977B169C76FEF2F'
//})
}));
 
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(__dirname + '/public'));

router.get('/', function(req, res) {
     res.sendFile(__dirname + '/views/index.html');
});


router.get('/acceptAppointment', function(req, res) {
     console.log("****INSIDE REGISTER USER*****")
     console.log("**** session ID= " + req.sessionID) 
     console.log("req.query.appointmentID= " + req.query.appointmentID)
  
  base('appointment').find(req.query.appointmentID, function(err, record) {
    if (err) { console.error(err); return; }
    console.log(record)
  });

  console.log("from acceptAppointment appointmentID: " + req.query.appointmentID);
  
  res.writeHead(200, "OK", {'Content-Type': 'text/html'});
  res.write('<form action="/confirmAppointment" method="get">');
  res.write('<input type="text" hidden="true" name="appointmentID" value=' + req.query.appointmentID + '>')
  res.write('First name:<br><input type="text" name="firstname" value="Mickey"><br>Last name:<br><input type="text" name="lastname" value="Mouse"><br><br><input type="submit" value="Submit"></form>'); 
   res.end();//  res.send(req.query.appointmentID);
  
  //res.sendFile(__dirname + '/views/index.html');
  
 

});

router.get('/confirmAppointment', function(req, res) {
   console.log("INSIDE confirmAppointment, appointmentID=" + req.query.appointmentID);
  base('appointment').update(req.query.appointmentID, {
  "Status": "Assigned"
  
  }, function(err, record) {
    if (err) { console.error(err); return; }
  });
  res.send("goobers");
});
            
app.use('/', router);






router.post('/registeruser', function(req, res) {
    console.log("****INSIDE REGISTER USER*****")
    console.log("**** session ID= " + req.sessionID)
  
    base('member').create({
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "phoneNumber": req.body.phoneNumber,
        "emailAddress": req.body.emailAddress,
        "referralID": req.body.referralID,
        "zipCode": req.body.zipcode

    }, function(err, record) {
        if (err) {
            console.error(err);
            return;
        }
      
      req.session.memberRecordID = record.getId()
      console.log("req.session.memberRecordID " + req.session.memberRecordID)
  
      
      res.send("registeruser Complete")

    });
});

router.post('/createScheduleRecord', function(req, res) {
    console.log("*****INSIDE SCHEDULE RECORD*****");
    console.log("**** session ID= " + req.sessionID)
  
  base('appointment').create({
        "appointmentDate": (Date.parse(req.body.startDate)),
        "availabilityStartTime": (Date.parse(req.body.startDate + " " + req.body.startTime + " GMT-0500")),
        "availabilityEndTime": Date.parse(req.body.startDate + " " + req.body.endTime + " GMT-0500"),
        "Status": "Awaiting Assignment",
      // group set to MIAMI record ID.. extend later for expansion.
        "group": [ "recy8zny8oO3X0mt2" ]
    
    }, function(err, record) {
        if (err) {
            console.error(err)
            return
        }

        req.session.appointmentRecordID = record.getId()
        console.log("req.session.appointmentRecordID = " + req.session.appointmentRecordID)
    
        res.send("createScheduleRecord Complete")

    });
});

router.post('/setLocation', function(req, res) {
    console.log("****INSIDE REGISTER USER*****")
    console.log("**** session ID= " + req.sessionID)
  
    console.log('session.appointmentRecordID =' + req.session.appointmentRecordID)
    console.log('session.memberRecordID =' + req.session.memberRecordID)


  base('memberLocation').create({
        "memberName": [req.session.memberRecordID],
        "addressStreet01": req.body.street_number + " " + req.body.route,
        "aptNumber": req.body.aptNumber,
        "city": req.body.locality,
        "state": req.body.administrative_area_level_1,
        "zipCode": req.body.postal_code,
        //populate once u hear from AIRTABLE support 


    }, function(err, record) {
        if (err) {
            console.error(err);
            return;
        }
    
      
        console.log("req.body.streetNumber = " + req.body.street_number);
        console.log("req.body.locality = " + req.body.locality);

        
        req.session.locationRecordID = record.getId();
        
        res.send("setLocation Complete");
    });
});

router.post('/updateServices', function(req, res) {
    console.log("****INSIDE REGISTER USER*****")
    console.log("**** session ID= " + req.sessionID)
    
    console.log("serviceString from HTML POST: " + req.body.serviceString);

    var servicesRequested = JSON.parse(req.body.serviceString)
 //   console.log('Parsed services: ', servicesRequested)
  
    var arrayofWaxes = []

    var arrayLength = servicesRequested.length
    for (var i = 0; i < arrayLength; i++) {
        //console.log(waxes[i][3]);
        if (servicesRequested[i][2] == 1) {
          
            arrayofWaxes.push(servicesRequested[i][3]);
         
        }
    }
  
  console.log('number of services' + arrayofWaxes.length)
  console.log('session.appointmentRecordID =' + req.session.appointmentRecordID)
  console.log('session.memberRecordID =' + req.session.memberRecordID)
  
    base('appointment').update(req.session.appointmentRecordID, {
           "memberName": [req.session.memberRecordID],
        "servicesRequested": arrayofWaxes,
      "appointmentLocation": [req.session.locationRecordID]
    }, function(err, record) {
        if (err) {
            console.error(err);
            return;
        }


    });
  
    res.send("updateServices Complete")
});





// START THE SERVER
// ==============================================
app.listen(port)
console.log('Magic happens on port ' + port)
