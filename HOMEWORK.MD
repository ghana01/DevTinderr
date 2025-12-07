create a repo
-node_module,pakage.json,pakacge-lock.json
-Install express
-create server
-Listen the port 5000
-make a request handler for /test,/heelo
-install nodemon ,update the script inside the pakage.json
- what are the dependecis
-differecnce between caret and tilde (^ vs ~)
- what are the use of -g  while npm install

-initialize git
-gitignore 
- create a remote repo on github
-push all code to remote origin
-play with the routes and route ex. /hello /hello/2  ->
-> important lesson is order of the route is matter 
-what are the http method
-
write logic to handel the get,post,pathc,delte
-use of regex in route
reading the querey params in the route

 reading the dyanamic route

 -multiple route hander
 next()
 next function and erro along with thr res.send()


 - how express js handel the request behind the scenes
 
-write a dummy auth middlware for all the user route except /user/login
-erro handeling 

--------
-coonect the appkication with db->mongoDb
-- visit to monnoge document if anything need to monngoe is orm for mognoDb
-create a cluster on mongodb offcial website (mongo atlas)
- install mongoose library (npm)
- connect your application to the database   /devTinder

-create a user  Schema  and user model

--create a post /signup api to add data to database
- push some document using api calls from postman
-- do some erro handeling using try catch
-js object vs json learn about it 
-add the express.json middlware to your app
-make your api dyanmics to recive data from the end 

-create api  with help of mongoose
-create and api get user BY ID
-create a delete user api

-explore the schema option from mongoose
-add required ,uine,lowercase,min,trim and many more
-add default value\
- create a custom validater
-improve the db schema overall


----
data senitazation


-add api level validation on patch request & signup post api

-add apo  validation for each feild in schema

-install validator
-explore validator library function and use vlidator func for password,gmeail....

install cookie parser ,jwt npm
just send a dummy cookie to user
create a get /profile and chek if u get the cookie back
in login PAI,create e jwt token and send back to the user in cooies

 read the cookies inside your profile api and ifnd thr logged in user

useAuth middleware

add the userAuth middleware in the profile  and send a new sendconnection request api

set the expiry of jwt token and cookies to 7 days

create userSchamea method to get Jwt() 
-Create a userschema method to comparepassword(password) 
