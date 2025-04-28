const OrderSummary = ({ cartData }) => {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Order Summary
      </h2>
      {cartData && cartData.items && cartData.items.length > 0 ? (
        <>
          <div className="max-h-[450px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
            <ul className="space-y-4">
              {cartData.items.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                      {item.product.image && (
                        <img 
                          src={`http://localhost:8080${item.product.image}`}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = 'https://via.placeholder.com/100';
                          }}
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-5">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-4">
                        Brand: {item.product.brand || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-4">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      Rs {item.product.price * item.quantity}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>Subtotal</span>
              <span className="font-medium">Rs {cartData.bill}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>Shipping</span>
              <span className="font-medium">Rs 5</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-gray-900 dark:text-gray-100 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span>Total</span>
              <span className="text-lg font-bold">Rs {cartData.bill + 5}</span>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-700 dark:text-gray-300 py-6 text-center">
          No items in cart.
        </p>
      )}
    </div>
  );
};

export default OrderSummary;
