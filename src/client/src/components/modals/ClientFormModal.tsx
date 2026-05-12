import { useEffect, useState } from 'react';
import '../../../public/styles/modal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  mode: 'create' | 'edit';
  initialData?: any;
}

export default function ClientFormModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData,
}: Props) {

    const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    assignedTo: '',
    });

  useEffect(() => {

    if (initialData) {

      setFormData({
        name: initialData.name || '',
        company: initialData.company || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        assignedTo:
            typeof initialData.assignedTo === 'string'
                ? initialData.assignedTo
                : initialData.assignedTo?.name || '',
      });

    } else {

      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        assignedTo: '',
      });
    }

  }, [initialData, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    await onSubmit(formData);
  }

  return (
    <div className="modal-overlay">

      <div className="modal-card">

        <div className="modal-header">

          <h2 className="modal-title">
            {mode === 'create'
              ? 'Create Client'
              : 'Edit Client'}
          </h2>

          <button
            onClick={onClose}
            className="modal-close"
          >
            ✕
          </button>

        </div>

        <form
          className="modal-form"
          onSubmit={handleSubmit}
        >

          <input
            className="modal-input"
            placeholder="Full Name"
            value={formData.name}
            onChange={e =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            required
          />

          <input
            className="modal-input"
            placeholder="Company"
            value={formData.company}
            onChange={e =>
              setFormData({
                ...formData,
                company: e.target.value,
              })
            }
          />

          <input
            className="modal-input"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={e =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />

          <input
            className="modal-input"
            placeholder="Phone"
            value={formData.phone}
            onChange={e =>
              setFormData({
                ...formData,
                phone: e.target.value,
              })
            }
          />


          <input
            className="modal-input"
            placeholder="Assigned Executive Name"
            value={formData.assignedTo}
            onChange={e =>
                setFormData({
                ...formData,
                assignedTo: e.target.value,
                })
            }
            required
           />

          <div className="modal-footer">

            <button
              type="submit"
              className="modal-button"
            >
              {mode === 'create'
                ? 'Create Client'
                : 'Save Changes'}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}