const PhotosUpload = {

    input: "",

    preview: document.querySelector("#recipes-preview"),

    uploadLimit: 5,

    files: [],

    handleFileInput(event) {

        const { files: filelist } = event.target;
        PhotosUpload.input = event.target;
       
        if (PhotosUpload.hasLimit(event)) return;

        Array.from(filelist).forEach((file) => {

            PhotosUpload.files.push(file);

            const reader = new FileReader();

            reader.onload = () => {
                const image = new Image();
                image.src = String(reader.result);

                const div = PhotosUpload.getContainer(image);
                
                PhotosUpload.preview.appendChild(div);
            }

            reader.readAsDataURL(file);
        });

        PhotosUpload.input.files = PhotosUpload.getAllFiles();
      
    },

    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload;
        const { files: filelist } = input;

        if (filelist.length > uploadLimit) {
            alert(`Selecione no máximo ${uploadLimit} fotos`);
            event.preventDefault();
            return true;
        }

        const photosDiv = [];
        preview.childNodes.forEach(item => {

            if (item.classList && item.classList.value == "photos") {
                photosDiv.push(item);
            }
        });

        const totalPhotos = filelist.length + photosDiv.length;

        if (totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos");
            event.preventDefault();
            return true;
        }

        return false;
    },

    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer();

        PhotosUpload.files.forEach( file => dataTransfer.items.add(file));

        return dataTransfer.files;
    },

    getContainer(image) {
        const div= document.createElement("div");
                div.classList.add("photos")

                div.onclick = PhotosUpload.removePhoto;

                div.appendChild(image);
                div.appendChild(PhotosUpload.getRemoveButton());
                return div;
    },

    getRemoveButton() {
        const button = document.createElement("span");
        button.classList.add("material-icons");
        button.innerHTML = "close";
        return button;
    },

    removePhoto(event) {
        const photoDiv = event.target.parentNode;
        const photosArray = Array.from(PhotosUpload.preview.children);
        const index = photosArray.indexOf(photoDiv);

        PhotosUpload.files.splice(index, 1);
        PhotosUpload.input.files = PhotosUpload.getAllFiles();

        photoDiv.remove();        
    },

    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode;

        if (photoDiv.id) {
            const removedFiles = document.querySelector("input[name='removed_files']");
                if (removedFiles) {
                    removedFiles.value += `${photoDiv.id},`
                }
        }
        
        photoDiv.remove();
    }
}

const PhotosUploadChefs = {

    input: "",

    previewAvatar: document.querySelector("form #Avatar-Chef-Preview"),

    uploadLimit: 1,

    file: [],

    handleFileInput(event) {
        const { files: filelist } = event.target; 
        PhotosUploadChefs.input = event.target; 
        
        if (PhotosUploadChefs.hasLimit(event)) return;

        Array.from(filelist).forEach(file => {

            PhotosUploadChefs.file.push(file);

            const reader = new FileReader();

            reader.onload = () => {
                const image = new Image();
                image.src = String(reader.result); 
                
                const div = PhotosUploadChefs.getContainer(image);
                
                PhotosUploadChefs.previewAvatar.appendChild(div);

            }

            reader.readAsDataURL(file);
        })

        PhotosUploadChefs.input.files = PhotosUploadChefs.getAllFile();
    },

    hasLimit(event) {
        const { uploadLimit, input, previewAvatar } = PhotosUploadChefs;
        const { files: filelist } = input;

        if (filelist.length > uploadLimit) {
            alert(`Só é permitido o envio de ${uploadLimit} foto`);
            event.preventDefault();
            return true;
        }

        const photoDiv = [];
        previewAvatar.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "avatarChef") {
                photoDiv.push(item);
            }
        });

        const totalPhotoAvatar = filelist.length + photoDiv.length;

        if ( totalPhotoAvatar > uploadLimit) {            
            alert("Você já escolheu uma foto para perfil");
            event.preventDefault();
            return true;
        }



        return false;
    },

    getAllFile() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer();        

        PhotosUploadChefs.file.forEach(file => dataTransfer.items.add(file));

        return dataTransfer.files;
    },

    getContainer(image) {
        const div = document.createElement("div");
        div.classList.add("avatarChef");
        
        div.onclick = PhotosUploadChefs.removePhoto;

        div.appendChild(image);

        div.appendChild(PhotosUploadChefs.getRemoveButton());

        return div;
    },

    getRemoveButton() {
        const button = document.createElement("span");
        button.classList.add("material-icons");
        button.innerHTML = "close";
        return button;
    },

    removePhoto(event) {
        const photoDiv = event.target.parentNode;
        const photosArray = Array.from(PhotosUploadChefs.previewAvatar.children);
        const index = photosArray.indexOf(photoDiv);
        
        PhotosUploadChefs.file.splice(index, 1);
        PhotosUploadChefs.input.files = PhotosUploadChefs.getAllFile();
        
        photoDiv.remove();
    },
    
    removeOldPhoto(event) {
        const inputAvatar = event.target.parentNode;

        if (inputAvatar.id) {
            let removedFile = document.querySelector("input[name='removed_avatar']");
            if (removedFile) {
                removedFile.value = inputAvatar.id;
                
            }
        }

        inputAvatar.remove();                     
    }
}

