const _config = require("./config")
const config = new _config();
const axios = require("axios").default;
const qs = require('qs');
const Customer = require("./customer");


class AuthenticateUser{
    mobile_number = "";
    otp_id = "";
    otp_token = "";

    constructor(mobile_number){
        this.mobile_number = mobile_number;
    };

    async sendOtp(){
        let response, requestSuccessful;
        try {
            response = await axios({
                method: 'post',
                url: config.get_server_endpoint() + '/api/v1/otp/send/',
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : qs.stringify({
                    'phone_no': this.mobile_number 
                  })
              })
              requestSuccessful = response.status == 200 && response?.data.success == true;
        } catch (error) {
            response = error.response;
            requestSuccessful = false;
        }

          if(requestSuccessful){
              this.otp_id = response?.data.payload.id;
          }
          const message = requestSuccessful ? response?.data.message : response?.data.error ;
          return [requestSuccessful, message??"Unexpected Error" ];
    }

    async resendOtp(){
        let response, requestSuccessful;
        try {
            response = await axios({
                method: 'post',
                url: config.get_server_endpoint() + '/api/v1/otp/resend/',
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : qs.stringify({
                    'id': this.otp_id 
                  })
              })
            requestSuccessful = response.status == 200 && response?.data.success == true;
        } catch (error) {
            response = error.response;
            requestSuccessful = false;
        }

        const message = requestSuccessful ? response?.data.message : response?.data.error ;
        return [requestSuccessful, message??"Unexpected Error" ];
    }

    async verifyOtp(otp){
        let response, requestSuccessful;
        try {
            response = await axios({
                method: 'post',
                url: config.get_server_endpoint() + '/api/v1/otp/verify/',
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : qs.stringify({
                    'id': this.otp_id,
                    'otp': otp
                  })
              })
            requestSuccessful = response.status == 200 && response?.data.success == true;
        } catch (error) {
            response = error.response;
            requestSuccessful = false;
        }

          if(requestSuccessful){
              this.otp_token = response?.data.payload.token;
          }

          const message = requestSuccessful ? response?.data.message : response?.data.error ;
          return [requestSuccessful, message??"Unexpected Error" ];
    }

    async generateToken(){
        let response, requestSuccessful;
        try {
            response = await axios({
                method: 'post',
                url: config.get_server_endpoint() + '/api/v1/customer/auth/?get_details=0',
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : qs.stringify({
                    'otp_id': this.otp_id,
                    'otp_token': this.otp_token
                  })
              })
            requestSuccessful = response.status == 200 && response?.data.success == true;
        } catch (error) {
            response = error.response;
            requestSuccessful = false;
        }

          if(requestSuccessful){
              this.token = response?.data.payload.token;
          }

          const message = requestSuccessful ? response?.data.message : response?.data.error ;
          return [requestSuccessful, message??"Unexpected Error" , this.token??""];
    }

    async generateTokenAndCustomerDetils(){
        let response, requestSuccessful, customer;
        try {
            response = await axios({
                method: 'post',
                url: config.get_server_endpoint() + '/api/v1/customer/auth/?get_details=1',
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : qs.stringify({
                    'otp_id': this.otp_id,
                    'otp_token': this.otp_token
                  })
              })
            requestSuccessful = response.status == 200 && response?.data.success == true;
        } catch (error) {
            response = error.response;
            requestSuccessful = false;
        }

          if(requestSuccessful){
              this.token = response?.data.payload.token;
              this.customer = new Customer(this.token);
              customer.importJSON(response?.data.payload.details ?? {});
          }

          const message = requestSuccessful ? response?.data.message : response?.data.error ;
          return [requestSuccessful, message??"Unexpected Error" , this.customer];
    }

}

module.exports = AuthenticateUser