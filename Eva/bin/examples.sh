#!/bin/sh 

./eva -e '(var x 10) (print x)'
./eva -e '(var x 10) (print (* x 15))'
./eva -e '(print ((lambda (x) (* x x)) 2))'

./eva -f ./test.eva

