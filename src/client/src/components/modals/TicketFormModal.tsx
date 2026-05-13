import { useEffect, useState } from 'react';
import '../../../public/styles/modal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  mode: 'create' | 'edit' | 'assign';
  initialData?: any;
  clients: any[];
  agents: any[];
}

export default function TicketFormModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData,
  clients,
  agents,
}: Props) {

    const [formData, setFormData] = useState({
    ticketId: '',
    requestName: '',
    clientId: '',
    assignedTo: '',
    status: 'PENDING',
    });

  useEffect(() => {

    if (initialData) {

        setFormData({

        ticketId:
            initialData.ticketId || '',

        requestName:
            initialData.requestName || '',

        clientId:
            typeof initialData.clientId === 'string'
            ? initialData.clientId
            : initialData.clientId?._id || '',

        assignedTo:
            typeof initialData.assignedTo === 'string'
            ? initialData.assignedTo
            : initialData.assignedTo?.name || '',

        status:
            initialData.status || 'PENDING',
        });

    } else {

        setFormData({
            ticketId: '',
            requestName: '',
            clientId: '',
            assignedTo: '',
            status: 'PENDING',
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
            {
              mode === 'create'
                ? 'Create Ticket'
                : mode === 'assign'
                  ? `Assign Ticket To: `
                  : 'Edit Ticket'
            }
          </h2>
          {
                mode === 'edit' &&
                formData.ticketId && (
                    <p
                    style={{
                        color: '#E8B13D',
                        marginBottom: '12px',
                        fontWeight: 700,
                    }}
                    >
                    {formData.ticketId}
                    </p>
                )
            }

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
          

          {
            mode !== 'assign' && (
              <>

                <input
                  className="modal-input"
                  placeholder="Request Name"
                  value={formData.requestName}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      requestName: e.target.value,
                    })
                  }
                  required
                />

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

              </>
            )
          }

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
              Select Agent
            </option>

            {agents.map(agent => (

              <option
                key={agent._id}
                value={agent.name}
              >
                {agent.name}
              </option>

            ))}

          </select>


          {
            mode !== 'assign' && (

              <select
                className="modal-select"
                value={formData.status}
                onChange={e =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
              >

                <option value="PENDING">
                  Pending
                </option>

                <option value="IN_PROCESS">
                  In Process
                </option>

                <option value="CLOSED">
                  Closed
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>

              </select>

            )
          }

          <div className="modal-footer">

            <button
              type="submit"
              className="modal-button"
            >
              {
                mode === 'create'
                  ? 'Create Ticket'
                  : 'Edit Ticket'
              }
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}