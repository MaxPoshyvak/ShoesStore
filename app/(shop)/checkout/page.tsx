'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { CreditCard, MapPin, FileText, CheckCircle2, Mail, Lock, User, Truck, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useCart } from '@/components/context/CartContext';

export default function Checkout() {
    const { clearCart, setIsCartOpen } = useCart();

    const handlePayment = async (payload: {
        email?: string;
        username?: string;
        password?: string;
        shipping_address: string;
        payment_method: string;
        customer_notes: string;
        items: Array<{ good_id: number; quantity: number; size: number | string }>;
    }) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                const message = errorBody?.message || 'Server error while creating order.';
                throw new Error(message);
            }

            return response.json().catch(() => ({}));
        } catch (error) {
            console.error('Error submitting order:', error);
            throw error;
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isAuthenticated, _setIsAuthenticated] = useState(() => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('token');
        }
        return false;
    });

    type FormDataType = {
        email: string;
        username: string;
        password: string;
        delivery_method: string;
        shipping_address: string;
        payment_method: string;
        customer_notes: string;
    };

    const userLocalStore = isAuthenticated ? localStorage.getItem('user') : null;
    const parsedUserLocalStore = userLocalStore ? JSON.parse(userLocalStore) : null;

    if (isAuthenticated && !userLocalStore) {
        _setIsAuthenticated(false);
    }

    const [formData, setFormData] = useState<FormDataType>({
        email: '',
        username: '',
        password: '',
        delivery_method: 'standard_post',
        shipping_address: isAuthenticated ? parsedUserLocalStore?.delivery_address : '', // Prefill for guests
        payment_method: 'card',
        customer_notes: '',
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); // State for loading spinner

    const items = useCartStore((state) => state.items);
    const isHydrated = true;

    // 🔧 Log hydration and items
    useEffect(() => {
        if (isHydrated) {
            console.log('✅ Store hydrated with', items.length, 'items');
        }
    }, [isHydrated, items.length]);

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    type OrderItemPayload = {
        good_id: number;
        quantity: number;
        size: number | string;
    };

    type PayloadType = {
        shipping_address: string;
        delivery_method: string;
        payment_method: string;
        customer_notes: string;
        items: OrderItemPayload[];
        email?: string;
        username?: string;
        password?: string;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsProcessing(true); // Start loading

        const payload: PayloadType = {
            shipping_address: formData.shipping_address,
            delivery_method: formData.delivery_method,
            payment_method: formData.payment_method,
            customer_notes: formData.customer_notes,
            items: items.map((item) => ({
                good_id: item.id,
                quantity: item.quantity,
                size: item.size || 0,
            })),
        };

        // Add auth fields only if user is not authenticated
        if (!isAuthenticated) {
            payload.email = formData.email;
            payload.username = formData.username;
            payload.password = formData.password;
        }

        console.log('Sending data:', payload);

        try {
            // 1. Create the Order

            const orderData = await handlePayment(payload);

            const orderId = orderData?.order?.id || orderData?.id;

            // 2. Conditional Payment Logic
            if (payload.payment_method === 'card' && orderId) {
                // Fetch to create payment session for the order
                const paymentResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/create/${orderId}`,
                    {
                        method: 'POST', // Assuming POST to create a payment session
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                        },
                    },
                );

                if (!paymentResponse.ok) {
                    throw new Error('Failed to initiate payment gateway.');
                }

                const paymentData = await paymentResponse.json().catch(() => ({}));

                // If backend returns a URL (like Stripe Checkout URL), redirect the user
                if (paymentData.url) {
                    window.location.href = paymentData.url;
                    return; // Stop execution, the user is being redirected
                }
            }

            // 3. If Cash on Delivery OR card payment returned no URL but succeeded
            clearCart();
            setIsCartOpen(false);
            setIsSubmitted(true);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Order failed.';
            await Swal.fire({
                icon: 'error',
                title: 'Order error',
                text: message,
                confirmButtonColor: '#000',
            });
        } finally {
            setIsProcessing(false); // End loading
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans text-black">
                <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Order Placed!</h1>
                <p className="text-gray-500 mb-8 max-w-md text-center">
                    Thank you for your purchase. Your order has been successfully processed and is now being prepared.
                </p>
                <button
                    onClick={() => {
                        setIsSubmitted(false);
                        window.location.href = '/';
                    }}
                    className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                    Back to Shop
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-black pt-20">
            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <div className="mb-8 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Checkout</h1>
                    <p className="text-gray-500">Fill in the details below to complete your purchase.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Form (Left Column) */}
                    <div className="lg:w-2/3">
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                            {/* Registration / Contact Details (Hidden if token exists) */}
                            {!isAuthenticated && (
                                <section className="bg-gray-50/50 p-5 md:p-8 rounded-2xl border border-gray-100">
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Contact Details & Account Creation
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2 text-gray-700">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required={!isAuthenticated}
                                                    className="w-full border border-gray-200 p-4 pl-12 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold mb-2 text-gray-700">
                                                    Username <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleInputChange}
                                                    required={!isAuthenticated}
                                                    className="w-full border border-gray-200 p-4 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                    placeholder="e.g. John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold mb-2 text-gray-700">
                                                    Password <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleInputChange}
                                                        required={!isAuthenticated}
                                                        className="w-full border border-gray-200 p-4 pl-12 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                        placeholder="Create a password"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Delivery Method */}
                            <section className="bg-gray-50/50 p-5 md:p-8 rounded-2xl border border-gray-100">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Truck className="w-5 h-5" />
                                    Delivery Method
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label
                                        className={`relative border p-5 rounded-xl cursor-pointer transition-all ${formData.delivery_method === 'standard_post' ? 'border-black bg-white shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                                        <input
                                            type="radio"
                                            name="delivery_method"
                                            value="standard_post"
                                            checked={formData.delivery_method === 'standard_post'}
                                            onChange={handleInputChange}
                                            className="absolute opacity-0"
                                        />
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.delivery_method === 'standard_post' ? 'border-black' : 'border-gray-300'}`}>
                                                {formData.delivery_method === 'standard_post' && (
                                                    <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold">Standard Post</div>
                                                <div className="text-sm text-gray-500">Delivery in 3-5 days</div>
                                            </div>
                                        </div>
                                    </label>

                                    <label
                                        className={`relative border p-5 rounded-xl cursor-pointer transition-all ${formData.delivery_method === 'express_courier' ? 'border-black bg-white shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                                        <input
                                            type="radio"
                                            name="delivery_method"
                                            value="express_courier"
                                            checked={formData.delivery_method === 'express_courier'}
                                            onChange={handleInputChange}
                                            className="absolute opacity-0"
                                        />
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.delivery_method === 'express_courier' ? 'border-black' : 'border-gray-300'}`}>
                                                {formData.delivery_method === 'express_courier' && (
                                                    <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold">Express Courier</div>
                                                <div className="text-sm text-gray-500">Next day delivery</div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </section>

                            {/* Shipping Address */}
                            <section className="bg-gray-50/50 p-5 md:p-8 rounded-2xl border border-gray-100">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Shipping Address
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                                            Full Address <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="shipping_address"
                                            value={formData.shipping_address}
                                            onChange={handleInputChange}
                                            placeholder="City, Street, Building, Apartment/Office..."
                                            required
                                            className="w-full border border-gray-200 p-4 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none h-28"></textarea>
                                    </div>
                                </div>
                            </section>

                            {/* Payment Method */}
                            <section className="bg-gray-50/50 p-5 md:p-8 rounded-2xl border border-gray-100">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Payment Method
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label
                                        className={`relative border p-5 rounded-xl cursor-pointer transition-all ${formData.payment_method === 'card' ? 'border-black bg-white shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="card"
                                            checked={formData.payment_method === 'card'}
                                            onChange={handleInputChange}
                                            className="absolute opacity-0"
                                        />
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.payment_method === 'card' ? 'border-black' : 'border-gray-300'}`}>
                                                {formData.payment_method === 'card' && (
                                                    <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold">Credit/Debit Card</div>
                                                <div className="text-sm text-gray-500">Pay securely online</div>
                                            </div>
                                        </div>
                                    </label>

                                    <label
                                        className={`relative border p-5 rounded-xl cursor-pointer transition-all ${formData.payment_method === 'cash' ? 'border-black bg-white shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="cash"
                                            checked={formData.payment_method === 'cash'}
                                            onChange={handleInputChange}
                                            className="absolute opacity-0"
                                        />
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.payment_method === 'cash' ? 'border-black' : 'border-gray-300'}`}>
                                                {formData.payment_method === 'cash' && (
                                                    <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold">Cash on Delivery</div>
                                                <div className="text-sm text-gray-500">Pay when you receive</div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </section>

                            {/* Customer Notes */}
                            <section className="bg-gray-50/50 p-5 md:p-8 rounded-2xl border border-gray-100">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Order Notes
                                </h2>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        name="customer_notes"
                                        value={formData.customer_notes}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Call before delivery, specific door code..."
                                        className="w-full border border-gray-200 p-4 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none h-24"></textarea>
                                </div>
                            </section>
                        </form>
                    </div>

                    {/* Order Summary (Right Column) */}
                    <div className="lg:w-1/3">
                        <div className="bg-gray-50/80 p-5 md:p-6 rounded-2xl sticky top-30 border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold mb-6 border-b border-gray-200 pb-4">Your Order</h2>

                            <div className="space-y-6 mb-6">
                                {!isHydrated && items.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>Loading your cart...</p>
                                    </div>
                                )}
                                {items.length === 0 && isHydrated && (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>Your cart is empty. Add items to proceed.</p>
                                    </div>
                                )}
                                {items.map((item, index) => (
                                    <div key={index} className="flex gap-4 items-center">
                                        <div className="w-20 h-20 bg-white rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-sm line-clamp-2 text-gray-900">
                                                {item.name}
                                            </h3>
                                            <div className="flex gap-3 text-gray-500 text-xs mt-1.5 font-medium">
                                                <span>Size: {item.size}</span>
                                                <span className="w-px h-4 bg-gray-300"></span>
                                                <span>Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="font-bold text-sm whitespace-nowrap">
                                            ₴ {(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Stylized Total & Button Section matching the user's screenshot */}
                            <div className="border-t border-gray-200 pt-4 mt-2">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[17px] font-bold text-black">Total:</span>
                                    <span className="text-[17px] font-bold text-black">₴ {total.toFixed(2)}</span>
                                </div>

                                <button
                                    type="submit"
                                    form="checkout-form"
                                    disabled={isProcessing || items.length === 0}
                                    className="w-full bg-black text-white py-3.5 px-6 font-semibold text-base rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : formData.payment_method === 'card' ? (
                                        'Proceed to Payment'
                                    ) : (
                                        'Place Order'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
