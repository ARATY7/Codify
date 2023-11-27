export function convertDateToThePast(dateToConvert: Date) {

  const date = new Date(dateToConvert).getTime();
  const currentDate = new Date().getTime();
  const difference = currentDate - date;

  const secondsDiff = Math.floor(difference / 1000);
  const minutesDiff = Math.floor(difference / (1000 * 60));
  const hoursDiff = Math.floor(difference / (1000 * 60 * 60));
  const daysDiff = Math.floor(difference / (1000 * 60 * 60 * 24));
  const monthsDiff = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44));
  const yearsDiff = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));

  let finalDate: string;

  if ( secondsDiff < 60 ) {
    if ( secondsDiff > 1 ) {
      finalDate = secondsDiff + ' seconds ago';
    } else {
      finalDate = secondsDiff + ' second ago';
    }
  } else if ( minutesDiff < 60 ) {
    if ( minutesDiff > 1 ) {
      finalDate = minutesDiff + ' minutes ago';
    } else {
      finalDate = minutesDiff + ' minute ago';
    }
  } else if ( hoursDiff < 24 ) {
    if ( hoursDiff > 1 ) {
      finalDate = hoursDiff + ' hours ago';
    } else {
      finalDate = hoursDiff + ' hour ago';
    }
  } else if ( daysDiff < 30.44 ) {
    if ( daysDiff > 1 ) {
      finalDate = daysDiff + ' days ago';
    } else {
      finalDate = daysDiff + ' day ago';
    }
  } else if ( monthsDiff < 12 ) {
    if ( monthsDiff > 1 ) {
      finalDate = monthsDiff + ' months ago';
    } else {
      finalDate = monthsDiff + ' month ago';
    }
  } else {
    if ( yearsDiff > 1 ) {
      finalDate = yearsDiff + ' years ago';
    } else {
      finalDate = yearsDiff + ' year ago';
    }
  }

  return finalDate;
}