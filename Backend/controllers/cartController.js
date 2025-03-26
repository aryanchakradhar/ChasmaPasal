const Cart = require('../models/cart');
const Product = require('../models/product');

const get_cart_items = async (req, res) => {
    const userId = req.params.userId;
    try {
        let cart = await Cart.findOne({ userId }).populate('items.product');
        res.send(cart)
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

const add_cart_item = async (req, res) => {
    const userId = req.params.userId;
    const { productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ userId });
        let item = await Product.findOne({ _id: productId });
        if (!item) {
            return res.status(404).send('Item not found!');
        }
        const price = item.price;
        const name = item.title;

        if (cart) {
            let itemIndex = cart.items.findIndex(p => p.product.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity, price });
            }
            cart.bill += quantity * price;
        } else {
            cart = new Cart({
                userId,
                items: [{ product: productId, quantity, price }],
                bill: quantity * price
            });
        }
        await cart.save();
        cart = await Cart.findById(cart._id).populate('items.product');
        return res.status(201).send(cart);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Something went wrong");
    }
}

const delete_item = async (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.itemId;
    try {
        let cart = await Cart.findOne({ userId });
        if (cart) {
            let itemIndex = cart.items.findIndex(p => p.product.toString() === productId);
            if (itemIndex > -1) {
                let product = cart.items[itemIndex];
                cart.bill -= product.quantity * product.price;
                cart.items.splice(itemIndex, 1);
                await cart.save();
                cart = await Cart.findById(cart._id).populate('items.product');
                return res.send(cart);
            } else {
                return res.status(404).send({ message: "Item not found in the cart" });
            }
        } else {
            return res.status(404).send({ message: "Cart not found" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send("Something went wrong");
    }
}

module.exports = {
    get_cart_items,
    add_cart_item,
    delete_item
}
