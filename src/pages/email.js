import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

 const EmailForm = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_231bj5g', 'template_uwnvh09', form.current, 'smUNEcWAjROpuR_CI')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  };

  return (
    <form ref={form} onSubmit={sendEmail}>
      <label>Name</label>
      <input type="text" name="to_name" />
      <label>Email</label>
      <input type="text" name="from_name" />
      <label>Message</label>
      <textarea name="message" />
      <input type="submit"  value="Send" />
    </form>
  );
};

export default EmailForm;