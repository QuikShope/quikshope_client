const _config = require("./config")
const config = new _config();
const axios = require("axios").default;
const qs = require('qs');


//  Shop Details
class ShopProfile{
    constructor(json){
        this.owner_first_name = json?.first_name ?? "";
        this.owner_last_name = json?.last_name ?? "";        
        this.shop_name = json?.shop_name ?? "";
        this.logo = json?.logo ?? "https://pmscacademy.com/img/old_logo.png";
    }
}

class ShopContact{
    constructor(json){
        this.email_id = json?.email_id ?? "";
        this.email_id_verified = json?.email_id_verified ?? false;
        this.phone_no = json?.phone_no ?? "";
        this.phone_no_verified = json?.phone_no_verified ?? false;
    }
}

class ShopAddress{
    constructor(json){
        this.address = json?.address ?? "";
        this.district = json?.district ?? "";
        this.state = json?.state ?? "";
        this.country_code = json?.country_code ?? "";
        this.country = json?.country ?? "";
        this.gps = json?.gps ?? {
            "longitude": 0,
            "latitude": 0
        }
    }
}

class ShopAccount{
    constructor(json){
        this.account_disabled = json?.status ?? "";
        this.deactivation_cause = json?.deactivation_cause ?? "";
        this.deactivation_cause_code = json?.deactivation_cause_code ?? "";
        this.is_free_plan = json?.is_free_plan ?? true;
        this.template_details = json?.template ?? {},
        this.template_config = json?.template_config ?? {}
    }

}

class PaymentMode{
    constructor(json){
        this.pod = json?.pod ?? false;
        this.online = json?.online ?? false;
    }
}

class HomeDeliveryConfig{
    constructor(json){
        this.enabled = json?.enabled ?? false;
        this.payment_mode = new PaymentMode(json?.paymentMode ?? {});
        this.flat_delivery_charge = json?.flatDeliveryCharge ?? 0;
    }
}

class SelfPicupConfig{
    constructor(json){
        this.enabled = json?.enabled ?? false;
        this.payment_mode = new PaymentMode(json?.paymentMode ?? {});
    }
}

class TableOrderConfig{
    constructor(json){
        this.enabled = json?.enabled ?? false;
        this.payment_mode = new PaymentMode(json?.paymentMode ?? {});
        this.table_id_list = json?.tableIdList ?? [];
    }
}

class AdvancedTableOrderConfig{
    constructor(json){
        this.enabled = json?.advancedTableOrderEnabled ?? false;
        this.payment_mode = new PaymentMode(json?.advancedTableOrderPaymentMode ?? {});
        this.table_id_list = json?.tableIdList ?? [];
        this.available_time_slots = json?.tableOrderTimeSlots ?? [];
    }
}

class ShopDays{
    constructor(json){
        this.sunday = json?.sunday ?? false;
        this.monday = json?.monday ?? false;
        this.tuesday = json?.tuesday ?? false;
        this.wednesday = json?.wednesday ?? false;
        this.thursday = json?.thursday ?? false;
        this.friday = json?.friday ?? false;
        this.saturday = json?.saturday ?? false;        
    }
}

class ShopConfig{
    constructor(json){
        this.closed = json?.shop_closed ?? false;
        this.opening_time = json?.shop_opening_time ?? "00:00 AM";
        this.closing_time = json?.shop_closing_time ?? "00:00 AM";
        this.days = new ShopDays(json?.shop_days ?? {});
        this.home_delivery_config = new HomeDeliveryConfig(json?.homeDelivery ?? {});
        this.self_pickup_config = new SelfPicupConfig(json?.selfPickup ?? {});
        this.table_order_config = new TableOrderConfig(json?.tableOrder ?? {});
        this.advanced_table_order_config = new AdvancedTableOrderConfig(json?.tableOrder ?? {});
    }
}

class ShopPromoCode{
    constructor(json){
        this.code = json?.code ?? "";
        this.is_flat_discount = json?.isFlatDiscount ?? false;
        this.flat_discount = json?.flatDiscount ?? 0;
        this.percentage_discount = json?.percentageDiscount ?? 0;
    }
}

class Shop{
    loaded = false
    profile = null
    contact_information = null
    address = null
    account_details = null
    config = null
    promo_codes = []

    importJSON(json){
        this.profile = new ShopProfile(json?.profile ?? {});
        this.contact_information = new ShopContact(json?.contact ?? {});
        this.address = new ShopAddress(json?.address ?? {});
        this.account_details = new ShopAccount(json?.customer_side_account ?? {});
        this.config = new ShopConfig(json?.config ?? {});
        const promo_codes_json = json?.promo_codes ?? [];
        for(var promo_code_id in promo_codes_json){
            this.promo_codes.push(new ShopPromoCode(promo_codes_json[promo_code_id] ?? {}))
        }
    }

    async fetch_details(){
        let response, requestSuccessful;    
        try {
            response = await axios({
                method: 'post',
                url: config.get_shop_server_endpoint() + '/api/v1/shop/details/',
                data: JSON.stringify({
                    "query" :  ["profile", "contact", "address", "customer_side_account",  "config"]
                })
            })
            requestSuccessful = response.status == 200 && response?.data.success == true;
        } catch (error) {
            console.log(error)
            response = error.response;
            requestSuccessful = false;
        }
    
            if(requestSuccessful){
                this.importJSON(response?.data.payload ?? {})
                this.loaded = true
            }
            const message = requestSuccessful ? response?.data.message : response?.data.error ;
            return [requestSuccessful, message??"Unexpected Error"];
    }

}


module.exports = Shop