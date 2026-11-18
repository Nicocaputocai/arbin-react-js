import React from "react";

export const Stepper = ({ steps, currentStep }) => {
  const progressPercent = Math.round((currentStep / steps.length) * 100);

  return (
    <div className="px-2 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="fw-bold text-success" style={{ fontSize: "0.95rem" }}>
          Paso {currentStep} de {steps.length}: {steps[currentStep - 1]}
        </span>
        <span className="small text-muted fw-semibold">{progressPercent}%</span>
      </div>
      <div className="progress" style={{ height: "8px", borderRadius: "10px" }}>
        <div
          className="progress-bar bg-success"
          role="progressbar"
          style={{
            width: `${progressPercent}%`,
            transition: "width 0.3s ease",
          }}
          aria-valuenow={progressPercent}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
};