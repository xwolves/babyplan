#! /usr/bin/perl
#print "Content-Type: application/json\n\n";
use CGI;
{
    my $c = new CGI;
    print $c->header(),
          $c->start_html("hello perl world"),
          $c->h1("hello perl world!"),
          $c->end_html();
}
