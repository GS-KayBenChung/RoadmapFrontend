import React from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({ isOpen, onConfirm, onCancel }: ConfirmDeleteModalProps){
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
        <p className="mb-4">This action cannot be undone.</p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded text-sm"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded text-sm"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};