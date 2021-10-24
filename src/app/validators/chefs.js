const Chef = require("../models/chef");


function checkAllfields(body) {
    const keys = Object.keys(body);

    for (key of keys) {
        if (body[key] == "" && key != "removed_avatar") {
            return {
                chef: body,                
                error: "Por favor, Preencha todos os campos!"
            }
        }
    }
}


 function post(req, res, next) {
    const fillAllFields = checkAllfields(req.body);
    
    if (fillAllFields) {        
        return res.render("admin/chefs/create", fillAllFields);
    }

    if (req.files.length == 0) {
        return res.render("admin/chefs/create", {
            chef: req.body,
            error: "Por favor, envie ao menos uma imagem"
        });
    }

    next();
}

async function put(req, res, next) {
    let fillAllFields = checkAllfields(req.body);     

    if (fillAllFields) { 

        results = await Chef.getImageChef(req.body.id);
        let avatarChef = results.rows[0];
        avatarChef = `${req.protocol}://${req.headers.host}${avatarChef.image.replace("public", "")}`;
        
        fillAllFields.chef = {
            ...req.body,
            avatar: avatarChef
        }        
        
        return res.render("admin/chefs/edit", fillAllFields);
    }

    if (req.files.length == 0 && req.body.removed_avatar != ""){
        
        return res.render("admin/chefs/edit", {
            chef: req.body,
            error: "Por favor, envie pelo menos uma imagem!"
        });
    }
    
    next();
}

module.exports = {
    post,
    put
}