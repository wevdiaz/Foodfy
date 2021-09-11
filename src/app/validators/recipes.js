const Recipe = require("../models/recipe");

function checkAllFields(body) {
    const keys = Object.keys(body);

    for (key of keys) {
        if (body[key] == "" && key != "removed_files") {
            return {
                recipe: body,
                error: "Por favor, Preencha todos os campos!"
            }
        }
    }
}

async function post(req, res, next) {
    let fillAllFields = checkAllFields(req.body);

    const options = await Recipe.chefsSelectOptions();      

    if (fillAllFields) {

        fillAllFields = {
            ...fillAllFields,
            chefOptions: options
        }
        
        return res.render("admin/recipes/create", fillAllFields);
    }

    if (req.files.length == 0) {        
        return res.render("admin/recipes/create", {
            recipe: req.body,
            chefOptions: options,
            error: "Por favor, coloque ao menos uma foto!"
        });
    }

    next();
}

async function show(req, res, next) {
    const recipe = await Recipe.findRecipe(req.params.id);
    
    if (!recipe) {
        return res.render("admin/recipes/index", {
            error: "Receita não encontrada"
        });
    }

    req.recipe = recipe;
   
    next();
}

async function edit(req, res, next) {
    const recipe= await Recipe.find(req.params.id);
    // const results = await Recipe.find(req.params.id);
    // const recipe = results.rows[0];

    if (!recipe) {
        return res.render("admin/recipes/index", {
            error: "Receita não encontrada!"
        });
    }

    req.recipe = recipe;

    next();
}

async function put(req, res, next) {
    let totalFilesSeleted = "";
    let fillAllFields = checkAllFields(req.body);

    const options = await Recipe.chefsSelectOptions();
    // const results = await Recipe.chefsSelectOptions();
    // const options = results.rows;

    let files = await Recipe.allFiles(req.body.id);
    // const result = await Recipe.files(req.body.id);
    // let files = result.rows;
    files = files.map( file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    })); 
    
    if (fillAllFields) {               

        fillAllFields = {
            ...fillAllFields,
            chefOptions: options,
            files
        }
        
        return res.render("admin/recipes/edit", fillAllFields);
    }  
    

    if (req.body.removed_files != "") {
        let removedFiles = req.body.removed_files.split(",");        
        const lastIndex = removedFiles.length - 1;
        removedFiles.splice(lastIndex, 1);        

        totalFilesSeleted = files.length - removedFiles.length;
    }    
    
    if (totalFilesSeleted < 1 && req.body.removed_files != "" && req.files.length == 0 ) {  
              
        return res.render("admin/recipes/edit", {
            recipe: req.body,
            chefOptions: options,
            files,
            error: "Por favor, coloque ao menos uma foto!"
        });
    }      

    next();
}


module.exports = {
    post,
    show,
    edit,
    put    
}