const { GetRouteRepository, fetchDataRoadRepository } = require("../repositories/routeRepository");

const GetRouteController = async (req, res) => {
    try {
        const data = await GetRouteRepository();

        if (data.error !== null) {
            return res.status(500).json({ status: 500, error: data.error });
        }

        return res.status(200).json({ status: 200, data: data.data });
    } catch (err) {
        console.log("🚀 ~ GetRouteController ~ err:", err)
        return res.status(500).json({ status: 500, error: err });
    }
}

const fetchDataRoad02Controller = async (req, res) => {
    const { route_id } = req.body;
    try {
        

        const data = await fetchDataRoadRepository(route_id);

        if (data.error !== null) {
            return res.status(500).json({ status: 500, error: data.error });
        }

        return res.status(200).json({ status: 200, data: data.data });
    } catch (err) {
        console.log("🚀 ~ GetRouteController ~ err:", err)
        return res.status(500).json({ status: 500, error: err });
    }
}

const fetchDataRoad03Controller = async (req, res) => {
    const { route_id } = req.body;
    try {
        const data = await fetchDataRoadRepository(route_id);

        if (data.error !== null) {
            return res.status(500).json({ status: 500, error: data.error });
        }

        return res.status(200).json({ status: 200, data: data.data });
    } catch (err) {
        console.log("🚀 ~ GetRouteController ~ err:", err)
        return res.status(500).json({ status: 500, error: err });
    }
}

const bus02 = async (req, res) => {
    const { shuttle_name } = req.body;
    try {
        const data = await bus02(shuttle_name);

        if (data.error !== null) {
            return res.status(500).json({ status: 500, error: data.error });
        }

        return res.status(200).json({ status: 200, data: data.data });
    } catch (err) {
        console.log("🚀 ~ GetRouteController ~ err:", err)
        return res.status(500).json({ status: 500, error: err });
    }
}


module.exports = {
    GetRouteController,
    fetchDataRoad02Controller,
    fetchDataRoad03Controller,
    bus02
  };