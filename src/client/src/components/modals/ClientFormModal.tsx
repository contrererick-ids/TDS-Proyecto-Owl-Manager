import { useEffect, useState } from 'react';
import '../../../public/styles/modal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  mode: 'create' | 'edit';
  initialData?: any;
  executives: any[];
}

export default function ClientFormModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData,
  executives,
}: Props) {

    const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    assignedTo: 
      initialData?.assignedTo?._id ||
      initialData?.assignedTo ||
      '',
    });
    
    const [documents, setDocuments] = useState<File[]>([]);


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
      setDocuments([]);

    } else {

      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        assignedTo: '',
      });

      setDocuments([]);
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

          <select
            className="modal-select"
            value={formData.assignedTo}
            onChange={e =>
              setFormData({
                ...formData,
                assignedTo: e.target.value,
              })
            }
          >

            <option value="">
              Elige Ejecutivo
            </option>

            {executives.map(exec => (

              <option
                key={exec._id}
                value={exec._id}
              >
                {exec.name}
              </option>

            ))}

          </select>
          
          <div className="documents-section">

            <label className="documents-label">
              Documents
            </label>

            <div className="documents-upload">

              <label className="upload-button">

                Choose Files

                <input
                  type="file"
                  multiple
                  hidden
                  onChange={(e) => {

                    if (!e.target.files) return;

                    setDocuments(
                      Array.from(e.target.files)
                    );
                  }}
                />

              </label>

              {
                documents.length > 0 && (

                  <div className="documents-list">

                    {documents.map((file, index) => (

                      <div
                        key={index}
                        className="document-item"
                      >

                        <span className="document-name">
                          {file.name}
                        </span>

                        <button
                          type="button"
                          className="remove-document"
                          onClick={() =>
                            setDocuments(prev =>
                              prev.filter(
                                (_, i) => i !== index
                              )
                            )
                          }
                        >
                          ×
                        </button>

                      </div>

                    ))}

                  </div>
                )
              }

            </div>

          </div>

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