const STOREPAGE_OPTION = document.querySelector("#storepage");
const WISHLIST_OPTION = document.querySelector("#wishlist");
const SEARCH_OPTION = document.querySelector("#search");

async function loadOptions() {
    const res = new Options(await browser.storage.sync.get());
    STOREPAGE_OPTION.checked = res.storepage;
    WISHLIST_OPTION.checked = res.wishlist;
    SEARCH_OPTION.checked = res.search;
}

function updateOptions(e) {
    const storageObject = {};
    storageObject[e.target.id] = e.target.checked;
    browser.storage.sync.set(storageObject)
}

document.querySelector("form").addEventListener("input", updateOptions);
document.addEventListener("DOMContentLoaded", loadOptions);
