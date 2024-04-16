import Post from '../models/postModel.js';

const addPost = async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;

    // Create a new post
    const newPost = new Post({
      title,
      content,
      imageUrl
    });

    await newPost.save();

    res.status(201).json('Post created successfully');
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getPost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json('Post not found');
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Delete the post by ID
    await Post.findByIdAndDelete(postId);

    res.status(200).json('Post deleted successfully');
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content, imageUrl } = req.body;

    // Find the post by ID and update its fields
    await Post.findByIdAndUpdate(postId, { title, content, imageUrl });

    res.status(200).json('Post updated successfully');
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export { addPost, getPost, deletePost, updatePost };
