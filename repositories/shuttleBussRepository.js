const db = require("../db/db");

const listMainShuttleBussDataRepository = async (shuttleBus_id) => {
  try {
    const query = db
      .select(
        "tb1.shuttleBus_id",
        "tb2.busStop_name",
        "tb2.busStop_latitude",
        "tb2.busStop_longitude"
      )
      .from("road_route as tb1")
      .leftJoin("busstop as tb2", "tb1.busStop_id", "tb2.busStop_id");

    if (shuttleBus_id) {
      query.where("tb1.shuttleBus_id", shuttleBus_id);
    }

    const result = await query;

    return { data: result, error: null };
  } catch (err) {
    console.log("🚀 ~ listMainShuttleBussDataRepository ~ err:", err);
    return { data: null, error: err };
  }
};

const listShuttleBusDataDetailRepository = async (shuttleBus_id) => {
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
    console.log("🚀 ~ listShuttleBusDataDetailRepository ~ err:", err);
    return { data: null, error: err };
  }
};

const insertShuttleBusRepository = async (data) => {
  try {
    const query = db.insert(data).from('shuttlebus')

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
      .select('seq').from('shuttlebus')
      .orderBy('seq', 'desc')
      .limit(1);

    return { data: result[0], error: null };
  } catch (error) {
    console.log("🚀 ~ getLatestShuttleBusSeqRepository ~ err:", err);
    return { data: null, error: err };
  }
}

const listBusstopRepository = async () => {
  try {
      const query = db
  .select(
    'tb1.busStop_id',
    'tb1.busStop_name',
    'tb1.busStop_latitude',
    'tb1.busStop_longitude',
    'tb1.busStop_picture'
    ).from('busstop as tb1')

    const result = await query;
    
     return { data: result, error: null };
  } catch (err) {
     console.log("🚀 ~ listBusstopRepository ~ err:", err);
    return { data: null, error: err };
  }
}

module.exports = {
  listMainShuttleBussDataRepository,
  listShuttleBusDataDetailRepository,
  insertShuttleBusRepository,
  getLatestShuttleBusSeqRepository,
  listBusstopRepository
};
