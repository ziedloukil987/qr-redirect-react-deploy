import React from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function ThankYouPage() {
  const [searchParams] = useSearchParams();
  const nextUrl = searchParams.get("next");

  useEffect(() => {
    if (!nextUrl) return;

    const timer = setTimeout(() => {
      window.location.href = nextUrl;
    }, 1500);

    return () => clearTimeout(timer);
  }, [nextUrl]);

  return (
    <div className="page">
      <div className="card">
        <h1>Thank you</h1>
        <p>Your information has been saved.</p>
        <p>Redirecting...</p>
        {nextUrl && (
          <p>
            If nothing happens, <a href={nextUrl}>click here</a>.
          </p>
        )}
      </div>
    </div>
  );
}
