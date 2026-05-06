const Project = require('../models/Project');

exports.getProjects = async (req, res) => {
  const projects = await Project.find({
    $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
  }).populate('owner', 'name email').populate('members.user', 'name email');
  res.json(projects);
};

exports.createProject = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Project name required' });
  const project = await Project.create({
    name, description, owner: req.user._id,
    members: [{ user: req.user._id, role: 'admin' }]
  });
  res.status(201).json(project);
};

exports.getProject = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email')
    .populate('members.user', 'name email');
  if (!project) return res.status(404).json({ message: 'Not found' });
  res.json(project);
};

exports.updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Not found' });
  if (project.owner.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });

  Object.assign(project, req.body);
  await project.save();
  res.json(project);
};

exports.deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Not found' });
  if (project.owner.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });
  await project.deleteOne();
  res.json({ message: 'Project deleted' });
};

exports.addMember = async (req, res) => {
  const { userId, role } = req.body;
  const project = await Project.findById(req.params.id);
  const alreadyIn = project.members.some(m => m.user.toString() === userId);
  if (alreadyIn) return res.status(400).json({ message: 'Already a member' });
  project.members.push({ user: userId, role: role || 'member' });
  await project.save();
  res.json(project);
};