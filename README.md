# Ride Lagbe is a ride sharing platform API

## Project Overview

The main goal was to design and build a secure, scalable, and role-based backend API for a ride booking system (similar to Uber, Pathao) using **Express.js** and **Mongoose**.

Riders can request rides, drivers can accept and complete rides, and admins manage the overall system.

---

## Features

- **Authentication:** JWT-based login system (admin, rider, driver)
- **Role-based Authorization**
- **Rider Logic:** Request/cancel rides, view ride history
- **Driver Logic:** Accept/reject rides, update status, view earnings, set availability
- **Admin Logic:** Manage users/drivers/rides, approve/suspend/block accounts, generate reports
- **Ride Management:** Complete ride history, status tracking
- **Modular Architecture:** Organized codebase for scalability
- **RESTful API Endpoints**

---

## Minimum Functional Requirements

- Secure password hashing (bcrypt)
- Riders: Request/cancel rides, view history
- Drivers: Accept/reject requests, update status, view earnings, set availability
- Admins: View/manage users/drivers/rides, approve/suspend/block, reports (optional)
- Role-based route protection
- All rides stored with full history

---

## Design Considerations

- **Ride Matching:** Manual or auto-match drivers
- **Cancellation:** Allowed before acceptance; handle unavailable drivers
- **Locations:** Store as coordinates or addresses
- **Ride Statuses:** requested → accepted → picked_up → in_transit → completed
- **Role Representation:** User model with role field; drivers have extra fields
- **Validations:** Prevent suspended drivers/riders from actions, limit cancel attempts
- **Access Control:** Role-based endpoint protection
- **API Design:** RESTful routes, proper status codes/messages

---

## Project Structure

```
src/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── driver/
│   ├── ride/
├── middlewares/
├── config/
├── utils/
├── app.ts
```

---

## 🧩 Example API Endpoints

- `POST /rides/request` – Rider requests a ride
- `PATCH /rides/:id/status` – Driver updates ride status
- `GET /rides/me` – Get user's ride history
- `PATCH /drivers/approve/:id` – Admin approves driver
- `PATCH /users/block/:id` – Admin blocks user

---

# Api structure:

- User (Account creation) with Name, Email, Password

```
    /api/v1/user/create - POST

```

- Auth (Login,Logout,Generate Refresh token using jwt,bcrypt)

```
 /api/v1/auth/login - POST
 /api/v1/auth/logout - POST
 /api/v1/auth/refresh-token - POST

```

- Rides (rides related apis are for user)

- /request: user provides pickup and destination latitude and longitude coordinates

  {pickupLatitude, pickupLongitude, destLongitude, destLatitude} = req.body;

- /me: See all the pending ride requests from user

- /:id: Cancel the ride but only if any driver has not picked up the ride yet and the status is still "PENDING" or else users cannot cancel the ride if the driver has already accepted the ride

```
    /api/v1/rides/request - POST
    /api/v1/rides/me - GET
    /api/v1/rides/:id - DELETE
```

## 📄 License

[MIT](LICENSE)

---

## 👤 Author

Md. Fazle Rabbi
