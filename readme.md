# TopRentals

TopRentals is an example application written in Nodejs and React that allows users to manage apartment rentals.

### Backend

The backend is written in Node.js and Typescript, using a Postgres as a database. It uses express for serving web requests, bcrypt and JSON Web Tokens for authentication, mocha and chai for testing and TypeORM for communication with the DB. It is very roughly based on https://github.com/oldboyxx/jira_clone.

To run it, you need to:

- create a .env file in /api, for example:

```
NODE_ENV=development
DB_HOST=your-host-here.db.ondigitalocean.com
DB_PORT=25060
DB_USERNAME=doadmin
DB_PASSWORD=doadminpassword
DB_DATABASE=toptal
DB_DATABASE_TEST=toptal_test
JWT_SECRET=myjwtsecret
```

- `cd api`
- run `yarn` to install dependencies
- run `yarn start` to start the application
- run `yarn test` to run the test suite; please note that it uses the test database configured in .env and completely removes all the contents after testing is done

Please note that the test suite is running using ts-node rather than the Typescript compiler, sometimes causing small differences in behavior.

### Frontend

The frontend is a standard create-react-app Typescript React app (see client/readme.md for more details) written using functional components and hooks. The design system used is Material-UI 4.

To run it for testing purposes:

- make sure the backend is running
- `cd api`
- run `yarn` to install dependencies
- run `yarn start` to start the application
- go to http://localhost:3000/

### Bugs

- the client does not handle expiring tokens nicely
- when editing apartment addresses, the coordinate length must be reduced for the address search to work; unclear whether the bug is in the code or the react-geocode library
- the realtor select in the Create Apartment dialog does not handle large numbers of users; it should be an [autocomplete](https://material-ui.com/components/autocomplete/) instead, calling a search route on the backend
- client performance sometimes suffers because of excessive updates, especially the filters
- maps apartment infobox location does not take zoom level into consideration; looks bad on very high or very low zoom

### Future improvements

- code
  - streamline dialog code
  - restrict Google key based on http request
  - more type safety
  - return human-readable error messages from backend for input validation
  - front-end tests
  - end-to-end tests
  - lerna setup to share Entity types between frontend and backend
  - security review
- features
  - show toasts for success and failure on the client
  - more useful map markers (e.g. show price on the marker, change color based on availability)
