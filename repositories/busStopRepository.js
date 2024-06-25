
const db = require("../db/db");

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

const insertBusstopRepository = async (busStopData) => {
  try {
    const query = db.insert(busStopData).from('busstop')

    await query;

    return { data: null, error: null };
  } catch (err) {
    console.log("🚀 ~ insertBusstopRepository ~ err:", err);
    return { data: null, error: err };
  }
}

const getBusStopByNameRepository = async (name) => { 
try {
      const query = db
  .select(
    'tb1.busStop_id',
    'tb1.busStop_name',
    'tb1.busStop_latitude',
    'tb1.busStop_longitude',
    'tb1.busStop_picture'
    ).from('busstop as tb1').where("tb1.busStop_name", name);

    const result = await query;
    
     return { data: result, error: null };
  } catch (err) {
     console.log("🚀 ~ getBusStopByNameRepository ~ err:", err);
    return { data: null, error: err };
  }
}

module.exports = {
  listBusstopRepository,
  insertBusstopRepository,
  getBusStopByNameRepository
};