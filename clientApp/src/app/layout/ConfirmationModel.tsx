// interface ConfirmModalProps {
//   isOpen: boolean;
//   actionType: 'delete' | 'publish' | "adjustDate";
//   onConfirm: () => void;
//   onCancel: () => void;
// }

// export default function ConfirmModal({ isOpen, actionType, onConfirm, onCancel }: ConfirmModalProps) {
//   if (!isOpen) return null;

//   // Determine the action-specific messages
//   const actionMessages = {
//     delete: {
//       title: 'Are you sure you want to delete?',
//       message: 'This action cannot be undone.',
//       confirmText: 'Delete',
//       confirmClass: 'bg-red-500 text-white',
//     },
//     publish: {
//       title: 'Are you sure you want to publish?',
//       message: 'Once published, it cannot be reverted to draft.',
//       confirmText: 'Publish',
//       confirmClass: 'bg-blue-500 text-white',
//     },
//     adjustDate: {
//       title: "Adjust Task Dates?",
//       message: "Do you want to adjust all subsequent tasks accordingly?",
//       confirmText: "Yes, Adjust",
//       confirmClass: "bg-green-500 text-white",
//     },
//   };

//   const { title, message, confirmText, confirmClass } = actionMessages[actionType];

//   return (
//     <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded shadow-lg w-1/3">
//         <h2 className="text-lg font-bold mb-4">{title}</h2>
//         <p className="mb-4">{message}</p>
//         <div className="flex justify-end space-x-4">
//           <button
//             className="bg-gray-300 px-4 py-2 rounded text-sm"
//             onClick={onCancel}
//           >
//             Cancel
//           </button>
//           <button
//             className={`${confirmClass} px-4 py-2 rounded text-sm`}
//             onClick={onConfirm}
//           >
//             {confirmText}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


interface ConfirmModalProps {
  isOpen: boolean;
  actionType: "delete" | "publish" | "adjustDate"; // Added "adjust" action type
  message?: string; // Allow custom messages
  confirmText?: string; // Allow custom confirm button text
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  actionType,
  message,
  confirmText,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  // Define default action-specific messages
  const actionMessages = {
    delete: {
      title: "Are you sure you want to delete?",
      message: "This action cannot be undone.",
      confirmText: "Delete",
      confirmClass: "bg-red-500 text-white",
    },
    publish: {
      title: "Are you sure you want to publish?",
      message: "Once published, it cannot be reverted to draft.",
      confirmText: "Publish",
      confirmClass: "bg-blue-500 text-white",
    },
    adjustDate: {
      title: "Adjust Task Dates?",
      message: message || "Do you want to adjust all subsequent tasks accordingly?",
      confirmText: confirmText || "Yes, Adjust",
      confirmClass: "bg-green-500 text-white",
    },
  };

  const { title, confirmClass } = actionMessages[actionType];
  const modalMessage = message || actionMessages[actionType].message;
  const modalConfirmText = confirmText || actionMessages[actionType].confirmText;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <p className="mb-4">{modalMessage}</p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded text-sm"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`${confirmClass} px-4 py-2 rounded text-sm`}
            onClick={onConfirm}
          >
            {modalConfirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
