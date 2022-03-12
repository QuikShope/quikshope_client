class Config{
    server_endpoint = "https://quikshope.com";
    server_base_url = "quikshope.com";
    static shop_username = "";
    static product_images_converted_dimensions = [[32,32], [128,128], [256,256], [448,448]];
    static product_category_images_converted_dimensions = [[32,32], [128,128], [256,256], [448,448]];
    static media_server_endpoint = "files.quikshope.com"; 
    static delivery_modes = ["home_delivery", "self_pickup", "table_order", "advanced_table_order"]
    static transaction_modes = ["pod", "online"]


    update_username(username){
        Config.shop_username = username.toString();
    }

    get_username(){
        return Config.shop_username;
    }

    get_server_endpoint(){
        return this.server_endpoint;
    }

    get_shop_server_endpoint(){
        if(Config.shop_username.trim().length == 0){
            console.log("Please set the username of shop before performing any action .. To learn more go to this link : <LINK>");
        }
        return "https://" + Config.shop_username + "." + this.server_base_url;
    }

}

module.exports = Config