#! /usr/bin/perl
use DBI;
use utf8;
use strict;
use JSON qw/encode_json decode_json/;

print "Content-Type: application/json\n\n";

my $dbh=DBI->connect('DBI:mysql:database=db_deposit;host=localhost','deposit','Deposit@00',{mysql_enable_utf8=>1});

my $sql = $dbh->prepare("select AccountID,OrgName from tb_accnt_deposit");

$sql->execute();

my %rsp;
while (my @row = $sql->fetchrow_array ){
    $rsp{$row[0]} = $row[1];
}
$dbh->disconnect();

print encode_json(\%rsp);


