const { Router } = require('express');
const {getOrders, createOrder, updateOrder, getAllOrders, deleteOrder} = require('../controllers/orderController');
const router = Router();

router.route('/:id').get(getOrders).put(updateOrder).delete(deleteOrder);
router.route('/').post(createOrder).get(getAllOrders);

module.exports = router;