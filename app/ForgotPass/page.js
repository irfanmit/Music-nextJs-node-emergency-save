'use client'

import { useState } from 'react';
import styles from './page.module.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const handleSendVerificationEmail = () => {
    // Send the verification email request to the server
    // Implement the logic to send the email to the user's email address here
    setEmailSent(true);
  };

  const handleVerifyEmail = () => {
    // Verify the user's email with the verification code
    // Implement the logic to verify the email here
    setEmailVerified(true);
  };

  const handleSetNewPassword = () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match.");
      return;
    }

    // Set the new password for the user
    // Implement the logic to update the user's password here
    setMessage('Password updated successfully.');
  };

  const handlePasswordReset = () => {
    // Construct your GraphQL mutation
    const graphqlMutation = {
      query: `
        mutation {
          resetPassword(email: "${email}", newPassword: "${newPassword}") {
            message
          }
        }
      `,
    };

    // Send the GraphQL mutation request
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlMutation),
    })
      .then((res) => res.json())
      .then((resData) => {
        // Handle the response data as needed
        console.log(resData);
        setMessage(resData.data.resetPassword.message);
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred during password reset.');
      });
  };

  return (
    <div className={styles.emailVerify}>
      <h1>Forgot Password</h1>

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Commented out code for verification */}
      
      {/* Display the password reset section */}
      <div>
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="button" onClick={handleSetNewPassword}>
          Set New Password
        </button>
        <button type="button" onClick={handlePasswordReset}>
          Reset Password
        </button>
        {message && <p style={{ color: 'red' }}>{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
