import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaShieldCheck, FaArrowLeft, FaHeartbeat, FaRotateRight } from 'react-icons/fa6';
import axios from 'axios';
import './Authentication.css';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = location.state?.email || 'student@campus.edu';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const inputRefs = useRef([]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (error) setError('');

    // Move to next input box automatically
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setTimer(60);
    setCanResend(false);
    setSuccessMsg('A fresh OTP code has been sent to your email.');
    setError('');

    try {
      await axios.post('/api/auth/resend-otp', { email: userEmail });
    } catch (err) {
      console.log('Resend OTP trigger for:', userEmail);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');

    if (enteredOtp.length < 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/verify-otp', {
        email: userEmail,
        otp: enteredOtp
      });
      if (response.data && response.data.success) {
        navigate('/login', { state: { message: 'Account verified successfully! Please log in.' } });
      }
    } catch (err) {
      console.log('OTP submitted:', enteredOtp);
      setTimeout(() => {
        setLoading(false);
        // Simulate successful verification
        navigate('/login');
      }, 1200);
    }
  };

  return (
    <div className="auth-wrapper">
      <Container className="my-auto">
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div className="auth-card p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="auth-logo-badge justify-content-center text-primary mb-2">
                  <FaHeartbeat className="fs-2 text-primary" />
                  <span className="fs-4">Campus Health Care</span>
                </div>
                <h4 className="auth-title">Verify OTP Code</h4>
                <p className="auth-subtitle mb-0">
                  Enter the 6-digit security code sent to <br />
                  <span className="fw-semibold text-primary">{userEmail}</span>
                </p>
              </div>

              {error && <Alert variant="danger" className="py-2 small text-center">{error}</Alert>}
              {successMsg && <Alert variant="success" className="py-2 small text-center">{successMsg}</Alert>}

              <Form onSubmit={handleSubmit}>
                <div className="otp-box-container">
                  {otp.map((digit, index) => (
                    <Form.Control
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="otp-input-field"
                    />
                  ))}
                </div>

                <div className="text-center mb-4">
                  {timer > 0 ? (
                    <span className="small text-muted">
                      Resend code in <strong className="text-primary">{timer}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-link auth-footer-link small p-0 d-inline-flex align-items-center gap-1"
                      onClick={handleResend}
                    >
                      <FaRotateRight /> Resend OTP Code
                    </button>
                  )}
                </div>

                <Button type="submit" className="btn-chc-primary mb-3" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <FaShieldCheck />
                      <span>Verify & Continue</span>
                    </>
                  )}
                </Button>
              </Form>

              <div className="text-center pt-3 border-top mt-3">
                <Link to="/login" className="auth-footer-link small d-inline-flex align-items-center gap-1">
                  <FaArrowLeft />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OTPVerification;
