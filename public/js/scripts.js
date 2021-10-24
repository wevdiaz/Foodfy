const Validate = {

    apply(input, func) {
        Validate.clearErrors(input);

        let results = Validate[func](input.value);

        input.value = results.value;
       

        if (results.error) {
            Validate.displayError(input, results.error);            
        }
    },

    displayError(input, error) {
        const div = document.createElement("div");
        div.classList.add("error");
        div.innerHTML = error;
        input.parentNode.appendChild(div);

        input.focus();
    },

    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector(".error");

        if (errorDiv) {
           errorDiv.remove();
        }
    },

    isEmail(value) {
        let error = null;

        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if(!value.match(mailFormat)) {
            error = "Email Inválido";
        }

        return {
            error,
            value
        }

    },

    fieldNameChef(event) {
        const fieldName = document.querySelector("#formCreateChef input[name='name']");

        if (fieldName.value === "") {
            fieldName.classList.add("field-error");
            event.preventDefault();
        }        
    },

    allFields(event) {
        const fields = document.querySelectorAll(".item-form input, .item-form select, .ingredient input, .passoPreparo input, .item-form textarea");

        for (field of fields) {
            if(field.value === "") {
                field.classList.add("field-error");
                event.preventDefault();
            } else {
                field.classList.remove("field-error");
            }
        }
    }
}