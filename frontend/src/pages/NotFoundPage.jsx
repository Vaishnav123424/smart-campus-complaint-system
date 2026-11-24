import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container py-5 text-center my-auto">
      <div className="py-5">
        <h1 className="display-1 fw-bold text-primary mb-2">404</h1>
        <h3 className="fw-bold text-dark mb-2">Page Not Found</h3>
        <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '480px' }}>
          The campus portal page you are looking for does not exist or has been relocated by the facility system.
        </p>
        <Link to="/" className="btn btn-primary-custom px-4 py-2">
          &larr; Back to Campus Portal Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
