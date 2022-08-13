const assert = require("assert");
const { test } = require("./test-util");

module.exports = eva => {


// there is error in Lection 12 example
test(eva, `
    (begin
     (def onClick (callback)
       (begin
         (var x 10)
         (var y 20)
         (callback (+ x y))
        )
      )
      (onClick (lambda (data) (* data 10)))
    )
  `, 300);

// Immediately-invoked lambda expression - IILE:
test(eva, `
    ((lambda (x) (* x x)) 2)
  `, 4);


//Save lambda to a variable lName
test(eva, `
  (begin 
    (var lName (lambda (x)  (* x x)))
    (lName 2)
  )
  `, 4);


};