#!"C:\xampp\perl\bin\perl.exe"
#!"\usr\bin\perl.exe"

BEGIN {
    push @INC, "../MODEL","../DAL";
}
use Data::Dumper;
use strict;
use CGI qw(:standard);
use CGI;
use DBContext;
use JSON;
my $deriver = "SQLite";
my $dbname = "../DataBase/Appointments.db";
my $user = "";
my $password = "";
my $db = new DBContext($deriver,$dbname,$user,$password);
my $request = new CGI();
if( $request->param("from") && $request->param("from") == "searchcall")
{
	print "Content-type: application/json; charset=iso-8859-1\n\n";
	my @appointments = $db->get($request->param("search"));
	print encode_json(\@appointments);
	exit;
}

if( $request->param('save')){
	my $date = $request->param('txtdate');
	my $description = $request->param('txtdescription');
	my $time = $request->param('txttime');
	$date = $date.' '.$time;
	my $id = $db->save_appt($date,$description);
}
print redirect(-url=> '../index.html');
print "Content-Type: text/html\n\n";
	
