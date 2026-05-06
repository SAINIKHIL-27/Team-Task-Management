const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProjects, createProject, getProject,
  updateProject, deleteProject, addMember
} = require('../controllers/projectController');

router.use(protect);
router.route('/').get(getProjects).post(createProject);
router.route('/:id').get(getProject).put(updateProject).delete(deleteProject);
router.post('/:id/members', addMember);

module.exports = router;