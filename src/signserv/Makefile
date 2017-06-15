proj_path := $(shell pwd)/../../
go_path := $(GOPATH)
target := signserv 

.PHONY: all clean
all:
	go get github.com/go-sql-driver/mysql
	export GOPATH=$(go_path):$(proj_path) && go build -v -o $(target)

clean:
	rm -rvf $(target)
