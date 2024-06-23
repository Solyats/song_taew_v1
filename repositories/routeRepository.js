const db = require("../db/db");

const GetRouteRepository = async () => {
  try {
    const busStops = await db.select("*").from("busstop");

    return { data: busStops, error: null };
  } catch (err) {
    console.log("🚀 ~ GetRouteRepository ~ error:", err);
    return { data: null, error: err };
  }
};

const fetchDataRoadRepository = async (shuttleBus_id) => {
  try {
    const query = db
      .select(
        "tb1.shuttleBus_id",
        "tb1.Road_number",
        "tb1.busStop_id",
        "busstop.busStop_name",
        "busstop.busStop_latitude",
        "busstop.busStop_longitude",
        "busstop.busStop_picture",
        "shuttlebus.shuttleBus_name",
        "shuttlebus.shuttleBus_color",
        "shuttlebus.shuttleBus_time",
        "shuttlebus.shuttleBus_price",
        "shuttlebus.shuttleBus_picture"
      )
      .from("road_route as tb1")
      .innerJoin("busstop", "tb1.busStop_id", "busstop.busStop_id")
      .innerJoin("shuttlebus", "tb1.shuttleBus_id", "shuttlebus.shuttleBus_id");

    if (shuttleBus_id) {
      query.where("tb1.shuttleBus_id", shuttleBus_id);
    }

    const result = await query;

    return { data: result, error: null };
  } catch (err) {
    console.log("🚀 ~ fetchDataRoadRepository ~ err:", err);
    return { data: null, error: err };
  }
};

const listDataRepository = async (shuttleBus_id) => {
  try {
    const query = db
      .select(
        "tb1.shuttleBus_id",
        "tb1.shuttleBus_name",
        "tb1.shuttleBus_color",
        "tb1.shuttleBus_time",
        "tb1.shuttleBus_price",
        "tb1.shuttleBus_picture",
        "tb1.polylineColor",
        "tb1.symbolColor",
        "tb1.icon_shuttle_bus"
      )
      .from("shuttlebus as tb1");

    if (shuttleBus_id) {
      query.where("tb1.shuttleBus_id", shuttleBus_id);
    }

    const result = await query;

    return { data: result, error: null };
  } catch (err) {
    console.log("🚀 ~ listDataDetailRepository ~ err:", err);
    return { data: null, error: err };
  }
};

const listDataDetailRepository = async (shuttleBus_id) => {
  try {
    const query = db
      .select(
        "tb1.shuttlebus",
        "tb2.busStop_name",
        "tb2.busStop_latitude",
        "tb2.busStop_longitude"
      )
      .from("road_route as tb1")
      .leftJoin("busstop as tb2", "tb1.busStop_id", "tb2.busStop_id");

    if (shuttleBus_id) {
      query.where("tb1.shuttlebus", shuttleBus_id);
    }

    const result = await query;

    return { data: result, error: null };
  } catch (err) {
    console.log("🚀 ~ listDataDetailRepository ~ err:", err);
    return { data: null, error: err };
  }
};

module.exports = {
  GetRouteRepository,
  fetchDataRoadRepository,
  listDataRepository,
  listDataDetailRepository,
};
