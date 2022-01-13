const QuikShope = require("../lib/index");
const shop = new QuikShope.shop();
const customer = new QuikShope.customer("eyJ0eXAiOiJqd3QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI0ODQ2ZTllMi1hZmVkLTQ4Y2ItYmFhNS02ODgzY2I3YzEwMzkiLCJkZXRhaWxzIjp7Im5hbWUiOiJUYW5tb3kgU2Fya2FyIiwicGhvbmVObyI6Ijk2NDE4MzE3MDYiLCJpZCI6IjQ4NDZlOWUyLWFmZWQtNDhjYi1iYWE1LTY4ODNjYjdjMTAzOSIsImFkZHJlc3MiOnsiYWRkcmVzcyI6IlBhbGl0cGFyYSwgV2VzdCBCZW5nYWwiLCJwaW5jb2RlIjoiNzQxMTI3IiwiY291bnRyeSI6IkluZGlhIiwiY291bnRyeUNvZGUiOiJJTiJ9fSwiZXhwIjoxNjczNDM5NDU1fQ.etsWFB4C-NzhplYWKLWntyiohcDC2_Bk4pFMXD8AB8w");
QuikShope.init("shop1");

async function test() {
    await shop.fetch_details();
    // console.log(shop);
    console.log(await customer.checkout(shop, {
        "1": 1,
        "21": 8,
        "6": 5
    }, "YTU", "table_order" ,"online","1","10:00-10:30","2002-07-15"))
}

test()