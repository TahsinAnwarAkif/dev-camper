# DevCamper API

> Backend API for DevCamper application, a bootcamp directory website.

> Live URL: http://159.223.10.250/

### Env Variables

To run the app locally, create a .env file in then root and add the following

```
NODE_ENV = development | production
PORT = <PORT>
MONGO_URI=<YOUR_MONGODB_URI>
JWT_SECRET=<JWT_SECRET>
JWT_EXPIRE=<JWT_EXPIRE_TIME>
JWT_COOKIE_EXPIRE=<JWT_COOKIE_EXPIRE_TIME>
GEOCODER_PROVIDER=<GEOCODER_PROVIDER>
GEOCODER_API_KEY=<GEOCODER_API_KEY>
FILE_UPLOAD_PATH=/uploads

SMTP_HOST=<SMTP_HOST>
SMTP_PORT=<2525>
SMTP_EMAIL=<SMTP_EMAIL>
SMTP_PASSWORD=<SMTP_PASSWORD>
FROM_EMAIL=<FROM_EMAIL>
FROM_NAME=<FROM_NAME>
```

### Install Dependencies & Run

```
npm install
npm run dev
```

### Seed Database

You can use the following commands to seed the database with some sample users/bootcamps/courses/reviews as well as destroy all data

```
# Import data
npm run data:import

# Destroy data
npm run data:destroy
```

### Bootcamp Functionalities

- List all bootcamps
  - Pagination
  - Filtering (i.e. with NoSQL standard querying)
  - Selecting specific fields in result
  - Sorting by single/multi params
- List bootcamps within a radius specifying zip-code and covering distance
- Get a single bootcamp
- Create new bootcamp w/ proper auth
- Update a bootcamp w/ proper auth
- Upload a photo for bootcamp w/ proper auth
- Delete a bootcamp w/ proper auth

- Calculate the average rating from the reviews for a bootcamp on saving/updating review

### Course Functionalities

- List all courses in general

  - Pagination
  - Filtering (i.e. with NoSQL standard querying)
  - Selecting specific fields in result
  - Sorting by single/multi params

- List all courses for bootcamp
- Get a single course
- Create new course for a bootcamp w/ proper auth
- Update a course w/ proper auth
- Delete a course w/ proper auth
- Average cost calculation of all courses for a bootcamp on saving/updating course

### Review Functionalities

- List all reviews in general

  - Pagination
  - Filtering (i.e. with NoSQL standard querying)
  - Selecting specific fields in result
  - Sorting by single/multi params

- List all reviews for a bootcamp
- Get a single review
- Create a review w/ proper auth
- Update a review w/ proper auth
- Delete a review w/ proper auth
- Average rating calculation of all reviews for a bootcamp on saving/updating reviews

### User Functionalities

- List all users w/ proper auth
  - Pagination
  - Filtering (i.e. with NoSQL standard querying)
  - Selecting specific fields in result
  - Sorting by single/multi params
- Create a user w/ proper auth
- Update a user w/ proper auth
- Delete a user w/ proper auth

### Auth Functionalities

- User Registration (w/ "user" or "publisher" role)
- User Login
- User Logout
- Preview my profile
- Update my profile's name, email
- Update my password
- Forget/Reset password using token

## Misc Functionalities

- Proper authentication/authorization w/ JWT
- Owner cases implementation wherever applicable
- Password hashing
- Mongoose / other validations
- Proper error status code / message handling
- Taking only specific fields wherever saving/updating an entity, in order to prevent inputting system generated fields
- Database seeders
- Prevent NoSQL injections
- Add extra headers for security
- Prevent cross site scripting - XSS
- Add a rate limit for requests of 100 requests per 10 minutes
- Protect against http param polution
- Use cors to make API public (for now)
- API Documentation in Postman as well as by Docgen

### Documentation

> Postman API Documentation: [here](https://documenter.getpostman.com/view/2647947/UzJQqZwk)

> Docgen API Documentation: [here](http://159.223.10.250/)
