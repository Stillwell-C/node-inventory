const Product = require("../models/Product");
require("dotenv").config();
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.product_list = asyncHandler(async (req, res, next) => {
  const allProducts = await Product.find().sort({ _id: 1 }).exec();
  res.status(200).render("product_list", {
    title: "All Products",
    product_list: allProducts,
  });
});

exports.product_create_get = asyncHandler(async (req, res, next) => {
  res.status(200).render("product_form", {
    title: "Create Product",
  });
});

exports.product_create_post = [
  //Convert image url text into array
  (req, res, next) => {
    if (!req.body.product_images.length) req.body.product_images = [];
    else {
      req.body.product_images = req.body.product_images
        .split(",")
        .map((link) => link.trim());
    }

    next();
  },

  //Validate and sanitize
  body("product_title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("product_description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("product_price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("product_discount", "Discount must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("product_rating", "Rating must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("product_stock", "Stock must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("product_brand", "Brand must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("product_category", "Category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const product = new Product({
      title: req.body.product_title,
      description: req.body.product_description,
      price: req.body.product_price,
      discountPercentage: req.body.product_discount,
      rating: req.body.product_rating,
      stock: req.body.product_stock,
      brand: req.body.product_brand,
      category: req.body.product_category,
      thumbnail: req.body.product_thumbnail,
      images: req.body.product_images,
    });

    if (!errors.isEmpty()) {
      //Check for errors. If there are, return again with sanitized values and error messages.
      res.render("product_form", {
        title: "Create Product",
        product: product,
        errors: errors.array(),
      });
      return;
    } else {
      //Data is valid
      await product.save();
      res.redirect(product.url);
    }
  }),
];

exports.product_update_get = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).exec();

  if (product === null) {
    // No results found
    const err = new Error("Product not found. Please try again.");
    err.status = 404;
    return next(err);
  }

  console.log(product.imageLinks);

  res.status(200).render("product_form", {
    product: product,
    title: "Update Product",
    password: true,
  });
});

exports.product_update_post = [
  //Convert image url text into array

  (req, res, next) => {
    //Check admin password
    if (req.body.adminpass !== process.env.ADMIN_PASS) {
      const err = new Error("Wrong credentials.");
      err.status = 401;
      return next(err);
    }

    if (!req.body.product_images.length) req.body.product_images = [];
    else {
      req.body.product_images = req.body.product_images
        .split(",")
        .map((link) => link.trim());
    }

    next();
  },

  //Validate and sanitize
  body("product_title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("product_description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("product_price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("product_discount", "Discount must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("product_rating", "Rating must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("product_stock", "Stock must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("product_brand", "Brand must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("product_category", "Category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const product = new Product({
      title: req.body.product_title,
      description: req.body.product_description,
      price: req.body.product_price,
      discountPercentage: req.body.product_discount,
      rating: req.body.product_rating,
      stock: req.body.product_stock,
      brand: req.body.product_brand,
      category: req.body.product_category,
      thumbnail: req.body.product_thumbnail,
      images: req.body.product_images,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      //Check for errors. If there are, return again with sanitized values and error messages.
      res.render("product_form", {
        title: "Create Product",
        product: product,
        errors: errors.array(),
      });
      return;
    } else {
      //Data is valid
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        product,
        {}
      );
      res.redirect(updatedProduct.url);
    }
  }),
];

exports.product_delete_get = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).exec();

  if (product === null) {
    //No results
    const err = new Error("Product not found. Please try again.");
    err.status = 404;
    return next(err);
  }

  res.status(200).render("product_delete", {
    product: product,
  });
});

exports.product_delete_post = asyncHandler(async (req, res, next) => {
  if (req.body.adminpass !== process.env.ADMIN_PASS) {
    const err = new Error("Wrong credentials.");
    err.status = 401;
    return next(err);
  }

  const product = await Product.findById(req.params.id).exec();

  if (product === null) {
    //No results
    const err = new Error("Product not found. Please try again.");
    err.status = 404;
    return next(err);
  }

  await Product.findByIdAndRemove(req.params.id);
  res.redirect("/products");
});

exports.product_smartphones = asyncHandler(async (req, res, next) => {
  const allSmartphones = await Product.find({ category: "smartphones" })
    .sort({ _id: 1 })
    .exec();
  res.status(200).render("product_list", {
    title: "All Smartphones",
    product_list: allSmartphones,
  });
});

exports.product_laptops = asyncHandler(async (req, res, next) => {
  const allLaptops = await Product.find({ category: "laptops" })
    .sort({ _id: 1 })
    .exec();
  res.status(200).render("product_list", {
    title: "All Laptops",
    product_list: allLaptops,
  });
});

exports.product_fragrances = asyncHandler(async (req, res, next) => {
  const allFragrances = await Product.find({ category: "fragrances" })
    .sort({ _id: 1 })
    .exec();
  res.status(200).render("product_list", {
    title: "All Fragrances",
    product_list: allFragrances,
  });
});

exports.product_skincare = asyncHandler(async (req, res, next) => {
  const allSkincare = await Product.find({ category: "skincare" })
    .sort({ _id: 1 })
    .exec();
  res.status(200).render("product_list", {
    title: "All Skincare",
    product_list: allSkincare,
  });
});

exports.product_groceries = asyncHandler(async (req, res, next) => {
  const allGroceries = await Product.find({ category: "groceries" })
    .sort({ _id: 1 })
    .exec();
  res.status(200).render("product_list", {
    title: "All Groceries",
    product_list: allGroceries,
  });
});

exports.product_homedecoration = asyncHandler(async (req, res, next) => {
  const allHomedecoration = await Product.find({ category: "home-decoration" })
    .sort({ _id: 1 })
    .exec();
  res.status(200).render("product_list", {
    title: "All Home Decoration",
    product_list: allHomedecoration,
  });
});

exports.product_detail = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).exec();

  res.status(200).render("product_detail", {
    product: product,
  });
});
