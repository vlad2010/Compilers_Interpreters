const assert = require("assert");
const { test } = require("./test-util");

module.exports = (eva) => {

   test(eva, 
   	`(begin 
   		(var x 10)
   		(switch 
			((= x 10) 100)
			((> x 10) 200)
			(else     300)
   		)
   	)
   	`
    , 100);

    // original while loop
    test(eva, 
   	`(begin 
   		(var c 10)
   		(begin
	   		(var x 10)
  			   (while (> x 0)
  			   	(begin 
            	   (set c (+ c 1))
			   	   (set x (- x 1))
  		   		)
  			)
  		)
  		c
   	)
   	`
    , 20);


    test(eva, 
   	`(begin 
   		(var c 10)
   		(for (var x 10) ( >  x 0) (set x (- x 1)) (set c (+ c 1)) )
   		c
   	)
   	`
    , 20);



};
