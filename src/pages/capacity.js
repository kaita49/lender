import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { getStorage, ref as storageRef, list, getDownloadURL, getMetadata } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const DataCapacity = () => {
  const [realtimeDBCapacity, setRealtimeDBCapacity] = useState(0);
  const [storageCapacity, setStorageCapacity] = useState(0);

  useEffect(() => {
    const dbRef = ref(getDatabase());

    const fetchData = async () => {
      try {
        // Fetch data from Realtime Database
        const snapshot = await onValue(dbRef, (snapshot) => {
          const data = snapshot.val();
          const dbCapacity = JSON.stringify(data).length;
          setRealtimeDBCapacity(dbCapacity);
        });

        // Firebase Storage reference
        const storage = getStorage();
        const storageReference = storageRef(storage, 'your-storage-path'); // Replace with your actual path

        // Fetch list of items in the storage path
        const storageList = await list(storageReference);

        // Calculate total storage size including metadata
        let totalSize = 0;

        for (const item of storageList.items) {
          const metadata = await getMetadata(item);
          totalSize += metadata.size;
        }

        setStorageCapacity(totalSize);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  return (
    <div>
      <div>
        <h2>Realtime Database Capacity</h2>
        <p>{realtimeDBCapacity} bytes</p>
      </div>

      <div>
        <h2>Firebase Storage Capacity</h2>
        <p>{storageCapacity} bytes</p>
      </div>
    </div>
  );
};

export default DataCapacity;
