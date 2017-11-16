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
 store   : new MemcachedStore({
        hosts: ['waxmenowmem.24l8cc.0001.use1.cache.amazonaws.com:11211'], //this should be where your Memcached server is running
       secret: 'memcached-secret-key'
//     username: 'F53955',
 //   password: '73AAAEEECFF4C7A65977B169C76FEF2F'
 })
}));
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

router.get('/', function(req, res) {
     res.sendFile(__dirname + '/views/index.html');
});

router.get('/acceptAppointment', function(req, res) {
  console.log("inside acceptAppointment for record ID:" + req.query.appointmentID);
  
  base('appointment').find(req.query.appointmentID, function(err, record) {
    if (err) { console.error(err); return; }
    console.log(record);

    
});
 // base('appointment').
  
   /*  res.writeHead(200, "OK", {'Content-Type': 'text/html'});
          res.write('<html><head><title>Hello</title></head><body>');
          res.write('<h1>Welcomeo are you?</h1>');
          res.write('<form="application/x-www-form-urlencoded" action="/confirmAppointment" method="POST">');
          res.write('<input type="text" label="enter time you will do this appointment" name="username" value="John Doe" /><br />');
          res.write('<input type="text" name="userage" value="99" /><br />');
          res.write('<input type="text" hidden="true" name="appointmentID" value=' + req.query.appointmentID + '>')
          res.write('<button type="submit" value="Submit">Submit</button>');
          res.write('</form></body></html>');
          res.end();*/
  console.log("from acceptAppointment appointmentID: " +req.query.appointmentID);
  
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
            
router.post('/registeruser', function(req, res) {
    console.log("****INSIDE REGISTER USER*****");

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
       console.log("req.body.emailAddress: " + req.body.emailAddress);
       // console.log("Member record created by Airtable= " + record.getId());
        mc.set('fullName', (req.body.firstName + " " + req.body.lastName), 'expires:20000');
      //  console.log("fullName set to: ", req.body.firstName + " " + req.body.lastName);
        mc.set('memberRecordId', record.getId(), 'expires:20000');
        req.session.memberRecordID = record.getId();
      console.log(req.sessionID);
      
  res.send("acceptAppointment");

    });
});



/*router.post('/takeAppointment', function(req, res) {
    console.log("****INSIDE REGISTER USER*****");

    base('appointment').update({
        // add code to update AIRTABLE with name of waxer accepting appointment and time of acceptance

    }, function(err, record) {
        if (err) {
            console.error(err);
            return;
        }



    });
});*/



function getmcValue(resultIndex, val, callback, p1,p2,p3) {
    //console.log("callback sent to getmcValue: " + callback);
    //console.log("val sent to getmcValue " + val);

    mc.get(val, function(err, value, key) {
        if (value != null) {
            console.log("*****INSIDE getmcValue --- value.toString()= " + value.toString());
        }
        result[resultIndex] = value.toString();
        callback(p1,p2,p3);
    });
}

function createAppointmentRecord(startDate, availabilityStartTime, availabilityEndTime, Status) { 
  console.log("print stuff: " + result[0]);
    console.log("the name game " + result[0]);
 console.log("startDate insde of createAppointmentRecord:" + startDate);
    base('appointment').create({
        "appointmentDate": startDate,
        "availabilityStartTime": availabilityStartTime,
        "availabilityEndTime": availabilityEndTime,
        "Status": "Awaiting Assignment",
        "group": [ "recy8zny8oO3X0mt2" ]
     
    }, function(err, record) {
        if (err) {
            console.error(err);
            return;
        }
         mc.get('memberRecordId', function(err, value, key) {
            if (value != null) {
                console.log("Schedule Record shows memberRecordId as " + value.toString());
            }
            mc.set('appointmentRecordId', record.getId(), 'expires:20000');
        });

        console.log(record.getId());




    });
}

function updateAppointmentRecord(waxes) {
 // console.log('some string:'+ somestring); //comes through undefinted here
    var servicesRequested = JSON.parse(waxes);
    console.log('Parsed services: ', servicesRequested);
  
    var arrayofWaxes = [];

    var arrayLength = servicesRequested.length;
    for (var i = 0; i < arrayLength; i++) {
        //console.log(waxes[i][3]);
        if (servicesRequested[i][2] == 1) {
          
            arrayofWaxes.push(servicesRequested[i][3]);
         
        }
        //Do something
    }
 console.log('rightbefore update arrayofwaxes: ' + arrayofWaxes.length)
    base('appointment').update(result[1], {
           "memberName": [result[0]],
        "servicesRequested": arrayofWaxes,
      "appointmentLocation": [result[2]]
    }, function(err, record) {
        if (err) {
            console.error(err);
            return;
        }


    });
}



//===================



router.post('/createScheduleRecord', function(req, res) {


    console.log("*****INSIDE SCHEDULE RECORD*****");

//values work here... the CB gets the parameters.  from the getmcValue below..(updateappointmentrecord) for some reason.. nothing goes through!.. missing something SIMPLE!  (im calling these from a loca
// html server.. views/index.html is irrelevant)
    getmcValue(0,'memberRecordId', createAppointmentRecord, (Date.parse(req.body.startDate)), (Date.parse(req.body.startDate + " " + req.body.startTime + " GMT-0500")), Date.parse(req.body.startDate + " " + req.body.endTime + " GMT-0500"));

       console.log('****THE RECORD ID WAS STORED WITH EXPRESS SESSION AND ITS VALUE IS:' +  req.session.memberRecordID);
      console.log(req.sessionID);


  res.send("createScheduleRecord");

});

router.post('/updateServices', function(req, res) {
    console.log("****** INSIDE /updateServices");
    console.log("serviceString from HTML POST: " + req.body.serviceString);
 
  



    getmcValue(1,'appointmentRecordId', updateAppointmentRecord, req.body.serviceString,"peanuts","ginandtonic");




  res.send("updateServices");
});

router.post('/setLocation', function(req, res) {
    base('memberLocation').create({
        "memberName": [result[0]],
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
        console.log("setLocation called");
        console.log("req.body.streetNumber = " + req.body.street_number);
        console.log("req.body.locality = " + req.body.locality);
        console.log(record.getId());
        
        mc.set('locationRecordId', record.getId(), 'expires:20000');
      
         mc.get('locationRecordId', function(err, value, key) {
            if (value != null) {
                console.log("locationRecordId= " + value.toString());
              result[2] = value.toString();
            }
          result[2] = record.getId(); 
        });
      
    });

  res.send("setLocation");
});

app.use('/', router);

// we'll create our routes here

// START THE SERVER
// ==============================================
app.listen(port);
console.log('Magic happens on port ' + port);