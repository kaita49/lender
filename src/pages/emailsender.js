import React, { useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from './firebaseConfig';
import emailjs from '@emailjs/browser';

const EmailSender = () => {
  useEffect(() => {
    const fetchDataAndSendEmail = async () => {
      try {
        const currentDate = new Date();
        const formattedCurrentDate = currentDate.toISOString().split('T')[0];

        // Fetch data from Firebase
        const dbRef = ref(db, 'lend');
        const snapshot = await get(dbRef);
        const data = snapshot.val();

        // Filter data based on conditions
        const clientsToEmail = Object.values(data || {}).filter(
          (client) =>
            client.returnDate === formattedCurrentDate &&
            client.status !== 'Paid'
        );

        if (clientsToEmail.length > 0) {
          // Prepare combined email content
          const combinedEmailContent = clientsToEmail
            .map(
              (client, index) => `Client ${index + 1}:
              Name: ${client.name}
              Amount: ${client.amount}
              Date: ${client.date}
              Period: ${client.period}
              Return Amount: ${client.returnAmount}
              Return Date: ${client.returnDate}
              Status: ${client.status}
              `
            )
            .join('\n');

          // Prepare email data
          const emailData = {
            to_name: 'Daniel',
            from_name: 'Lenderapp',
            message: `Combined email message for clients:\n\n${combinedEmailContent}`,
          };

          // Send email using emailjs
          const result = await emailjs.send(
            'service_231bj5g',
            'template_uwnvh09',
            emailData,
            'smUNEcWAjROpuR_CI'
          );

          console.log('Email sent successfully:', result.text);
        } else {
          console.log('No clients to email.');
        }
      } catch (error) {
        console.error('Error fetching/sending data:', error.text);
      }
    };

    fetchDataAndSendEmail();
  }, []);

  return null; // This component doesn't render anything
};

export default EmailSender;
