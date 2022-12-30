const express = require('express');
const tourController = require('../controllers/postsController');

const router = express.Router();

router
  .route('/')
  .get(tourController.getAllPosts)
  .post(
    tourController.uploadPostImages,
    tourController.resizePostImages,
    tourController.createPost
  );

router
  .route('/:id')
  .get(tourController.getPost)
  .patch(
    tourController.uploadPostImages,
    tourController.resizePostImages,
    tourController.updatePost
  )
  .delete(tourController.deletePost);

module.exports = router;
