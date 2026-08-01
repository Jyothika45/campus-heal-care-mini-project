import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaHospitalUser, FaEye, FaEyeSlash, FaUserGraduate, FaUserMd, FaShieldAlt, FaHeartbeat } from 'react-icons/fa';
import axios from 'axios';
import './Authentication.css';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier.trim()) {
      newErrors.identifier = role === 'student' ? 'Student ID or Email is required' : 'Email/ID is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Axios ready API endpoint
      const response = await axios.post('/api/auth/login', {
        ...formData,
        role
      });
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      // Fallback mock success for demonstration until backend is connected
      console.log('Login submitted:', { ...formData, role });
      setTimeout(() => {
        setLoading(false);
        // Simulate successful navigation or error
        navigate('/dashboard');
      }, 1200);
    }
  };

  return (
    <div className="auth-wrapper">
      <Container className="my-auto">
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            <div className="auth-card">
              <Row className="g-0">
                {/* Left Side Healthcare Banner */}
                <Col md={5} className="d-none d-md-block">
                  <div className="auth-banner">
                    <div>
                      <div className="auth-logo-badge">
                        <FaHeartbeat className="fs-3 text-warning" />
                        <span>Campus Health Care</span>
                      </div>
                      <h4 className="fw-bold mb-3">Your Wellness, Our Priority</h4>
                      <p className="small opacity-75">
                        Comprehensive health management for students, staff, and medical personnel.
                      </p>
                      <ul className="health-feature-list">
                        <li className="health-feature-item">
                          <span className="health-feature-icon"><FaUserGraduate /></span>
                          <span>Student Health & OPD Booking</span>
                        </li>
                        <li className="health-feature-item">
                          <span className="health-feature-icon"><FaUserMd /></span>
                          <span>Real-time Doctor Availability</span>
                        </li>
                        <li className="health-feature-item">
                          <span className="health-feature-icon"><FaShieldAlt /></span>
                          <span>24/7 Emergency Support</span>
                        </li>
                      </ul>
                    </div>
                    <div className="pt-3 border-top border-light border-opacity-25 text-center small opacity-75">
                      © {new Date().getFullYear()} Campus Health Care System
                    </div>
                  </div>
                </Col>

                {/* Right Side Login Form */}
                <Col md={7}>
                  <div className="auth-form-section">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <FaHospitalUser className="text-primary fs-3" />
                      <h3 className="auth-title m-0">Welcome Back</h3>
                    </div>
                    <p className="auth-subtitle">Please sign in to access your health portal</p>

                    {/* Role Tab Selection */}
                    <div className="role-tab-group">
                      <button
                        type="button"
                        className={`role-tab-btn ${role === 'student' ? 'active' : ''}`}
                        onClick={() => setRole('student')}
                      >
                        Student
                      </button>
                      <button
                        type="button"
                        className={`role-tab-btn ${role === 'doctor' ? 'active' : ''}`}
                        onClick={() => setRole('doctor')}
                      >
                        Doctor/Staff
                      </button>
                      <button
                        type="button"
                        className={`role-tab-btn ${role === 'admin' ? 'active' : ''}`}
                        onClick={() => setRole('admin')}
                      >
                        Admin
                      </button>
                    </div>

                    {serverError && <Alert variant="danger">{serverError}</Alert>}

                    <Form onSubmit={handleSubmit}>
                      {/* Email / ID */}
                      <Form.Group className="form-floating-custom mb-3">
                        <Form.Label className="fw-semibold small text-secondary">
                          {role === 'student' ? 'Student Register No / Email' : 'Institutional Email / ID'}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="identifier"
                          placeholder={role === 'student' ? 'e.g. STU123456 or student@campus.edu' : 'name@campus.edu'}
                          value={formData.identifier}
                          onChange={handleChange}
                          isInvalid={!!errors.identifier}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.identifier}
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* Password */}
                      <Form.Group className="form-floating-custom mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <Form.Label className="fw-semibold small text-secondary m-0">Password</Form.Label>
                          <Link to="/forgot-password" className="auth-footer-link small">
                            Forgot Password?
                          </Link>
                        </div>
                        <div className="password-input-group">
                          <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            isInvalid={!!errors.password}
                          />
                          <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label="Toggle password visibility"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          <Form.Control.Feedback type="invalid">
                            {errors.password}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      {/* Remember Me */}
                      <Form.Group className="mb-4">
                        <Form.Check
                          type="checkbox"
                          id="rememberMe"
                          name="rememberMe"
                          label="Remember me on this device"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                          className="small text-muted"
                        />
                      </Form.Group>

                      {/* Submit Button */}
                      <Button type="submit" className="btn-chc-primary mb-3" disabled={loading}>
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" />
                            <span>Signing In...</span>
                          </>
                        ) : (
                          <span>Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
                        )}
                      </Button>
                    </Form>

                    <div className="text-center pt-3 border-top">
                      <span className="text-muted small">Don't have a health care account? </span>
                      <Link to="/register" className="auth-footer-link small">
                        Register Now
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
