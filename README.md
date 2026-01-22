

# 🏋️ FitZone Gym – Membership Management System

<span class="badge badge-green">LIVE</span>
<span class="badge badge-blue">React</span>
<span class="badge badge-blue">Google Apps Script</span>
<span class="badge badge-red">Admin Alerts</span>

🔗 **Live Application**  
https://yellankikaushik.github.io/Gym-Membership/

---

## 🚀 Overview

**FitZone Gym** is a full-stack gym membership management system built to replace spreadsheets and manual tracking.

The system focuses on:
- Admin productivity
- Membership expiry intelligence
- Zero-cost, serverless backend

---

## 👤 Member Features

<div class="box">

- Member lookup using **Member ID**
- View membership status
- View plan duration:
  - 3 Months
  - 6 Months
  - 1 Year
- Start & expiry dates
- Remaining days displayed
- Phone number masked for privacy

</div>

---

## 🛠️ Admin Panel

<div class="box">

- Secure admin authentication
- Add / Edit / Delete members
- Renew memberships
- Status-aware filtering
- Clean, professional UI

</div>

---

## 🔔 Core USP – Admin Expiry Alert Engine

<div class="box">

This project’s key differentiator.

- Automated expiry email alerts
- Emails sent **only to admin**
- Alerts triggered when membership:
  - Expires today
  - Expires tomorrow
  - Expires in 2 days
  - Is expired
- One-time notification per member
- No third-party services

</div>

### 📧 Sample Email

Membership Expiry Alert | FitZone

Membership Alerts | FitZone

Membership of below members is going to expire:

ID: GYM004
Name: Kaushik
Phone: 7878787878
Status: Expires today
Ends: 2026-01-22

ID: GYM005
Name: Rahul Kiran
Phone: 5656565656
Status: Expires in 2 days
Ends: 2026-01-24

With regards,
FitZone, Hyderabad

yaml
Copy code

---

## 🧱 System Architecture

Frontend (React + Vite)
↓
Google Apps Script API
↓
Google Sheets (Database)
↓
Gmail (Admin Alerts)

yaml
Copy code

---

## 🧑‍💻 Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion

### Backend
- Google Apps Script
- Google Sheets
- Gmail Service

### Deployment
- GitHub Pages (`/docs`)

---

## 📂 Project Structure

Gym-Membership/
├── src/
│ ├── pages/
│ ├── api/
│ └── config/
├── docs/ # GitHub Pages build output
├── public/
├── README.md
└── vite.config.ts

yaml
Copy code

---

## 🎯 Why This Project Matters

<div class="box">

- Solves a real business problem
- Serverless & cost-free backend
- Clean system design
- Strong interview & demo value
- Admin-focused intelligence (USP)

</div>

---

## 🔮 Future Enhancements

- SMS alerts to members
- Payment & billing history
- Analytics dashboard
- Multi-branch gym support
- Role-based access control

---

## 👨‍💼 Author

**Kaushik **  
India 🇮🇳

---

<div class="footer">
⭐ If this project helped you, consider starring the repository.
</div>
