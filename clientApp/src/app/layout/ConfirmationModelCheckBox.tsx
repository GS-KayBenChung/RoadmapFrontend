import React from 'react';

type ConfirmModalCheckBoxProps = {
  actionType: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModalCheckBox: React.FC<ConfirmModalCheckBoxProps> = ({
  actionType,
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-1/3 p-6">
        <div className="text-lg font-semibold mb-4">
          {actionType === 'checkbox' ? (
            'Are you sure you want to change the checkbox state?'
          ) : (
            'Are you sure?'
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModalCheckBox;
