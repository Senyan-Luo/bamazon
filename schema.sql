DROP DATABASE IF EXISTS
bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
    id INT NOT NULL AUTO_INCREMENT
    product_name VARCHAR(100) NOT NULL
    department_name VARCHAR(100) NOT NULL
    price INT DEFAULT 0,
    stock_quantity INT default 0,
    PRIMARY KEY (id)
);

