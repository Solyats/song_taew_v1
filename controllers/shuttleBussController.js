const { validationResult } = require("express-validator");
const {
  getShuttleBussDetailRepository,
  getShuttleBusByIdRepository,
  insertShuttleBusRepository,
  getLatestShuttleBusSeqRepository,
  deleteShuttleBusRepository,
  editShuttleBusRepository,
} = require("../repositories/shuttleBussRepository");
const {
  deleteRoadRouteByShuttleBusIdRepository,
  deleteRoadRouteNotInForShuttleBusRepository,
  insertRoadRouteRepository,
  getRoadRouteByshuttleBusIdAndbusStopIdRepository,
  editRoadRouteSeqRepository,
  getRoadRouteByIdRepository,
} = require("../repositories/roadRouteRepository");
const { newUUID } = require("../utils/utils");
const {
  getBusStopByIDRepository,
} = require("../repositories/busStopRepository");

const fetchDataShuttleBussController = async (req, res) => {
  const { route_id } = req.body;
  try {
    const listData = await getShuttleBusByIdRepository(route_id);

    if (listData.error !== null) {
      return res.status(500).json({ status: 500, error: listDataDetail.error });
    }

    const listDataDetail = await getShuttleBussDetailRepository(route_id);

    if (listDataDetail.error !== null) {
      return res.status(500).json({ status: 500, error: listDataDetail.error });
    }

    const detailDataMap = listDataDetail?.data.reduce((acc, detail) => {
      const {
        Road_id,
        shuttleBus_id,
        busStop_subname,
        busStop_id,
        busStop_name,
        busStop_latitude,
        busStop_longitude,
        busStop_picture,
        road_id_increment,
      } = detail;
      if (!acc[shuttleBus_id]) {
        acc[shuttleBus_id] = [];
      }
      acc[shuttleBus_id].push({
        Road_id,
        shuttleBus_id,
        busStop_subname,
        busStop_id,
        busStop_name,
        busStop_latitude,
        busStop_longitude,
        busStop_picture,
        road_id_increment,
      });
      return acc;
    }, {});

    const updatedListData = listData?.data.map((bus) => {
      const { shuttleBus_id } = bus;
      return {
        ...bus,
        detailData: detailDataMap[shuttleBus_id] || [],
      };
    });

    return res.status(200).json({ status: 200, data: updatedListData });
  } catch (err) {
    console.log("🚀 ~ GetRouteController ~ err:", err);
    return res.status(500).json({ status: 500, error: err });
  }
};

const createShuttleBussController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 400, error: errors.array() });
  }

  const data = req.body;
  try {
    const latestSeq = await getLatestShuttleBusSeqRepository();

    const seqBody = latestSeq?.data?.seq + 1;

    const uuid = newUUID();

    let bodyJson = {
      shuttleBus_id: uuid,
      shuttleBus_name: data?.shuttleBus_name || "",
      shuttleBus_subname: data?.shuttleBus_subname || "",
      shuttleTHname: data?.shuttleTHname || "",
      shuttleBus_color: data?.shuttleBus_color || "",
      shuttleBus_time: data?.shuttleBus_time || "",
      shuttleBus_price: data?.shuttleBus_price || 0,
      shuttleBus_picture: data?.shuttleBus_picture || "",
      polylineColor: data?.polylineColor || null,
      symbolColor: data?.symbolColor || null,
      icon_shuttle_bus: data?.icon_shuttle_bus || null,
      seq: seqBody || 0,
    };

    const createShuttleBuss = await insertShuttleBusRepository(bodyJson);

    if (createShuttleBuss.error !== null) {
      return res.status(500).json({ status: 500, error: data.error });
    }

    return res.status(200).json({ status: 200, data: null });
  } catch (err) {
    console.log("🚀 ~ createShuttleBussController ~ err:", err);
    return res.status(500).json({ status: 500, error: err });
  }
};

const deleteShuttleBusController = async (req, res) => {
  const { shuttleBus_id } = req.body;
  try {
    if (!shuttleBus_id) {
      return res
        .status(400)
        .json({ status: 400, error: "shuttleBus_id_is_required" });
    }

    const getBusId = await getShuttleBusByIdRepository(shuttleBus_id);

    if (getBusId.error !== null) {
      return res.status(500).json({ status: 500, error: data.error });
    }

    if (getBusId?.data.length === 0) {
      return res
        .status(400)
        .json({ status: 400, error: "shuttleBus_id_is_not_found" });
    }

    const result = await deleteShuttleBusRepository(shuttleBus_id);

    if (result.error !== null) {
      return res.status(500).json({ status: 500, error: data.error });
    }

    const resp = await deleteRoadRouteByShuttleBusIdRepository(shuttleBus_id);

    if (resp.error !== null) {
      return res.status(500).json({ status: 500, error: data.error });
    }

    return res.status(200).json({ status: 200, data: null });
  } catch (err) {
    console.log("🚀 ~ deleteShuttleBusController ~ err:", err);
    return res.status(500).json({ status: 500, error: err });
  }
};

const editShuttleBussController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 400, error: errors.array() });
  }

  const data = req.body;
  try {
    if (!data?.shuttleBus_id) {
      return res
        .status(400)
        .json({ status: 400, error: "shuttleBus_id_is_required" });
    }

    const shuttleBus = await getShuttleBusByIdRepository(data?.shuttleBus_id);

    if (shuttleBus?.error !== null) {
      return res.status(500).json({ status: 500, error: data.error });
    }

    if (shuttleBus?.data.length === 0) {
      return res
        .status(400)
        .json({ status: 500, error: "shuttleBus_id_not_found" });
    }

    let RoadIds = [];
    if (data?.detailData.length > 0) {
      RoadIds = data?.detailData.map((item) => item.Road_id);

      const respDeleteNotInBus =
        await deleteRoadRouteNotInForShuttleBusRepository(
          data?.shuttleBus_id,
          RoadIds
        );

      if (respDeleteNotInBus?.error !== null) {
        return res.status(500).json({ status: 500, error: data.error });
      }

      data?.detailData.forEach(async (item) => {
        if (!item.Road_id && item.busStop_id) {
          const getBusId = await getBusStopByIDRepository(item?.busStop_id);

          if (getBusId.error !== null) {
            return res.status(500).json({ status: 500, error: data.error });
          }

          if (getBusId?.data.length > 0) {
            const checkIsExist =
              await getRoadRouteByshuttleBusIdAndbusStopIdRepository(
                data?.shuttleBus_id,
                item.busStop_id
              );

            if (checkIsExist.error !== null) {
              return res.status(500).json({ status: 500, error: data.error });
            }

            if (checkIsExist.data.length === 0) {
              const roadUUID = newUUID();

              const dataInsertDetail = {
                Road_id: roadUUID,
                Road_number: roadUUID,
                shuttleBus_id: data?.shuttleBus_id,
                busStop_id: item?.busStop_id,
              };

              const resultRoadRoute = await insertRoadRouteRepository(
                dataInsertDetail
              );

              if (resultRoadRoute.error !== null) {
                return res.status(500).json({ status: 500, error: data.error });
              }
            }
          }
        }
      });
    } else {
      const respDelete = await deleteRoadRouteByShuttleBusIdRepository(
        data?.shuttleBus_id
      );

      if (respDelete.error !== null) {
        return res.status(500).json({ status: 500, error: data.error });
      }
    }

    let bodyJson = {
      shuttleBus_name: data?.shuttleBus_name || "",
      shuttleTHname: data?.shuttleTHname || "",
      shuttleBus_color: data?.shuttleBus_color || "",
      shuttleBus_time: data?.shuttleBus_time || "",
      shuttleBus_subname: data?.shuttleBus_subname || "",
      shuttleBus_price: data?.shuttleBus_price || 0,
      shuttleBus_picture: data?.shuttleBus_picture || "",
      polylineColor: data?.polylineColor || null,
      symbolColor: data?.symbolColor || null,
      icon_shuttle_bus: data?.icon_shuttle_bus || null,
    };

    const updateShuttleBus = await editShuttleBusRepository(
      data?.shuttleBus_id,
      bodyJson
    );

    if (updateShuttleBus.error !== null) {
      return res.status(500).json({ status: 500, error: data.error });
    }

    return res.status(200).json({ status: 200, data: null });
  } catch (err) {
    console.log("🚀 ~ editShuttleBussController ~ err:", err);
    return res.status(500).json({ status: 500, error: err });
  }
};

const editSeqShuttleBusController = async (req, res) => {
  const { data } = req.body;
  try {
    if (!data) {
      return res.status(400).json({ status: 400, error: "data_is_required" });
    }

    if (!Array.isArray(data) || data.length === 0) {
      return res
        .status(400)
        .json({ status: 400, error: "data must be a non-empty array" });
    }

    data.forEach(async (item) => {
      if (!item?.shuttleBus_id) {
        return res
          .status(400)
          .json({ status: 400, error: "shuttleBus_id_is_required" });
      }

      if (!item?.seq || item?.seq === 0) {
        return res.status(400).json({ status: 400, error: "seq_is_required" });
      }

      const getBusId = await getShuttleBusByIdRepository(item?.shuttleBus_id);

      if (getBusId.error !== null) {
        return res.status(500).json({ status: 500, error: data.error });
      }

      if (getBusId?.data.length === 0) {
        return res
          .status(400)
          .json({ status: 400, error: "shuttleBus_id_is_not_found" });
      }

      const dataUpdateSeq = {
        seq: item?.seq,
      }

      const editSeq = await editShuttleBusRepository(
        item?.shuttleBus_id,
       dataUpdateSeq
      );

      if (editSeq.error !== null) {
        return res.status(500).json({ status: 500, error: data.error });
      }
    });

    return res.status(200).json({ status: 200, data: null });
  } catch (err) {
    console.log("🚀 ~ editSeqShuttleBusController ~ err:", err);
    return res.status(500).json({ status: 500, error: err });
  }
};

const editSeqShuttleBusDetailSeqController = async (req, res) => {
  const { shuttleBus_id, data } = req.body;
  try {
    if (!shuttleBus_id) {
      return res.status(400).json({ status: 400, error: "shuttleBus_id_is_required" });
    }

    if (!data) {
      return res.status(400).json({ status: 400, error: "data_is_required" });
    }

    if (!Array.isArray(data) || data.length === 0) {
      return res
        .status(400)
        .json({ status: 400, error: "data must be a non-empty array" });
    }

    const getShuttleBusId = await getShuttleBusByIdRepository(shuttleBus_id);

      if (getShuttleBusId.error !== null) {
        return res.status(500).json({ status: 500, error: data.error });
      }

      if (getShuttleBusId?.data.length === 0) {
        return res
          .status(400)
          .json({ status: 400, error: "shuttleBus_id_is_not_found" });
      }

    data.forEach(async (item) => {
      if (!item?.Road_id) {
        return res
          .status(400)
          .json({ status: 400, error: "Road_id_is_required" });
      }

      if (!item?.road_id_increment || item?.road_id_increment === 0) {
        return res.status(400).json({ status: 400, error: "road_id_increment_is_required" });
      }

      const Road_id = await getRoadRouteByIdRepository(item?.Road_id);

      if (Road_id.error !== null) {
        return res.status(500).json({ status: 500, error: data.error });
      }

      if (Road_id?.data.length === 0) {
        return res
          .status(400)
          .json({ status: 400, error: "Road_id_is_not_found" });
      }

      const dataUpdateroad_id_increment = {
        road_id_increment: item?.road_id_increment,
      }

      const editSeq = await editRoadRouteSeqRepository(
        item?.Road_id,
       dataUpdateroad_id_increment
      );

      if (editSeq.error !== null) {
        return res.status(500).json({ status: 500, error: data.error });
      }
    });

    return res.status(200).json({ status: 200, data: null });
  } catch (err) {
    console.log("🚀 ~ editSeqShuttleBusDetailSeqController ~ err:", err);
    return res.status(500).json({ status: 500, error: err });
  }
};

module.exports = {
  fetchDataShuttleBussController,
  createShuttleBussController,
  deleteShuttleBusController,
  editShuttleBussController,
  editSeqShuttleBusController,
  editSeqShuttleBusDetailSeqController,
};
