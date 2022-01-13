const _config = require("./config")
const config = new _config();

const axios = require("axios").default;
const convert_images_to_preferred_dimensions = require("./helper").convert_images_to_preferred_dimensions;

class Product{
    constructor(json){
        this.id = json["id"];
        this.category_id = json["category_id"];
        this.title = json["title"];
        this.images = convert_images_to_preferred_dimensions(json["images"]??[], _config.product_images_converted_dimensions, json["is_images_converted"]??false, false);
        this.price = parseInt(json["price"]??0)/100;
        this.discounted_price = parseInt(json["discounted_price"]??0)/100;
        this.discount_percentage = parseFloat((this.price - this.discounted_price)/this.price).toFixed(1)
        this.description = json["description"];
        this.in_stock = json["in_stock"]??false;
        this.is_pinned = json["is_pinned"]??false;
    }
}

class ProductCategory{
    constructor(json){
        this.id = json["id"] ?? "";
        this.picture =  convert_images_to_preferred_dimensions(json["picture"] ?? "https://us.123rf.com/450wm/blankstock/blankstock1901/blankstock190101912/125986048-corrupted-document-icon-bad-file-sign-paper-page-concept-symbol-quality-design-element-classic-style.jpg?ver=6", _config.product_images_converted_dimensions, json["is_images_converted"]??false, true);
        this.title = json["title"] ?? "";
        this.is_images_converted = json["is_images_converted"] ?? false;
    }

    async fetchProducts(){
        const parsed_content = await fetchProductsByCategoryId(this.id);
        if(parsed_content[0] == true){
            this.id = parsed_content[2].id;
            this.picture = parsed_content[2].picture;
            this.title = parsed_content[2].title;
        }
        return [parsed_content[0], parsed_content[1], parsed_content[3]];
    }
}


// Helper functions
function _productCategoryParserFromResponse(response_api){
    let products = []; 
    let categories = [];
    if(response_api[0] == true){
        const products_map = response_api[2]?.products_map;
        const categories_map = response_api[2]?.categories_map;
        // Iterate through categoires map and add products
        for(var category_id in categories_map){
            categories.push(new ProductCategory(categories_map[category_id]));
        }

        // Interate though product map and add products
        for(var category_id in products_map){
            const products_in_category = products_map[category_id];
            for(var serial in products_in_category){
                products.push(new Product(products_in_category[serial]));
            }
        }
    }

    return [response_api[0], response_api[1], categories, products];
}


// Api handlers for PRODUCTS
// This is the base function to fetch products information
async function fetchProductsBase(fetch_all=true ,is_list_by_category_id=false, category_id=0 , is_search=false, search_query="", filter_product_by_ids=false, product_id_list=[]) {
    if(config.get_username().trim().length == 0){
        throw new Error("Set shop username first before request");
    }
    let response, requestSuccessful;
    try {
        if(fetch_all){
            response = await axios({
                method: 'post',
                url: config.get_shop_server_endpoint() + '/api/v1/shop/products/'
            })
        }else if(is_list_by_category_id){
            response = await axios({
                method: 'post',
                url: config.get_shop_server_endpoint() + '/api/v1/shop/products/'+category_id.toString()+"/"
            })
        }else if(is_search){
            response = await axios({
                method: 'post',
                url: config.get_shop_server_endpoint() + '/api/v1/shop/products/search/?q='+search_query.toString()
            })
        }else if(filter_product_by_ids){
            response = await axios({
                method: 'post',
                url: config.get_shop_server_endpoint() + '/api/v1/shop/products/filter/',
                data: JSON.stringify({
                    "ids" : product_id_list
                })
            })
        }

        requestSuccessful = response.status == 200 && response?.data.success == true;
    } catch (error) {
        response = error.response;
        requestSuccessful = false;
    }

    const message = requestSuccessful ? response?.data.message : response?.data.error ;
    return [requestSuccessful, message??"Unexpected Error", requestSuccessful ? response?.data.payload : {} ];
}

// Fetch all products -- In return we will get [status, message, categories, products]
async function fetchAllProducts() {
    const response_api = await fetchProductsBase(fetch_all=true);
    return _productCategoryParserFromResponse(response_api);
}

// Fetch products by category id -- In return we will get [status, message, category, products]
async function fetchProductsByCategoryId(query_category_id) {
    const response_api = await fetchProductsBase(fetch_all=false,is_list_by_category_id=true, category_id=query_category_id);
    const parsed_content =  _productCategoryParserFromResponse(response_api);
    return [parsed_content[0], parsed_content[1], parsed_content[2]?.[0], parsed_content[3]];
}

// Search product by query -- In return we will get [status, message, categories, products]
async function searchProducts(query) {
    const response_api = await fetchProductsBase(fetch_all=false, is_list_by_category_id=false, null, is_search=true, search_query=query);
    return _productCategoryParserFromResponse(response_api);
}

// Search product details by list of product ids -- In return we will get [status, message, categories, products]
async function searchProductsByIdsList(ids_list) {
    const response_api = await fetchProductsBase(fetch_all=false, is_list_by_category_id=false, null, is_search=false, null, filter_product_by_ids=true, product_id_list=ids_list);
    return _productCategoryParserFromResponse(response_api);
}

// Fetch Single Product -- In return we will get [status, message, product] | If no product found , product will be null
async function getProductById(id){

    let response, requestSuccessful, product = null;

    try {
        response = await axios({
            method: 'post',
            url: config.get_shop_server_endpoint() + '/api/v1/shop/product/'+id.toString()+"/"
            })
            requestSuccessful = response.status == 200 && response?.data.success == true;
    } catch (error) {
        response = error.response;
        requestSuccessful = false;
    }

        if(requestSuccessful){
            product = new Product(response?.data.payload.product);
        }
        const message = requestSuccessful ? response?.data.message : response?.data.error ;
        return [requestSuccessful, message??"Unexpected Error", product ];
}

// Api Handler for CATEGORY
// Fetch All Categories -- In return we will get [status, message, categories]
async function fetchAllCategroies(){
    let response, requestSuccessful, categories = [];

    try {
        response = await axios({
                method: 'post',
                url: config.get_shop_server_endpoint() + '/api/v1/shop/categories/'
            })
            requestSuccessful = response.status == 200 && response?.data.success == true;
    } catch (error) {
        response = error.response;
        requestSuccessful = false;
    }

        if(requestSuccessful){
            (response?.data.payload.categories.data??[]).forEach(category_json =>{
                categories.push(new ProductCategory(category_json))
            })
        }
        const message = requestSuccessful ? response?.data.message : response?.data.error ;
        return [requestSuccessful, message??"Unexpected Error", categories ];
}

// Fetch single category
async function getCategoryById(id) {
    let response, requestSuccessful, category = null;

    try {
        response = await axios({
            method: 'post',
            url: config.get_shop_server_endpoint() + '/api/v1/shop/category/'+id.toString()+"/"
            })
            requestSuccessful = response.status == 200 && response?.data.success == true;
    } catch (error) {
        response = error.response;
        requestSuccessful = false;
    }

        if(requestSuccessful){
            category = new ProductCategory(response?.data.payload.category);
        }
        const message = requestSuccessful ? response?.data.message : response?.data.error ;
        return [requestSuccessful, message??"Unexpected Error", category ];
}

module.exports = {
    Product : Product,
    ProductCategory : ProductCategory,
    
    FetchAllCategroies : fetchAllCategroies,
    GetCategoryById : getCategoryById,

    FetchAllProducts : fetchAllProducts,
    FetchProductsByCategoryId : fetchProductsByCategoryId,
    GetProductById : getProductById,
    SearchProducts : searchProducts,
    SearchProductsByIdsList : searchProductsByIdsList
}