import dashboardService from "../services/dashboard.services.js";

const dashboardController = async (req, res) => {
  const userId = req.user.id;

  let data;

  try {
    data = await dashboardService(userId);
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }

  return res.json(data);
};

export default dashboardController;
