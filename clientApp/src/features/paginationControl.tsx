import { useState, useEffect } from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) => {
  return (
    <div className="flex justify-center mt-4">
      <button
        className="px-4 py-2 border rounded"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span className="px-4">{`${currentPage} / ${totalPages}`}</span>
      <button
        className="px-4 py-2 border rounded"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};
