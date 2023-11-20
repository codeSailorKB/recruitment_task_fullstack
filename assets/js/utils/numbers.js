export const roundNumber = (number, decimals) => {
    return !isNaN(number) ? number.toFixed(decimals) : number;
}