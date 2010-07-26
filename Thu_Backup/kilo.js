var jQT = $.jQTouch({
    formSelector: false,
    icon: 'icon.png',
    startupScreen: 'Default.png',
    statusBar: 'black', 
    useFastTouch: false,
    preloadImages: [
        'themes/jqt/img/back_button.png',
        'themes/jqt/img/back_button_clicked.png',
        'themes/jqt/img/button_clicked.png',
        'themes/jqt/img/grayButton.png',
        'themes/jqt/img/whiteButton.png',
        'themes/jqt/img/loading.gif'
    ]
});
var db;

function testBMCA(event,info){
	if (info.direction=='in'){
		alert('hi county');
		}
}

$(document).ready(function(){
    $('#createEntry form').submit(createEntry);
    $('#editEntry form').submit(updateEntry);
    $('#settings form').submit(saveSettings);
    $('#settings').bind('pageAnimationStart', loadSettings);
	
	//$('#County').bind('pageAnimationStart', function (event, info){
	//				if (info.direction=='in'){
	//					alert('Loading the counties - load the locations...');
	//				}
	//			}
	//			);
	$('#locations').bind('pageAnimationStart', function (event, info){
					if (info.direction=='in'){
						alert('Loading the locations here - load the locations...');
					}
				}
				);
				
    $('#dates li a').click(function(e){
        var dayOffset = this.id;
        var date = new Date();
        date.setDate(date.getDate() - dayOffset);
        sessionStorage.currentDate = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
        refreshEntries();
    });
    var shortName = 'Kilo';
    var version = '1.0';
    var displayName = 'Kilo';
    var maxSize = 65536;
    db = openDatabase(shortName, version, displayName, maxSize);
    db.transaction(
        function(transaction) {
            transaction.executeSql(
                "CREATE TABLE IF NOT EXISTS entries (" +
                    "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, date DATE, food TEXT, calories INTEGER);"
            );
        }
    );
    refreshTotals();
});
function loadSettings() {
	alert('loading settings');
    $('#age').val(localStorage.age);
    $('#budget').val(localStorage.budget);
    $('#weight').val(localStorage.weight);
}
function saveSettings() {
    localStorage.age = $('#age').val();
    localStorage.budget = $('#budget').val();
    localStorage.weight = $('#weight').val();
    jQT.goBack();
    return false;
}
function createEntry() {
    var date = sessionStorage.currentDate;
    var calories = $('#calories').val();
    var food = $('#food').val();
    db.transaction(
        function(transaction) {
            transaction.executeSql(
                'INSERT INTO entries (date, calories, food) VALUES (?, ?, ?);', 
                [date, calories, food], 
                function(){
                    refreshEntries();
                    checkBudget();
                    jQT.goBack();
                }, 
                errorHandler
            );
        }
    );
    return false;
}
function refreshEntries() {
    refreshTotals();
    var currentDate = sessionStorage.currentDate;
    $('#date h1').text(currentDate);
    $('#date ul li:gt(0)').remove();
    db.transaction(
        function(transaction) {
            transaction.executeSql(
                'SELECT * FROM entries WHERE date = ? ORDER BY food;', 
                [currentDate], 
                function (transaction, result) {
                    for (var i=0; i < result.rows.length; i++) {
                        var row = result.rows.item(i);
                        var newEntryRow = $('#entryTemplate').clone();
                        newEntryRow.removeAttr('id');
                        newEntryRow.removeAttr('style');
                        newEntryRow.data('entryId', row.id);
                        newEntryRow.appendTo('#date ul');
                        newEntryRow.find('.label').text(row.food);
                        newEntryRow.find('.calories').text(row.calories);
                        newEntryRow.find('.delete').click(deleteClickHandler);
                        newEntryRow.click(entryClickHandler);
                    }
                }, 
                errorHandler
            );
        }
    );
}
function deleteEntryById(id) {
    db.transaction(
        function(transaction) {
            transaction.executeSql('DELETE FROM entries WHERE id=?;', [id], null, errorHandler);
        }
    );
}
function errorHandler(transaction, error) {
    var message = 'Oops. Error was: "'+error.message+'" (Code '+error.code+')';
    try {
        navigator.notification.alert(message, 'Error', 'Dang!');
    } catch(e) {
        alert(message);
    }
    return true;
}
function checkBudget(offset) {
    var currentDate = sessionStorage.currentDate;
    var dailyBudget = localStorage.budget || 2000;
    db.transaction(
        function(transaction) {
            transaction.executeSql(
                'SELECT SUM(calories) AS currentTotal FROM entries WHERE date = ?;', 
                [currentDate], 
                function (transaction, result) {
                    var currentTotal = result.rows.item(0).currentTotal;
                    if (currentTotal > dailyBudget) {
                        var overage = currentTotal - dailyBudget;
                        var message = 'You are '+overage+' calories over your daily budget. Better start jogging!';
                        alert(message);
                    }
                }, 
                errorHandler
            );
        }
    );
}
function updateEntry() {
    var date = sessionStorage.currentDate;
    var calories = $('#editEntry input[name="calories"]').val();
    var food = $('#editEntry input[name="food"]').val();
    var id = sessionStorage.entryId;
    db.transaction(
        function(transaction) {
            transaction.executeSql(
                'UPDATE entries SET date=?, calories=?, food=? WHERE id=?;', 
                [date, calories, food, id], 
                function(){
                    refreshEntries();
                    checkBudget();
                    jQT.goBack();
                }, 
                errorHandler
            );
        }
    );
    return false;
}

function entryClickHandler(e){
    sessionStorage.entryId = $(this).data('entryId');
    db.transaction(
        function(transaction) {
            transaction.executeSql(
                'SELECT * FROM entries WHERE id = ?;', 
                [sessionStorage.entryId], 
                function (transaction, result) {
                    var row = result.rows.item(0);
                    var food = row.food;
                    var calories = row.calories;
                    $('#editEntry input[name="food"]').val(food);
                    $('#editEntry input[name="calories"]').val(calories);
                    $('#saveChanges').click(function(){
                        updateEntry();
                    });
                    jQT.goTo('#editEntry', 'slideup');
                }, 
                errorHandler
            );
        }
    );
}

function deleteClickHandler(e){
    var clickedEntry = $(this).parent();
    var clickedEntryId = clickedEntry.data('entryId');
    deleteEntryById(clickedEntryId);
    clickedEntry.slideUp();
    e.stopPropagation();
}
function refreshTotals() {
    $('#dates li').each(function(){
        var li = $(this);
        var dayOffset = li.find('a').attr('id');
        var date = new Date();
        date.setDate(date.getDate() - dayOffset);
        dateAsString = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
        li.find('small').text(dateAsString);
    });
}