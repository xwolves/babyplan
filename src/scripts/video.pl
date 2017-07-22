#! /usr/bin/perl
use DBI;
use CGI;
use utf8;
use strict;
use LWP::Simple;
use JSON qw/encode_json decode_json/;

print "Content-Type: application/json\n";
print "Cache-Control: no-cache\n\n";


my $dbh=DBI->connect('DBI:mysql:database=db_deposit;host=localhost','deposit','Deposit@00',{mysql_enable_utf8=>1});

my $sql = $dbh->prepare("select AccountID,OrgName from tb_accnt_deposit");

$sql->execute();

my %deposits;
while (my @row = $sql->fetchrow_array ){
    $deposits{$row[0]} = $row[1];
}
$dbh->disconnect();

#{"deposit_id":10000001,"deposit_name":"南科大","video_list":[{"room_id":02,"room_name":"教室1","rtmp_src":"xxxx","hls_src":"yyy","poster":"zzz"}]}
#
        
my %rooms_name = (
    '01' => '前台',
    '02' => '教室1',
    '03' => '教室2',
    '04' => '饭堂',
    '05' => '卧室',
);

my $streams = get('http://a.zxing-tech.cn/api/v1/streams/');
my $json = new JSON;
my $objs = $json->decode($streams);
if ($objs->{'code'} != 0) {
    print '{"errno":4001,"error":"get streams from srs fail."}';
}else{
    my $input = new CGI;
    my $deposit_id = $input->param('did');
    my @rooms;
    for my $stream(@{$objs->{'streams'}}) {
        if ($deposit_id == $stream->{'app'}) {
            if ($stream->{'publish'}->{'active'}) {
                push @rooms, $stream->{'name'};
            }
        }
    }
    my @vl;
    for my $r(@rooms) {
        my %item = (
            room_id => $r,
            room_name => $rooms_name{$r},
            rtmp_src => "rtmp://v.zxing-tech.cn/$deposit_id/$r",
            hls_src => "http://v.zxing-tech.cn/$deposit_id/$r.m3u8",
            poster => "http://v.zxing-tech.cn/$deposit_id/$r-poster-003.png",
        );
        push @vl, \%item
    }

    my %rsp = (
        deposit_id => $deposit_id,
        deposit_name => $deposits{$deposit_id},
        vedio_list => \@vl,
    );

    #print '{"depoist_id":"'.$stream->{'app'}.'",room_id":"'.$stream->{'name'}.'"}';
    print encode_json(\%rsp);

}

# print encode_json(\%rsp);

#print $rsp;


