"use client";

export default function Error() {
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center">
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => refreshPage()
        }
      >
        Try again
      </button>
    </div>
  );
}
