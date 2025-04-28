export const formatDateToMonthYear = (date: Date) => {
    const month = date.getMonth() + 1; // Janeiro é 0
    const year = date.getFullYear();
    return `${month.toString().padStart(2, '0')}-${year}`;
}