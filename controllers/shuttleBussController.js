const {
  listMainShuttleBussDataRepository,
  listShuttleBusDataDetailRepository,
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
      const { shuttleBus_id, busStop_name, busStop_latitude, busStop_longitude } =
        detail;
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

module.exports = {
  fetchDataShuttleBussController,
};
