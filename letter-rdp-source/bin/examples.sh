#!/bin/sh

./letter-rdp -e '2+2;'
echo -------------
./letter-rdp -e 'let x = 10; console.log(x);'
echo -----------
./letter-rdp -f ../__tests__/example.lt 

