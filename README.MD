# QuikShope Client SDK

#### List of classes availlable in the SDK , which can be returned by functions will be dicussed in the later part

 Class Name | Purpose 
 --- | ---
Config | Hold all the config of project such as API Endpoints and . Also store ***username*** of shop as *static* member which is used by another functions
AuthenticateUser | It has the functions to handle the OTP verification and generate auth token / generate Customer Object [**GLOBAL**]
Customer | This consists all the information of the customer. This call include functions for update details / fetch all orders / get a particular order details / checkout [**CUSTOMER**]
Product | All details of an product
ProductCategory | All detaiks of a product category. It has function to fetch all the products under the category
OrderStatus| It has two members : status_code, datetime [**ORDER**]
Transaction | Holds all information for a transaction , related to order [**ORDER**]
PromoCode | Holds promocode details that has been applied for order [**ORDER**]
HomeDelivery | Hold home delivery related details for order details [**ORDER**]
SelfPickup | Hold self pickup mode delivery related details for order details [**ORDER**]
TableOrder | Hold table order related details for order details [**ORDER**]
AdvancedTableOrder | Hold advanced table order related details for order details [**ORDER**]
Order | Hold details of order [**ORDER**]
ShopProfile | Hold information like owner's name, shop name and logo [**SHOP**]
ShopContact | Email Id, Mobile number of shop and also have information whether email id and mobile number verified or not [**SHOP**]
ShopAddress | Hold address of shop [**SHOP**]
ShopAccount | Hold details whether user in on free_account mode , also have template name and configuration of the template [**SHOP**]
PaymentMode | Hold pod and online params which indicate that payment mode is available or not. *It is used by another class . No direct iimplementation.*[**SHOP**]
HomeDeliveryConfig | Hold home delivery related details for order details [**SHOP**]
SelfPicupConfig | Hold self pickup mode delivery related details for order details [**SHOP**]
TableOrderConfig | Hold table order related details for order details [**SHOP**]
AdvancedTableOrderConfig | Hold advanced table order related details for order details [**SHOP**]
ShopDays | Store information in which days shop will be opened for taking orders [**SHOP**]
ShopConfig | Store information of shop like , shop is force closed or not , opening time, closing time, working days, delivery & payment configurations [**SHOP**]
ShopPromoCode | Holds information for promo code available to apply . It holds the code, discount details and its description [**SHOP**]
Shop | Main Class which hold all the details related to a shop. [**SHOP**]

### Install QuikShope Client Library
Install by npm
```bash
npm install git@github.com:GiantsMeet/quikshope_client.git
```

> If you are not using any frontend framework or nodejs , then prefer to use the below method to import library.

To install directly in HTML, use the cdn link provided below
```js
<script srdc="https://cdn.jsdelivr.net/gh/GiantsMeet/quikshope_client@main/dist/client.min.js"></script>
```

### Import Library

In case of NodeJS / Frontend framework , the standard ES5 & ES6 import strategy will work
```js
// For type "module"
const client = require("quikshope_client")

// For type "commonjs"
import client from "quikshope_client"

// For HTML javascript
let client = QuikShopeClient;
```

### Initialize Library
For initialization, the username of the shop needed , that can be found in dashboard of seller
```js
client.init("shop2")
```

### Authenticate User [Customer]
Process flow for authentication
1. Create object of AuthenticateUser
1. Send OTP
2. Verify OTP [If failed, resent OTP]
3. Generate Auth Token or Generate Customer Object

- ##### Create AuthenticateUser object
The 10 digit phone number of customer without country code need to be pass as arguments.
> Note : If the customer has not any account, account will be created , there is no need to check existance of customer account

	```js
const auth = new client.authenticate("9999999999")
	```

- #### Send OTP
	```js
await auth.sendOtp()
    ```
In return , we will receive a list of two items in the below format
```
[success (boolean), message(string)]
```
If success is true that's indicate OTP has been sent , in same way we will get message which can be shown to the user

- #### Send OTP
	```js
await auth.sendOtp()
    ```
In return , we will receive a list of two items in the below format
```
[success (boolean), message(string)]
```
If success is true that's indicate OTP has been sent , in same way we will get message which can be shown to the user

- #### Resend OTP
	```js
await auth.resendOtp()
    ```
In return , we will receive a list of two items in the below format
```
[success (boolean), message(string)]
```
If success is true that's indicate OTP has been resent , in same way we will get message which can be shown to the user

- #### Verify OTP
It takes 6 digit otp as parameter
	```js
await auth.verifyOtp("111111")
    ```
In return , we will receive a list of two items in the below format
```
[success (boolean), message(string)]
```
If success is true that's indicate OTP has been verified so that we can proceed for generate auth token or customer object , in same way we will get message which can be shown to the user


- #### Generate Auth Token
	```js
await auth.generateToken()
    ```
In return , we will receive a list of two items in the below format
```
[success (boolean), message(string), token(string)]
```
If success is true that's indicate user has been verified through otp verification and received auth token , in same way we will get message which can be shown to the user. the 3rd parmeter we will receive the Auth Token

	There is various method to store the token in clientside
	1. Cookie
	2. LocalStorage
	3. IndexedDB


- #### Generate Customer Object
	```js
await auth.generateTokenAndCustomerDetils()
    ```
In return , we will receive a list of two items in the below format
```
[success (boolean), message(string), customer(Customer Object)]
```
If success is true that's indicate user has been verified through otp verification and received customer object , in same way we will get message which can be shown to the user. If success is false then the customer [3rd parameter] will be *null*

### Customer Object [Detailed]
