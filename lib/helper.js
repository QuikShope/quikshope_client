const config = require("./config");

let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
const isDate = (date) => {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

function image_link_generator(imageUrl, dimesions, is_images_converted) {
    const imgName = imageUrl.split("/").slice(-1)[0];
    let data = {}
    data[`original`] = imageUrl
    for(var dimesion_index in dimesions){
        data[`${dimesions[dimesion_index][0].toString()}X${dimesions[dimesion_index][1].toString()}`] = is_images_converted ? `https://${config.media_server_endpoint}/${dimesions[dimesion_index][0].toString()}/${dimesions[dimesion_index][1].toString()}/${imgName}` : imageUrl
    }
    return data;
}

function convert_images_to_preferred_dimensions(url, dimesions, is_images_converted, is_single_image=false) {
    if(is_single_image){
        return image_link_generator(url, dimesions, is_images_converted)
    }else{
        let data = []
        for(img_id in url){
            data.push(image_link_generator(url[img_id], dimesions, is_images_converted));
        }
        return data;
    }
}

/*
@products_cart_map => {
                        "1": 1,
                        "2": 8,
                        "6": 5
                      }

Checkout valid payload 
{
    "cart": {
        "products": {
            "1": 1,
            "2": 8,
            "6": 5
        }
    },
    "promoCode": "YURTEW",
    "deliveryMode": "home_delivery",
    "paymentMode": "online",
    "tableID": "",
    "tableOrderTimeSlot": "",
    "tableOrderDate":"2021-12-10"
}
*/
function verify_checkout_payload(shop, products_cart_map, promo_code, delivery_mode, payment_mode, table_id , table_order_time_slot, table_order_date) {
    let data = {}

    // Verify shop is loaded or not
    if((shop?.loaded ?? false) == false){
        return [false, "Shop need to be initiated and all details need to be loaded before proceed to ckeckout", {}]
    }

    // Verify products_map json
    if(Object.keys(products_cart_map).length == 0){
        return [false, "Products list can't be empty", {}]
    }else{
        data["cart"] = {
            "products" : products_cart_map
        }
    }

    // Verify promo code
    if((promo_code??"").trim().length != 0 && (shop.promo_codes??[]).filter((pr_c)=>(promo_code == pr_c?.code)).length == 0){
        return [false, "Promo code is invalid", {}]
    }else{
        data["promoCode"] = (promo_code??"").trim()
    }

    // Verify delivery mode
    if(config.delivery_modes.includes(delivery_mode) == false){
        return [false, "Invalid delivery mode ! Available modes ~ " + config.delivery_modes.toString(), {}]
    }
    else{
        if(delivery_mode == 'home_delivery' && (shop?.config.home_delivery_config.enabled == false)){
            return [false, "Home delivery not available", {}]
        }else if(delivery_mode == 'self_pickup' && (shop?.config.self_pickup_config.enabled == false)){
            return [false, "Self pickup not available", {}]
        }else if(delivery_mode == 'table_order' && (shop?.config.table_order_config.enabled == false)){
            return [false, "Table order not available", {}]
        }else if(delivery_mode == 'advanced_table_order' && (shop?.config.advanced_table_order_config.enabled == false)){
            return [false, "Advanced table order not available", {}]
        }

        data["deliveryMode"] = delivery_mode
    }

    

    // Verify payment mode
    if(config.transaction_modes.includes(payment_mode) == false){
        return [false, "Invalid transaction mode ! Available modes ~ " + config.transaction_modes.toString(), {}]
    }else{
        if (payment_mode == 'online') {
            if(shop?.config.home_delivery_config.payment_mode.online == false ){
                return [false, "Online payment in home delivery not available", {}]
            }else if(shop?.config.self_pickup_config.payment_mode.online == false ){
                return [false, "Online payment in self-pickup not available", {}]
            }else if(shop?.config.table_order_config.payment_mode.online == false ){
                return [false, "Online payment in table order not available", {}]
            }else if(shop?.config.advanced_table_order_config.payment_mode.online == false ){
                return [false, "Online payment in advanced table order not available", {}]
            }
        }else if(payment_mode == 'pod'){
            if(shop?.config.home_delivery_config.payment_mode.pod == false ){
                return [false, "Pay on delivery [POD] in home delivery not available", {}]
            }else if(shop?.config.self_pickup_config.payment_mode.pod == false ){
                return [false, "Pay on delivery [POD] in self-pickup not available", {}]
            }else if(shop?.config.table_order_config.payment_mode.pod == false ){
                return [false, "Pay on delivery [POD] in table order not available", {}]
            }else if(shop?.config.advanced_table_order_config.payment_mode.pod == false ){
                return [false, "Pay on delivery [POD] in advanced table order not available", {}]
            }
        }
        data["paymentMode"] = payment_mode;
    }
    
    // Table ID
    if( (delivery_mode == 'advanced_table_order' || delivery_mode == 'table_order') && ((table_id??"").trim().length == 0)){
        return [false, "Table id can't be empty", {}]
    }else{
        data["tableID"] = table_id??"";
    }

    // Table Time Slot
    if( (delivery_mode == 'advanced_table_order') && ((table_order_time_slot??"").trim().length == 0)){
        return [false, "Table order time slot can't be empty", {}]
    }

    data["tableOrderTimeSlot"] = table_order_time_slot??"";

    // Table Order Date
    if(delivery_mode == 'advanced_table_order'){
        if(((table_order_date??"").trim().length == 0)){
            return [false, "Table order date can't be empty", {}]
        }else if(isDate(table_order_date) == false){
            return [false, "Table order date wrongly formatted",{}]
        }else{
            var order_date = new Date(table_order_date);
            var today_date = new Date();
            if(order_date.getDate() >= today_date.getDate() && order_date.getMonth() >= today_date.getMonth() && order_date.getFullYear() >= today_date.getFullYear()){
                return [false, "Table order scheduled date can't be lesser than today's date", {}]
            }
        }
    }

    data["tableOrderDate"] = table_order_date??"";
    
    return [true, "Checkout payload verified !", data]
}


module.exports = {
    convert_images_to_preferred_dimensions : convert_images_to_preferred_dimensions,
    verify_checkout_payload : verify_checkout_payload
}