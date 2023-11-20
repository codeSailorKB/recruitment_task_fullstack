export const formatDateObjToString = date => {
    return date ? date.toISOString().slice(0, 10) : '';
}