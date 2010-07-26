

            function login3js(){
				readuserrows(1066);
			}
        	function login2js(){
				 //alert('Starting call to DB');
				 var uname=$("#username").val();
				 var pwd=$("#password").val();
				 //alert(uname + pwd);
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
             // alert(result.d);
			 var txt=result.d;
             var userID=result.d;
             //$("#Box1").val(txt);
             //readrows();
			 readuserrows(userID);
       
          }
         
          function AjaxFailed(result) {
              alert("Failed " + result.status + ' ' + result.statusText);
          }

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
                     LoadJobSucceeded(msg);
                 },
                 error:AjaxFailed

             });
		 
		 
		 }
		 
           //Loads the Jobs for this userID
          function readrows(){
         
          var uid=$("#Box1").val();
          //alert(uid);
          var odata="{'UserID':" + uid + "}";
         
          //Call the webservice
          $.ajax({
                 type: "POST",
                 url: "http://pit-cs-m901.ingerrand.com/IR2/Service1.asmx/GetJobFileList",
                 data: odata,
                 contentType: "application/json; charset=utf-8",
                 dataType: "json",
                 success: function(msg) {
                     LoadJobSucceeded(msg);
                 },
                 error:AjaxFailed

             });
             }
             
             
             function loadquote(jfileid){
				//alert('here1');
                //var linkTo=obj.href;
                //return confirm('Whats the story' + quote);
				var odata="{'JobFileID':" + jfileid + "}";
				//Call the webservice
		  $.ajax({
                 type: "POST",
                 url: "http://pit-cs-m901.ingerrand.com/IR2/Service1.asmx/GetQuoteFilesFromJob",
                 data: odata,
                 contentType: "application/json; charset=utf-8",
				 dataType: "json",
                 success: function(msg) {
					alert('heresucc');
                     LoadQuoteSucceeded(msg);
                 },
                 error:AjaxFailed

             });
			}
			
             
             
             
              function LoadQuoteSucceeded(result){
			 // alert('here2');
			//alert(result.d);
			 //alert(result.d);
			
			//Convert the RAW ML to JSON
			//div.get('jsonresult').innerHTML=xml2json.parser(result.d);
			var myJsonObject=xml2json.parser(result.d);
			
			//For some reason...cant handle the case where there is only one record in JSON array...
			//??? In the JobFiles Ive chosen there is only one....but this wont always be the case....
			  //for(var i=0;i<myJsonObject.row.length;i++){
					//alert(i);
					//var row=myJsonObject.rows.item(i);
					var newEntryRow=$('#quoteTemplate').clone();
					
					newEntryRow.removeAttr('id');
                    newEntryRow.removeAttr('style');
                    newEntryRow.attr('Id', myJsonObject.row.quotefileid);
					
					newEntryRow.appendTo('#quotefiles ul');
					newEntryRow.find('.label').text(myJsonObject.row.quotefilename);
					newEntryRow.find('.calories').text(myJsonObject.row.quotefilename);
                    
					//$('#q').attr('href', 'javascript:loadquote(' + myJsonObject.row[i].jobfilename + ');');
			 //}
			}
			
              function LoadJobSucceeded(result){
			  
            alert(result.d);
           
            //Convert the RAW ML to JSON
            //div.get('jsonresult').innerHTML=xml2json.parser(result.d);
            var myJsonObject=xml2json.parser(result.d);
				  alert('here');
              for(var i=0;i<myJsonObject.row.length;i++){
                    alert(i);
                    //var row=myJsonObject.rows.item(i);
                    var newEntryRow=$('#entryTemplate').clone();
                   
                    //newEntryRow.removeAttr('id');
                    newEntryRow.removeAttr('style');
                    newEntryRow.attr('Id', myJsonObject.row[i].jobfileid);
                   
                    newEntryRow.appendTo('#jobs ul');
                    newEntryRow.find('.CustomerName').text(myJsonObject.row[i].customername);
                   // newEntryRow.find('.calories').text(myJsonObject.row[i].jobfilename);
                   
                  //  $('#q').attr('href', 'javascript:loadquote(' + myJsonObject.row[i].jobfileid + ');');
					
					//When it has populate the list of Jobs, then move to this anchor
					//window.location.hash="#jobs"; ?? BMCA MAY 2010 removed this...
              }
           
          }
               
