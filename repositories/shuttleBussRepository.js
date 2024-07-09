const db = require("../db/db");

const getShuttleBussDetailRepository = async (shuttleBus_id) => {
  try {
    const query = db
      .select(
        "tb1.Road_id",
        "tb1.shuttleBus_id",
        "tb1.busStop_id",
        "tb2.busStop_name",
        "tb2.busStop_latitude",
        "tb2.busStop_longitude",
        "tb2.busStop_picture"
      )
      .from("road_route as tb1")
      .leftJoin("busstop as tb2", "tb1.busStop_id", "tb2.busStop_id")
      .orderBy("tb1.road_id_increment", "asc"); 

    if (shuttleBus_id) {
      query.where("tb1.shuttleBus_id", shuttleBus_id);
    }

    const result = await query;

    return { data: result, error: null };
  } catch (err) {
    console.log("🚀 ~ getShuttleBussDetailRepository ~ err:", err);
    return { data: null, error: err };
  }
};

const getShuttleBusByIdRepository = async (shuttleBus_id) => {
  try {
    const query = db
      .select(
        "tb1.shuttleBus_id",
        "tb1.shuttleTHname",
        "tb1.shuttleBus_name",
        "tb1.shuttleBus_color",
        "tb1.shuttleBus_time",
        "tb1.shuttleBus_subname",
        "tb1.shuttleBus_price",
        "tb1.shuttleBus_picture",
        "tb1.polylineColor",
        "tb1.symbolColor",
        "tb1.icon_shuttle_bus",
        "tb1.seq"
      )
      .from("shuttlebus as tb1").orderBy("seq", "asc")

    if (shuttleBus_id) {
      query.where("tb1.shuttleBus_id", shuttleBus_id);
    }

    const result = await query;

    return { data: result, error: null };
  } catch (err) {
    console.log("🚀 ~ getShuttleBusByIdRepository ~ err:", err);
    return { data: null, error: err };
  }
};

const insertShuttleBusRepository = async (data) => {
  try {
    const query = db.insert(data).from("shuttlebus");

    await query;

    return { data: null, error: null };
  } catch (err) {
    console.log("🚀 ~ insertShuttleBusRepository ~ err:", err);
    return { data: null, error: err };
  }
};

const getLatestShuttleBusSeqRepository = async () => {
  try {
    const result = await db
      .select("seq")
      .from("shuttlebus")
      .orderBy("seq", "desc")
      .limit(1);

    return { data: result[0], error: null };
  } catch (error) {
    console.log("🚀 ~ getLatestShuttleBusSeqRepository ~ err:", err);
    return { data: null, error: err };
  }
};

const deleteShuttleBusRepository = async (shuttleBus_id) => {
  try {
    const query = db("shuttlebus").where("shuttleBus_id", shuttleBus_id).del();

    await query;

    return { data: null, error: null };
  } catch (err) {
    console.log("🚀 ~ deleteShuttleBusRepository ~ err:", err);
    return { data: null, error: err.message };
  }
};

const editShuttleBusRepository = async (shuttleBus_id, data) => {
  try {
    const query = db("shuttlebus")
      .where("shuttleBus_id", shuttleBus_id)
      .update(data);

    await query;

    return { data: null, error: null };
  } catch (err) {
    console.log("🚀 ~ editShuttleBusRepository ~ err:", err);
    return { data: null, error: err.message };
  }
};

module.exports = {
  getShuttleBussDetailRepository,
  getShuttleBusByIdRepository,
  insertShuttleBusRepository,
  getLatestShuttleBusSeqRepository,
  deleteShuttleBusRepository,
  editShuttleBusRepository,
};
