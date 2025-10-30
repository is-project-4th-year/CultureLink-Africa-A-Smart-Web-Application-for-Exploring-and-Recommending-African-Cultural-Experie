import React, { useState } from "react";
import "./contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Asante! Your message has been received — we'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-page">
      <div className="contact-card">
        <h2>Contact CultureLink Kenya</h2>
        <p className="intro">
          Have a question, partnership proposal, or suggestion? 
          We’d love to hear from you and collaborate in promoting Kenyan culture and experiences.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Type your message here..."
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">Send Message</button>
        </form>

        {status && <p className="status">{status}</p>}
      </div>

      <div className="contact-info">
        <h3>Get in Touch</h3>
        <p><strong>Email:</strong> hello@culturelinkkenya.com</p>
        <p><strong>Phone:</strong> +254 712 345 678</p>
        <p><strong>Location:</strong> Nairobi, Kenya</p>
        <div className="socials">
          <a href="#">Instagram</a> | <a href="#">X (Twitter)</a> | <a href="#">LinkedIn</a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
