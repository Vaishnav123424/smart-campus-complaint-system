import React from 'react';

const StatusTimeline = ({ timeline = [], currentStatus = 'Pending' }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="timeline-track mt-3">
      {timeline.map((item, index) => {
        const isLatest = index === timeline.length - 1;
        const isResolved = item.status === 'Resolved';
        const isRejected = item.status === 'Rejected';

        let itemClass = 'timeline-item';
        if (isResolved) itemClass += ' completed';
        else if (isLatest) itemClass += ' active';

        return (
          <div key={index} className={itemClass}>
            <div className="timeline-marker"></div>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="fw-semibold text-dark">
                Status: <span className="text-primary">{item.status}</span>
              </span>
              <small className="text-muted">{formatDate(item.timestamp)}</small>
            </div>
            <p className="text-secondary small mb-1">
              {item.remarks || 'No detailed remarks recorded.'}
            </p>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-light text-dark border small">
                <i className="bi bi-person-check me-1"></i>
                {item.updatedBy || 'Campus Administrator'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;
