import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api';
import { CreditCard, Lock } from 'lucide-react';

const CheckoutForm = ({ amount, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            // 1. Create PaymentIntent on backend
            const { data } = await api.post('/payment/create-payment-intent', {
                amount: amount
            });

            const clientSecret = data.clientSecret;

            // 2. Confirm Card Payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: 'Demo User', // In real app, get from profile
                    },
                },
            });

            if (result.error) {
                setError(result.error.message);
                setProcessing(false);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    // 3. Confirm to backend to update wallet
                    await api.post('/payment/confirm', {
                        amount: amount,
                        paymentIntentId: result.paymentIntent.id
                    });
                    onSuccess();
                }
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Payment failed');
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#ffffff',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>

            {error && (
                <div className="text-red-500 text-sm flex items-center">
                    <Lock className="w-4 h-4 mr-1" />
                    {error}
                </div>
            )}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={processing}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-xl font-semibold transition disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!stripe || processing}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-4 py-3 rounded-xl font-semibold hover:from-yellow-400 hover:to-yellow-500 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {processing ? (
                        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <CreditCard className="w-5 h-5" />
                            Pay ${amount}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default CheckoutForm;
