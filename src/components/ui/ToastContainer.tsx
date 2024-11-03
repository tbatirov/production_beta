import React from 'react';
import Toast, { ToastProps } from './Toast';

export default function ToastContainer({ toasts }: { toasts: ToastProps[] }) {
  return (
    <div className="fixed bottom-0 right-0 z-50 m-8 flex flex-col space-y-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}