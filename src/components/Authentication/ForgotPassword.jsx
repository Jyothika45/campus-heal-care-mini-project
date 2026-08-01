import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaKey, FaArrowLeft, FaHeartbeat, FaEnvelopeCheck } from 'react-icons/fa6';
import axios from 'axios';
import './Authentication.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your registered email address or student ID.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setLoading(false);
      setSubmitted(true);
    } catch (err) {
      console.log('Forgot Password request for:', email);
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
      }, 1000);
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
                <h4 className="auth-title">Password Recovery</h4>
                <p className="auth-subtitle mb-0">
                  {submitted
                    ? 'Check your inbox for instructions'
                    : 'Enter your registered email address to receive password reset OTP'}
                </p>
              </div>

              {submitted ? (
                <div className="text-center py-3">
                  <div className="bg-light-primary text-primary p-4 rounded-circle d-inline-flex mb-3">
                    <FaEnvelopeCheck className="display-4 text-primary" />
                  </div>
                  <Alert variant="success" className="text-start mb-4">
                    <strong>OTP Link Sent!</strong> An OTP code and reset link have been dispatched to{' '}
                    <u className="fw-semibold">{email}</u>. Please check your inbox and spam folder.
                  </Alert>
                  <Button
                    className="btn-chc-primary mb-3"
                    onClick={() => navigate('/otp-verification', { state: { email } })}
                  >
                    Enter Verification OTP
                  </Button>
                  <div>
                    <button
                      type="button"
                      className="btn btn-link auth-footer-link small p-0"
                      onClick={() => setSubmitted(false)}
                    >
                      Did not receive code? Try again
                    </button>
                  </div>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

                  <Form.Group className="form-floating-custom mb-4">
                    <Form.Label className="fw-semibold small text-secondary">
                      Registered Campus Email / Student ID
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. student@campus.edu"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                    />
                  </Form.Group>

                  <Button type="submit" className="btn-chc-primary mb-3" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <FaKey />
                        <span>Send Reset Instructions</span>
                      </>
                    )}
                  </Button>
                </Form>
              )}

              <div className="text-center pt-3 border-top mt-3">
                <Link to="/login" className="auth-footer-link small d-inline-flex align-items-center gap-1">
                  <FaArrowLeft />
                  <span>Back to Login</span>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;
