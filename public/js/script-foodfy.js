const receitas = document.querySelectorAll(".receita");

const modalOverlay = document.querySelector(".modal-overlay");
const closeModal = document.querySelector(".close-modal");

for (let receita of receitas) {    
    
    receita.addEventListener("click", function(){ 

        const recipeID = receita.querySelector("input[name='id']").value;        
            
        window.location.href = `/detalhe/${recipeID}`;                      
                
    });
}

function ocultarIngredientes() {
   
   const list = document.querySelector(".lista-ingredientes")
            .classList
            .toggle("ocultar");

           
            document.querySelector(".btn-ingredientes").innerHTML = "mostrar".toUpperCase();          
    
    if(list == false){      
        document.querySelector(".btn-ingredientes").innerHTML = "esconder".toUpperCase();
    }
}


 /* --- Nova função mostrar/esconder  --- */

 function hiddenModePreparation(button) {
     const recipePreparation = document.querySelector(".detalheReceita .passosPreparo");

     if (recipePreparation.classList.contains("ocultar")) {

         recipePreparation.classList.remove("ocultar");
         button.innerHTML = "esconder";
     }
     else {
         recipePreparation.classList.add("ocultar");
         button.innerHTML = "mostrar";
     }
 }

 function hiddenRecipeInformation(button) {     
    
    const recipeInformation = document.querySelector(".detalheReceita .add-recipe");

    if (recipeInformation.classList.contains("ocultar")) {
        
        recipeInformation.classList.remove("ocultar");
        button.innerHTML = "esconder";
    }
    else {
        recipeInformation.classList.add("ocultar");
        button.innerHTML = "mostrar";
    }

     console.log(recipeInformation);
 }


/* === Create New Recipe === */

// function addIngredient() {
//     const ingredients = document.querySelector("#ingredients");
//     const fieldContainer = document.querySelectorAll(".ingredient");

//     const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

//     if (newField.children[0].value == "") return false;

//     newField.children[0].value = "";
//     ingredients.appendChild(newField);
// }

// document.querySelector(".add-ingredient").addEventListener("click", addIngredient);

// function addPassosPreparo() {
// const modoPreparo = document.querySelector("#modoPreparo");
// const fieldContainerPreparo = document.querySelectorAll(".passoPreparo");

// const newPasso = fieldContainerPreparo[fieldContainerPreparo.length - 1].cloneNode(true);

// if (newPasso.children[0].value == "") return false;

// newPasso.children[0].value = "";
// modoPreparo.appendChild(newPasso);
// }

// document.querySelector(".add-passo").addEventListener("click", addPassosPreparo);


/* === Delete Recipe === */

// const formDelete = document.querySelector("#form-delete");

//         formDelete.addEventListener("submit", function(event){
//             const confirmation = confirm("Deseja deletar o cadastro?");

//             if(!confirmation) {
//                 event.preventDefault();
//             }
            
//         });
