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

Request:

```
{
    "name": "Titumir haque",
    "email": "titu@mir.com",
    "password": "Titumir123!"
}
```

Response:

```
{
    "statusCode": 201,
    "success": true,
    "message": "User created successfully",
    "data": {
        "name": "Titumir haque",
        "email": "titu@mir.com",
        "role": "USER",
        "isDeleted": false,
        "isActive": "ACTIVE",
        "isVerified": false,
        "auths": [
            {
                "provider": "credentials",
                "providerId": "titu@mir.com"
            }
        ],
        "_id": "68bc2879400115e6d575bd54",
        "createdAt": "2025-09-06T12:26:33.273Z",
        "updatedAt": "2025-09-06T12:26:33.273Z",
        "__v": 0
    }
}
```

- Auth (Login,Logout,Generate Refresh token using jwt,bcrypt)

```
 /api/v1/auth/login - POST
 /api/v1/auth/logout - POST
 /api/v1/auth/refresh-token - POST

```

## /login:

Request

```
{
    "email": "arif@sarkar.com",
    "password": "Arif123!"
}
```

Response

```
{
    "statusCode": 201,
    "success": true,
    "message": "Logged in successfully",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGJiMWY2MWJiOGEzNzJiZjExZDE5NWYiLCJlbWFpbCI6ImFyaWZAc2Fya2FyLmNvbSIsIm5hbWUiOiJBcmlmIFNhcmthciIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzU3MTYwODg4LCJleHAiOjE3NTcyNDcyODh9.lY2OVhejeGU7cEqeKsuszH7HY0swURghufkXztu0Bk0",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGJiMWY2MWJiOGEzNzJiZjExZDE5NWYiLCJlbWFpbCI6ImFyaWZAc2Fya2FyLmNvbSIsIm5hbWUiOiJBcmlmIFNhcmthciIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzU3MTYwODg4LCJleHAiOjE3NTkzMjA4ODh9.zvTXArLWQ0rWRvuuKR16wD8UMbPIRkUd-8Bt3mm9V64",
        "user": {
            "_id": "68bb1f61bb8a372bf11d195f",
            "name": "Arif Sarkar",
            "email": "arif@sarkar.com",
            "role": "USER",
            "isDeleted": false,
            "isActive": "ACTIVE",
            "isVerified": false,
            "auths": [
                {
                    "provider": "credentials",
                    "providerId": "arif@sarkar.com"
                }
            ],
            "createdAt": "2025-09-05T17:35:29.719Z",
            "updatedAt": "2025-09-05T17:35:29.719Z",
            "__v": 0
        }
    }
}

```

## Logout

```
{
    "success": true,
    "message": "Logged out successfully!",
    "body": null
}

```

- Rides (rides related apis are for user)

```
    /api/v1/rides/request - POST
    /api/v1/rides/me - GET
    /api/v1/rides/:id - DELETE
```

- /request: user provides pickup and destination latitude and longitude coordinates

  {pickupLatitude, pickupLongitude, destLongitude, destLatitude} = req.body;

Request:

```
{
"pickupLatitude": 25.746466,
"pickupLongitude": 90.376015,
"destLatitude": 25.792496,
"destLongitude": 90.401215
}

```

Response:

```
{
    "statusCode": 201,
    "success": true,
    "message": "Requested Ride successfully",
    "data": {
        "user_id": "68bc2879400115e6d575bd54",
        "email": "titu@mir.com",
        "pickup_location": {
            "type": "Point",
            "coordinates": [
                90.376015,
                25.746466
            ]
        },
        "destination": {
            "type": "Point",
            "coordinates": [
                90.401215,
                25.792496
            ]
        },
        "trip_fare": 167,
        "duration": 9,
        "status": "REQUESTED",
        "_id": "68bc2941400115e6d575bd5a",
        "__v": 0
    }
}

```

- /me: See all the pending ride requests from user

Response:

```
 {
   "statusCode": 201,
   "success": true,
   "message": "Fetched all requests of the user",
   "data": [
       {
           "pickup_location": {
               "type": "Point",
               "coordinates": [
                   90.376015,
                   25.746466
               ]
           },
           "destination": {
               "type": "Point",
               "coordinates": [
                   90.401215,
                   25.792496
               ]
           },
           "_id": "68bb35fb975f15d9fa767784",
           "user_id": "68bb1f61bb8a372bf11d195f",
           "email": "arif@sarkar.com",
           "trip_fare": 221,
           "duration": 9,
           "status": "REQUESTED",
           "__v": 0
       }
   ]
}

```

- /:id: Cancel the ride but only if any driver has not picked up the ride yet and the status is still "PENDING" or else users cannot cancel the ride if the driver has already accepted the ride

- /delete
  Response:

```
{
    "statusCode": 200,
    "success": true,
    "message": "Ride cancelled successfully",
    "data": {
        "pickup_location": {
            "type": "Point",
            "coordinates": [
                90.376015,
                25.746466
            ]
        },
        "destination": {
            "type": "Point",
            "coordinates": [
                90.401215,
                25.792496
            ]
        },
        "_id": "68bc2941400115e6d575bd5a",
        "user_id": "68bc2879400115e6d575bd54",
        "email": "titu@mir.com",
        "trip_fare": 167,
        "duration": 9,
        "status": "REQUESTED",
        "__v": 0
    }
}
```

## 📄 License

[MIT](LICENSE)

---

## 👤 Author

Md. Fazle Rabbi
