const QuikShope = require("../lib/index");
const shop = new QuikShope.shop();
const customer = new QuikShope.customer("AUTH TOKEN");
const inventory = require("../lib/inventory");

console.log(customer);

QuikShope.init("shop1");

async function test() {
    // await shop.fetch_details();
    // console.log(shop);
    // console.log(await customer.checkout(shop, {
    //     "1": 1,
    //     "21": 8,
    //     "6": 5
    // }, "YTU", "table_order" ,"online","1","10:00-10:30","2002-07-15"))
    // console.log(await inventory.SearchProductsByIdsList([1,2,3]));
}

// test()