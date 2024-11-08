const express = require("express");
const app = express();
const cors = require("cors");
const UserRouter = require("./db/router/users");
const BookRouter = require("./db/router/books");
const OrderRouter = require("./db/router/orders");
const WishlistRouter = require("./db/router/wishlists");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

// database connection
require("./db/conn");

// CRUD operation
app.use(UserRouter);
app.use(BookRouter);
app.use(OrderRouter);
app.use(WishlistRouter);

app.listen(port, () => {
  console.log("server is live on " + port);
});
