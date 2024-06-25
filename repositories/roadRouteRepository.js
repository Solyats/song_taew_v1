const db = require("../db/db");

const deleteRoadRouteByShuttleBusIdRepository = async (shuttleBus_id) => {
  try {
    const query = db('road_route')
      .where('shuttleBus_id', shuttleBus_id)
      .del()

    await query;

    return { data: null, error: null };
  } catch (err) {
    console.log("🚀 ~ deleteRoadRouteByShuttleBusIdRepository ~ err:", err);
    return { data: null, error: err.message };
  }
};

const deleteRoadRouteBybusStopIdRepository = async (busStop_id) => {
  try {
    const query = db('road_route')
      .where('busStop_id', busStop_id)
      .del()

    await query;

    return { data: null, error: null };
  } catch (err) {
    console.log("🚀 ~ deleteRoadRouteBybusStopIdRepository ~ err:", err);
    return { data: null, error: err.message };
  }
};

const insertRoadRouteRepository = async (data) => {
  try {
    const query = db.insert(data).from("road_route");

    await query;

    return { data: null, error: null };
  } catch (err) {
    console.log("🚀 ~ insertRoadRouteRepository ~ err:", err);
    return { data: null, error: err };
  }
};

const deleteRoadRouteNotInForShuttleBusRepository = async (shuttleBus_id, Road_ids) => {
  try {
    if (!Array.isArray(Road_ids) || Road_ids.length === 0) {
      return { data: null, error: "Road_ids must be a non-empty array" };
    }

    const query = db('road_route')
      .whereNotIn('Road_id', Road_ids)
      .where("shuttleBus_id", shuttleBus_id)
      .del()

    await query;

    return { data: null, error: null };
  } catch (err) {
    console.log("🚀 ~ insertRoadRouteRepository ~ err:", err);
    return { data: null, error: err };
  }
};


const getRoadRouteByshuttleBusIdAndbusStopIdRepository = async (shuttleBus_id, busStop_id) => {
  try {
    const query = db.select(
        'tb1.busStop_id',
        'tb1.Road_number',
        'tb1.shuttleBus_id',
        'tb1.busStop_id'
      )
      .where('tb1.shuttleBus_id', shuttleBus_id)
      .andWhere('tb1.busStop_id', busStop_id).from('road_route as tb1')

     const result = await query;

    return { data: result, error: null };
  } catch (err) {
    console.log("🚀 ~ getRoadRouteByshuttleBusIdAndbusStopIdRepository ~ err:", err);
    return { data: null, error: err };
  }
}

module.exports = {
  deleteRoadRouteByShuttleBusIdRepository,
  deleteRoadRouteBybusStopIdRepository,
  insertRoadRouteRepository,
  deleteRoadRouteNotInForShuttleBusRepository,
  getRoadRouteByshuttleBusIdAndbusStopIdRepository,
};