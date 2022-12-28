console.log("search.js");

class Search {
    /**
     * Creates the icon to add to the wishlist
     * @param {string} rating
     * @param {string} app_id
     * @param {boolean} isWhitelisted
     * @returns
     */
    static create_rating(rating, app_id, isWhitelisted) {
        const link = document.createElement("a");
        link.href = "https://protondb.com/app/" + app_id;
        link.title = rating.charAt(0).toUpperCase() + rating.slice(1);
        if (isWhitelisted) {
            link.title = link.title + " (Whitelisted by Valve)";
        }
        link.setAttribute("target", "_blank");

        let img;
        console.log("preimg")
        if (rating === "pending") {
            img = injectSVG("pending");
            img.classList.add("protondb_search");
        } else {
            img = injectSVG("wine");
            img.classList.add("protondb_" + rating);
        }
        console.log(img);
        img.classList.add("protondb_icon");
        link.appendChild(img);

        return link;
    }

    static load_ratings() {
        const rows = document.getElementById("search_resultsRows");
        for (const row of rows.getElementsByClassName("search_result_row")) {
            const app_id = row.dataset.dsAppid;
            const icon_container = row.querySelector(".search_name > div");

            // If a protondb rating has already been loaded, skip to the next wishlist item.
            if (icon_container.querySelector(".protondb_icon") || row.querySelector(".platform_img.linux") !== null) {
                continue;
            }

            ProtonDB.request_rating(app_id, rating => {
                console.log("Processing rating for " + app_id + " (" + rating + ")");
                const isWhitelisted = whitelist.includes(app_id);

                const rating_container = Search.create_rating(rating, app_id, isWhitelisted);

                icon_container.appendChild(rating_container);
            });
        }

        setTimeout(Search.load_ratings, 1000);
    }
}


if (document.readyState === "complete") {
    Search.load_ratings();
} else {
    document.addEventListener("readystatechange", _ => {
        if (document.readyState === "complete") {
            Search.load_ratings();
        }
    });
}
