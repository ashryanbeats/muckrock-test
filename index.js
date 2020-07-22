require("dotenv").config();
const axios = require("axios");
const moment = require("moment");

axios.defaults.baseURL = "https://www.muckrock.com/api_v1";
axios.defaults.headers["Content-Type"] = "application/json";

const init = async () => {
  try {
    const response = await axios.get("/foia");
    const tatData = handleData(response.data);
    const overallStats = processOverallStats(tatData);

    console.log(overallStats);
  } catch (error) {
    console.log(error);
  }
};

const handleData = (data) => {
  const { results } = data;

  const tatData = results.map((el) => {
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
