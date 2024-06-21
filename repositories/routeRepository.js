const db = require('../db/db');

const GetRouteRepository = async () => {
    try {
        const busStops = await db.select('*').from('busstop');
    
        return { data: busStops, error: null };
    } catch (err) {
        console.log("🚀 ~ GetRouteRepository ~ error:", err)
        return { data: null, error: err };
    }
}


const fetchDataRoadRepository = async (shuttleBus_id) => {
  try {
    const query = db.select(
      'tb1.shuttleBus_id',
      'tb1.Road_number',
      'tb1.busStop_id',
      'busstop.busStop_name',
      'busstop.busStop_latitude',
      'busstop.busStop_longitude',
      'busstop.busStop_picture',
      'shuttlebus.shuttleBus_name',
      'shuttlebus.shuttleBus_color',
      'shuttlebus.shuttleBus_time',
      'shuttlebus.shuttleBus_price',
      'shuttlebus.shuttleBus_picture'
    )
    .from('road_route as tb1')
    .innerJoin('busstop', 'tb1.busStop_id', 'busstop.busStop_id')
    .innerJoin('shuttlebus', 'tb1.shuttleBus_id', 'shuttlebus.shuttleBus_id');

    if (shuttleBus_id) {
      query.where('tb1.shuttleBus_id', shuttleBus_id);
    }

    const result = await query;
    
    return { data: result, error: null };
  } catch (err) {
    console.log("🚀 ~ fetchDataRoadRepository ~ err:", err)
    return { data: null, error: err };
  }
}

 
   

  module.exports = {
    GetRouteRepository,
    fetchDataRoadRepository,
 
  };