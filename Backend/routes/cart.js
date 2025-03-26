const { Router } = require('express');
const {get_cart_items, add_cart_item, delete_item} = require('../controllers/cartController');
const router = Router();

router.route('/:userId').get(get_cart_items).post(add_cart_item);
router.route('/:userId/:itemId').delete(delete_item);

module.exports = router;