import { useEffect, useState } from "react";
import toast from "react-hot-toast";


interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    mode: "create" | "edit";
    initialData?: any;
}

const UserFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    mode,
    initialData
}: UserFormModalProps) => {

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "AGENT"
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (initialData) {

            setFormData({
                name: initialData.name || "",
                username: initialData.username || "",
                email: initialData.email || "",
                password: "",
                role: initialData.role || "AGENT"
            });
        } else {
            setFormData({
                name: '',
                username: '',
                email: '',
                password: '',
                role: 'AGENT'
            });
        }

    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {

        if (!formData.name.trim()) {
            toast.error("Name is required");
            return false;
        }

        if (!formData.username.trim()) {
            toast.error("Username is required");
            return false;
        }

        if (!formData.email.includes("@")) {
            toast.error("Invalid email");
            return false;
        }

        if (mode === "create" && formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }

        return true;
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!validateForm()) return;

        try {

            setLoading(true);

            await onSubmit(formData);

            toast.success(
                mode === "create"
                    ? "User created successfully"
                    : "User updated successfully"
            );

            onClose();

        } catch (error: any) {

            toast.error(
                error?.response?.data?.message ||
                "Error saving user"
            );

        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="modal-overlay">

            <div className="modal-card">

                <div className="modal-header">

                    <h2 className="modal-title">

                        {
                            mode === "create"
                                ? "Create User"
                                : "Edit User"
                        }

                    </h2>

                    <button
                        onClick={onClose}
                        className="modal-close"
                    >
                        ✕
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="modal-form"
                >

                    <div>
                        <label className="block mb-1 font-medium">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="modal-input"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="modal-input"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="modal-input"
                        />
                    </div>

                    {
                        mode === "create" && (

                            <div>
                                <label className="block mb-1 font-medium">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="modal-input"
                                />
                            </div>
                        )
                    }

                    <div>
                        <label className="block mb-1 font-medium">
                            Role
                        </label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="modal-select"
                        >
                            <option value="AGENT">
                                Agent
                            </option>

                            <option value="EXECUTIVE">
                                Executive
                            </option>

                            <option value="ADMIN">
                                Admin
                            </option>
                        </select>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="submit"
                            disabled={loading}
                            className="modal-button">

                            {
                                loading
                                    ? "Saving..."
                                    : mode === "create"
                                        ? "Create User"
                                        : "Save Changes"
                            }

                        </button>
                    </div>
                </form>

            </div>

        </div>
    );
};

export default UserFormModal;