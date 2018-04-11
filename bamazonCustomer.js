var inquirer = require("inquirer")
var prmpt = inquirer.createPromptModule()
var figlet = require('figlet');

var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'bamazon_db',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
  });
function titlecall(){
  figlet.text('Bamazon', {
    font: 'doom',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
    rawdata()
});
}


var stringquery = "SELECT * FROM products"

function rawdata(){
    
    connection.query(stringquery, function(err, res){
        if(err) throw err
        // console.log(res)
        inquirer.prompt({
            name:"choice",
            type:"list",
            choices:function(value){
                var prodArr = []
                for (var i=0; i <res.length; i++){
                    prodArr.push(res[i].product_name)
                }
                return prodArr
            },
            message: "What Item would you like to buy?"
        }).then(function(selection){
            for(var i = 0 ; i < res.length; i++){
                if(res[i].product_name=== selection.choice){
                    var chosenproduct = res[i];
                    inquirer.prompt({
                        name: "howmany",
                        type:"input",
                        message: "How Many do you want to purchase?",
                        validate:function(value){
                            if(isNaN(value)==false){
                                return true;
                            }else{return false}
                        }
                    }).then(function(answer){
                        if(chosenproduct.stock_quantity < parseInt(answer.howmany)){
                            console.log("Sorry, we dont have enough...")
                            rawdata()
                        }else{
                            connection.query("UPDATE products SET ? WHERE ?",[{
                                stock_quantity: (chosenproduct.stock_quantity - parseInt(answer.howmany))
                            },{
                                item_id: chosenproduct.item_id
                            }],function(err,res){
                                console.log("Your purchase was Successful!")
                                rawdata()
                            })
                        }
                    })
                }
            }
        })
       
    })
}

titlecall()


/*
Notes on following:

The app should then prompt users with two messages.

The first should ask them the ID of the product they would like to buy.
The second message should ask how many units of the product they would like to buy.
Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
However, if your store does have enough of the product, you should fulfill the customer's order.
This means updating the SQL database to reflect the remaining quantity.
Once the update goes through, show the customer the total cost of their purchase.
*/
