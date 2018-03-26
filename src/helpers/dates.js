// get Date from YYYY-MM-DDTHH:mm:ss.mmmm
export const convertDateToApiDateFormat = date => date.toISOString().split('T')[0];

export default convertDateToApiDateFormat;
