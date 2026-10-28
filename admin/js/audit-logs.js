/**
 * BRANAPI ADMIN — AUDIT LOGS VIEWER
 * Real-time event auditing for OWASP ASVS compliance.
 */

const BranapiAuditLogs = (function () {
  'use strict';

  function renderLogs() {
    const tbody = document.getElementById('auditLogsTableBody');
    if (!tbody) return;

    let logs = [];
    try {
      logs = JSON.parse(localStorage.getItem('branapi_audit_logs') || '[]');
    } catch {}

    tbody.innerHTML = '';

    if (logs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--admin-muted); padding: 24px;">Nenhum evento de auditoria registrado no momento.</td></tr>`;
      return;
    }

    logs.slice(0, 50).forEach((entry) => {
      const tr = document.createElement('tr');
      const actionColor =
        entry.action === 'LOGIN_SUCCESS'
          ? 'var(--admin-success)'
          : entry.action.includes('FAIL') || entry.action.includes('LOCKOUT')
          ? 'var(--admin-danger)'
          : 'var(--admin-lime)';

      tr.innerHTML = `
        <td style="font-family: var(--admin-mono); font-size: 11px; color: var(--admin-muted);">${new Date(entry.timestamp).toLocaleString('pt-BR')}</td>
        <td style="font-family: var(--admin-mono); font-size: 11px; font-weight: 700; color: ${actionColor};">${entry.action}</td>
        <td style="font-family: var(--admin-mono); font-size: 11px; color: var(--admin-ice);">${JSON.stringify(entry.details || {})}</td>
        <td style="font-family: var(--admin-mono); font-size: 11px; color: var(--admin-muted);">hash-${(entry.id || 'sec').substring(0, 6)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  return {
    init: renderLogs,
    refresh: renderLogs
  };
})();
