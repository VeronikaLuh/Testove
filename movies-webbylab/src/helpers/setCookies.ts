export const setCookies = (
  name: string,
  value: string,
  daysToExpire: number
): void => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + daysToExpire);

  const cookieValue =
    encodeURIComponent(value) +
    "; expires=" +
    expirationDate.toUTCString() +
    "; path=/";
  document.cookie = name + "=" + cookieValue;
};
