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

### Import Library

In case of NodeJS / Frontend framework , the standard ES5 & ES6 import strategy will work
```
const quikshop_client = require("quikshope_client")
```
To import directly in HTML, use the cdn link provided below
```
<script srdc="https://cdn.jsdelivr.net/gh/GiantsMeet/quikshope_client@main/dist/client.min.js"></script>
```