# dicri-mp
![License: CC BY-NC-ND 4.0](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey.svg)


This project is for a technical evaluation using React, NodeJS and Docker


The project is planed use the following components
- *backend:* with nodejs, express and express session.
- *frontend:* with react
- *DB:* with SQL Express Server
- *ORM:* Sequelize
- *Session Store:* SQL-based session Table
- *API Testing:* Postman + Newman


## Status of todos
- [x] Planned views/mockups and ER schema
- [x] First design for testing API(postman)
- [x] Docker compose definition
- [x] REST Api implemented
- [ ] Postman runner passed
- [ ] Frontend implemented
 


📝 Note:
This project was originally developed in Spanish for a technical evaluation on a government institution in Guatemala.  
All table names, some endpoint and views are in Spanish for consistency.  

##  (Backend)
### 📁 Folder Structure
```
src/
├── config/      # Configuration (DB, sessions)
├── constants/   # Project-wide constants
├── controllers/ # Route logic (handlers)
├── middlewares/ # Auth, error handling
├── repository/  # DB access layer with repository pattern
├── routes/      # Route definitions
├── services/    # Business logic
├── types/       # TypeScript interfaces & definitions
├── utils/       # Helpers
└── server.ts    # Application entry point


## License
© 2025 Héctor Yaque — All rights reserved.
This project is licensed under the [Creative Commons BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/) license.  
You may view the code, but you may not use it for commercial purposes or create derivative works without explicit permission.