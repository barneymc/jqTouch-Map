
var myALERT=false;			//Set to true to get all the ALERTs displayed
var hideDIV=true;

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
						   
						   function AjaxFailedShipAddress(){
						   alert('Failed to locate shipping address.');
						   }
						   
						   function getQuoteMenuStart(){
						   var qid=GetQuerystringParam("qid");
						   $('#shipmaplink').attr('href','shipmap.html?qid=' + qid);
						   }
						   
						   
						   function getQuoteDetailStart(){
						   var qid=GetQuerystringParam("quoteid");
						   var jobid=GetQuerystringParam("jobid");
						   var userid=GetQuerystringParam("userid");
						   $('#backbutton').attr('href','quotes.html?jobid=' + jobid+'&userid='+userid);
						   
						   LoadQuoteDetailForthisQuote(qid);
    }	
						   
						   
						   function getQuoteMenuStart(){
						   var qid=GetQuerystringParam("qid");
						   $('#backbutton').attr('href','quotedetail.html?quoteid=' + qid);
						   
						   }
	
	//sets any values for the Menu
	//you could set the userID in the onclick event here for example
	function getMenuStart(){
	var userID=GetQuerystringParam("userid");
	if (myALERT) alert('UserID :' + userID);
	 if (hideDIV) $('#textdiv').hide();
	$("#textm").val(userID );
	$("#jobbuttonhref").attr("href","jobs.html?userid=" + userID); //works
						   
	}


	
	function getJobsStart(){
	var userID=GetQuerystringParam("userid");
	if (myALERT) alert('The userID is ' + userID + ' call the read rows...');
						   if (hideDIV) $('#textdiv').hide();
	//This is supposed to update the q link
						   $('#backbutton').attr('href','menu.html?userid='+userID);					
	readuserrows(userID);
						   
	}
						   
	function getQuotesStart(){
						   var jobID=GetQuerystringParam("jobid");
						   var userID=GetQuerystringParam("userid");
						    if (hideDIV) $('#textdiv').hide();
						   if (myALERT) alert('getQuotesStart:jobID:' + jobID);
						  //alert('here' + userID);
						    $('#backbutton').attr('href','jobs.html?userid='+userID);	
						   LoadQuotesForthisJob(jobID);
						  	
						   }
						   
	
            function login3js(){
				readuserrows(1066);
			}
						   
						   
        	function login2js(){
			     //window.location.href="menu.html" + document;
				//debug.log('Logging in');
				 if (myALERT) alert('Starting d call to DB');
				 var uname=$("#username").val();
				 var pwd=$("#password").val();
				 if (myALERT) alert(uname + pwd);
				 var odata="{'username':'" + uname + "','password':'" + pwd + "'}";
				 $.ajax({
					 type: "POST",
					 url: "http://pit-cs-m901.ingerrand.com/IR2/Service1.asmx/UserLogin",
					 data: odata,
					 contentType: "application/json; charset=utf-8",
					 dataType: "json",
					 success: function(msg) {
						 AjaxSucceeded(msg);
					 },
					 error:AjaxFailed

				 });
			
			}
		
	 
	 
	 
          function AjaxSucceeded(result) {
            //alert("Worked");
             if (myALERT) alert(result.d);
			 var txt=result.d;
             var userID=result.d;
			 $("#textm").val(userID );
             $("#Box1").val(userID);
			 $("#logonlink").attr("href","menu.html?userid=" + userID); //works
			 $("#logonbutton").attr("onclick","window.location.href='menu.html?userid=" + userID);  //not working
			$("#logonbuttonhref").attr("href",	"menu.html?userid=" + userID); //works
						   
						   
						   
			 
             //readrows();
			 //readuserrows(userID);
       
          }
         
          function AjaxFailed(result) {
              if (myALERT) alert("Failed " + result.status + ' ' + result.statusText);
          }

			//Modified reasuserrows to call the JSON webservice now
         function readuserrows(userid)
		 {
		 //alert ('here');
		 var odata="{'UserID':" + userid + "}";
		  //Call the webservice
          $.ajax({
                 type: "POST",
                 url: "http://pit-cs-m901.ingerrand.com/IR2/Service1.asmx/GetJobFileListJSON",
                 data: odata,
                 contentType: "application/json; charset=utf-8",
                 dataType: "json",
                 success: function(msg) {
                     LoadJobsSucceeded(msg,userid);
                 },
                 error:AjaxFailed

             });
		 
		 
		 }
		 
           //Loads the Jobs for this userID
          function readrows(){
         
          var uid=$("#Box1").val();
          //alert(uid);
          var odata="{'UserID':" + uid + "}";
           if (myALERT) alert(odata);
          //Call the webservice
          $.ajax({
                 type: "POST",
                 url: "http://pit-cs-m901.ingerrand.com/IR2/Service1.asmx/GetJobFileListJSON",
                 data: odata,
                 contentType: "application/json; charset=utf-8",
                 dataType: "json",
                 success: function(msg) {
                     LoadJobSucceeded(msg);
                 },
                 error:AjaxFailed

             });
             }
             
             function LoadQuoteDetailForthisQuote(qid)
			 {
				if (myALERT) alert('This quoteflie: ' + qid);
				var odata="{'QuoteFileID':" + qid + "}";
				if (myALERT) alert(odata);
				//Call the webservice
		  $.ajax({
                 type: "POST",
                 url: "http://pit-cs-m901.ingerrand.com/IR2/Service1.asmx/GetQuoteDetails",
                 data: odata,
                 contentType: "application/json; charset=utf-8",
				 dataType: "json",
                 success: function(msg) {
					if (myALERT) alert('Detail succ. Calling func.');
                     LoadQuoteDetailSucceeded(msg);
                 },
                 error:AjaxFailed

             });
			}
			
			 
			 
             function LoadQuotesForthisJob(jfileid){
						   if (myALERT) alert('LoadQuotesForThisJob');
                //var linkTo=obj.href;
                //return confirm('Whats the story' + quote);
				var odata="{'JobFileID':" + jfileid + "}";
				if (myALERT) alert(odata);
				//Call the webservice
		  $.ajax({
                 type: "POST",
                 url: "http://pit-cs-m901.ingerrand.com/IR2/Service1.asmx/GetQuoteFilesFromJobJSON",
                 data: odata,
                 contentType: "application/json; charset=utf-8",
				 dataType: "json",
                 success: function(msg) {
					if (myALERT) alert('heresucc');
                     LoadQuotesSucceeded(msg);
                 },
                 error:AjaxFailed

             });
			}
			
             //Loads the data into the Detail screen
             function LoadQuoteDetailSucceeded(result)
				{
				if (myALERT) alert('In LoadQuoteDetailsSucceeded');
				 var qid=GetQuerystringParam("quoteid");
				var c=eval(result.d);
				if (myALERT) alert('Quotedetail' + c[0][3]);
				$('#Status').val(c[0][0]);  //Note we must specify [0] also
				$('#Comments').val(c[0][3]);  //Note we must specify [0] also
				$('#quotemenulink').attr('href','quotemenu.html?qid=' + qid);
				
				
			}	
             
              function LoadQuotesSucceeded(result){
				if (myALERT) alert(result.d);
				var jobid=GetQuerystringParam("jobid");
				var userid=GetQuerystringParam("userid");
				var xtraquerystring='&jobid='+jobid+'&userid='+userid;
						   
				$("#textq").val(result.d);
				//alert(result.d);
				//alert(result.d);
				var c=eval(result.d);
				for (var i in c)
					{
						if (myALERT) alert(i);
						//var row=myJsonObject.rows.item(i);
						var newEntryRow=$('#quoteTemplate').clone();
						
						//newEntryRow.removeAttr('id');
						newEntryRow.removeAttr('style');
						 newEntryRow.attr('Id', c[i][0]);   //The QuoteFileID
						
						newEntryRow.appendTo('#quotes ul');
						newEntryRow.find('.QName').text(c[i][1]);
						newEntryRow.find('.CreatedDate').text(c[i][2]);
						   newEntryRow.find('#q').attr('href','quotedetail.html?quoteid=' + c[i][0]+xtraquerystring);
						//newEntryRow.find('38428').text(c[i][1]);
					}
				//Set the querystring param		   
			}
			
			function LoadJobsSucceeded(result,userid){
						   
			  if (myALERT) alert('LoadJobSucceeded');
				if (myALERT) alert(result.d);
						   if (myALERT) alert('The userid is ' + userid);
				var txt=result.d;
				$("#texta").val(result.d);
				
				var c=eval(result.d);
				for (var i in c)
					{
					//alert('JobFileName' + c[i][0]);
					var newEntryRow=$('#entryTemplate').clone();
					   
						//newEntryRow.removeAttr('id');
						newEntryRow.removeAttr('style');
						newEntryRow.attr('Id', c[i][1]);  //JobFileID is the link for the <LI>
					   
						newEntryRow.appendTo('#jobs ul');
						newEntryRow.find('.CustomerName').text(c[i][2]);
						newEntryRow.find('.JobFileName').text(c[i][0]);
						newEntryRow.find('38428').text(c[i][1]);
						   newEntryRow.find('#q').attr('href','quotes.html?jobid=' + c[i][1] + '&userid=' + userid);
						   
						//var parentid=newEntryRow[0].id	//this is unique for each <LI>
						//var linkid=newEntryRow.parentNode.id;   
					
						//$('#quotefileslink').attr('href','quotes.html?jobid=' + varparentid);
							
					   //$('#q').attr('href', 'loadquote(' + c[i][1] + ');');
					   
						//$('#quotefile').attr('href', 'loadquote(' + c[i][1] + ');');
						//var clickstring='meloadquote(' +c[i][1] + ')';
						
						//$('#q').attr('onclick', 'loadquote(' + c[i][1] + ');');
					}
			}
               
