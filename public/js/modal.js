const receitas = document.querySelectorAll(".receita");
const modal = document.querySelector(".modalOverlay");
const closeModal = document.querySelector(".close-modal");

// === Modal  ====

for (let receita of receitas) {    
    
    receita.addEventListener("click", function(){         
        
        modal.classList.add("active");
        
        const image = receita.querySelector(".img-prato img").src;
        const titleRecipe = receita.querySelector(".info-prato h3").textContent;
        const chefRecipe = receita.querySelector(".info-prato span").textContent;
        const recipeId = receita.querySelector(".info-prato span").getAttribute("data-id");

        modal.querySelector(".modal-img-recipe img").src = image;
        modal.querySelector(".modal .modal-information div h3").innerHTML = titleRecipe;
        modal.querySelector(".modal .modal-information div p").innerHTML = chefRecipe;
        modal.querySelector(".modal-information .btn-modal a").href = `/detalhe/${recipeId}`;        
                
    });
}

closeModal.addEventListener("click", function() {
    modal.classList.remove("active");
});