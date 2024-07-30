const express = require("express");
const router = express.Router();
const isloggedin = require("../middlewares/isLoggedin");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/", function(req, res) {
    let error = req.flash("error");
    res.render("index", { error, loggedin: false });
});

router.get("/shop", isloggedin, async function(req, res) {
    let product = await productModel.find();
    let success = req.flash("success");
    res.render("shop", { product, success });
});

router.get("/cart", isloggedin, async function(req, res) {
    let user = await userModel.findOne({ email: req.user.email }).populate("cart");
    res.render("cart", { user });
});

router.get("/addtocart/:productid", isloggedin, async function(req, res) {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "Added Successfully");
    res.redirect("/shop");
});

router.get("/logout", isloggedin, function(req, res) {
    res.render("shop");
});

// Order Now page route
router.get("/order", isloggedin, function(req, res) {
    res.render("order");
});

// Handle form submission for Order Now
router.post("/order-now", isloggedin, async function(req, res) {
    const { productName, size, price } = req.body;

    if (!productName || !size || !price) {
        return res.json({ success: false, message: "All fields are required." });
    }

    // Handle the order processing here (e.g., save to database, send email, etc.)
    console.log("Order placed:", { productName, size, price });

    res.json({ success: true });
});

// New route for "My Account"
router.get("/account", isloggedin, async function(req, res) {
    let user = await userModel.findOne({ email: req.user.email });
    res.render("account", { user });
});

module.exports = router;