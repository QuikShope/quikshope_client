const Product = require("./inventory").Product;

class OrderStatus{
    constructor(code, datetime){
        this.code = code;
        this.datetime = datetime;
    }
}

class Transaction{
    constructor(json){
        this.id = json.id ?? "";
        // Amount
        this.amount = parseInt((json.amount ?? 0)/100);
        // Mode
        this.mode = json.mode ?? "";
        this.mode_code = json.mode_code ?? "";
        // Status
        this.status = json.status ?? "";
        this.status_code = json.status_code ?? "";
        // Payment Details
        this.payment_id = json.payment_id ??"";
        // Timestamps
        this.initiated_on = json.initiated_on ?? "";
        this.last_updated_on = json.last_updated_on ?? "";
    }
}

class PromoCode{
    constructor(json){
        this.applied = json?.applied ?? "";
        this.discount = json?.discount ?? 0;
        this.code = json?.code ?? "";
    }
}

class HomeDelivery{
    constructor(json){
        this.estimated_delivery_on = json?.estimated_delivery_on ?? "-1";
        this.tracking_no = json?.tracking_no ?? "";
    }
}

class SelfPickup{
    constructor(json){
        this.estimated_delivery_on = json?.estimated_delivery_on ?? "-1";
    }
}

class TableOrder{
    constructor(json){
        this.table_id = json?.table_id ?? "";
    }
}

class AdvancedTableOrder{
    constructor(json){
        this.table_id = json?.table_id ?? "";
        this.time_slot = json?.time_slot ?? "";
        this.date = json?.date ?? "";
    }
}

class Order{
    // 
    // Products
    products = [];
    // Promo Code
    promo_code = null;
    // Status
    lastest_status = null;
    all_statuses = [];
    // Address
    address = "";
    pincode = "";
    country = "";
    country_code = "";
    // Delivery mode
    delivery_mode = "";
    delivery_mode_code = "";
    // Delivery details
    home_delivery_charge = 0;
    home_delivery_details = null;
    self_pickup_details = null;
    table_order_details = null;
    advanced_table_order_details = null;
    // Transaction
    transaction = null;

    constructor(json){
        // Interate though product map and add products
        const products_map = json?.order_details.products ?? [];
        for(var product_json_id in products_map){
            this.products.push(new Product(products_map[product_json_id]));
        }
        // Promo Code
        this.promo_code = new PromoCode( json?.order_details.promo_code ?? {});
        // Latest Status
        this.lastest_status = new OrderStatus(json?.latest_status.status_code ?? "ERR", json?.latest_status.initiated_on ?? "ERR")
        // All Statuses
        const all_statuses = json?.all_status??[];
        for(var status_json_id in all_statuses){
            this.all_statuses.push(new OrderStatus(status_json_id ,all_statuses[status_json_id]))
        }
        // Address
        this.address = json?.address.address ?? "";
        this.pincode = json?.address.pincode ?? "";
        this.country = json?.address.country ?? "";
        this.country_code = json?.address.countryCode ?? "";
        // Delivery mode
        this.delivery_mode = json?.delivery_mode.delivery_mode ?? "";
        this.delivery_mode_code = json?.delivery_mode.delivery_mode_code ?? "";
        // Transaction
        this.transaction = new Transaction(json?.transaction ?? {})
        // Home Delivery
        this.home_delivery_charge = json?.order_details.home_delivery_charge ?? 0;
        this.home_delivery_details = new HomeDelivery(json?.delivery_details.home_delivery ?? {});
        // Self pickup
        this.self_pickup_details = new SelfPickup(json?.delivery_details.self_pickup ?? {});
        // Table Order Details
        this.table_order_details = new TableOrder(json?.delivery_details.table_order ?? {});
        // Advanced Table Order Details
        this.advanced_table_order_details = new AdvancedTableOrder(json?.delivery_details.advanced_table_order ?? {});
    }


}


module.exports = Order
