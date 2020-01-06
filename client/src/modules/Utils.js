class Utils {

  static sortByMonth(data) {
    let monthNames = {
      "January": 1,
      "February": 2,
      "March": 3,
      "April": 4,
      "May": 5,
      "June": 6,
      "July": 7,
      "August": 8,
      "September": 9,
      "October": 10,
      "November": 11,
      "December": 12
    };

    data.sort(function(a, b) {
      // sort based on the value in the monthNames object
      return monthNames[a.stats[0].month] - monthNames[b.stats[0].month];
    });

    return data;
  }

}

export default Utils;
