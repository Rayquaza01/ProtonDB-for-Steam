console.log("Game Page");

let appid;

class Steam {
    /**
     * Returns a games appid from the url
     * @param {string} url
     * @returns
     */
    static get_app_id(url) {
        var appid = url.match(/\/(app)\/([0-9]{1,7})/);

        return parseInt(appid[2], 10);
    }

    /**
     * Insert the ProtonDB rating next to the Steam Deck Verified results
     * @param {string} rating
     * @param {boolean} whitelisted
     */
    static insert_rating(rating, whitelisted = false) {
        // if (rating === "native") return;

        const cont = document.createElement("div");
        const bannerContainer = document.createElement("div");
        bannerContainer.className = "protondb_BannerContainer";
        cont.appendChild(bannerContainer);

        const bannerHeader = document.createElement("div");
        bannerHeader.className = "protondb_BannerHeader";
        bannerHeader.innerText = "Proton Compatibility"
        bannerContainer.appendChild(bannerHeader);

        const bannerContent = document.createElement("div");
        bannerContent.className = "protondb_BannerContent";
        bannerContainer.appendChild(bannerContent);

        const descCont = document.createElement("div");
        descCont.className = "protondb_DescCont";
        bannerContent.appendChild(descCont);

        let img;
        switch (rating) {
            case "native":
            case "platinum":
            case "gold":
            case "silver":
            case "bronze":
                img = injectSVG("checkmark");
                break;
            case "pending":
            case "borked":
                img = injectSVG(rating);
                break;
        }
        img.classList.add("protondb_" + rating);
        img.classList.add("protondb_rating_icon");
        descCont.appendChild(img);

        const ratingDesc = document.createElement("span");
        ratingDesc.className = "protondb_CompatibilityDetailRatingDescription";
        ratingDesc.innerText = rating.charAt(0).toUpperCase() + rating.slice(1);
        descCont.appendChild(ratingDesc);

        const linkCont = document.createElement("div");
        bannerContent.appendChild(linkCont)

        const link = document.createElement("a");
        link.className = "protondb_LearnMore Focusable";
        link.href = "https://protondb.com/app/" + appid;
        link.setAttribute("target", "_blank");
        link.innerText = "Learn More";
        linkCont.appendChild(link);

        const deck = document.querySelector("div[data-featuretarget=\"deck-verified-results\"]");
        if (deck !== null) {
            deck.insertAdjacentElement("afterend", cont)
        } else {
            const lang = document.querySelector("#LanguagesHeader");
            if (lang !== null) {
                lang.parentElement.insertAdjacentElement("afterend", cont);
            } else {
                const category = document.querySelector(".rightcol");
                category.insertBefore(cont, category.firstChild);
            }
        }
    }
}

async function main() {
    const opts = new Options(await browser.storage.sync.get());
    console.log(opts);
    if (!opts.storepage) return;

    appid = Steam.get_app_id(window.location.href);

    if (document.querySelector("span.platform_img.linux") === null) {
        const rating = await ProtonDB.request_rating(appid);
        console.log(rating);
        Steam.insert_rating(rating, whitelist.includes(appid));
    } else {
        Steam.insert_rating("native");
    }
}

// Main
main();
