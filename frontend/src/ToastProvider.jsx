import { createContext, useContext, useState, useCallback } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

export const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

let nextId = 0;

function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, variant = "success", detail = null) => {
        const id = ++nextId;
        setToasts((prev) => [...prev, { id, message, variant, detail }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1100 }}>
                {toasts.map(({ id, message, variant, detail }) => (
                    <Toast
                        key={id}
                        bg={variant}
                        autohide
                        delay={6000}
                        onClose={() => removeToast(id)}
                    >
                        <Toast.Body className="text-white d-flex align-items-start gap-2">
                            <span className="me-auto">
                                {message}
                                {detail && <><br /><small className="opacity-75">{detail}</small></>}
                            </span>
                            <button
                                type="button"
                                className="btn-close btn-close-white flex-shrink-0"
                                aria-label="Zavřít"
                                onClick={() => removeToast(id)}
                            />
                        </Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
}

export default ToastProvider;
