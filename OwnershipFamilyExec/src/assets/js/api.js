'use strict';
//获取本地域名
const domain = window.location.host;
const protocol = document.location.protocol;
//获取当前域名
const API = {
    'url': protocol + "//" + domain + "/familyTree",
    "url_pro": "https://appdata-intra.c.citic/familyTree",
    "url_test": "http://10.76.3.74:8081/familyTree"
}
export default API;