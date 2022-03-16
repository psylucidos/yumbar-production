## Yumbar Production API
Super simple CRUD API for stored production data.
### Setup
Run `node setup.js USERNAME PASSWORD`, to reset then create the database tables and create the admin user.
### Routes
#### /auth/login
Method: `POST`
Parameters:
 - username `string REQUIRED`
 - password `string REQUIRED`
Returns: `status 200 || status 401`
#### /auth/register
Method: `POST`
Parameters:
 - username `string REQUIRED`
 - password `string REQUIRED`
Returns: `status 200 || status 401`
#### /days/add
Method: `POST`
Parameters:
 - date `date REQUIRED`
 - productionType `string REQUIRED`
Returns: `object createdDay || status 401`
#### /days/get
Method: `POST`
Parameters:
 - date `date REQUIRED`
Returns: `object foundDay || undefined`
#### /flavours/add
Method: `POST`
Parameters:
 - date `date REQUIRED`
 - productionType `string REQUIRED`
 - flavourEntryData `object REQUIRED`
Returns: `object createdFlavourEntry || status 401`
#### /flavours/update
Method: `POST`
Parameters:
 - date `date REQUIRED`
 - productionType `string REQUIRED`
 - flavourEntryData `object REQUIRED`
Returns: `object updatedFlavourEntry || status 401`
#### /flavours/delete
Method: `POST`
Parameters:
 - id `string REQUIRED`
Returns: `status 200 || status 401`
#### /flavours/get
Method: `POST`
Parameters:
 - date `date REQUIRED`
 - productionType `string REQUIRED`
Returns: `array[object] foundFlavourEntries || undefined`
#### /staff/add
Method: `POST`
Parameters:
 - date `date REQUIRED`
 - staffEntryData `object REQUIRED`
Returns: `object createdStaffEntry || status 401`
#### /staff/update
Method: `POST`
Parameters:
 - id `string REQUIRED`
 - staffEntryData `object REQUIRED`
Returns: `object updatedStaffEntry || status 401`
#### /staff/delete
Method: `POST`
Parameters:
 - id `string REQUIRED`
Returns: `status 200 || status 401`
#### /staff/get
Method: `POST`
Parameters:
 - date `date REQUIRED`
Returns: `array[object] foundFlavourEntries || undefined`
