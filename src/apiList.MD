#DEVTINDER

##authRouter
-POST/signup
-POST/login
-Post/logout

##progileRouter
-GET/profile/view   ->get the profile
-PATCH/profile/edit  ->update the profile
-PATCH/profile/password   ->this api for forget the passowrd
-
##connectionRequestRouter

//-Post/request/review/:status/:userID
-POST/request/send/intrested/:userId
-POST/request/send/ignore/:userId

//-POST /request/review/:status/:requestId
-POST /request/review/accepted/:requestID
-POST /request/review/rejected/:requestID

#UserROuter
-GET/user/Connection   -> the looged in user can see the all the  the connection he have i means  all the accptd  either he send request and it get accpeted   and other people send rquest to loggend in user and he accept the request 
-GET/user/request
-GET/feed   -get the other user profile on the platform

- build the chat feature later i will build 
status  ->
         ignore,intrested,accept,rejected



