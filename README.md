
# Clean Architecture Full-Stack

## Overview
More instructions will be added here as the project progresses.

## Getting Started

### Using Docker
Start the project with Docker by running:
```bash
docker-compose up -d
```
> **Note:** Ensure that the database credentials are correctly set in the environment files.

### Without Docker

1. **Backend Setup:**
   ```bash
   cd ./backend
   yarn install
   yarn start
   ```

2. **Frontend Setup:**
   ```bash
   cd ./frontend
   yarn install
   yarn start
   ```

## Backend Environment Variables & Setup

### Add `.env` File
```env
PREDEFINED_API_TOKEN=''
PORT=3001
```

### Add `.env.db` File
```env
DATABASE_URL=postgresql://username:password@localhost:5432/mydatabase
DB_HOST=localhost
DB_PORT=5432
DB_USER=username
DB_PASSWORD=password
DB_NAME=database
```

### Add `.env.firebase` File
```env
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_JSON_ROUTE=./full-stack.json
FIREBASE_DATABASE_URL=
```
### Add full-stack.json to the backend/src/config

## Frontend Environment Variables & Setup

### Add `.env` File
```env
VUE_APP_PREDEFINED_API_TOKEN=
VUE_APP_FIREBASE_API_KEY=
VUE_APP_FIREBASE_AUTH_DOMAIN=
VUE_APP_FIREBASE_PROJECT_ID=
VUE_APP_FIREBASE_STORAGE_BUCKET=
VUE_APP_FIREBASE_MESSAGING_SENDER_ID=
VUE_APP_FIREBASE_APP_ID=
```

### For country change you can click the button near the profile icon or or send the GET request as an localhost:3001/frontend_parameters?countryCode=TR&sort=ASC.

### If you click the arrow near the Create Date it will change the ascending descending order of the elements

### Email: firebase login email , Password: firebase login password 