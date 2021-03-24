module.exports = {

    checkItemAdd(itens) {
        // check field in white

        let itemChecked = [];
    
        for (item of itens) {
    
            if(item != "") {
                itemChecked.push(item);
            }
        }
    
        return itemChecked;
    },

    foundDate(timestamp) {
        const date = new Date(timestamp);

        const day = `0${date.getUTCDate()}`.slice(-2);
        const month = `0${date.getUTCMonth() + 1}`.slice(-2);
        const year = date.getUTCFullYear();

        return {
            day,
            month,
            year,
            iso:`${year}/${month}/${day}`,
            format: `${day}/${month}/${year}`
        }
    }
}