import dashboardService from "../services/dashboard.services.js";

const dashboardController = async (req, res) => {
  const userId = req.user.id;

  try {
    const data = await dashboardService(userId);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

export default dashboardController;
