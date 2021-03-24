const ImageGallery = {

    imageFeatured: document.querySelector(".img-recipe img"),
    previews: document.querySelectorAll(".gallery-preview .images-gallery"),
    
    setImage(event) {       
        
        const selectedImage = event.target.parentNode;

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'));
        selectedImage.classList.add("active");

        ImageGallery.imageFeatured.src = selectedImage.children[0].currentSrc;
        
    }
}