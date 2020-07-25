require("dotenv").config();
const axios = require("axios");
const moment = require("moment");

axios.defaults.headers["Content-Type"] = "application/json";

const init = async () => {
  try {
    const data = await getData(
      "https://www.muckrock.com/api_v1/foia/?page=1&page_size=200"
    );
    const tatData = handleData(data);
    const overallStats = processOverallStats(tatData);

    console.log(overallStats);
  } catch (error) {
    console.log(error);
  }
};

const getData = async (url, acc = []) => {
  console.log("Getting data from", url);
  const response = await axios.get(url);
  acc = acc.concat(response.data.results);

  if (!response.data.next || response.data.next.includes("page=11")) {
    return acc;
  } else {
    return getData(response.data.next, acc);
  }
};

const handleData = (data) => {
  const tatData = data.map((el) => {
    const dateSubmitted = moment(el.datetime_submitted);
    const dateDone = moment(el.datetime_done);
    const dateDiff = dateDone.diff(dateSubmitted, "days");
    const status = el.status;

    return {
      status,
      dateSubmitted,
      dateDone,
      dateDiff,
    };
  });

  return tatData;
};

const processOverallStats = (data) => {
  const requestStatusStats = data.reduce((acc, curr) => {
    if (acc[curr.status]) {
      acc[curr.status].totalCount += 1;
    } else {
      acc[curr.status] = {
        totalCount: 1,
      };
    }

    if (curr.status === "done") {
      if (acc[curr.status].totalDays) {
        acc[curr.status].totalDays += curr.dateDiff;
      } else {
        acc[curr.status].totalDays = curr.dateDiff;
      }
    }

    return acc;
  }, {});

  requestStatusStats.done.tatAvg =
    requestStatusStats.done.totalDays / requestStatusStats.done.totalCount;

  return requestStatusStats;
};

init();
