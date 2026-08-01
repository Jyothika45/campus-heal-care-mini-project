import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaEye, FaEyeSlash, FaHeartbeat, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import './Authentication.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    registerNo: '',
    email: '',
    phone: '',
    department: '',
    batch: '',
    bloodGroup: '',
    gender: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.registerNo.trim()) newErrors.registerNo = 'Register/Student ID is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Campus Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.department) newErrors.department = 'Department selection is required';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood Group selection is required';
    if (!formData.gender) newErrors.gender = 'Gender selection is required';

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and health care privacy policy';
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
      const response = await axios.post('/api/auth/register', formData);
      if (response.data && response.data.success) {
        navigate('/otp-verification', { state: { email: formData.email } });
      }
    } catch (err) {
      console.log('Registration data:', formData);
      setTimeout(() => {
        setLoading(false);
        // Navigate to OTP verification after registration
        navigate('/otp-verification', { state: { email: formData.email } });
      }, 1200);
    }
  };

  return (
    <div className="auth-wrapper py-4">
      <Container>
        <Row className="justify-content-center">
          <Col lg={11} xl={10}>
            <div className="auth-card">
              <Row className="g-0">
                {/* Banner Side */}
                <Col lg={4} className="d-none d-lg-block">
                  <div className="auth-banner">
                    <div>
                      <div className="auth-logo-badge">
                        <FaHeartbeat className="fs-3 text-warning" />
                        <span>Campus Health Care</span>
                      </div>
                      <h4 className="fw-bold mb-3">Join Student Health Network</h4>
                      <p className="small opacity-75 mb-4">
                        Register your student profile to access medical consultations, prescription requests, and emergency aid.
                      </p>
                      <div className="bg-white bg-opacity-10 p-3 rounded-3 mb-3">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <FaCheckCircle className="text-warning" />
                          <span className="fw-semibold small">Instant OPD Appointments</span>
                        </div>
                        <p className="small text-white-50 m-0">Book slots with campus doctors without waiting in queues.</p>
                      </div>
                      <div className="bg-white bg-opacity-10 p-3 rounded-3">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <FaCheckCircle className="text-warning" />
                          <span className="fw-semibold small">Digital Health Card</span>
                        </div>
                        <p className="small text-white-50 m-0">Maintain secure electronic medical records and prescriptions.</p>
                      </div>
                    </div>
                    <div className="pt-3 border-top border-light border-opacity-25 text-center small opacity-75">
                      Need Help? Contact Health Center Portal Admin
                    </div>
                  </div>
                </Col>

                {/* Form Side */}
                <Col lg={8}>
                  <div className="auth-form-section">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <FaUserPlus className="text-primary fs-3" />
                      <h3 className="auth-title m-0">Student Registration</h3>
                    </div>
                    <p className="auth-subtitle">Create your campus health care profile</p>

                    {serverError && <Alert variant="danger">{serverError}</Alert>}

                    <Form onSubmit={handleSubmit}>
                      <Row>
                        {/* Full Name */}
                        <Col md={6}>
                          <Form.Group className="form-floating-custom mb-3">
                            <Form.Label className="fw-semibold small text-secondary">Full Name *</Form.Label>
                            <Form.Control
                              type="text"
                              name="fullName"
                              placeholder="John Doe"
                              value={formData.fullName}
                              onChange={handleChange}
                              isInvalid={!!errors.fullName}
                            />
                            <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        {/* Register No */}
                        <Col md={6}>
                          <Form.Group className="form-floating-custom mb-3">
                            <Form.Label className="fw-semibold small text-secondary">Register / Roll Number *</Form.Label>
                            <Form.Control
                              type="text"
                              name="registerNo"
                              placeholder="e.g. 21MCA042"
                              value={formData.registerNo}
                              onChange={handleChange}
                              isInvalid={!!errors.registerNo}
                            />
                            <Form.Control.Feedback type="invalid">{errors.registerNo}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        {/* Email */}
                        <Col md={6}>
                          <Form.Group className="form-floating-custom mb-3">
                            <Form.Label className="fw-semibold small text-secondary">Campus Email Address *</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              placeholder="student@campus.edu"
                              value={formData.email}
                              onChange={handleChange}
                              isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        {/* Phone */}
                        <Col md={6}>
                          <Form.Group className="form-floating-custom mb-3">
                            <Form.Label className="fw-semibold small text-secondary">Mobile Number *</Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              placeholder="10-digit mobile number"
                              value={formData.phone}
                              onChange={handleChange}
                              isInvalid={!!errors.phone}
                            />
                            <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        {/* Department */}
                        <Col md={6}>
                          <Form.Group className="form-floating-custom mb-3">
                            <Form.Label className="fw-semibold small text-secondary">Department *</Form.Label>
                            <Form.Select
                              name="department"
                              value={formData.department}
                              onChange={handleChange}
                              isInvalid={!!errors.department}
                            >
                              <option value="">Select Department</option>
                              <option value="MCA">Computer Applications (MCA)</option>
                              <option value="CSE">Computer Science & Engineering</option>
                              <option value="ECE">Electronics & Communication</option>
                              <option value="ME">Mechanical Engineering</option>
                              <option value="MBA">Management (MBA)</option>
                              <option value="OTHER">Other Department</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{errors.department}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        {/* Batch */}
                        <Col md={6}>
                          <Form.Group className="form-floating-custom mb-3">
                            <Form.Label className="fw-semibold small text-secondary">Batch / Year</Form.Label>
                            <Form.Control
                              type="text"
                              name="batch"
                              placeholder="e.g. 2024-2026"
                              value={formData.batch}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        {/* Blood Group */}
                        <Col md={6}>
                          <Form.Group className="form-floating-custom mb-3">
                            <Form.Label className="fw-semibold small text-secondary">Blood Group *</Form.Label>
                            <Form.Select
                              name="bloodGroup"
                              value={formData.bloodGroup}
                              onChange={handleChange}
                              isInvalid={!!errors.bloodGroup}
                            >
                              <option value="">Select Blood Group</option>
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{errors.bloodGroup}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        {/* Gender */}
                        <Col md={6}>
                          <Form.Group className="form-floating-custom mb-3">
                            <Form.Label className="fw-semibold small text-secondary">Gender *</Form.Label>
                            <Form.Select
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                              isInvalid={!!errors.gender}
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        {/* Password */}
                        <Col md={6}>
                          <Form.Group className="form-floating-custom mb-3">
                            <Form.Label className="fw-semibold small text-secondary">Password *</Form.Label>
                            <div className="password-input-group">
                              <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="At least 6 characters"
                                value={formData.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password}
                              />
                              <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </button>
                              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>

                        {/* Confirm Password */}
                        <Col md={6}>
                          <Form.Group className="form-floating-custom mb-3">
                            <Form.Label className="fw-semibold small text-secondary">Confirm Password *</Form.Label>
                            <div className="password-input-group">
                              <Form.Control
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Re-enter password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                isInvalid={!!errors.confirmPassword}
                              />
                              <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                              </button>
                              <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* Terms Acceptance */}
                      <Form.Group className="mb-4">
                        <Form.Check
                          type="checkbox"
                          id="termsAccepted"
                          name="termsAccepted"
                          checked={formData.termsAccepted}
                          onChange={handleChange}
                          label={
                            <span className="small text-muted">
                              I agree to the <a href="#privacy" className="auth-footer-link">Campus Health Care Terms & Privacy Policy</a>
                            </span>
                          }
                          isInvalid={!!errors.termsAccepted}
                        />
                        {errors.termsAccepted && (
                          <div className="text-danger small mt-1">{errors.termsAccepted}</div>
                        )}
                      </Form.Group>

                      {/* Submit */}
                      <Button type="submit" className="btn-chc-primary mb-3" disabled={loading}>
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" />
                            <span>Creating Account...</span>
                          </>
                        ) : (
                          <span>Register & Proceed to OTP Verification</span>
                        )}
                      </Button>
                    </Form>

                    <div className="text-center pt-3 border-top">
                      <span className="text-muted small">Already registered? </span>
                      <Link to="/login" className="auth-footer-link small">
                        Sign In Here
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

export default Register;
