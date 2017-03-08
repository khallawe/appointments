package DBContext;

use DBI;
use JSON;
sub new
{
    my $class = shift;
    my $self = {
        _deriver => shift,
        _db => shift,
        _user  => shift,
        _password       => shift,
        _dbh => shift,
    };
    $self->{_dbh} = DBI->connect(          
    'DBI:'.$self->{_deriver}.":db=".$self->{_db}, 
    $self->{_user},
    $self->{_password},
    { RaiseError => 1}
    ) or die $DBI::errstr;
    $self->{_dbh}->do("CREATE TABLE IF NOT Exists appointments(Id INTEGER PRIMARY KEY AutoIncrement, Date DateTime, Description TEXT)");
    
    bless $self, $class;
    return $self;
}
sub save_appt
{
    my ( $self, $date,$description ) = @_;
    $self->{_dbh}->do("INSERT INTO appointments VALUES(null,'$date','$description')");
    return $self->{_dbh}->sqlite_last_insert_rowid()
}
sub get
{
    my ( $self, $param ) = @_;
    my @data_array = ();
    my $stmt = qq(SELECT Date, Description FROM appointments where description like '%$param%' order by Date);
    my $stmt_handle = $self->{_dbh}->prepare( $stmt );
    my $data = $stmt_handle->execute() or die $DBI::errstr;
    if($data < 0){
       return @data_array;
    }
    while(my $row = $stmt_handle->fetchrow_hashref()) {
        push @data_array, $row;
    }
    return @data_array;
}
sub DESTROY
{
    $self->{_dbh}->disconnect();
}
1;