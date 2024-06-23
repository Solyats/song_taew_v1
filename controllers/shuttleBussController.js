const { validationResult } = require("express-validator");
const {
  listMainShuttleBussDataRepository,
  listShuttleBusDataDetailRepository,
  insertShuttleBusRepository,
  getLatestShuttleBusSeqRepository,
} = require("../repositories/shuttleBussRepository");

const fetchDataShuttleBussController = async (req, res) => {
  const { route_id } = req.body;
  try {
    const listData = await listShuttleBusDataDetailRepository(route_id);

    if (listData.error !== null) {
      return res.status(500).json({ status: 500, error: data.error });
    }

    const listDataDetail = await listMainShuttleBussDataRepository(route_id);

    if (listDataDetail.error !== null) {
      return res.status(500).json({ status: 500, error: data.error });
    }

    const detailDataMap = listDataDetail?.data.reduce((acc, detail) => {
      const {
        shuttleBus_id,
        busStop_name,
        busStop_latitude,
        busStop_longitude,
      } = detail;
      if (!acc[shuttleBus_id]) {
        acc[shuttleBus_id] = [];
      }
      acc[shuttleBus_id].push({
        busStop_name,
        busStop_latitude,
        busStop_longitude,
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

    const shuttleBus = await listShuttleBusDataDetailRepository(data?.shuttleBus_id);

    if (shuttleBus.error !== null) {
      return res.status(500).json({ status: 500, error: data.error });
    }

    if (shuttleBus?.data.length > 0) {
      return res.status(400).json({ status: 500, error: "shuttleBus_id_is_already_exist" });
    }

    

    const latestSeq = await getLatestShuttleBusSeqRepository()

    const seqBody = latestSeq?.data?.seq + 1

    let bodyJson = {
      shuttleBus_id: data?.shuttleBus_id || "",
      shuttleBus_name: data?.shuttleBus_name || "",
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
    console.log("🚀 ~ GetRouteController ~ err:", err);
    return res.status(500).json({ status: 500, error: err });
  }
};


module.exports = {
  fetchDataShuttleBussController,
  createShuttleBussController,
};
