
var systemDB;
var REBUILD_DB=0;   //the database is already built, no need to rebuild...!
var xMap;
var yMAP;

/*! Initialize the systemDB global variable. */
function initDB()
{


try {
    if (!window.openDatabase) {
        alert('not supported');
    } else {
        var shortName = 'mydatabase';
        var version = '1.0';
        var displayName = 'My Important Database';
        var maxSize = 65536; // in bytes
        var myDB = openDatabase(shortName, version, displayName, maxSize);

        // You should have a database instance in myDB.

    }
} catch(e) {
    // Error handling code goes here.
    if (e == INVALID_STATE_ERR) {
        // Version number mismatch.
	alert("Invalid database version.");
    } else {
	alert("Unknown error "+e+".");
    }
    return;
}

// alert("Database is: "+myDB);
	
	
createTables(myDB);
systemDB = myDB;

}



/*! If a deletion resulted in a change in the list of county, redraw the "Choose a file" pane. */
function deleteUpdateResults(transaction, results)
{
	if (results.rowsAffected) {
		chooseDialog();
	}
}


function GetQuerystringParam(name, url) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
						  var regexS = "[\\?&amp;]" + name + "=([^&amp;#]*)";
						  var regex = new RegExp(regexS);
						  if (typeof (url) == 'undefined') url = window.location.href;
						  var results = regex.exec(url);
						  if (results == null)
						  return "";
						  
						  else
						  return results[1];
						  
						  }
						  
						  
						  
	/*! Mark a file as "deleted". */
function reallyDelete(id)
{
	// alert('delete ID: '+id);
	var myDB = systemDB;

	myDB.transaction(
	    new Function("transaction", "transaction.executeSql('UPDATE county set deleted=1 where id=?;', [ "+id+" ], /* array of values for the ? placeholders */"+
			"deleteUpdateResults, errorHandler);")
	);

}

/*! Ask for user confirmation before deleting a file. */
function deleteFile(id)
{
	var myDB = systemDB;
	
	myDB.transaction(
	    new Function("transaction", "transaction.executeSql('SELECT id,name from county where id=?;', [ "+id+" ], /* array of values for the ? placeholders */"+
			"function (transaction, results) {"+
				"if (confirm('Really delete '+results.rows.item(0)['name']+'?')) {"+
					"reallyDelete(results.rows.item(0)['id']);"+
				"}"+
			"}, errorHandler);")
	);
}


//The different ways you can set the parameters for the Update
//Update structure is different : NB!!!
function createCounty(countyname)
{
try{

	if (countyname==null){
		countyname = document.getElementById('createFilename').value
	}
	var myDB=systemDB;
	var SQL_INSERT_COUNTY='INSERT INTO county (name,location_id,deleted) VALUES (?,?,?);';
	myDB.transaction(
						 function(transaction){
						    transaction.executeSql(
												   SQL_INSERT_COUNTY,
												   [countyname,0,0],
												   alert('Inserted County'),
												   errorHandler);
						 }						 						 
		);
	
	}
	
	catch(b)
	{
	alert('createLocation : An error has occurred ' + b);
	return
	}


}

function createLocation(name,xcord,ycord,countyID)
{
try{
	var myDB=systemDB;
	var SQL_INSERT='INSERT INTO location (DATABLOB,LATX,LATY,COUNTYID) VALUES (?,?,?,?);';
	myDB.transaction(
						 function(transaction){
						    transaction.executeSql(
												   SQL_INSERT,
												   [name,xcord,ycord,countyID],
												   alert('Inserted Location'),
												   errorHandler);
						 }						 						 
		);
	
	}
	
	catch(b)
	{
	alert('createLocation : An error has occurred ' + b);
	return
	}


}

function callsaveLocation()
{
	var userinput=document.getElementById('txtinput').value;
	var userxcord=document.getElementById('latx').value;
	var userycord=document.getElementById('laty').value;
	var usercountyID=document.getElementById('countyselect').value;
	var userlocationid=document.getElementById('locationid').value;
	
	//alert('UserInput ' + userinput);
	saveLocation(userinput,userxcord,userycord,usercountyID,userlocationid);
	
}
function saveLocation(name,xcord,ycord,countyID,locationid)
{
	try{
		var myDB=systemDB;
		var SQL_UPDATE='UPDATE location set datablob=?,LatX=?,LatY=?,countyID=? where id=?;';
		var params;
		myDB.transaction(
						 function(transaction){
						    transaction.executeSql(
												   SQL_UPDATE,
												   [name,xcord,ycord,countyID,locationid],
												   alert('Updated'),
												   errorHandler);
						 }						 						 
		);
	}
	
	catch(b){
		alert('An error has occurred ' + b);
		return
	}
	
}

//Loads the Location data based on the LocationID
//and populates the textboxes...
function loadlocationByID(locationid)
{
try
	{
		//alert('LocationByID=' + locationid);
		 var myDB=systemDB;
		myDB.transaction(
						 function(transaction){
						 transaction.executeSql("select datablob,LatX,LatY,id,countyID from location where id=?;",[locationid],
												function(transaction,results)
												{
												var row1=results.rows.item(0);		//there only is one record
												var fieldvalue=row1['datablob'];
												var fieldvaluelatx=row1['LatX'];
												var fieldvaluelaty=row1['LatY'];
												var countyvalue=row1['countyID'];
												var locnamevalue=row1['datablob'];
												var mylatx=document.getElementById('latx');
												var mylaty=document.getElementById('laty');
												var mylocationid=document.getElementById('locationid');
												var mylocationname=document.getElementById('locationname'); 
												
												mylatx.value=fieldvaluelatx;
												mylaty.value=fieldvaluelaty;
												mylocationid.value=locationid;
												mylocationname.value=locnamevalue;
												
												//Should these be global vars?
												xMAP=row1['LatX'];
												yMAP=row1['LatY'];
												}
												,errorHandler);
						 }
						 );
	}
	
	catch(b){
		
		alert('loadlocation : An error has occurred ' + b);
		return
	}
	
}

//Just loads the data from the first file in the table....
function loadbyCountyID(countyid)
{
	//1. Wrap in try/catch
	//2. Note format for input parameters to WHERE clause --- ? and []
	//3. SQL,params,success,fail
	
try
	{
		//alert('loadbyCountyID -> County ID ' + countyid);
		var myLocations=document.getElementById('locationsul');
		myLocations.innerHTML='';
		var myDB=systemDB;
		myDB.transaction(
						 function(transaction){
						 transaction.executeSql("select datablob,LatX,LatY,id from location where countyid=?;",[countyid],
												function(transaction,results)
												{
												
												//Loop through the results and build the links
												var currentrec=0;
												var onclickstring=null;
												var row1=results.rows.item(currentrec);
												
												//alert('Count ' + results.rows.length);
												//Loop
												for (var i=0; i<results.rows.length; i++) {
												var row1 = results.rows.item(i);
												var locID = row1['id'];
												//alert('Current row ' + i);
												onclickstring=" onclick='loadlocationByID("+ row1['id']+ ")'";
												//alert(onclickstring);
	//myLocations.innerHTML=myLocations.innerHTML + "<li onclick='callocdetail(" + locID + ")' class='arrow'><a href='#' " + onclickstring +  ">" + row1['datablob'] + '--' +  row1['id']+ "</a></li><BR>";
	myLocations.innerHTML=myLocations.innerHTML + "<li onclick='callocdetail(" + locID + ")' class='arrow'><a href='shipmap.html' " + onclickstring +  ">" + row1['datablob'] + '--' +  row1['id']+ "</a></li><BR>";
												
												}																				
												}
												,errorHandler);
						 }
						);
						 
	}
catch(b)
	{
		alert('An error has occurred ' + b);
		return
	}
}

/*! This prints a list of "county" to edit. */
function LoadCounties()
{
	try
	{
	//alert('Loading counties');
	var myDB = systemDB;
	var SQL_string="select count(*) as [LocationsCount],C.name as [CountyName],C.ID as [CountyID] from county C INNER JOIN location L on C.ID=L.countyID group by C.Name, C.ID ";
	var SQL_string_original="SELECT * from county where deleted=0";
	myDB.transaction(
	    function (transaction) {
		transaction.executeSql(SQL_string,
			[ ], // array of values for the ? placeholders
			function (transaction, results) {
				var string = '';
				var controldiv = document.getElementById('bb');
				for (var i=0; i<results.rows.length; i++) {
					var row = results.rows.item(i);
					string = string + docLink(row);
				}
				if (string == "") { 
					string = "No county.<br />\n";
				} else {
					//string = "<ul class='edgetoedge'><li class='arrow'><a id='0' href='#locations'>BLA</a></li></ul>";
					//string = "<ul class='rounded'>"+string+"</ul>";
				}
				controldiv.innerHTML=string;
			}, errorHandler);
					 }
	); //myDB.transaction
						 
	}
	catch(b)
	{
		alert('An error has occurred: ' + b);
	return
	}
}

function calloc(county_id){
	//alert('Calloc called ' + county_id);
	loadbyCountyID(county_id);
	jQT.goTo('#locations','flip');
	
}

//Change this to do a call to an external mappage
function callocdetail(locID){
	//alert('Clicked this location ID ' + locID);
	//Load the location detail
	//loadlocationByID(locID);
	//jQT.goTo('#locdetail','flip');
	
	//initialize();
	//showmap(xMAP,yMAP)
}

/*! Format a link to a document for display in the "Choose a file" pane. */
function docLink(row)
{
	var name = row['CountyName'];
	var county_id = row['CountyID'];
	var loccount=row['LocationsCount'];
	//we can add the counter in later, hardcode for moment...

	//return "<tr class='filerow'><td class='filenamecell'>"+name+"</td><td class='filelinkcell'>(<a href='#' onClick=loadFile("+county_id+")>edit</a>)&nbsp;(<a href='#' onClick=deleteFile("+county_id+")>delete</a>)</td></tr>\n";
	//return "<li class='arrow'><a id='1' href='#location' onClick=loadbyCountyID("+county_id+")>"+name+"<small class='counter'>1</small></a></li>\n";
	return "<li onclick='calloc(" + county_id + ")' class='arrow' id='" + county_id + "'><a href='#' >" + name + "<small class='counter'>" + loccount + "</small></a></li>\n";
	//return "<li class='arrow'><a href='#dates'>BLA</a></li>\n";
}

/*! This prints a link to the "Create file" pane. */
function linkToCreateNewFile()
{
	return "<p><button onClick='createNewFile()'>Create New County</button>";
}



/*! This creates a new "file" in the database. */
function createNewFileAction()
{
	var myDB = systemDB;
	var name = document.getElementById('createFilename').value

	// alert('Name is "'+name+'"');

	myDB.transaction(
		function (transaction) {
			var myfunc = new Function("transaction", "results", "transaction.executeSql('INSERT INTO county (name, location_id) VALUES (?, ?);', [ '"+name+"', results.insertId], nullDataHandler, killTransaction);");
        		transaction.executeSql('INSERT INTO location (datablob,countyID) VALUES ("TOWN_NAME",1);', [], 
				myfunc, errorHandler);
		}
	);

	chooseDialog();
}

/*! This saves the contents of the file. */
function saveFile()
{
	var myDB = systemDB;
	// alert("Save not implemented.\n");

	var contentdiv = document.getElementById('contentdiv');
	var contents = contentdiv.contentDocument.body.innerHTML;

	alert('SaveFile : file text is '+contents);

	myDB.transaction(
		function (transaction) {
			var contentdiv = document.getElementById('contentdiv');
			var datadiv = document.getElementById('tempdata');

			var location_id = datadiv.getAttribute('lfdataid');
			var contents = contentdiv.contentDocument.body.innerHTML;

			transaction.executeSql("UPDATE location set datablob=? where id=?;",
				[ contents, location_id ], // array of values for the ? placeholders
				nullDataHandler, errorHandler); 
			// alert('Saved contents to '+location_id+': '+contents);
			var origcontentdiv = document.getElementById('origcontentdiv');
			origcontentdiv.innerHTML = contents;

			alert('Saved.');
    		}
	);
}

/*! This displays the "Create file" pane. */
function createNewFile()
{
	var myDB = systemDB;
	var controldiv = document.getElementById('controldiv');
	var string = "";

	string += "<H1>Create New County</H1>\n";
	string += "<form action='javascript:createCounty()'>\n";
	string += "<input id='createFilename' name='name'>County Name</input>\n";
	string += "<input type='submit' value='Save new County' />\n";
	string += "</form>\n";

	controldiv.innerHTML=string;

}

/*! This processes the data read from the database by loadFile and sets up the editing environment. */
function loadlocation(transaction, results)
{
	try
	{
	var controldiv = document.getElementById('controldiv');
	var contentdiv = document.getElementById('contentdiv');
	var origcontentdiv = document.getElementById('origcontentdiv');
	var datadiv = document.getElementById('tempdata');

	alert('loadlocation called :' + location);

	var data = results.rows.item(0);
	
	alert('data is ' + data);
	
	var filename = data['name'];
	var location = data['datablob'];
	datadiv.setAttribute('lfdataid', parseInt(data['location_id']));

	document.title="Editing "+filename;
	controldiv.innerHTML="";
	contentdiv.contentDocument.body.innerHTML='TEXT1'+location;
	origcontentdiv.innerHTML='TEXT2' + location;
	
	contentdiv.style.border="1px solid #000000";
	contentdiv.style['min-height']='20px';
	contentdiv.style.display='block';
	contentdiv.contentDocument.contentEditable=true;
	alert('SQL.js-location:  ' + location);
	}
	
	catch(b)
	{
	    alert('An error has occurred' + b);
		return
	}
}

/*! This loads a "file" from the database and calls loadlocation with the results. */
function loadFile(id)
{
	alert('loadFile : Loading file with id '+id);
	var datadiv = document.getElementById('tempdata');
	datadiv.setAttribute('lfid', parseInt(id));

	myDB = systemDB;
	myDB.transaction(
		function (transaction) {
			var datadiv = document.getElementById('tempdata');
			var id = datadiv.getAttribute('lfid');
			alert('loading id' +id);
			transaction.executeSql('SELECT * from county, location where county.id=? and county.location_id = location.id;', [id ], loadlocation, errorHandler);
		}
	);

}

/*! This creates the database tables. */
function createTables(db)
{

/* To wipe out the table (if you are still experimenting with schemas,
   for example), enable this block. */
if (REBUILD_DB) {
	db.transaction(
	    function (transaction) {
		transaction.executeSql('DROP TABLE county;');
		transaction.executeSql('DROP TABLE location;');
	    }
	);
}

db.transaction(
    function (transaction) {
        transaction.executeSql('CREATE TABLE IF NOT EXISTS county(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, location_id INTEGER NOT NULL, deleted INTEGER NOT NULL DEFAULT 0);', [], nullDataHandler, killTransaction);
        transaction.executeSql('CREATE TABLE IF NOT EXISTS location(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, datablob BLOB NOT NULL DEFAULT "",LatX INTEGER, LatY INTEGER, countyID INTEGER);', [], nullDataHandler, errorHandler);
    }
);

}

/*! When passed as the error handler, this silently causes a transaction to fail. */
function killTransaction(transaction, error)
{
	return true; // fatal transaction error
}

/*! When passed as the error handler, this causes a transaction to fail with a warning message. */
function errorHandler(transaction, error)
{
    // Error is a human-readable string.
    alert('Oops.  Error was '+error.message+' (Code '+error.code+')');

    // Handle errors here
    var we_think_this_error_is_fatal = true;
    if (we_think_this_error_is_fatal) return true;
    return false;
}

/*! This is used as a data handler for a request that should return no data. */
function nullDataHandler(transaction, results)
{
}

/*! This returns a string if you have not yet saved changes.  This is used by the onbeforeunload
    handler to warn you if you are about to leave the page with unsaved changes. */
function saveChangesDialog(event)
{
    var contentdiv = document.getElementById('contentdiv');
    var contents = contentdiv.contentDocument.body.innerHTML;
    var origcontentdiv = document.getElementById('origcontentdiv');
    var origcontents = origcontentdiv.innerHTML;

    // alert('close dialog');

    if (contents == origcontents) {
	return NULL;
    }

    return "You have unsaved changes."; //   CMP "+contents+" TO "+origcontents;
}

/*! This sets up an onbeforeunload handler to avoid accidentally navigating away from the
    page without saving changes. */
function setupEventListeners()
{
    window.onbeforeunload = function () {
	return saveChangesDialog();
    };
}

