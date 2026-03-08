import { useCallback } from 'react';
import { usePaystackPayment } from 'react-paystack';

interface PaymentModalProps {
  isOpen: boolean;
  amount: number;
  email: string;
  bookingId: string;
  serviceName: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

export default function PaymentModal({
  isOpen,
  amount,
  email,
  bookingId,
  serviceName,
  onSuccess,
  onClose
}: PaymentModalProps) {
  const config = {
    reference: `${bookingId}-${Date.now()}`,
    email: email,
    amount: Math.round(amount * 100), // Paystack expects amount in kobo (cents)
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_default_key',
    currency: 'NGN'
  };

  const handlePaymentSuccess = useCallback((reference: any) => {
    onSuccess(reference.reference);
    onClose();
  }, [onSuccess, onClose]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    initializePayment({
      onSuccess: handlePaymentSuccess,
      onClose: handleClose
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Service</p>
            <p className="font-semibold text-lg">{serviceName}</p>
            <div className="mt-2 border-t pt-2">
              <p className="text-sm text-gray-600">Amount to pay</p>
              <p className="text-2xl font-bold text-green-600">₦{amount.toLocaleString()}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            You will be redirected to Paystack to complete your payment securely.
          </p>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Pay with Paystack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
