const assert = require("assert");
const { test } = require("./test-util");

module.exports = (eva) => {

    test(eva, 
   	`(begin 
   		(set x 10)
   		(+= x 5)
   		x
	 )`, 15);

}