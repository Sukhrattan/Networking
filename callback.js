//What is a Callback?
//Callback is a function passed inside another function as an argument.

//It is used in Asynchronous JavaScript.
//Asynchronous JavaScript :- Asynchronous Programming in JavaScript allows the program to handle tasks with
//long running time and does not block the main thread. It does not wait around for a function to complete
// and block the main thread, rather continues with the computation.
function bye(){
     console.log("bye");
}                                                       //NOTE: This particular example is Synchronous as the callback
                                                        //function is not executed until hello is first executed.
function hello(callback){
    console.log("hello!");
    callback();
}
hello(bye);