const express = require("express");
const router = express.Router();
const product_controller = require("../controllers/productController");

router.get("/", product_controller.product_list);

router.get("/create", product_controller.product_create_get);

router.post("/create", product_controller.product_create_post);

router.get("/smartphones", product_controller.product_smartphones);

router.get("/laptops", product_controller.product_laptops);

router.get("/fragrances", product_controller.product_fragrances);

router.get("/skincare", product_controller.product_skincare);

router.get("/groceries", product_controller.product_groceries);

router.get("/home-decoration", product_controller.product_homedecoration);

//Update
router.get("/:id/update", product_controller.product_update_get);

router.post("/:id/update", product_controller.product_update_post);

//Delete
router.get("/:id/delete", product_controller.product_delete_get);

router.post("/:id/delete", product_controller.product_delete_post);

//Get details for single book
router.get("/:id", product_controller.product_detail);

module.exports = router;
