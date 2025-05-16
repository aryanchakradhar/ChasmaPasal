const { Router } = require("express");
const {
  getOrders,
  createOrder,
  updateOrder,
  getAllOrders,
  deleteOrder,
  cancelOrder,
} = require("../controllers/orderController");
const router = Router();

router.route("/:id").get(getOrders).put(updateOrder).delete(deleteOrder);
router.route("/").post(createOrder).get(getAllOrders);
router.route("/:id/cancel").patch(cancelOrder);

module.exports = router;
