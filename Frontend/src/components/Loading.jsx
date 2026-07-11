import "./Loading.css";

const Loading = () => {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-state__spinner" aria-hidden="true" />
      <div className="loading-state__content">
        <h3 className="loading-state__title">Loading your data</h3>
        <p className="loading-state__description">
          Please wait while we pull in your latest insights.
        </p>
      </div>
    </div>
  );
};

export default Loading;
