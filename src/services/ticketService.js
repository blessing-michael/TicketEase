// src/services/ticketService.js
const TICKET_KEY = 'ticketapp_tickets';

function delay(ms = 200) {
    return new Promise(r => setTimeout(r, ms));
}

function readAll() {
    const raw = localStorage.getItem(TICKET_KEY);
    return raw ? JSON.parse(raw) : [];
}

function writeAll(arr) {
    localStorage.setItem(TICKET_KEY, JSON.stringify(arr));
}

export async function fetchTickets() {
    await delay();
    try {
        return readAll();
    } catch (e) {
        throw new Error('Failed to load tickets. Please retry.');
    }
}

export async function createTicket(payload) {
    await delay();
    // validation guard (title/status mandatory)
    if (!payload.title || !payload.status) {
        throw new Error('Title and status are required.');
    }
    if (!['open', 'in_progress', 'closed'].includes(payload.status)) {
        throw new Error('Status must be open, in_progress or closed.');
    }
    const arr = readAll();
    const id = Date.now().toString();
    const t = {
        id,
        title: payload.title,
        status: payload.status,
        description: payload.description || '',
        priority: payload.priority || 'low',
        createdAt: new Date().toISOString(),
    };
    arr.unshift(t);
    writeAll(arr);
    return t;
}

export async function updateTicket(id, updates) {
    await delay();
    const arr = readAll();
    const i = arr.findIndex(x => x.id === id);
    if (i === -1) throw new Error('Ticket not found');
    if (updates.status && !['open', 'in_progress', 'closed'].includes(updates.status)) {
        throw new Error('Status must be open, in_progress or closed.');
    }
    arr[i] = { ...arr[i], ...updates, updatedAt: new Date().toISOString() };
    writeAll(arr);
    return arr[i];
}

export async function deleteTicket(id) {
    await delay();
    let arr = readAll();
    arr = arr.filter(x => x.id !== id);
    writeAll(arr);
    return true;
}
