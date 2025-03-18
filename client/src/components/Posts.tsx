import React, { useState } from 'react';
import { apiRequest } from "@/lib/queryClient";

const Posts = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handlePost = async () => {
    const response = await apiRequest('POST', '/api/posts', {
      userId: 1, // Replace with actual user ID
      title,
      content,
      type: 'discussion',
    });
    // Handle response, update UI, etc.
  };

  return (
    <div>
      <h2>Create a Post</h2>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post Title" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Post Content" />
      <button onClick={handlePost}>Submit</button>
    </div>
  );
};

export default Posts;