const Task = require('../models/Task');

exports.getDashboard = async (req, res) => {
  const now = new Date();
  const userId = req.user._id;

  const [total, completed, inProgress, overdue, myTasks] = await Promise.all([
    Task.countDocuments(),
    Task.countDocuments({ status: 'completed' }),
    Task.countDocuments({ status: 'in-progress' }),
    Task.countDocuments({ dueDate: { $lt: now }, status: { $ne: 'completed' } }),
    Task.find({ assignedTo: userId }).populate('project', 'name').sort({ dueDate: 1 }).limit(5)
  ]);

  res.json({ total, completed, inProgress, pending: total - completed, overdue, myTasks });
};