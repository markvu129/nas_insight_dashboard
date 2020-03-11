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

  static subtractCertainDay(dateString, counter) {
    let date = new Date(dateString);
    date = date.setDate(date.getDate() - counter);
    return new Date(date).toISOString().slice(0, 10);
  };


  static combineDemographicPeriodData(values) {
    const country_values = {};
    for (const value of values) {
      for (const country of Object.keys(value.value)) {
              if (country in country_values) {
                country_values[country] = country_values[country] + value.value[country]
              }
              else {
                country_values[country] = value.value[country]
              }
      }
    }
    return this.sortKeys(country_values);
  }

  static sortKeys(obj_1) {
    let key = Object.keys(obj_1)
        .sort(function(a,b){return obj_1[b]-obj_1[a]});

    // Taking the object in 'temp' object
    // and deleting the original object.
    let temp = {};

    for (var i = 0; i < key.length; i++) {
      temp[key[i]] = obj_1[key[i]];
      delete obj_1[key[i]];
    }

    // Copying the object from 'temp' to
    // 'original object'.
    for (let i = 0; i < key.length; i++) {
      obj_1[key[i]] = temp[key[i]];
    }
    return obj_1;
  }

  static combineYouTubeData(values) {
    let ytData = {
      'views': 0,
      'subscribersGained': 0,
      'subscribersLost': 0,
      'likes': 0,
      'shares': 0,
      'dislikes': 0,
      'averageViewDuration': 0,
      'start': '',
      'false': ''
    };
    for(let i=0; i<values.length; i++) {
      ytData['views'] = ytData['views'] + values[i][1];
      ytData['likes'] = ytData['likes'] + values[i][2];
      ytData['dislikes'] = ytData['dislikes'] + values[i][3];
      ytData['shares'] = ytData['shares'] + values[i][4];
      ytData['averageViewDuration']= ytData['averageViewDuration'] + values[i][5];
      ytData['subscribersGained'] = ytData['subscribersGained'] + values[i][7];
      ytData['subscribersLost'] = ytData['subscribersLost'] + values[i][8]

      if(i === values.length - 1) {
        ytData['end'] = values[i][0]
      }
      if(i === 0) {
        ytData['start'] = values[i][0]
      }
    }
    return ytData
  }
}

export default Utils;
