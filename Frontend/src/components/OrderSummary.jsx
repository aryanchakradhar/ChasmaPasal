const OrderSummary = ({ cartData }) => {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Order Summary
      </h2>
      {cartData && cartData.items && cartData.items.length > 0 ? (
        <>
          <ul className="mt-4 space-y-2">
            {cartData.items.map((item, index) => (
              <li
                key={index}
                className="flex justify-between text-gray-700 dark:text-gray-300"
              >
                <span>{item.product.name}({item.quantity})</span>
                <span>Rs{item.product.price}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between text-gray-700 dark:text-gray-300 mt-4">
            <span>Subtotal</span>
            <span>Rs{cartData.bill}</span>
          </div>
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <span>Shipping</span>
            <span>Rs5</span>
          </div>
          <div className="flex justify-between text-gray-900 dark:text-gray-100 font-bold mt-4">
            <span>Total</span>
            <span>Rs{cartData.bill + 5}</span>
          </div>
        </>
      ) : (
        <p className="text-gray-700 dark:text-gray-300">No items in cart.</p>
      )}
    </div>
  );
};

export default OrderSummary;
