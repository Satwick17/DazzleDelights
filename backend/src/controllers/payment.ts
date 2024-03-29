import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";

// Creating Payment
export const createPayment = TryCatch(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount) return next(new ErrorHandler("Please Enter Amount", 400));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "inr",
  });

  return res.status(201).json({
    success: true,
    clientServer: paymentIntent.client_secret,
  });
});

// Creating new Coupon
export const newCoupon = TryCatch(async (req, res, next) => {
  const { coupon, amount } = req.body;

  if (!coupon || !amount)
    return next(new ErrorHandler("Please enter both coupon and amount", 400));

  await Coupon.create({ code: coupon, amount });

  return res.status(201).json({
    success: true,
    message: `Coupon ${coupon} created successfully`,
  });
});

// Applying Discount
export const applyDiscount = TryCatch(async (req, res, next) => {
  const { coupon } = req.query;

  const discount = await Coupon.findOne({ code: coupon });

  if (!discount) return next(new ErrorHandler("Coupon not exist", 400));
  res.status(200).json({
    success: true,
    discount: discount.amount,
  });
});

// Find all Coupons
export const allCoupons = TryCatch(async (req, res, next) => {
  const coupons = await Coupon.find({});

  res.status(200).json({
    success: true,
    coupons,
  });
});

// Delete Coupon
export const deleteCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await Coupon.findByIdAndDelete(id);

  if (!coupon) return next(new ErrorHandler("Invalid coupon ID", 400));

  res.status(200).json({
    success: true,
    message: `Coupon ${coupon?.code} deleted successfully`,
  });
});
