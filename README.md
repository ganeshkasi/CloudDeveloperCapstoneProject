# Udacity Cloud Developer Capstone Project

Serverless application where a user can keep records of receipts.

# Functionality of the application

- [x] **A user needs to authenticate in order to use an application homepage**
- [x] **The application allows users to create, update, delete receipts.**
- [x] **The application allows users to attach a image for a receipt.**
- [x] **The application only displays receipts for a logged in user.**


# Deployment

## Frontend deployment
A `serverless.yml` file has been added to the frontend project, which uses `serverless-s3-sync` plugin to depoly the frontend website to a AWS S3 bucket.

## Continuous deployment
A `travis.yml` file has been added to the project which streamlines the deployment of both frontend and backend services.
![Alt text](travis2.png?raw=true "deployment result")


# Realtime email notification for image upload
Every time a user is authenticated, an email will be sent to the user asking the user to confirm subscription to the image bucket SNS topic, once the user confirmed, an notification email will be sent to the user every time the user uploads an image to the bucket. User must be registered with valid email address to be able to receive notifications.
![Alt text](sns2.png?raw=true "deployment result")

# Best practices
- Individual packaging has been used for all lambda functions to reduce package size.
- All resources in the application are defined in the serverless.yml file.
- Each function has its own set of permissions.
- Application has sufficient monitoring.
- HTTP requests are validated.


# How to run the application
Website endpoint `http://udacity-capstone-frontend-s3-bucket-jmanzano.s3-website-us-east-1.amazonaws.com/`.

