/*
Challenge #2: Manager View (Next Level)

Create a new Node application called bamazonManager.js. Running this application will:

List a set of menu options:
View Products for Sale
View Low Inventory
Add to Inventory
Add New Product
If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
*/

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

  function mgrcall(){
    figlet.text('Bamazon \n Manager', {
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
      whattodo()
  });
  }

  var actionlist = {
      name:'action',
      type:'list',
      message:'What would you like to do?',
      choices:[{
            name :"View Products for Sale"
        },{
            name:"View Low Inventory"
        },{
            name:"Add to Inventory"
        },{
            name:"Add New Product"
        }]
  }

function whattodo(){
  prmpt(actionlist).then(function(r){
      var input = r.action
      switch(input){
        case "View Products for Sale":
            productview();
        break;
        case "View Low Inventory":
            lowproduct();
        break;
        case "Add to Inventory":
            addquantity();
        break;
        case "Add New Product":
            productadd();
        break; 
      }
  })
}

function productview(){
    var listitems = "SELECT * FROM products"
    connection.query(listitems, function(err,res){
        if(err){ throw err}
        else{
        console.log(res)
    }
    // console.log("productview running")
    whattodo()        
})
}

function lowproduct(){
    var count = 5
    connection.query("SELECT * FROM products WHERE 'stock_quantity' <= '25'",
function(err,res){
    if(err){throw err}
    else{
        console.log(res)
    }

    whattodo()
})

}

  mgrcall()