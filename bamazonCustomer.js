var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        inquirer.prompt([{
                name: "inventory",
                type: "rawlist",
                choices: function () {
                    var allItems = [];
                    for (var i = 0; i < results.length; i++) {
                        allItems.push(`${results[i].product_name} price: ${results[i].price}`)
                    };
                    return allItems;
                },
                message: "Enter the item id that you want to purchase today"
            },

            {
                name: "quantity",
                type: "input",
                message: "How many do you want to buy?"
            }
        ]).then(function (answer) {
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (`${results[i].product_name} price: ${results[i].price}` === answer.inventory) {
                    chosenItem = results[i];
                }
            }
            if (chosenItem.stock_quantity > parseInt(answer.quantity)) {
                console.log(`Dear customer, you picked item number ${chosenItem.id}`);
                connection.query(
                    "UPDATE products SET ? WHERE ?", [{
                            stock_quantity: chosenItem.stock_quantity - answer.quantity
                        },
                        {
                            id: chosenItem.id
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        let total = answer.quantity * chosenItem.price;
                        console.log(`Order placed successfully! Your total today is ${total} dollars. Thank you for shopping with us!`);
                        console.log(`There are ${chosenItem.stock_quantity - answer.quantity} ${chosenItem.product_name} left in stock`);
                        start();
                    }
                )


            } else {
                console.log(`Oops looks like we do not have enough ${answer.inventory} in stock for you to purchase`);

                start();
            }
        });
    });

};