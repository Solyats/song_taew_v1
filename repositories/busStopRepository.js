
const db = require("../db/db");

const listBusstopRepository = async () => {
  try {
      const query = db
  .select(
    'tb1.busStop_id',
    'tb1.busStop_name',
    'tb1.busStop_subname',
    'tb1.busStop_status',
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



const getBusstopRepository = async (busStop_id) => {
  try {
      const query = db
  .select(
    'tb1.busStop_id',
    'tb1.busStop_name',
    'tb1.busStop_subname',
    'tb1.busStop_status',
    'tb1.busStop_latitude',
    'tb1.busStop_longitude',
    'tb1.busStop_picture'
    ).from('busstop as tb1')
    .where("tb1.busStop_id", busStop_id)

    const result = await query;
    
     return { data: result[0], error: null };
  } catch (err) {
     console.log("🚀 ~ getBusstopRepository ~ err:", err);
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
    'tb1.busStop_latitude'
    ,
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

const deleteBusStopByIdRepository = async (id) => {
  try {
    const query = db('busstop')
      .where('busStop_id', id)
      .del();

    await query;

    return { data: null, error: null };
  } catch (err) {
    console.error("🚀 ~ deleteBusStopByIdRepository ~ err:", err);
    return { data: null, error: err };
  }
};

const getBusStopByIDRepository = async (ID) => { 
try {
      const query = db
  .select(
    'tb1.busStop_id',
    'tb1.busStop_name',
    'tb1.busStop_subname',
    'tb1.busStop_status',
    'tb1.busStop_latitude',
    'tb1.busStop_longitude',
    'tb1.busStop_picture'
    ).from('busstop as tb1').where("tb1.busStop_id", ID);

    const result = await query;
    
     return { data: result, error: null };
  } catch (err) {
     console.log("🚀 ~ getBusStopByIDRepository ~ err:", err);
    return { data: null, error: err };
  }
}

const editBusstopRepository = async (busStop_id, busStopData) => {
  try {

    const query = db('busstop')
      .where('busStop_id', busStop_id)
      .update(busStopData);

    await query;

    return { data: null, error: null };
  } catch (err) {
    console.error("🚀 ~ editBusstopRepository ~ err:", err);
    return { data: null, error: err };
  }
};

module.exports = {
  listBusstopRepository,
  insertBusstopRepository,
  getBusStopByNameRepository,
  deleteBusStopByIdRepository,
  getBusStopByIDRepository,
  editBusstopRepository,
  getBusstopRepository
};