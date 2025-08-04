export const getDataFromServer = async (url) => {
    try { 
        const result = await fetch(url);
        return result;
    } catch (e) {
        console.log(e);
    }
}