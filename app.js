// Personal Finance Manager Application
class FinanceManager {
    constructor() {
        this.data = {
            monthly_income: [],
            savings_categories: [],
            emi_for_friends: [],
            money_received: [],
            money_lending: [],
            money_borrowing: []
        };
        
        this.categories = {
            savings: ["Emergency Fund", "Vacation", "Investment", "Education", "Home Purchase", "Retirement", "Healthcare", "Entertainment", "Custom"],
            income: ["Primary Income", "Secondary Income", "Bonus", "Investment Returns", "Other"],
            payment_methods: ["Cash", "Bank Transfer", "UPI", "Credit Card", "Debit Card", "Check", "Other"],
            status_options: ["Active", "Partially Paid", "Fully Paid", "Overdue", "Cancelled"]
        };
        
        this.currentEditId = null;
        this.currentEditType = null;
        this.currentTab = 'dashboard';
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.initializeEventListeners();
        this.renderAllTabs();
        this.updateDashboard();
    }
    
    // Data Management
    loadData() {
        const savedData = localStorage.getItem('financeManagerData');
        if (savedData) {
            this.data = JSON.parse(savedData);
        } else {
            // Initialize with sample data
            this.initializeSampleData();
        }
    }
    
    saveData() {
        localStorage.setItem('financeManagerData', JSON.stringify(this.data));
    }
    
    initializeSampleData() {
        this.data = {
            monthly_income: [
                {id: 1, amount: 50000, source: "Salary", date: "2025-08-01", category: "Primary Income"},
                {id: 2, amount: 5000, source: "Freelance", date: "2025-08-15", category: "Secondary Income"}
            ],
            savings_categories: [
                {id: 1, category_name: "Emergency Fund", target_amount: 100000, current_amount: 45000, monthly_contribution: 10000, deadline: "2025-12-31"},
                {id: 2, category_name: "Vacation", target_amount: 30000, current_amount: 15000, monthly_contribution: 5000, deadline: "2025-10-31"},
                {id: 3, category_name: "Investment", target_amount: 200000, current_amount: 80000, monthly_contribution: 15000, deadline: "2026-06-30"}
            ],
            emi_for_friends: [
                {id: 1, friend_name: "John", loan_amount: 100000, emi_amount: 5000, start_date: "2025-01-01", end_date: "2026-08-01", remaining_emis: 12, purpose: "Personal Loan", status: "Active"},
                {id: 2, friend_name: "Sarah", loan_amount: 50000, emi_amount: 2500, start_date: "2025-03-01", end_date: "2026-02-01", remaining_emis: 6, purpose: "Education Loan", status: "Active"}
            ],
            money_received: [
                {id: 1, friend_name: "John", amount_received: 5000, date_received: "2025-08-01", payment_method: "Bank Transfer", purpose: "EMI Payment"},
                {id: 2, friend_name: "Sarah", amount_received: 2500, date_received: "2025-08-01", payment_method: "Cash", purpose: "EMI Payment"}
            ],
            money_lending: [
                {id: 1, borrower_name: "Mike", loan_amount: 25000, date_lent: "2025-07-01", due_date: "2025-12-01", interest_rate: 5, status: "Active", purpose: "Business Investment"},
                {id: 2, borrower_name: "Lisa", loan_amount: 15000, date_lent: "2025-06-15", due_date: "2025-11-15", interest_rate: 0, status: "Active", purpose: "Emergency"}
            ],
            money_borrowing: [
                {id: 1, lender_name: "Dad", borrowed_amount: 75000, date_borrowed: "2025-05-01", due_date: "2026-05-01", interest_rate: 0, status: "Active", purpose: "Home Down Payment"}
            ]
        };
        this.saveData();
    }
    
    // Event Listeners
    initializeEventListeners() {
        // Tab navigation with proper event handling
        const tabElements = document.querySelectorAll('.nav-tab');
        tabElements.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const tabName = tab.getAttribute('data-tab');
                console.log('Tab clicked:', tabName); // Debug log
                this.switchTab(tabName);
            });
        });
        
        // Modal management
        const modalCloseBtn = document.getElementById('modal-close-btn');
        const modalCancelBtn = document.getElementById('modal-cancel-btn');
        const modalSaveBtn = document.getElementById('modal-save-btn');
        const modalOverlay = document.getElementById('modal-overlay');
        
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal();
        });
        
        if (modalCancelBtn) modalCancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal();
        });
        
        if (modalSaveBtn) modalSaveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.saveModalData();
        });
        
        if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') {
                this.closeModal();
            }
        });
        
        // Add buttons with proper event handling
        const addIncomeBtn = document.getElementById('add-income-btn');
        const addSavingsBtn = document.getElementById('add-savings-btn');
        const addEmiBtn = document.getElementById('add-emi-btn');
        const addMoneyReceivedBtn = document.getElementById('add-money-received-btn');
        const addLendingBtn = document.getElementById('add-lending-btn');
        const addBorrowingBtn = document.getElementById('add-borrowing-btn');
        
        if (addIncomeBtn) addIncomeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.openIncomeModal();
        });
        
        if (addSavingsBtn) addSavingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.openSavingsModal();
        });
        
        if (addEmiBtn) addEmiBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.openEMIModal();
        });
        
        if (addMoneyReceivedBtn) addMoneyReceivedBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.openMoneyReceivedModal();
        });
        
        if (addLendingBtn) addLendingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.openLendingModal();
        });
        
        if (addBorrowingBtn) addBorrowingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.openBorrowingModal();
        });
        
        // Export buttons
        const exportButtons = [
            { id: 'export-income', type: 'income' },
            { id: 'export-savings', type: 'savings' },
            { id: 'export-emi', type: 'emi' },
            { id: 'export-lending', type: 'lending' },
            { id: 'export-borrowing', type: 'borrowing' }
        ];
        
        exportButtons.forEach(btn => {
            const element = document.getElementById(btn.id);
            if (element) {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.exportData(btn.type);
                });
            }
        });
        
        // Import functionality
        const importBtn = document.getElementById('import-data-btn');
        if (importBtn) {
            importBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.importData();
            });
        }
    }
    
    // Tab Management
    switchTab(tabName) {
        console.log('Switching to tab:', tabName); // Debug log
        
        // Update current tab
        this.currentTab = tabName;
        
        // Update active tab visual state
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // Show corresponding content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const activeContent = document.getElementById(`${tabName}-tab`);
        if (activeContent) {
            activeContent.classList.add('active');
        }
        
        // Render tab content
        this.renderTab(tabName);
    }
    
    renderTab(tabName) {
        switch(tabName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'income':
                this.renderIncomeTable();
                break;
            case 'savings':
                this.renderSavingsCategories();
                break;
            case 'emi':
                this.renderEMITables();
                break;
            case 'lending':
                this.renderLendingTables();
                break;
            case 'settings':
                // Settings tab doesn't need special rendering
                break;
        }
    }
    
    renderAllTabs() {
        this.renderIncomeTable();
        this.renderSavingsCategories();
        this.renderEMITables();
        this.renderLendingTables();
    }
    
    // Dashboard
    updateDashboard() {
        // Calculate total income
        const totalIncome = this.data.monthly_income.reduce((sum, income) => sum + income.amount, 0);
        const totalIncomeEl = document.getElementById('total-income');
        if (totalIncomeEl) totalIncomeEl.textContent = `₹${totalIncome.toLocaleString()}`;
        
        // Calculate savings progress
        const savingsProgress = this.calculateSavingsProgress();
        const savingsProgressEl = document.getElementById('savings-progress');
        const savingsProgressBarEl = document.getElementById('savings-progress-bar');
        if (savingsProgressEl) savingsProgressEl.textContent = `${savingsProgress.toFixed(1)}%`;
        if (savingsProgressBarEl) savingsProgressBarEl.style.width = `${savingsProgress}%`;
        
        // Calculate EMI outstanding
        const emiOutstanding = this.data.emi_for_friends
            .filter(emi => emi.status === 'Active')
            .reduce((sum, emi) => sum + (emi.emi_amount * emi.remaining_emis), 0);
        const emiOutstandingEl = document.getElementById('emi-outstanding');
        if (emiOutstandingEl) emiOutstandingEl.textContent = `₹${emiOutstanding.toLocaleString()}`;
        
        // Calculate lending balance
        const lendingBalance = this.data.money_lending
            .filter(loan => loan.status === 'Active')
            .reduce((sum, loan) => sum + loan.loan_amount, 0);
        const lendingBalanceEl = document.getElementById('lending-balance');
        if (lendingBalanceEl) lendingBalanceEl.textContent = `₹${lendingBalance.toLocaleString()}`;
        
        // Calculate borrowing balance
        const borrowingBalance = this.data.money_borrowing
            .filter(loan => loan.status === 'Active')
            .reduce((sum, loan) => sum + loan.borrowed_amount, 0);
        const borrowingBalanceEl = document.getElementById('borrowing-balance');
        if (borrowingBalanceEl) borrowingBalanceEl.textContent = `₹${borrowingBalance.toLocaleString()}`;
    }
    
    calculateSavingsProgress() {
        if (this.data.savings_categories.length === 0) return 0;
        
        const totalProgress = this.data.savings_categories.reduce((sum, category) => {
            const progress = (category.current_amount / category.target_amount) * 100;
            return sum + Math.min(progress, 100);
        }, 0);
        
        return totalProgress / this.data.savings_categories.length;
    }
    
    // Income Management
    renderIncomeTable() {
        const tbody = document.querySelector('#income-table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        this.data.monthly_income.forEach(income => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(income.date).toLocaleDateString()}</td>
                <td>${income.source}</td>
                <td>${income.category}</td>
                <td>₹${income.amount.toLocaleString()}</td>
                <td>
                    <button class="btn btn--sm btn--outline action-btn" onclick="window.financeManager.editIncome(${income.id})">Edit</button>
                    <button class="btn btn--sm btn--outline action-btn" onclick="window.financeManager.deleteIncome(${income.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    openIncomeModal(incomeId = null) {
        this.currentEditId = incomeId;
        this.currentEditType = 'income';
        
        const income = incomeId ? this.data.monthly_income.find(i => i.id === incomeId) : null;
        
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        if (modalTitle) modalTitle.textContent = incomeId ? 'Edit Income' : 'Add Income';
        
        if (modalBody) {
            modalBody.innerHTML = `
                <form class="modal-form">
                    <div class="form-group">
                        <label class="form-label">Amount</label>
                        <input type="number" id="income-amount" class="form-control" required value="${income?.amount || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Source</label>
                        <input type="text" id="income-source" class="form-control" required value="${income?.source || ''}">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Date</label>
                            <input type="date" id="income-date" class="form-control" required value="${income?.date || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Category</label>
                            <select id="income-category" class="form-control" required>
                                ${this.categories.income.map(cat => 
                                    `<option value="${cat}" ${income?.category === cat ? 'selected' : ''}>${cat}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                </form>
            `;
        }
        
        this.showModal();
    }
    
    editIncome(id) {
        this.openIncomeModal(id);
    }
    
    deleteIncome(id) {
        if (confirm('Are you sure you want to delete this income entry?')) {
            this.data.monthly_income = this.data.monthly_income.filter(income => income.id !== id);
            this.saveData();
            this.renderIncomeTable();
            this.updateDashboard();
        }
    }
    
    // Savings Management
    renderSavingsCategories() {
        const container = document.getElementById('savings-categories');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.data.savings_categories.forEach(category => {
            const progress = (category.current_amount / category.target_amount) * 100;
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'card savings-category';
            categoryDiv.innerHTML = `
                <div class="card__body">
                    <div class="savings-header">
                        <h3>${category.category_name}</h3>
                        <div class="button-group">
                            <button class="btn btn--sm btn--outline" onclick="window.financeManager.editSavings(${category.id})">Edit</button>
                            <button class="btn btn--sm btn--outline" onclick="window.financeManager.deleteSavings(${category.id})">Delete</button>
                        </div>
                    </div>
                    <div class="savings-progress">
                        <div class="savings-stat">
                            <div class="savings-stat-label">Current</div>
                            <div class="savings-stat-value">₹${category.current_amount.toLocaleString()}</div>
                        </div>
                        <div class="savings-stat">
                            <div class="savings-stat-label">Target</div>
                            <div class="savings-stat-value">₹${category.target_amount.toLocaleString()}</div>
                        </div>
                        <div class="savings-stat">
                            <div class="savings-stat-label">Monthly</div>
                            <div class="savings-stat-value">₹${category.monthly_contribution.toLocaleString()}</div>
                        </div>
                        <div class="savings-stat">
                            <div class="savings-stat-label">Progress</div>
                            <div class="savings-stat-value">${progress.toFixed(1)}%</div>
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                    </div>
                    <p style="margin-top: var(--space-8); font-size: var(--font-size-sm); color: var(--color-text-secondary);">
                        Deadline: ${new Date(category.deadline).toLocaleDateString()}
                    </p>
                </div>
            `;
            container.appendChild(categoryDiv);
        });
    }
    
    openSavingsModal(savingsId = null) {
        this.currentEditId = savingsId;
        this.currentEditType = 'savings';
        
        const savings = savingsId ? this.data.savings_categories.find(s => s.id === savingsId) : null;
        
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        if (modalTitle) modalTitle.textContent = savingsId ? 'Edit Savings Goal' : 'Add Savings Goal';
        
        if (modalBody) {
            modalBody.innerHTML = `
                <form class="modal-form">
                    <div class="form-group">
                        <label class="form-label">Category Name</label>
                        <select id="savings-category" class="form-control" required>
                            ${this.categories.savings.map(cat => 
                                `<option value="${cat}" ${savings?.category_name === cat ? 'selected' : ''}>${cat}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Target Amount</label>
                            <input type="number" id="savings-target" class="form-control" required value="${savings?.target_amount || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Current Amount</label>
                            <input type="number" id="savings-current" class="form-control" required value="${savings?.current_amount || ''}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Monthly Contribution</label>
                            <input type="number" id="savings-monthly" class="form-control" required value="${savings?.monthly_contribution || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Deadline</label>
                            <input type="date" id="savings-deadline" class="form-control" required value="${savings?.deadline || ''}">
                        </div>
                    </div>
                </form>
            `;
        }
        
        this.showModal();
    }
    
    editSavings(id) {
        this.openSavingsModal(id);
    }
    
    deleteSavings(id) {
        if (confirm('Are you sure you want to delete this savings goal?')) {
            this.data.savings_categories = this.data.savings_categories.filter(savings => savings.id !== id);
            this.saveData();
            this.renderSavingsCategories();
            this.updateDashboard();
        }
    }
    
    // EMI Management
    renderEMITables() {
        // Render EMI table
        const emiTbody = document.querySelector('#emi-table tbody');
        if (emiTbody) {
            emiTbody.innerHTML = '';
            
            this.data.emi_for_friends.forEach(emi => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${emi.friend_name}</td>
                    <td>₹${emi.loan_amount.toLocaleString()}</td>
                    <td>₹${emi.emi_amount.toLocaleString()}</td>
                    <td>${emi.remaining_emis}</td>
                    <td><span class="status status--${emi.status.toLowerCase()}">${emi.status}</span></td>
                    <td>
                        <button class="btn btn--sm btn--outline action-btn" onclick="window.financeManager.editEMI(${emi.id})">Edit</button>
                        <button class="btn btn--sm btn--outline action-btn" onclick="window.financeManager.deleteEMI(${emi.id})">Delete</button>
                    </td>
                `;
                emiTbody.appendChild(row);
            });
        }
        
        // Render money received table
        const receivedTbody = document.querySelector('#money-received-table tbody');
        if (receivedTbody) {
            receivedTbody.innerHTML = '';
            
            this.data.money_received.forEach(received => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(received.date_received).toLocaleDateString()}</td>
                    <td>${received.friend_name}</td>
                    <td>₹${received.amount_received.toLocaleString()}</td>
                    <td>${received.payment_method}</td>
                    <td>${received.purpose}</td>
                    <td>
                        <button class="btn btn--sm btn--outline action-btn" onclick="window.financeManager.editMoneyReceived(${received.id})">Edit</button>
                        <button class="btn btn--sm btn--outline action-btn" onclick="window.financeManager.deleteMoneyReceived(${received.id})">Delete</button>
                    </td>
                `;
                receivedTbody.appendChild(row);
            });
        }
    }
    
    openEMIModal(emiId = null) {
        this.currentEditId = emiId;
        this.currentEditType = 'emi';
        
        const emi = emiId ? this.data.emi_for_friends.find(e => e.id === emiId) : null;
        
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        if (modalTitle) modalTitle.textContent = emiId ? 'Edit EMI' : 'Add EMI';
        
        if (modalBody) {
            modalBody.innerHTML = `
                <form class="modal-form">
                    <div class="form-group">
                        <label class="form-label">Friend Name</label>
                        <input type="text" id="emi-friend" class="form-control" required value="${emi?.friend_name || ''}">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Loan Amount</label>
                            <input type="number" id="emi-loan-amount" class="form-control" required value="${emi?.loan_amount || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">EMI Amount</label>
                            <input type="number" id="emi-amount" class="form-control" required value="${emi?.emi_amount || ''}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Start Date</label>
                            <input type="date" id="emi-start-date" class="form-control" required value="${emi?.start_date || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">End Date</label>
                            <input type="date" id="emi-end-date" class="form-control" required value="${emi?.end_date || ''}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Remaining EMIs</label>
                            <input type="number" id="emi-remaining" class="form-control" required value="${emi?.remaining_emis || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <select id="emi-status" class="form-control" required>
                                ${this.categories.status_options.map(status => 
                                    `<option value="${status}" ${emi?.status === status ? 'selected' : ''}>${status}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Purpose</label>
                        <input type="text" id="emi-purpose" class="form-control" required value="${emi?.purpose || ''}">
                    </div>
                </form>
            `;
        }
        
        this.showModal();
    }
    
    openMoneyReceivedModal(receivedId = null) {
        this.currentEditId = receivedId;
        this.currentEditType = 'money_received';
        
        const received = receivedId ? this.data.money_received.find(r => r.id === receivedId) : null;
        
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        if (modalTitle) modalTitle.textContent = receivedId ? 'Edit Payment Received' : 'Record Payment Received';
        
        if (modalBody) {
            modalBody.innerHTML = `
                <form class="modal-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Friend Name</label>
                            <input type="text" id="received-friend" class="form-control" required value="${received?.friend_name || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Amount Received</label>
                            <input type="number" id="received-amount" class="form-control" required value="${received?.amount_received || ''}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Date Received</label>
                            <input type="date" id="received-date" class="form-control" required value="${received?.date_received || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Payment Method</label>
                            <select id="received-method" class="form-control" required>
                                ${this.categories.payment_methods.map(method => 
                                    `<option value="${method}" ${received?.payment_method === method ? 'selected' : ''}>${method}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Purpose</label>
                        <input type="text" id="received-purpose" class="form-control" required value="${received?.purpose || ''}">
                    </div>
                </form>
            `;
        }
        
        this.showModal();
    }
    
    editEMI(id) {
        this.openEMIModal(id);
    }
    
    deleteEMI(id) {
        if (confirm('Are you sure you want to delete this EMI entry?')) {
            this.data.emi_for_friends = this.data.emi_for_friends.filter(emi => emi.id !== id);
            this.saveData();
            this.renderEMITables();
            this.updateDashboard();
        }
    }
    
    editMoneyReceived(id) {
        this.openMoneyReceivedModal(id);
    }
    
    deleteMoneyReceived(id) {
        if (confirm('Are you sure you want to delete this payment record?')) {
            this.data.money_received = this.data.money_received.filter(received => received.id !== id);
            this.saveData();
            this.renderEMITables();
        }
    }
    
    // Lending/Borrowing Management
    renderLendingTables() {
        // Render lending table
        const lendingTbody = document.querySelector('#lending-table tbody');
        if (lendingTbody) {
            lendingTbody.innerHTML = '';
            
            this.data.money_lending.forEach(loan => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${loan.borrower_name}</td>
                    <td>₹${loan.loan_amount.toLocaleString()}</td>
                    <td>${new Date(loan.date_lent).toLocaleDateString()}</td>
                    <td>${new Date(loan.due_date).toLocaleDateString()}</td>
                    <td>${loan.interest_rate}%</td>
                    <td><span class="status status--${loan.status.toLowerCase()}">${loan.status}</span></td>
                    <td>
                        <button class="btn btn--sm btn--outline action-btn" onclick="window.financeManager.editLending(${loan.id})">Edit</button>
                        <button class="btn btn--sm btn--outline action-btn" onclick="window.financeManager.deleteLending(${loan.id})">Delete</button>
                    </td>
                `;
                lendingTbody.appendChild(row);
            });
        }
        
        // Render borrowing table
        const borrowingTbody = document.querySelector('#borrowing-table tbody');
        if (borrowingTbody) {
            borrowingTbody.innerHTML = '';
            
            this.data.money_borrowing.forEach(loan => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${loan.lender_name}</td>
                    <td>₹${loan.borrowed_amount.toLocaleString()}</td>
                    <td>${new Date(loan.date_borrowed).toLocaleDateString()}</td>
                    <td>${new Date(loan.due_date).toLocaleDateString()}</td>
                    <td>${loan.interest_rate}%</td>
                    <td><span class="status status--${loan.status.toLowerCase()}">${loan.status}</span></td>
                    <td>
                        <button class="btn btn--sm btn--outline action-btn" onclick="window.financeManager.editBorrowing(${loan.id})">Edit</button>
                        <button class="btn btn--sm btn--outline action-btn" onclick="window.financeManager.deleteBorrowing(${loan.id})">Delete</button>
                    </td>
                `;
                borrowingTbody.appendChild(row);
            });
        }
    }
    
    openLendingModal(lendingId = null) {
        this.currentEditId = lendingId;
        this.currentEditType = 'lending';
        
        const lending = lendingId ? this.data.money_lending.find(l => l.id === lendingId) : null;
        
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        if (modalTitle) modalTitle.textContent = lendingId ? 'Edit Lending' : 'Record Lending';
        
        if (modalBody) {
            modalBody.innerHTML = `
                <form class="modal-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Borrower Name</label>
                            <input type="text" id="lending-borrower" class="form-control" required value="${lending?.borrower_name || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Loan Amount</label>
                            <input type="number" id="lending-amount" class="form-control" required value="${lending?.loan_amount || ''}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Date Lent</label>
                            <input type="date" id="lending-date" class="form-control" required value="${lending?.date_lent || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Due Date</label>
                            <input type="date" id="lending-due-date" class="form-control" required value="${lending?.due_date || ''}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Interest Rate (%)</label>
                            <input type="number" id="lending-interest" class="form-control" step="0.1" value="${lending?.interest_rate || '0'}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <select id="lending-status" class="form-control" required>
                                ${this.categories.status_options.map(status => 
                                    `<option value="${status}" ${lending?.status === status ? 'selected' : ''}>${status}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Purpose</label>
                        <input type="text" id="lending-purpose" class="form-control" required value="${lending?.purpose || ''}">
                    </div>
                </form>
            `;
        }
        
        this.showModal();
    }
    
    openBorrowingModal(borrowingId = null) {
        this.currentEditId = borrowingId;
        this.currentEditType = 'borrowing';
        
        const borrowing = borrowingId ? this.data.money_borrowing.find(b => b.id === borrowingId) : null;
        
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        if (modalTitle) modalTitle.textContent = borrowingId ? 'Edit Borrowing' : 'Record Borrowing';
        
        if (modalBody) {
            modalBody.innerHTML = `
                <form class="modal-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Lender Name</label>
                            <input type="text" id="borrowing-lender" class="form-control" required value="${borrowing?.lender_name || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Borrowed Amount</label>
                            <input type="number" id="borrowing-amount" class="form-control" required value="${borrowing?.borrowed_amount || ''}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Date Borrowed</label>
                            <input type="date" id="borrowing-date" class="form-control" required value="${borrowing?.date_borrowed || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Due Date</label>
                            <input type="date" id="borrowing-due-date" class="form-control" required value="${borrowing?.due_date || ''}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Interest Rate (%)</label>
                            <input type="number" id="borrowing-interest" class="form-control" step="0.1" value="${borrowing?.interest_rate || '0'}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <select id="borrowing-status" class="form-control" required>
                                ${this.categories.status_options.map(status => 
                                    `<option value="${status}" ${borrowing?.status === status ? 'selected' : ''}>${status}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Purpose</label>
                        <input type="text" id="borrowing-purpose" class="form-control" required value="${borrowing?.purpose || ''}">
                    </div>
                </form>
            `;
        }
        
        this.showModal();
    }
    
    editLending(id) {
        this.openLendingModal(id);
    }
    
    deleteLending(id) {
        if (confirm('Are you sure you want to delete this lending record?')) {
            this.data.money_lending = this.data.money_lending.filter(lending => lending.id !== id);
            this.saveData();
            this.renderLendingTables();
            this.updateDashboard();
        }
    }
    
    editBorrowing(id) {
        this.openBorrowingModal(id);
    }
    
    deleteBorrowing(id) {
        if (confirm('Are you sure you want to delete this borrowing record?')) {
            this.data.money_borrowing = this.data.money_borrowing.filter(borrowing => borrowing.id !== id);
            this.saveData();
            this.renderLendingTables();
            this.updateDashboard();
        }
    }
    
    // Modal Management
    showModal() {
        const modal = document.getElementById('modal-overlay');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }
    
    closeModal() {
        const modal = document.getElementById('modal-overlay');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.currentEditId = null;
        this.currentEditType = null;
    }
    
    saveModalData() {
        if (!this.currentEditType) return;
        
        const formData = this.getFormData();
        if (!formData) return;
        
        if (this.currentEditId) {
            this.updateRecord(formData);
        } else {
            this.createRecord(formData);
        }
        
        this.saveData();
        this.renderAllTabs();
        this.updateDashboard();
        this.closeModal();
    }
    
    getFormData() {
        const type = this.currentEditType;
        
        try {
            switch (type) {
                case 'income':
                    return {
                        amount: parseFloat(document.getElementById('income-amount').value) || 0,
                        source: document.getElementById('income-source').value || '',
                        date: document.getElementById('income-date').value || '',
                        category: document.getElementById('income-category').value || ''
                    };
                case 'savings':
                    return {
                        category_name: document.getElementById('savings-category').value || '',
                        target_amount: parseFloat(document.getElementById('savings-target').value) || 0,
                        current_amount: parseFloat(document.getElementById('savings-current').value) || 0,
                        monthly_contribution: parseFloat(document.getElementById('savings-monthly').value) || 0,
                        deadline: document.getElementById('savings-deadline').value || ''
                    };
                case 'emi':
                    return {
                        friend_name: document.getElementById('emi-friend').value || '',
                        loan_amount: parseFloat(document.getElementById('emi-loan-amount').value) || 0,
                        emi_amount: parseFloat(document.getElementById('emi-amount').value) || 0,
                        start_date: document.getElementById('emi-start-date').value || '',
                        end_date: document.getElementById('emi-end-date').value || '',
                        remaining_emis: parseInt(document.getElementById('emi-remaining').value) || 0,
                        status: document.getElementById('emi-status').value || '',
                        purpose: document.getElementById('emi-purpose').value || ''
                    };
                case 'money_received':
                    return {
                        friend_name: document.getElementById('received-friend').value || '',
                        amount_received: parseFloat(document.getElementById('received-amount').value) || 0,
                        date_received: document.getElementById('received-date').value || '',
                        payment_method: document.getElementById('received-method').value || '',
                        purpose: document.getElementById('received-purpose').value || ''
                    };
                case 'lending':
                    return {
                        borrower_name: document.getElementById('lending-borrower').value || '',
                        loan_amount: parseFloat(document.getElementById('lending-amount').value) || 0,
                        date_lent: document.getElementById('lending-date').value || '',
                        due_date: document.getElementById('lending-due-date').value || '',
                        interest_rate: parseFloat(document.getElementById('lending-interest').value) || 0,
                        status: document.getElementById('lending-status').value || '',
                        purpose: document.getElementById('lending-purpose').value || ''
                    };
                case 'borrowing':
                    return {
                        lender_name: document.getElementById('borrowing-lender').value || '',
                        borrowed_amount: parseFloat(document.getElementById('borrowing-amount').value) || 0,
                        date_borrowed: document.getElementById('borrowing-date').value || '',
                        due_date: document.getElementById('borrowing-due-date').value || '',
                        interest_rate: parseFloat(document.getElementById('borrowing-interest').value) || 0,
                        status: document.getElementById('borrowing-status').value || '',
                        purpose: document.getElementById('borrowing-purpose').value || ''
                    };
                default:
                    return null;
            }
        } catch (error) {
            console.error('Error getting form data:', error);
            return null;
        }
    }
    
    createRecord(data) {
        const type = this.currentEditType;
        const newId = this.getNextId(type);
        const record = { id: newId, ...data };
        
        switch (type) {
            case 'income':
                this.data.monthly_income.push(record);
                break;
            case 'savings':
                this.data.savings_categories.push(record);
                break;
            case 'emi':
                this.data.emi_for_friends.push(record);
                break;
            case 'money_received':
                this.data.money_received.push(record);
                break;
            case 'lending':
                this.data.money_lending.push(record);
                break;
            case 'borrowing':
                this.data.money_borrowing.push(record);
                break;
        }
    }
    
    updateRecord(data) {
        const type = this.currentEditType;
        const id = this.currentEditId;
        
        switch (type) {
            case 'income':
                const incomeIndex = this.data.monthly_income.findIndex(i => i.id === id);
                if (incomeIndex !== -1) {
                    this.data.monthly_income[incomeIndex] = { id, ...data };
                }
                break;
            case 'savings':
                const savingsIndex = this.data.savings_categories.findIndex(s => s.id === id);
                if (savingsIndex !== -1) {
                    this.data.savings_categories[savingsIndex] = { id, ...data };
                }
                break;
            case 'emi':
                const emiIndex = this.data.emi_for_friends.findIndex(e => e.id === id);
                if (emiIndex !== -1) {
                    this.data.emi_for_friends[emiIndex] = { id, ...data };
                }
                break;
            case 'money_received':
                const receivedIndex = this.data.money_received.findIndex(r => r.id === id);
                if (receivedIndex !== -1) {
                    this.data.money_received[receivedIndex] = { id, ...data };
                }
                break;
            case 'lending':
                const lendingIndex = this.data.money_lending.findIndex(l => l.id === id);
                if (lendingIndex !== -1) {
                    this.data.money_lending[lendingIndex] = { id, ...data };
                }
                break;
            case 'borrowing':
                const borrowingIndex = this.data.money_borrowing.findIndex(b => b.id === id);
                if (borrowingIndex !== -1) {
                    this.data.money_borrowing[borrowingIndex] = { id, ...data };
                }
                break;
        }
    }
    
    getNextId(type) {
        const dataMap = {
            'income': 'monthly_income',
            'savings': 'savings_categories',
            'emi': 'emi_for_friends',
            'money_received': 'money_received',
            'lending': 'money_lending',
            'borrowing': 'money_borrowing'
        };
        
        const dataArray = this.data[dataMap[type]];
        return dataArray.length > 0 ? Math.max(...dataArray.map(item => item.id)) + 1 : 1;
    }
    
    // CSV Export/Import
    exportData(type) {
        let data, filename, headers;
        
        switch (type) {
            case 'income':
                data = this.data.monthly_income;
                filename = 'income_data.csv';
                headers = ['id', 'amount', 'source', 'date', 'category'];
                break;
            case 'savings':
                data = this.data.savings_categories;
                filename = 'savings_data.csv';
                headers = ['id', 'category_name', 'target_amount', 'current_amount', 'monthly_contribution', 'deadline'];
                break;
            case 'emi':
                data = [...this.data.emi_for_friends, ...this.data.money_received.map(r => ({...r, type: 'received'}))];
                filename = 'emi_data.csv';
                headers = ['id', 'friend_name', 'loan_amount', 'emi_amount', 'start_date', 'end_date', 'remaining_emis', 'purpose', 'status', 'type'];
                break;
            case 'lending':
                data = this.data.money_lending;
                filename = 'lending_data.csv';
                headers = ['id', 'borrower_name', 'loan_amount', 'date_lent', 'due_date', 'interest_rate', 'status', 'purpose'];
                break;
            case 'borrowing':
                data = this.data.money_borrowing;
                filename = 'borrowing_data.csv';
                headers = ['id', 'lender_name', 'borrowed_amount', 'date_borrowed', 'due_date', 'interest_rate', 'status', 'purpose'];
                break;
            default:
                return;
        }
        
        const csvContent = this.arrayToCSV(data, headers);
        this.downloadCSV(csvContent, filename);
    }
    
    arrayToCSV(data, headers) {
        const csvRows = [];
        csvRows.push(headers.join(','));
        
        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header] || '';
                return `"${value}"`;
            });
            csvRows.push(values.join(','));
        }
        
        return csvRows.join('\n');
    }
    
    downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
    
    importData() {
        const fileInput = document.getElementById('import-file');
        const typeSelect = document.getElementById('import-type');
        
        if (!fileInput || !typeSelect || !fileInput.files[0] || !typeSelect.value) {
            alert('Please select a file and data type');
            return;
        }
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const data = this.parseCSV(csv);
                this.importParsedData(data, typeSelect.value);
                alert('Data imported successfully!');
                this.renderAllTabs();
                this.updateDashboard();
                // Clear the file input
                fileInput.value = '';
            } catch (error) {
                alert('Error importing data: ' + error.message);
            }
        };
        
        reader.readAsText(file);
    }
    
    parseCSV(csv) {
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
                const row = {};
                headers.forEach((header, index) => {
                    row[header.toLowerCase().replace(/\s+/g, '_')] = values[index] || '';
                });
                data.push(row);
            }
        }
        
        return data;
    }
    
    importParsedData(data, type) {
        const dataMap = {
            'income': 'monthly_income',
            'savings': 'savings_categories',
            'emi': 'emi_for_friends',
            'money_received': 'money_received',
            'lending': 'money_lending',
            'borrowing': 'money_borrowing'
        };
        
        if (dataMap[type]) {
            // Convert string numbers to actual numbers and ensure proper data types
            data.forEach(item => {
                Object.keys(item).forEach(key => {
                    if (key.includes('amount') || key.includes('rate') || key.includes('emis') || key === 'id') {
                        const num = parseFloat(item[key]);
                        if (!isNaN(num)) {
                            item[key] = num;
                        }
                    }
                });
                
                // Ensure ID is set properly
                if (!item.id || isNaN(item.id)) {
                    item.id = this.getNextId(type);
                }
            });
            
            this.data[dataMap[type]] = [...this.data[dataMap[type]], ...data];
            this.saveData();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Finance Manager...');
    // Make the finance manager available globally
    window.financeManager = new FinanceManager();
});