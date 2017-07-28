CBT Nuggets Demo Project


Kirk Stennett

npm install && npm test

no mock servers so:

node app.js
node acme/acme.js
node rainier/rainier.js

Notes::
Customer login: customer, password
Employee login: employee, password

Logout just wipes id field, no visible response
Dropdown data is bound on click (kendo style - ajax loading hidden input)

Assumptions:

-web based UI for user to create posts to the system
-login for getting customer_id for requests and for validating employees and getOrders, if not logged in it will 'succeed' but say in the response that the user must be logged in
-3 total servers, one main customer end point and two for the supplier end points
-developed on mac, all db connections are wrapped with mockgoose
