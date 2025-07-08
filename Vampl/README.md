Project - Vampl 

description - This is small messenger based on nest.js and react - vite.Created to improve my understanding of project server part and get websocket experience.(Many design decisions were taken from telegram web)

Screenshots:
1) Home page:
  ![Light theme](image-3.png)
  ![Dark theme](image-4.png)
  ![Default page](image-1.png)
  ![opened chat](image-2.png)
  ![Search](image-8.png)

2) Account menu:
  ![Default](image-5.png) 
  ![Edit](image-6.png)
  ![Avatar](image-7.png)

3) Authorization page:
  ![Default](image-9.png)
  ![Incorrect value in some input](image-10.png)


Technology stack:
  - Front:
      Typescript
      React.js
      Redux-toolkit (RTK Query)
  - Back:
      Nest.js
      Axios
      Prisma
      Websocket(Socket.io)
  - Database:MySQL

To run this project:
  - clone repo 
  - install dep. (npm install)
  - in server folder .env enter db url (
    DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
  )
  - since this project have migrations use - "npx prisma migrate deploy" (in server folder btw)
  - in project folder run "npm run project"
