/* --- Menu Active --- */
const currentPageFoodfy = window.location.pathname;

const menuLinks = document.querySelectorAll("#header-adm nav.links_adm a");
const linksVisitors = document.querySelectorAll(".topo-principal nav ul li a");

for (link of menuLinks) {
    if(currentPageFoodfy.includes(link.getAttribute("href"))) {
        link.classList.add("active");        
    }
}

for (link of linksVisitors) {
    if(currentPageFoodfy.includes(link.getAttribute("href"))) {
        link.classList.add("active");        
    }
}
