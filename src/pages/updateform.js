// Updateform.jsx
import React, { useState } from 'react';

const Updateform = ({ rowData, onUpdate }) => {
  const [updatedData, setUpdatedData] = useState({ name: rowData.name , amount: rowData.amount}); // Adjust initial state as needed

  const handleChange = (e) => {
    setUpdatedData({
      ...updatedData,
      [e.target.name]: e.target.value,
      [e.target.amount]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(updatedData);
  };

  return (
    <div className="update-form">
     
      <form onSubmit={handleSubmit}>

      <div className="flex justify-center items-center h-screen ">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4 font-serif">Update Info:</h2>
      <div className="mb-4">
            <label className="block text-sm font-medium text-gray600">Name:</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Enter client name"
              name="name"   value={updatedData.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray600">Amount:</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="amount"
              name="amount"   value={updatedData.amount}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="bg-gray500 text-white px-4 py-2 rounded-md hover:bg-gray600"
          >
            Submit
          </button>
          </div>
          </div>


        





       
       
        {/* Add other form fields as needed */}
        
      </form>
    </div>
  );
};

export default Updateform;
