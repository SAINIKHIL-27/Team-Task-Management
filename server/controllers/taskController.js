const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  const { projectId, status, priority } = req.query;
  const filter = {};
  if (projectId) filter.project = projectId;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const tasks = await Task.find(filter)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  const { title, description, projectId, assignedTo, status, priority, dueDate } = req.body;
  if (!title || !projectId) return res.status(400).json({ message: 'Title and project required' });

  const task = await Task.create({
    title, description,
    project: projectId,
    assignedTo, status, priority, dueDate,
    createdBy: req.user._id
  });
  res.status(201).json(task);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate('assignedTo', 'name email');
  if (!task) return res.status(404).json({ message: 'Not found' });
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Task deleted' });
};