const _config = require("./config")
const config = new _config();

const axios = require("axios").default;
const qs = require('qs');
const Order = require('./order');
const utils = require("./helper");

class Customer{
    token = "";
    id = "";
    name = "";
    phone_no = "";
    address = "";
    pincode = "";
    country = "";
    country_code = "";


    constructor(token){
        this.token = token;
        try {
            const parsed_json = utils.parse_jwt(token);
            const data = parsed_json?.details??{}
            this.importJSON(data)
            console.log("Token imported successfully !");
        } catch (error) {
            console.log(error);
            console.log("Token has assigned to Customer but data can't be decode. The token maybe corrupted or expired.")
        }
    }

    importJSON(json){
        this.id = json.id ?? "";
        this.name = json.name ?? "";
        this.phone_no = json.phoneNo ?? "";
        this.address = json?.address.address ?? "";
        this.pincode = json?.address.pincode ?? "";
        this.country = json?.address.country ?? "";
        this.country_code = json?.address.countryCode ?? "";
    }

    toJSON(){
        return {
            "name": this.name,
            "phoneNo": this.phone_no,
            "id": this.id,
            "address": {
                "address": this.address,
                "pincode": this.pincode,
                "country": this.country,
                "countryCode": this.country_code
            }
        };
    }

    async fetchDetails(){
        let response, requestSuccessful;
        try {
            response = await axios({
                method: 'post',
                url: config.get_server_endpoint() + '/api/v1/customer/details/',
                headers: { 
                    'token': this.token
                }
              })
              requestSuccessful = response.status == 200 && response?.data.success == true;
        } catch (error) {
            response = error.response;
            requestSuccessful = false;
        }

          if(requestSuccessful){
              this.importJSON(response?.data.payload.details ?? {});
          }
          const message = requestSuccessful ? response?.data.message : response?.data.error ;
          return [requestSuccessful, message??"Unexpected Error" ];
    }

    // Update customer details ! After calling , it will update the customer details also
    async updateDetails(name, address, pincode){
        let response, requestSuccessful;
        try {
            response = await axios({
                method: 'post',
                url: config.get_server_endpoint() + '/api/v1/customer/update/',
                headers: { 
                    'token': this.token
                },
                data: qs.stringify({
                    'name': name,
                    'address': address,
                    'pincode': pincode 
                  })
              })
              requestSuccessful = response.status == 200 && response?.data.success == true;
        } catch (error) {
            requestSuccessful = false;
        }

          if(requestSuccessful){
              this.name = name;
              this.address = address;
              this.pincode = pincode;
          }
          const message = requestSuccessful ? response?.data.message : response?.data.error ;
          return [requestSuccessful, message??"Unexpected Error" ];
    }

    // This will fetch all orders of the customer under the specified shop | In return , we will get [status, message, orders]
    async fetchAllOrders(){
        let response, requestSuccessful, orders = [];
        try {
            response = await axios({
                method: 'post',
                url: config.get_shop_server_endpoint() + '/api/v1/customer/orders/',
                headers: {
                    'token': this.token
                },
                data: JSON.stringify({
                    "query" : ["order_details","customer_details","address","latest_status","all_status","delivery_mode","transaction","delivery_details"]
                })
              })
              requestSuccessful = response.status == 200 && response?.data.success == true;
        } catch (error) {
            response = error.response;
            requestSuccessful = false;
        }

          if(requestSuccessful){
            //   console.log(response.data);
            const orders_map = response?.data.payload.orders ?? [];
            for(let order_json_id in orders_map){
                orders.push(new Order(orders_map[order_json_id.toString()] ?? {}))
            }
          }
          const message = requestSuccessful ? response?.data.message : response?.data.error ;
          return [requestSuccessful, message??"Unexpected Error" , orders];
    }

    // This will fetch one order by id of the customer under the specified shop | In return , we will get [status, message, order]
    async getOrderById(id){
        let response, requestSuccessful, order = null;
        try {
            response = await axios({
                method: 'post',
                url: config.get_shop_server_endpoint() + '/api/v1/customer/order/' + id.toString() + "/",
                headers: { 
                    'token': this.token
                },
                data: JSON.stringify({
                    "query" : ["order_details","customer_details","address","latest_status","all_status","delivery_mode","transaction","delivery_details"]
                })
              })
              requestSuccessful = response.status == 200 && response?.data.success == true;
        } catch (error) {
            response = error.response;
            requestSuccessful = false;
        }

          if(requestSuccessful){
              order = new Order(response?.data.payload.order ?? {});
          }
          const message = requestSuccessful ? response?.data.message : response?.data.error ;
          return [requestSuccessful, message??"Unexpected Error" , order];
    }

    // Checkout product
    async checkout(shop, products_cart_map, promo_code, delivery_mode, payment_mode, table_id , table_order_time_slot, table_order_date){
        let response, requestSuccessful;
        try {
            // Verify payload
            const verified_payload = utils.verify_checkout_payload(shop, products_cart_map, promo_code, delivery_mode, payment_mode, table_id , table_order_time_slot, table_order_date);
            if(verified_payload[0] == false){
                return [false, verified_payload[1], {}]
            }

            response = await axios({
                method: 'post',
                url: config.get_shop_server_endpoint() + '/api/v1/checkout/',
                headers: { 
                    'token': this.token
                },
                data: JSON.stringify(verified_payload[2])
              })
              requestSuccessful = response.status == 200 && response?.data.success == true;
        } catch (error) {
            response = error.response;
            requestSuccessful = false;
        }

        const message = requestSuccessful ? response?.data.message : response?.data.error ;
        return [requestSuccessful, message??"Unexpected Error" , response?.data.payload??{}];
    }
}

module.exports = Customer