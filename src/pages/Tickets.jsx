// src/pages/Tickets.jsx
import React, { useEffect, useState } from 'react';
import { fetchTickets, createTicket, updateTicket, deleteTicket } from '../services/ticketService';
import { toast } from 'react-toastify';
import { getSession, logout } from "../services/authService";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";




const allowedStatuses = ['open', 'in_progress', 'closed'];

function TicketCard({ t, onEdit, onDelete }) {
    const statusColor = t.status === 'open' ? '#16A34A' : t.status === 'in_progress' ? '#D97706' : '#6B7280';

    return (
        <div
            className="card"
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px',
                width: "100%",
                boxSizing: "border-box",
                overflow: "hidden"
            }}
        >

            {/* LEFT SIDE */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0 }}>{t.title}</h3>
                    <span style={{
                        padding: '4px 8px',
                        borderRadius: 999,
                        background: statusColor + '20',
                        color: statusColor,
                        fontSize: 12,
                        whiteSpace: "nowrap"
                    }}>
                        {t.status.replace('_', ' ')}
                    </span>
                </div>

                {t.description && (
                    <p style={{
                        marginTop: 8,
                        color: '#444',
                        wordBreak: "break-word",
                        overflowWrap: "break-word"
                    }}>
                        {t.description}
                    </p>
                )}

                <div style={{ fontSize: 12, color: '#888' }}>
                    Created: {new Date(t.createdAt).toLocaleString()}
                </div>
            </div>

            {/* RIGHT SIDE BUTTONS (ALWAYS STAYS RIGHT) */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                flexShrink: 0,
                alignItems: 'flex-end'
            }}>
                <button className="btn" style={{
                    borderColor: '#ec9706',
                    color: '#ec9706',
                    backgroundColor: '#fff',   // ✅ white background
                    padding: '6px 12px',
                }} onClick={() => onEdit(t)}>Edit</button>
                <button className="btn" style={{ borderColor: '#e53e3e', color: '#e53e3e' }} onClick={() => onDelete(t.id)}>Delete</button>
            </div>

        </div>
    );
}


function TicketForm({ initial = {}, onCancel, onSave }) {
    const [title, setTitle] = useState(initial.title || '');
    const [status, setStatus] = useState(initial.status || 'open');
    const [description, setDescription] = useState(initial.description || '');
    const [priority, setPriority] = useState(initial.priority || 'low');
    const [errors, setErrors] = useState({});

    function validate() {
        const e = {};
        if (!title || title.trim().length < 3) e.title = 'Title must be at least 3 characters.';
        if (!status || !allowedStatuses.includes(status)) e.status = 'Status must be open, in_progress or closed.';
        if (description && description.length > 2000) e.description = 'Description is too long.';
        if (priority && !['low', 'medium', 'high'].includes(priority)) e.priority = 'Invalid priority.';
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function submit(ev) {
        ev.preventDefault();
        if (!validate()) return;
        await onSave({ title: title.trim(), status, description: description.trim(), priority });
    }

    return (
        <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
            <label>
                <div className="label">Title *</div>
                <input value={title} onChange={e => setTitle(e.target.value)} />
                {errors.title && <div className="error">{errors.title}</div>}
            </label>

            <label>
                <div className="label">Status *</div>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="open">Open</option>
                    <option value="in_progress">In progress</option>
                    <option value="closed">Closed</option>
                </select>
                {errors.status && <div className="error">{errors.status}</div>}
            </label>

            <label>
                <div className="label">Description</div>
                <textarea value={description} rows={4} onChange={e => setDescription(e.target.value)} />
                {errors.description && <div className="error">{errors.description}</div>}
            </label>

            <label>
                <div className="label">Priority</div>
                <select value={priority} onChange={e => setPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </label>

            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <button className="btn primary" type="submit">Save</button>
                <button type="button" className="btn" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
}

export default function TicketsPage() {
    const nav = useNavigate();
    const session = getSession();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState(null);

    async function load() {
        setLoading(true);
        try {
            const data = await fetchTickets();
            setTickets(data);
        } catch (err) {
            toast.error(err.message || 'Failed to load tickets. Please retry.');
        } finally {
            setLoading(false);
        }
    }

    // ✅ Session enforcement
    useEffect(() => {
        if (!session) {
            toast.error("Your session has expired — please log in again.");
            logout();
            nav("/auth/login", { replace: true });
        }
    }, [session, nav]);

    useEffect(() => { load(); }, []);


    async function handleCreate(payload) {
        try {
            const t = await createTicket(payload);
            setTickets(prev => [t, ...prev]);
            toast.success('Ticket created');
            setShowCreate(false);
        } catch (err) {
            toast.error(err.message || 'Failed to create ticket');
        }
    }

    async function handleUpdate(id, payload) {
        try {
            const t = await updateTicket(id, payload);
            setTickets(prev => prev.map(x => x.id === id ? t : x));
            toast.success('Ticket updated');
            setEditing(null);
        } catch (err) {
            toast.error(err.message || 'Failed to update ticket');
        }
    }

    async function handleDelete(id) {
        if (!confirm('Delete this ticket?')) return;
        try {
            await deleteTicket(id);
            setTickets(prev => prev.filter(x => x.id !== id));
            toast.success('Ticket deleted');
        } catch (err) {
            toast.error(err.message || 'Failed to delete ticket');
        }
    }

    return (
        <>
            <Header />
            <div style={{ width: "100%", overflowX: "hidden", marginBottom: "6rem" }}>
                {/* ✅ Hero Section */}
                <section style={{ position: "relative", textAlign: "center", padding: "80px 0 120px", background: "#F3F4F6" }}>
                    <h1 style={{ margin: 0, fontSize: "42px", fontWeight: 700 }}>Ticket Management</h1>
                    <div style={{
                        position: "absolute",
                        width: "140px",
                        height: "140px",
                        borderRadius: "50%",
                        background: "rgba(0, 153, 255, 0.15)",
                        top: "20px",
                        right: "10%",
                        zIndex: 1
                    }}></div>
                    <svg viewBox="0 0 1440 120" style={{ position: "absolute", bottom: 0, left: 0, width: "100%" }}>
                        <path fill="#ffffff" d="M0,32L1440,96L1440,0L0,0Z"></path>
                    </svg>
                </section>



                {/* ✅ The Main Ticket Content */}
                <div
                    className="page-container"
                    style={{
                        maxWidth: "1440px",
                        width: "100%",
                        margin: "0 auto",
                        padding: "0 16px",  // ✅ smaller padding for small screens
                        boxSizing: "border-box",
                        overflowX: "hidden" // ✅ 
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "12px"
                        }}
                    >
                        <h1 style={{ margin: 0 }}>Tickets</h1>

                        {/* ✅ Make button responsive */}
                        <button
                            className="btn primary"
                            style={{ flexShrink: 0, padding: "10px 20px", width: "100%", maxWidth: "200px" }}
                            onClick={() => { setShowCreate(s => !s); setEditing(null); }}
                        >
                            {showCreate ? "Close" : "New Ticket"}
                        </button>
                    </div>



                    {showCreate && (
                        <div style={{ marginTop: 12 }}>
                            <div className="card">
                                <TicketForm onCancel={() => setShowCreate(false)} onSave={handleCreate} />
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
                        {loading && <div>Loading tickets...</div>}
                        {!loading && tickets.length === 0 && <div className="muted">No tickets yet — create one.</div>}
                        {!loading && tickets.map(t => (
                            <TicketCard key={t.id} t={t} onEdit={(x) => { setEditing(x); setShowCreate(false); }} onDelete={handleDelete} />
                        ))}
                    </div>

                    {editing && (
                        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                            <div style={{ width: 'min(760px,100%)' }}>
                                <div className="card">
                                    <h3>Edit ticket</h3>
                                    <TicketForm initial={editing} onCancel={() => setEditing(null)} onSave={(payload) => handleUpdate(editing.id, payload)} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </>

    );
}
