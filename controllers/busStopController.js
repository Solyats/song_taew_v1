const { validationResult } = require("express-validator");
const {
  listBusstopRepository,
  getBusStopByNameRepository,
  insertBusstopRepository,
  getBusStopByIDRepository,
  deleteBusStopByIdRepository,
  editBusstopRepository,
} = require("../repositories/busStopRepository");
const { newUUID } = require("../utils/utils");
const { deleteRoadRouteBybusStopIdRepository } = require("../repositories/roadRouteRepository");

const listBussStopControler = async (req, res) => {
  try {
    const datas = await listBusstopRepository();

    return res.status(200).json({ status: 200, data: datas?.data });
  } catch (err) {
    console.log("🚀 ~ listBussStopControler ~ err:", err);
    return res.status(500).json({ status: 500, error: err });
  }
};

const createBusStopController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 400, error: errors.array() });
  }

  const data = req.body;
  try {
    const busStopName = await getBusStopByNameRepository(data?.busStop_name);

    if (busStopName.error !== null) {
      return res.status(500).json({ status: 500, error: data.error });
    }

    if (busStopName?.data.length > 0) {
      return res
        .status(400)
        .json({ status: 500, error: "busStopName_is_already_exist" });
    }

    const uuid = newUUID();

    const busStopData = {
      busStop_id: uuid,
      busStop_name: data?.busStop_name,
      busStop_latitude: data?.busStop_latitude,
      busStop_longitude: data?.busStop_longitude,
      busStop_picture: data?.busStop_picture,
    };

    const result = await insertBusstopRepository(busStopData);

    if (result.error !== null) {
      return res.status(500).json({ status: 500, error: data.error });
    }

    return res.status(200).json({ status: 200, data: null });
  } catch (err) {
    console.log("🚀 ~ createBusStopController ~ err:", err);
    return res.status(500).json({ status: 500, error: err });
  }
};

const deleteBusStopController = async (req, res) => {
  const { busStop_id } = req.body;
  try {
    if (!busStop_id) {
      return res
        .status(400)
        .json({ status: 400, error: "busStop_id_is_required" });
    }

    const getBusId = await getBusStopByIDRepository(busStop_id);

    if (getBusId.error !== null) {
      return res.status(500).json({ status: 500, error: data.error });
    }

    if (getBusId?.data.length === 0) {
      return res
        .status(400)
        .json({ status: 400, error: "busStop_id_is_not_found" });
    }

    const result = await deleteBusStopByIdRepository(busStop_id);

    if (result.error !== null) {
      return res.status(500).json({ status: 500, error: data.error });
    }

    const resp = await deleteRoadRouteBybusStopIdRepository(busStop_id);

    if (resp.error !== null) {
      return res.status(500).json({ status: 500, error: data.error });
    }

    return res.status(200).json({ status: 200, data: null });
  } catch (err) {
    console.log("🚀 ~ createBusStopController ~ err:", err);
    return res.status(500).json({ status: 500, error: err });
  }
};

const editBusStopController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 400, error: errors.array() });
  }


  const data = req.body;
  try {
    if (!data?.busStop_id) {
      return res
        .status(400)
        .json({ status: 400, error: "busStop_id_is_required" });
    }

    const getBusId = await getBusStopByIDRepository(data?.busStop_id);

    if (getBusId.error !== null) {
      return res.status(500).json({ status: 500, error: data.error });
    }

    if (getBusId?.data.length === 0) {
      return res
        .status(400)
        .json({ status: 400, error: "busStop_id_is_not_found" });
    }

      const busStopName = await getBusStopByNameRepository(data?.busStop_name);
      
       if (busStopName.error !== null) {
      return res.status(500).json({ status: 500, error: data.error });
    }

    if (getBusId.data[0]?.busStop_name !== data?.busStop_name) {
      if (busStopName?.data.length > 0) {
        return res
          .status(400)
          .json({ status: 500, error: "busStopName_is_already_exist" });
      }
    }

    const busStopData = {
      busStop_name: data?.busStop_name,
      busStop_latitude: data?.busStop_latitude,
      busStop_longitude: data?.busStop_longitude,
      busStop_picture: data?.busStop_picture,
    };

    const result = await editBusstopRepository(data?.busStop_id,busStopData);

    if (result.error !== null) {
      return res.status(500).json({ status: 500, error: data.error });
    }

    return res.status(200).json({ status: 200, data: null });
  } catch (err) {
    console.log("🚀 ~ createBusStopController ~ err:", err);
    return res.status(500).json({ status: 500, error: err });
  }
};


module.exports = {
  listBussStopControler,
  createBusStopController,
  deleteBusStopController,
  editBusStopController,
};
