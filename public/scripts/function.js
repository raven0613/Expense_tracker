  function getFormattedDate (date) {
    const dateItem = date? new Date(date) : new Date();
    let dd = dateItem.getDate();
    let mm = dateItem.getMonth() + 1;
    let yyyy = dateItem.getFullYear();
    if (dd < 10) { dd = `0${dd}` }
    if (mm < 10) { mm = `0${mm}` }
    return `${yyyy}-${mm}-${dd}`;
  }

  module.exports = getFormattedDate;