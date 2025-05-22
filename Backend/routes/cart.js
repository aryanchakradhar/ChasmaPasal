const { Router } = require("express");
const {
  get_cart_items,
  add_cart_item,
  delete_item,
  // clear_cart,
} = require("../controllers/cartController");
const router = Router();

router.route("/:userId").get(get_cart_items).post(add_cart_item);
router.route("/:userId/:itemId").delete(delete_item);
// router.put("/clear/:userId", clear_cart);

module.exports = router;
