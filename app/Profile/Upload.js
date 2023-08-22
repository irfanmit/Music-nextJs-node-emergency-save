'use client'

import { useState } from 'react';
import styles from './page.module.css';

const Profile = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [musicPreferences, setMusicPreferences] = useState([]);

  const handlePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMusicPreferenceChange = (preference) => {
    if (musicPreferences.includes(preference)) {
      setMusicPreferences(musicPreferences.filter(pref => pref !== preference));
    } else {
      setMusicPreferences([...musicPreferences, preference]);
    }
  };

  return (
    <div className={styles.profile}>
      <h2>Profile</h2>
      <div className={styles.profilePicture}>
        <label htmlFor="pictureUpload">Upload Profile Picture:</label>
        <input type="file" id="pictureUpload" accept="image/*" onChange={handlePictureUpload} />
        {profilePicture && <img src={profilePicture} alt="Profile" />}
      </div>
      <div className={styles.info}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className={styles.musicPreferences}>
        <h3>Music Preferences:</h3>
        <label>
          <input
            type="checkbox"
            checked={musicPreferences.includes('Bollywood')}
            // onChange={() => handleMusicPreferenceChange('Bollywood')}
          />
          Bollywood
        </label>
        <label>
          <input
            type="checkbox"
            checked={musicPreferences.includes('Pop')}
            // onChange={() => handleMusicPreferenceChange('Pop')}
          />
          Pop
        </label>
        <label>
          <input
            type="checkbox"
            checked={musicPreferences.includes('Soundtrack')}
            onChange={() => handleMusicPreferenceChange('Soundtrack')}
          />
          Soundtrack
        </label>
        <label>
          <input
            type="checkbox"
            checked={musicPreferences.includes('Anime')}
            onChange={() => handleMusicPreferenceChange('Anime')}
          />
          Anime
        </label>
      </div>
    </div>
  );
};

export default Profile;
