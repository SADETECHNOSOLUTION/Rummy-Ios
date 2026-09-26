# 02-rummy-ios

IOS player application. The supplied legacy ios source is retained under `legacy-reference/` for audit and asset comparison. The active application uses centralized API/session/realtime/localization/theme modules and contains no cash-withdrawal flow.

## Environment
Copy `.env.example` values into your build environment. Never hard-code production URLs or credentials.

## External integrations
Google auth, push provider, PAN/Aadhaar provider and Razorpay checkout require real provider configuration. Backend remains authoritative for KYC, wallet, card state, scoring and tournament decisions.
