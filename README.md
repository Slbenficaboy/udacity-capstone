# Serverless Haircut Appointments

## Functionality of the application

This application allows a user to record haircut appointments. The user can enter the name of their barber/stylist, date of the appointment, and description of the appointment. The user can then edit the entry to add an image of the final results. This will provide a history of styles for reference at a later point. Each entry can also be deleted.

## How to run the application

### Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

### Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.