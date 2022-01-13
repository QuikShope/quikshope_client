const config = require("./config");

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


function verifyCheckoutPayload(payload) {
    
}

module.exports = {
    convert_images_to_preferred_dimensions : convert_images_to_preferred_dimensions
}