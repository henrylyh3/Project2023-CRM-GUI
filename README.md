# CRMGUI

<!-- ABOUT THE PROJECT -->
This is a simple project that is built for accessing a list of contact that have details of its username, email, phone, skills and hobbies.

Originally generated with Angular CLI 16.2.2; upgraded to Angular 22.2.3,
Angular CLI 22.2.5, and Angular Material/CDK 22.2.4.

There is only one page in this project which is the user listing page, any other operation (add, edit, delete) will be in the form of popup for the specific purpose.

This project is mainly using angular material for the styling and component. It is split into different category (main, models, services)
- main (component for the pages, dialog)
- services (for conducting http service with backend)
- models (dtos)


<!-- GETTING STARTED -->
Use a supported Node.js version: 22.22.3+, 24.15.0+, or 26.x. The upgrade was
validated with Node.js 26.11.1 and npm 12.2.0.

```sh
npm ci
npm start
```

The API configured in `src/environments/environment.ts` must be running at
`https://localhost:5266/api` for live contact operations.

```sh
npm run build
```

Automated test files, runner configuration, and test commands have been removed.

See [Angular upgrade and interview notes](./ANGULAR-UPGRADE.md) for architectural
decisions, version differences, and an interview explanation.


<!-- How to Use the Project -->
after running `npm start`, browse to  http://localhost:4200/

<!-- Further enhancement -->
The future enhancement for this project will be 
- adding logging
- introduce account (login, sign up)
- add loading 


<!-- CONTACT -->
Lee Yoong Hean - henrylyh96@gmail.com
Project Link: https://github.com/henrylyh3/Project2023-CRM-GUI.git

<!-- ADD ON-->
- Enhancement to validate input by each type (text, phone, email)
- Enhancement to bulk add / bulk delete
- Filter in database with pagination

CRMGUI
