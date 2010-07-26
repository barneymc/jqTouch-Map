

            function login3js(){
				alert('login3js');
				readuserrows(1066);
			}

        	function login2js(){
				//showPageByHref('#menu');
				window.location.href='menu.html';
				alert('login2js');
				//debug.log("Enter login2js()");
				alert('here');
						  //console.log('test');		  
				 //alert('Starting call to DB');
				 var uname=$("#username").val();
				 var pwd=$("#password").val();
				 alert(uname + pwd);
				 var odata="{'username':'" + uname + "','password':'" + pwd + "'}";
				//debug.log('Calling UserLogin for uname:' + uname + '. pwd:' + pwd);
				 $.ajax({
					 type: "POST",
					 url: "http://pit-cs-m901.ingerrand.com/IR2/Service1.asmx/UserLogin",
					 data: odata,
					 contentType: "application/json; charset=utf-8",
					 dataType: "json",
					 success: function(msg) {
						alert('herehtoo');
						 AjaxSucceeded(msg);
					 },
					 error:AjaxFailed

				 });
			
			}
		
	 
	 
	 
          function AjaxSucceeded(result) {
			  //debug.log('UserLogin call succeeded');
            alert("Ajax SucceededWorked");
             // alert(result.d);
			 var txt=result.d;
             var userID=result.d;
			 $("#textm").val(userID);
             $("#Box1").val(userID);
			  //debug.log('set the userid');
			  //window.location.hash="menu";
			  alert('here after hash');
			  //debug.log('set the window.location');
			  //readrows();
			 //readuserrows(userID);
       
          }
         
          function AjaxFailed(result) {
			  debug.log('User login failed');
              alert("Failed " + result.status + ' ' + result.statusText);
          }

			//Modified reasuserrows to call the JSON webservice now
         function readuserrows(userid)
		 {
			// debug.log('readrows' + userid + '. Called from href onclick() event. Calling GetJobFileListJSON');
		 alert ('readuserrows');
		 var odata="{'UserID':" + userid + "}";
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
		 
           //Loads the Jobs for this userID
          function readrows(){
			 // debug.log('readrows()');
			  alert('readrows');
          var uid=$("#Box1").val();
			  //debug.log('readrows() :uid=' + uid + '. Called from href onclick() event. Calling GetJobFileListJSON');
			  
          alert(uid);
          var odata="{'UserID':" + uid + "}";
           alert(odata);
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
             
             function LoadThisQuote(qid)
			 {
				 $('#textqd').val(qid);
				 //debug.log('LoadThisQuote qid: '+ qid);
				alert('Going to load details for this quoteflie: ' + qid);
				var odata="{'QuoteFileID':" + qid + "}";
				alert(odata);
				//Call the webservice
		  $.ajax({
                 type: "POST",
                 url: "http://pit-cs-m901.ingerrand.com/IR2/Service1.asmx/GetQuoteDetails",
                 data: odata,
                 contentType: "application/json; charset=utf-8",
				 dataType: "json",
                 success: function(msg) {
					alert('Detail succ. Calling func.');
                     LoadQuoteDetailSucceeded(msg);
                 },
                 error:AjaxFailed

             });
			}
			
			 
			 
             function LoadQuotesForthisJob(jfileid){
				 $('#textjid').val(jfileid);
                //var linkTo=obj.href;
                //return confirm('Whats the story' + quote);
				var odata="{'JobFileID':" + jfileid + "}";
				alert('calling GetQuoteFilesFromJobJSON' + odata);
				//Call the webservice
		  $.ajax({
                 type: "POST",
                 url: "http://pit-cs-m901.ingerrand.com/IR2/Service1.asmx/GetQuoteFilesFromJobJSON",
                 data: odata,
                 contentType: "application/json; charset=utf-8",
				 dataType: "json",
                 success: function(msg) {
					//alert('heresucc');
                     LoadQuotesSucceeded(msg);
                 },
                 error:AjaxFailed

             });
			}
			
             //Loads the data into the Detail screen
             function LoadQuoteDetailSucceeded(result)
				{
				alert('In LoadQuoteDetailsSucceeded');
				var c=eval(result.d);
				alert('Quotedetail' + c[0][3]);
				$('#Status').val(c[0][0]);  //Note we must specify [0] also
				$('#Comments').val(c[0][3]);  //Note we must specify [0] also
				
				
			}	
             
              function LoadQuotesSucceeded(result){
				alert('LQS' + result.d);
				$("#textq").val(result.d);
				//alert(result.d);
				//alert(result.d);
				var c=eval(result.d);
				for (var i in c)
					{
						//alert(i);
						//var row=myJsonObject.rows.item(i);
						var newEntryRow=$('#quoteTemplate').clone();
						
						//newEntryRow.removeAttr('id');
						newEntryRow.removeAttr('style');
						 newEntryRow.attr('Id', c[i][0]);   //The QuoteFileID
						
						newEntryRow.appendTo('#quotes ul');
						newEntryRow.find('.QName').text(c[i][1]);
						newEntryRow.find('.CreatedDate').text(c[i][2]);
						//newEntryRow.find('38428').text(c[i][1]);
					}
			}
			
			function LoadJobSucceeded(result){
			  
				alert('Entering LoadJobSucceeded');
				var txt=result.d;
				$("#texta").val(txt);
				
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
						//$(newEntryRow).attr('onclick','loadquote(1234)');
							
					   //$('#q').attr('href', 'loadquote(' + c[i][1] + ');');
					   
						//$('#quotefile').attr('href', 'loadquote(' + c[i][1] + ');');
						//var clickstring='meloadquote(' +c[i][1] + ')';
						
						//$('#q').attr('onclick', 'loadquote(' + c[i][1] + ');');
					}
			}
               
