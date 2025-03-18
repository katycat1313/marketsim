import React, { useState } from 'react';
import { apiRequest } from "@/lib/queryClient";

const Achievements = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAchievement = async () => {
    const response = await apiRequest('POST', '/api/achievements', {
      name,
      description,
      type: 'skill',
      requirements: {},
      icon: 'icon_url',
      experiencePoints: 10,
    });
    // Handle response, update UI, etc.
  };

  return (
    <div>
      <h2>Create Achievement</h2>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Achievement Name" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Achievement Description" />
      <button onClick={handleAchievement}>Submit</button>
    </div>
  );
};

export default Achievements;