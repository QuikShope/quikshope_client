# QuikShope Client SDK

#### `Class definition` availlable in the SDK , which can be returned by functions or used internally will be dicussed in the later part

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

- - -

### Install QuikShope Client Library
Install by npm
```bash
npm i quikshope_client
```

> If you are not using any frontend framework or nodejs , then prefer to use the below method to import library.

To install directly in HTML, use the cdn link provided below
```js
<script src="https://cdn.jsdelivr.net/gh/GiantsMeet/quikshope_client@main/dist/client.min.js"></script>
```

- - -

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

- - -

### Initialize Library
For initialization, the username of the shop needed , that can be found in dashboard of seller
```js
client.init("shop2")
```
- - -

### Authenticate User [Customer]
Process flow for authentication
1. Create object of AuthenticateUser
1. Send OTP
2. Verify OTP [If failed, resent OTP]
3. Generate Auth Token or Generate Customer Object

#### Create AuthenticateUser object
The 10 digit phone number of customer without country code need to be pass as arguments.
> Note : If the customer has not any account, account will be created , there is no need to check existance of customer account

```js
const auth = new client.authenticate("9999999999")
```

#### Send OTP
```js
await auth.sendOtp()
```
In return , we will receive a list of two items in the below format
```
[success (boolean), message(string)]
```
If success is true that's indicate OTP has been sent , in same way we will get message which can be shown to the user

#### Send OTP
```js
await auth.sendOtp()
```
In return , we will receive a list of two items in the below format
```
[success (boolean), message(string)]
```
If success is true that's indicate OTP has been sent , in same way we will get message which can be shown to the user

#### Resend OTP
```js
await auth.resendOtp()
```
In return , we will receive a list of two items in the below format
```
[success (boolean), message(string)]
```
If success is true that's indicate OTP has been resent , in same way we will get message which can be shown to the user

#### Verify OTP
It takes 6 digit otp as parameter
```js
await auth.verifyOtp("111111")
```
In return , we will receive a list of two items in the below format
```
[success (boolean), message(string)]
```
If success is true that's indicate OTP has been verified so that we can proceed for generate auth token or customer object , in same way we will get message which can be shown to the user


#### Generate Auth Token
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


#### Generate Customer Object
```js
await auth.generateTokenAndCustomerDetils()
```
In return , we will receive a list of two items in the below format
```
[success (boolean), message(string), customer(Customer Object)]
```
If success is true that's indicate user has been verified through otp verification and received customer object , in same way we will get message which can be shown to the user. If success is false then the customer [3rd parameter] will be *null*

- - -

### Customer Object
The members of teh customer object
- id
- name
- phone_no
- address
- pincode
- country
- country_code
- token

#### Intialize a customer object
To initialize a customer object , the authentication token of the customer needed which have been discussed in **Authenticate User** section
```js
const customer = new client.customer("authentication token")
```

#### Fetch all details of customer from server
```js
await customer.fetchDetails()
```
In return , we will receive a list of two items in the below format
```
[success (boolean), message(string)]
```
If success is true that's indicate that customer details has been fetch successfully , in same way we will get message which can be shown to the user.

To get the customer details in JSON format,
```js
customer.toJSON()
```

#### Update Customer Details
> Note that, Mobile number of customer is not allowed. Only change of name, address, pincode is allowed

```js
// all 3 parameters are required
await customer.updateDetails("Tanmoy", "Kolkata", 700032)
```

In return , we will receive a list of two items in the below format
```
[success (boolean), message(string)]
```
If success is true that's indicating that customer details has been updated successfully , in same way we will get message which can be shown to the user.

#### Fetch All Orders
```js
await customer.fetchAllOrders()
```
In return , we will receive a list of three items in the below format
```
[success (boolean), message(string), List<Order>]
```
#### Get Particular Order By ID
Pass order id as argument

```js
await customer.getOrderById(1)
```
In return , we will receive a list of three items in the below format
```
[success (boolean), message(string), Order]
```
#### Checkout
For checkout we need to collect the checkout details
- Instance of Shop
- Products cart map [Preferred format below]

```js
// Schema
{
	"<product_id>" : quantity
}
// Example
{
    "1": 1,
    "2": 8,
    "6": 5
}
```
- Promo code
- Delivery mode [home_delivery, self_pickup, table_order, advanced_table_order]
- Payment mode [pod or online]
- Table Id [Required for tale_order / advanced_table_order]
- Table Time Slot [Required for advanced_table_order]
- Table Order Date [Required for advanced_table_order]

```js
await customer.checkout(shop, {
    "1": 1,
    "2": 8,
    "6": 5
}, "YTUI", "home_delivery", "online", "" , "", "")
```
In return , we will receive a list of three items in the below format
```
[success (boolean), message(string), data(JSON)]
```

In JSON response, `online_payment_redirection` is `true`, then redirect user to `redirection_link` for payment. If `online_payment_redirection` is `false` , then either redirect user to `redirection_link` as default order confirmation page or fetch order details by `order_id` and show custom UI



- - -


### Product [Class]
Data members
- id
- category_id
- title
- images [List of images in multiple sizes and format]
- price
- discounted_price
- dicount_percentage
- description
- in_stock
- is_pinned

- - -

### ProductCategory [Class]
Data members
- id
- picture
- title

Functions
- fetchProducts : Will fetch all the product under this category

```js
await category.fetchProducts()
```
In return we will get
```
[status(boolean), message(string), List<Product>]
```

- - -

### Order [Class]
Data members
- products [List<Product>]
- promo_code [null or Instance of PromoCode]
- latest_status [Instance of OrderStatus]
- all_statues [List<OrderStatus>]
- address [String]
- pincode [String]
- country [String]
- country_code [String]
- home_delivery_charge
- home_delivery_details [Instance of HomeDelivery]
- self_pickup_details [Instance of SelfPickup]
- table_order_details [Instance of TableOrder]
- advanced_table_order_details [Instance of AdvancedTableOrder]

- - -

### Inventory
#### Fetch All Categories
```js
await client.inventory.FetchAllCategroies()
```
In return
```
[status(boolean), message(string), List<ProductCategory>]
```

#### Get Category By ID
```js
await client.inventory.GetCategoryById("category_id")
```
In return
```
[status(boolean), message(string), ProductCategory]
```

#### Fetch All Products
```js
await client.inventory.FetchAllProducts()
```
In return
```
[status(boolean), message(string), List<ProductCategory>, List<Product>]
```

#### Get Product By Id
```js
await client.inventory.FetchAllProducts()
```
In return
```
[status(boolean), message(string), Product]
```

#### Search Products By Query
```js
await client.inventory.SearchProducts("boat headphone")
```
In return
```
[status(boolean), message(string), List<ProductCategory>, List<Product>]
```

#### Filter Products By Selected Products Ids
```js
await client.inventory.SearchProductsByIdsList([1,2,3])
```
In return
```
[status(boolean), message(string), List<ProductCategory>, List<Product>]
```

- - -

### Shop
Data Members
- profile [Instance of ShopProfile]
- contact_information [Instance of ShopContact]
- address [Instance of ShopAddress]
- account_details [Instance of ShopAccount]
- config [Instance of ShopConfig]
- promo_codes [List<ShopPromoCode>]

Functions
- `fetch_details()` : This will load all the information regarding that shop.
```js
const shop = new client.shop()
console.log(await shop.fetch_details())
```
In return
```
[status(boolean), message(string)]
```
- - -