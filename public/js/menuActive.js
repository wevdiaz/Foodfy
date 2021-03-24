/* --- Menu Active --- */
const currentPageFoodfy = window.location.pathname;

const menuLinks = document.querySelectorAll("#header-adm nav.links_adm a");

for (link of menuLinks) {
    if(currentPageFoodfy.includes(link.getAttribute("href"))) {
        link.classList.add("active");        
    }
}