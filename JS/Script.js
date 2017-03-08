//Add datepicker for the Date textbox
$('.datepicker').datepicker({
    format: 'mm/dd/yyyy',
    inline: true,
    showOtherMonths: true,
    dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
     });
//Add timepicker for the time textbox
$(".timepicker").timepicker({
    'timeFormat': 'h:i A', step: 5 
 });
 //Date format for txtDate
var dateFormat = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
 // if the date text box change here I check if the date format currect or not
 $(".datepicker").on("change",function() {		
var dateValue = $(this).val();
var match = dateValue.match(dateFormat);
if(match != null)
{
    $(this).val(match[0]);
    $(this).attr("style","");
    validDate = true;
}
else
{
    $(this).val("");
    $(this).attr("style","border:1px solid red;");
    validDate = false;
}

    });
    // when user press new button 
$("button.btnNew").click(function () {
    var text = $(this).text();
    
    //Check if button text is new then show the form
    if (text == "NEW") {
        $(this).text("ADD");
        $("button.btnCancel").slideDown();
        $("form.form").slideDown();
    }
    //else check if the form is valid then submit
    else {
        if (isFormValid())
            $("form").submit();
    }
});
    //when user press to cancel button hide the form
$("button.btnCancel").click(function () {
    $(this).slideUp();
    $("button.btnNew").text("NEW");
    $("form.form").slideUp();
})
// variable to hold the date validation
var validDate = false;
//check if all value not null and valid 
isFormValid = function () {
    var valid = true;
    if (!validDate) {
        valid = false;
        $("input[name='txtDate']").attr("style", "border:1px solid red;");
    }
    if ($("input[name='txtTime']").val() == "") {
        $("input[name='txtTime']").attr("style", "border:1px solid red;");
        valid = false;
    }
    else {
        $("input[name='txtTime']").attr("style", "");
    }
    if ($("textarea[name='txtdescription']").val() == "") {
        $("textarea[name='txtdescription']").attr("style", "border:1px solid red;");
        valid = false;
    }
    else {
        $("textarea[name='txtdescription']").attr("style", "style", "border:1px solid;");
        
    }
    return valid;
};






// ajax call to get the data from perl page when page load and when user search 
getAppointmentsList = function(){
    $.get({
        url:"BLL/main.pl",
        method:"GET",
        data:{search:$("input[name='txtSearch']").val(),from:"searchcall"},
        success:function(data){
            console.log(data)
            buildResult(data);
        },
        error:function(data){
            console.log(data);
        }
    });
}
//get all Appointments when page load
    getAppointmentsList();
// when user press to search button get call getAppointmentsList() to bind all Appointments depend on search value 
$('#btnSearch').click(function(){
    console.log("clicked");
    getAppointmentsList();
});

//this function to build all the Appointments to the table 
buildResult = function(rows){
    var table=$("<table>");
    var table_header = $("<thead>");
    table_header.append("<tr><th>Date</th><th>Time</th><th>Description</th></tr></thead>");
    table.append(table_header);
    var table_body = $("<tbody>");
    $.each(rows,function(index,row){
        var tr = $("<tr>");
        var date = new Date(row.Date);
        tr.append("<td>"+getDateTime(date.toDateString(),'date')+"</td>");
        tr.append("<td>"+getDateTime(date.toTimeString(),'time')+"</td>");
        tr.append("<td>"+row.Description+"</td>");
        table_body.append(tr);
    });
    table_body.append("</tbody></table>");
    table.append(table_body);
    $("table.tblRes").html(table.html());
}

// this function to parse the date and time and return the currect format
getDateTime = function(strValue,type){
    var date = strValue.split(" ");
    if(type == 'date'){
        // this return the month and the day like May 6
        return date[1]+ ' ' + date[2];
    }else if(type == 'time'){
        // this return the time format like 12:25 AM or 09:50 PM
        var time = date[0];
        time     = time.split(":");
        var amPm = time[0] >= 12? "PM":"AM";
        var hour = time[0] == 0?12:time[0]==12?12:time[0]%12;
        hour 	 = parseInt(hour) < 10? "0" + hour:hour;
        return hour + ":" + time[1] + " " + amPm;
    }
}
