import { useEffect, useState } from 'react';
import '../../../public/styles/modal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  mode: 'create' | 'edit';
  initialData?: any;
  clients: any[];
}

export default function SaleFormModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData,
  clients,
}: Props) {

  const [formData, setFormData] = useState({
    clientId: '',
    amount: '',
    description: '',
    saleDate: '',
  });

  const [documents, setDocuments] = useState<File[]>([]);


  useEffect(() => {

    if (initialData) {

      setFormData({
        clientId:
          typeof initialData.clientId === 'string'
            ? initialData.clientId
            : initialData.clientId?._id || '',

        amount:
          initialData.amount?.toString() || '',

        description:
          initialData.description || '',

        saleDate:
          initialData.saleDate
            ? initialData.saleDate.slice(0, 10)
            : '',
      });

      setDocuments([]);

    } else {

      setFormData({
        clientId: '',
        amount: '',
        description: '',
        saleDate: '',
      });

      setDocuments([]);
    }

  }, [initialData, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    await onSubmit({
      ...formData,
      amount: Number(formData.amount),
    });
  }

  return (
    <div className="modal-overlay">

      <div className="modal-card">

        <div className="modal-header">

          <h2 className="modal-title">
            {
              mode === 'create'
                ? 'Create Sale'
                : 'Edit Sale'
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
          className="modal-form"
          onSubmit={handleSubmit}
        >

          <select
            className="modal-select"
            value={formData.clientId}
            onChange={e =>
              setFormData({
                ...formData,
                clientId: e.target.value,
              })
            }
            required
          >
            <option value="">
              Select Client
            </option>

            {clients.map(client => (

              <option
                key={client._id}
                value={client._id}
              >
                {client.name}
              </option>

            ))}

          </select>

          <input
            className="modal-input"
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={e =>
              setFormData({
                ...formData,
                amount: e.target.value,
              })
            }
            required
          />

          <textarea
            className="modal-input"
            placeholder="Description"
            rows={4}
            value={formData.description}
            onChange={e =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />

          <input
            className="modal-input"
            type="date"
            value={formData.saleDate}
            onChange={e =>
              setFormData({
                ...formData,
                saleDate: e.target.value,
              })
            }
          />

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
              {
                mode === 'create'
                  ? 'Create Sale'
                  : 'Edit Sale'
              }
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}