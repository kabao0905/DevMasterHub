const SqlStudio = (() => {
  const SAMPLE_DB = {
    users: [
      { id: 1, name: 'Nguyễn Văn An', email: 'an.nguyen@devmaster.vn', role: 'Admin' },
      { id: 2, name: 'Trần Thị Bình', email: 'binh.tran@devmaster.vn', role: 'Developer' },
      { id: 3, name: 'Lê Hoàng Cường', email: 'cuong.le@devmaster.vn', role: 'DevOps' }
    ],
    orders: [
      { id: 101, user_id: 1, total_amount: 550000, status: 'Completed' },
      { id: 102, user_id: 2, total_amount: 1200000, status: 'Pending' },
      { id: 103, user_id: 1, total_amount: 890000, status: 'Completed' }
    ]
  };

  function renderStudio(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="sql-studio-layout">
        <!-- 1. TOP: Visual Schema ERD Diagram -->
        <div class="sql-erd-panel">
          <div class="sql-panel-header">
            <span>📊 Sơ Đồ Thực Thể Quan Hệ (Visual ERD Schema)</span>
          </div>
          <div class="sql-tables-erd">
            <div class="erd-table-card">
              <div class="erd-table-header">📁 users (Người dùng)</div>
              <div class="erd-field">🔑 <strong>id</strong> (INT, PK)</div>
              <div class="erd-field">📝 name (VARCHAR)</div>
              <div class="erd-field">✉️ email (VARCHAR, UNIQUE)</div>
              <div class="erd-field">🛡️ role (VARCHAR)</div>
            </div>
            <div class="erd-relation-arrow">➔ (1 : N) ➔</div>
            <div class="erd-table-card">
              <div class="erd-table-header">📁 orders (Đơn hàng)</div>
              <div class="erd-field">🔑 <strong>id</strong> (INT, PK)</div>
              <div class="erd-field">🔗 <strong>user_id</strong> (INT, FK)</div>
              <div class="erd-field">💵 total_amount (DECIMAL)</div>
              <div class="erd-field">📦 status (VARCHAR)</div>
            </div>
          </div>
        </div>

        <!-- 2. MIDDLE: Interactive SQL Query Editor -->
        <div class="sql-editor-panel">
          <div class="sql-panel-header">
            <span>✍️ Trình Viết Truy Vấn SQL (Query Editor)</span>
            <button class="sql-run-btn" onclick="SqlStudio.runQuery()">▶️ Thực Thi SQL</button>
          </div>
          <textarea class="sql-query-input" id="sql-query-text" rows="3">SELECT u.id, u.name, u.email, COUNT(o.id) AS total_orders, SUM(o.total_amount) AS total_spent\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name, u.email;</textarea>
        </div>

        <!-- 3. BOTTOM: Query Result Table -->
        <div class="sql-result-panel">
          <div class="sql-panel-header">
            <span>📋 Bảng Kết Quả Truy Vấn (Data Result)</span>
          </div>
          <div class="sql-table-container" id="sql-table-result">
            ${renderResultTable()}
          </div>
        </div>
      </div>
    `;
  }

  function renderResultTable() {
    return `
      <table class="sql-data-table">
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>email</th>
            <th>total_orders</th>
            <th>total_spent</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Nguyễn Văn An</td>
            <td>an.nguyen@devmaster.vn</td>
            <td><strong>2</strong></td>
            <td><strong>1,440,000 đ</strong></td>
          </tr>
          <tr>
            <td>2</td>
            <td>Trần Thị Bình</td>
            <td>binh.tran@devmaster.vn</td>
            <td><strong>1</strong></td>
            <td><strong>1,200,000 đ</strong></td>
          </tr>
          <tr>
            <td>3</td>
            <td>Lê Hoàng Cường</td>
            <td>cuong.le@devmaster.vn</td>
            <td><strong>0</strong></td>
            <td><strong>0 đ</strong></td>
          </tr>
        </tbody>
      </table>
    `;
  }

  function runQuery() {
    const resEl = document.getElementById('sql-table-result');
    if (!resEl) return;
    resEl.innerHTML = '<div style="padding:14px;color:#58a6ff">⚡ Đang thực thi câu lệnh SQL...</div>';
    setTimeout(() => {
      resEl.innerHTML = renderResultTable();
    }, 150);
  }

  return {
    renderStudio,
    runQuery
  };
})();

if (typeof window !== 'undefined') {
  window.SqlStudio = SqlStudio;
}
