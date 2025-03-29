
const PaymentSection = ({setFormData , formData}) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Payment Information</h2>
      <div className="mt-4 space-y-4">
        <div className="flex items-center">
          <input
            type="radio"
            id="cod"
            name="paymentMethod"
            value="cod"
            checked={formData.paymentMethod === 'cod'}
            onChange={() => setFormData(
              {
                ...formData,
                paymentMethod: 'cod'
              }
            )}
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-700"
          />
          <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Cash on Delivery
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="card"
            name="paymentMethod"
            value="card"
            checked={formData.paymentMethod === 'card'}
            disabled
            onChange={() => setFormData(
              {
                ...formData,
                paymentMethod: 'card'
              }
            )}
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-700"
          />
          <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-400 dark:text-gray-600">
            Card Payment (Unavailable)
          </label>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;