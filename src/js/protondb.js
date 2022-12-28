"use strict";

class ProtonDB {
    static get HOMEPAGE() {return "https://www.protondb.com/";}
    static get API_SUMMARY() {return "api/v1/reports/summaries/";}

    static request_rating(appid) {
        return browser.runtime.sendMessage({contentScriptQuery: "queryRating", appid: appid});
    }
}
