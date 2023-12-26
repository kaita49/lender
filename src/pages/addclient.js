import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ref, push, set } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';
import { db } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';

const AddClient = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('1');
  const [returnAmount, setReturnAmount] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [clearReturn, setClearReturn] = useState(false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [userAdded, setUserAdded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    calculateReturn();
  }, [amount, selectedDate, period]);

  const calculateReturn = () => {
    if (!amount || !period) {
      setReturnAmount('');
      setReturnDate('');
      return;
    }

    const daysDifference = Math.ceil(
      (selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    let returnPercentage = 105;

    if (parseInt(period, 10) > 7) {
      const additionalWeeks = Math.ceil((parseInt(period, 10) - 7) / 7);
      returnPercentage += additionalWeeks * 5;
      returnPercentage = Math.min(returnPercentage, 150);
    }

    const calculatedReturn = (parseFloat(amount) * returnPercentage) / 100;
    setReturnAmount(calculatedReturn.toFixed(2));

    const returnDateObj = new Date(
      selectedDate.getTime() + parseInt(period, 10) * 24 * 60 * 60 * 1000
    );
    setReturnDate(returnDateObj.toISOString().split('T')[0]);
  };

  const handleClearReturn = () => {
    setReturnAmount('');
    setReturnDate('');
    setClearReturn(true);
  };

  const periodOptions = Array.from({ length: 64 }, (_, i) => (i + 1).toString());

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleClearImage = () => {
    setImage(null);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!e.target.name.value || !e.target.amount.value) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const dbRef = ref(db, 'lend');
      const newClientRef = push(dbRef);

      const clientData = {
        name: e.target.name.value,
        amount: e.target.amount.value,
        date: e.target.date.value,
        phone: e.target.phone.value,
        period: e.target.period.value,
        returnAmount,
        returnDate,
        status: 'active',
      };

      if (image) {
        const imageName = `${newClientRef.key}_${image.name}`;
        const storage = getStorage();
        const imageRef = storageRef(storage, `images/${imageName}`);
        await uploadBytes(imageRef, image);
        clientData.imageUrl = imageName;
      }

      await set(newClientRef, clientData);

      setError('');
      setUserAdded(true);

      scrollToTop();

      setTimeout(() => {
        setUserAdded(false);
        navigate('/'); // Use React Router's useNavigate for navigation
      }, 1000); // Adjust the duration as needed (in milliseconds)

      e.target.reset();
      setAmount('');
      setSelectedDate(today);
      setPeriod('1');
      setClearReturn(true);
      handleClearImage();
    } catch (error) {
      console.error('Error adding data to Realtime Database:', error);
      setError('Error submitting the form. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen mt-28">
      <div className="bg-white p-8 rounded shadow-md mt-11 w-96">
        <h2 className="text-2xl mb-4 flex items-center justify-center font-serif">Add Client:</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {userAdded && (
          <div className="bg-green500 text-white p-2 mb-4 rounded">
            User added successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray600">Name:</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Enter client name"
              name="name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray600">Phone No:</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Enter Phone No"
              name="phone"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray600">Amount:</label>
            <input
              type="number"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Enter the amount"
              name="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray600">Date:</label>
            <div className="p-2 mt-1 w-full border rounded-md">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className=" border-0"
              
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a date"
              name="date"
              readOnly
            />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray600">Period:</label>
            <select
              className="mt-1 p-2 w-full border rounded-md"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              name="period"
            >
              {periodOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray600">Attach file:</label>
            <input
              type="file"
              className="mt-1 p-2 w-full border rounded-md"
              accept="image/*"
              onChange={handleImageChange}
            />
            
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray600">Return Amount:</label>
            <div className="flex items-center">
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md text-black"
                placeholder="Return"
                value={returnAmount}
                onChange={(e) => setReturnAmount(e.target.value)}
              />
              {returnAmount && (
                <button
                  type="button"
                  className="ml-2 px-3 py-2 bg-red500 text-white rounded-md"
                  onClick={handleClearReturn}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray600">Return Date:</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Return Date"
              value={returnDate}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray600">Status:</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md"
              value="active"
              readOnly
            />
          </div>

          <button
            type="submit"
            className="bg-gray500 text-white px-4 py-2 rounded-md hover:bg-gray600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddClient;
