import React, { useState, useEffect } from 'react';
import { ref, update } from 'firebase/database';
import { db } from '../firebaseConfig';

const Updateform = ({ rowData, onUpdate }) => {
  const calculateReturnDate = (startDate, period) => {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + period);
    return currentDate.toISOString().split('T')[0];
  };

  const calculateReturnAmount = (amount, totalPeriod) => {
    const baseRate = 1.05;
    const percentageIncrease = 0.05;
    const numberOfPeriods = Math.ceil(totalPeriod / 7);
    const returnAmount = baseRate + percentageIncrease * (numberOfPeriods - 1);
    return (returnAmount * amount).toFixed(2);
  };

  const calculateTotalPeriod = (startDate, returnDate) => {
    const start = new Date(startDate);
    const end = new Date(returnDate);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays;
  };

  const [updatedData, setUpdatedData] = useState({
    name: rowData.name,
    amount: rowData.amount,
    date: rowData.date,
    originalreturndate: rowData.returnDate,
    period1: 1,
    returnDate: calculateReturnDate(rowData.returnDate, 1),
    totalperiod: calculateTotalPeriod(rowData.date, calculateReturnDate(rowData.returnDate, 1)),
    returnAmount: calculateReturnAmount(rowData.amount, calculateTotalPeriod(rowData.date, calculateReturnDate(rowData.returnDate, 1))),
  });

  useEffect(() => {
    const newReturnDate = calculateReturnDate(updatedData.originalreturndate, updatedData.period1);
    const newTotalPeriod = calculateTotalPeriod(updatedData.date, newReturnDate);
    const newReturnAmount = calculateReturnAmount(updatedData.amount, newTotalPeriod);

    setUpdatedData((prevData) => ({
      ...prevData,
      returnDate: newReturnDate,
      totalperiod: newTotalPeriod,
      returnAmount: newReturnAmount,
    }));
  }, [updatedData.amount, updatedData.period1, updatedData.originalreturndate, updatedData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === 'period1') {
      updatedValue = parseInt(value, 10);

      const newReturnDate = calculateReturnDate(updatedData.originalreturndate, updatedValue);
      const newTotalPeriod = calculateTotalPeriod(updatedData.date, newReturnDate);
      const newReturnAmount = calculateReturnAmount(updatedData.amount, newTotalPeriod);

      setUpdatedData((prevData) => ({
        ...prevData,
        [name]: updatedValue,
        returnDate: newReturnDate,
        period: newTotalPeriod,
        returnAmount: newReturnAmount,
      }));
    } else {
      setUpdatedData((prevData) => ({
        ...prevData,
        [name]: updatedValue,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { amount,period, returnAmount, returnDate} = updatedData;

    const dbRef = ref(db, `lend/${rowData.key}`);
    update(dbRef, {
      amount,
      period,
      returnAmount,
      returnDate,
    });

    onUpdate(updatedData);
  };

  return (
    <div className="update-form">
      <form className="mt-36" onSubmit={handleSubmit}>
        <div className="flex justify-center items-center h-screen ">
          <div className="bg-white p-8 rounded shadow-md w-96">
            <h2 className="text-2xl mb-4 font-serif">Update Info:</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray600">Name:</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Enter client name"
                name="name"
                value={updatedData.name}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray600">Date:</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Enter client name"
                name="date"
                value={updatedData.date}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray600">original Return Date:</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Enter client name"
                name="originalreturndate"
                value={updatedData.originalreturndate}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray600">Amount:</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="amount"
                name="amount"
                value={updatedData.amount}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray600">Extend Period:</label>
              <input
                type="number"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Number of days to extend by"
                name="period1"
                value={updatedData.period1}
                onChange={handleChange}
                min={1}
                max={64}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray600">Total Period:</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="total period"
                name="period"
                value={updatedData.totalperiod}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray600">Return Date:</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Enter client name"
                name="returnDate"
                value={updatedData.returnDate}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray600">Return Amount:</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="return amount"
                name="returnAmount"
                value={updatedData.returnAmount}
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
      </form>
    </div>
  );
};

export default Updateform;
