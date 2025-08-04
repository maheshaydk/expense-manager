// Monthly Finance Tracker Application
class FinanceTracker {
    constructor() {
        this.months = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];
        this.savingsData = {};
        this.lendingData = {};
        this.emiData = {};
        this.charts = {};
        
        this.init();
    }

    init() {
        this.loadData();
        this.initTabs();
        this.initTables();
        this.initEventListeners();
        this.updateDashboard();
    }

    // Data Management
    loadData() {
        // Load from localStorage or use sample data
        const saved = localStorage.getItem('financeTrackerData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.savingsData = data.savings || {};
                this.lendingData = data.lending || {};
                this.emiData = data.emi || {};
            } catch (e) {
                console.error('Error loading saved data:', e);
                this.loadSampleData();
            }
        } else {
            this.loadSampleData();
        }
    }

    saveData() {
        try {
            const data = {
                savings: this.savingsData,
                lending: this.lendingData,
                emi: this.emiData
            };
            localStorage.setItem('financeTrackerData', JSON.stringify(data));
        } catch (e) {
            console.error('Error saving data:', e);
        }
    }

    loadSampleData() {
        // Sample savings data
        this.savingsData = {
            "NPS Tier I": {"January": 50000, "February": 0, "March": 0, "April": 0, "May": 0, "June": 0, "July": 0, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0},
            "NPS Tier II": {"January": 10000, "February": 10000, "March": 10000, "April": 10000, "May": 10000, "June": 10000, "July": 10000, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0},
            "LIC - Term": {"January": 36865, "February": 0, "March": 0, "April": 0, "May": 0, "June": 0, "July": 0, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0},
            "LIC - Self": {"January": 2852, "February": 2852, "March": 2852, "April": 2852, "May": 2852, "June": 2852, "July": 2852, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0},
            "LIC - Shruthi": {"January": 8156, "February": 8156, "March": 8156, "April": 8156, "May": 8156, "June": 8156, "July": 0, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0},
            "Emergency Fund": {"January": 10000, "February": 20000, "March": 20000, "April": 20000, "May": 20000, "June": 20000, "July": 20000, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0},
            "RD": {"January": 0, "February": 20000, "March": 20000, "April": 20000, "May": 20000, "June": 20000, "July": 20000, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0},
            "Gold": {"January": 0, "February": 0, "March": 0, "April": 0, "May": 0, "June": 0, "July": 0, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0},
            "EPF": {"January": 3600, "February": 3600, "March": 3600, "April": 3600, "May": 3600, "June": 3600, "July": 3600, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0},
            "Kuri": {"January": 5000, "February": 5000, "March": 4565, "April": 3995, "May": 4230, "June": 0, "July": 0, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0},
            "FD": {"January": 0, "February": 0, "March": 0, "April": 0, "May": 0, "June": 0, "July": 0, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0},
            "Extra": {"January": 158057, "February": 72943, "March": 113317, "April": 64608, "May": 69608, "June": 69608, "July": 69173, "August": 226660, "September": 141781, "October": 0, "November": 0, "December": 0}
        };

        // Sample lending data
        this.lendingData = {
            "Nagesha": {"January": 100000, "February": 5000, "March": 105000, "April": 0, "May": 0, "June": 0, "July": 0, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0},
            "Pramod": {"January": 229620, "February": 15000, "March": -15000, "April": 229620, "May": 0, "June": 0, "July": 0, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0},
            "Sathisha": {"January": 35000, "February": 35000, "March": 0, "April": 0, "May": 0, "June": 0, "July": 0, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0},
            "Varma": {"January": 0, "February": 0, "March": 0, "April": 0, "May": 0, "June": 0, "July": 0, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0},
            "Mava": {"January": 36000, "February": 36000, "March": 0, "April": 0, "May": 0, "June": 0, "July": 0, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0},
            "Shivaprasad": {"January": 7875, "February": -165932, "March": 136457, "April": -21600, "May": 400620, "June": 0, "July": 0, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0}
        };

        // Sample EMI data
        this.emiData = {
            "Hari": {"January": 14908, "February": 14908, "March": 14908, "April": 0, "May": 0, "June": 0, "July": 0, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0},
            "Nagesh": {"January": 5000, "February": 11955, "March": 11955, "April": 0, "May": 0, "June": 0, "July": 0, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0},
            "Putta": {"January": 0, "February": 0, "March": 0, "April": 0, "May": 0, "June": 0, "July": 0, "August": 0, "September": 0, "October": 0, "November": 0, "December": 0}
        };

        this.saveData();
    }

    // Tab Navigation - Fixed
    initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = btn.dataset.tab;
                
                // Remove active from all tabs and panels
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));
                
                // Add active to current tab and panel
                btn.classList.add('active');
                const targetPanel = document.getElementById(tabId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
                
                // Update dashboard when switching to it
                if (tabId === 'dashboard') {
                    setTimeout(() => this.updateDashboard(), 100);
                }
            });
        });
    }

    // Table Initialization
    initTables() {
        this.renderSavingsTable();
        this.renderLendingTable();
        this.renderEMITable();
    }

    renderSavingsTable() {
        const tbody = document.getElementById('savingsTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        Object.keys(this.savingsData).forEach(category => {
            const row = this.createEditableRow(category, this.savingsData[category], 'savings');
            tbody.appendChild(row);
        });

        this.updateTableTotals('savings');
    }

    renderLendingTable() {
        const tbody = document.getElementById('lendingTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        Object.keys(this.lendingData).forEach(person => {
            const row = this.createEditableRow(person, this.lendingData[person], 'lending');
            tbody.appendChild(row);
        });

        this.updateTableTotals('lending');
    }

    renderEMITable() {
        const tbody = document.getElementById('emiTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        Object.keys(this.emiData).forEach(person => {
            const row = this.createEditableRow(person, this.emiData[person], 'emi');
            tbody.appendChild(row);
        });

        this.updateTableTotals('emi');
    }

    createEditableRow(name, data, tableType) {
        const row = document.createElement('tr');
        
        // Category/Person name cell with delete button
        const nameCell = document.createElement('td');
        nameCell.innerHTML = `
            ${name}
            <button class="delete-row-btn" onclick="financeTracker.deleteRow('${name}', '${tableType}')" title="Delete ${name}">×</button>
        `;
        row.appendChild(nameCell);

        // Month cells
        this.months.forEach((month, index) => {
            const cell = document.createElement('td');
            const value = data[month] || 0;
            cell.className = 'editable-cell';
            cell.textContent = this.formatCurrency(value);
            cell.dataset.name = name;
            cell.dataset.month = month;
            cell.dataset.table = tableType;
            
            // Add balance styling for lending table
            if (tableType === 'lending' && value !== 0) {
                cell.classList.add(value > 0 ? 'positive-balance' : 'negative-balance');
            }
            
            this.makeEditable(cell);
            row.appendChild(cell);
        });

        // Total cell
        const totalCell = document.createElement('td');
        totalCell.className = 'row-total';
        
        if (tableType === 'lending') {
            // For lending, show running balance
            const balance = this.calculateRunningBalance(data);
            totalCell.textContent = this.formatCurrency(balance);
            totalCell.classList.add(balance >= 0 ? 'positive-balance' : 'negative-balance');
        } else {
            // For savings and EMI, show sum
            const total = Object.values(data).reduce((sum, val) => sum + (val || 0), 0);
            totalCell.textContent = this.formatCurrency(total);
        }
        
        row.appendChild(totalCell);
        
        return row;
    }

    makeEditable(cell) {
        cell.addEventListener('click', (e) => {
            e.stopPropagation();
            if (cell.classList.contains('editing')) return;
            
            const currentValue = this.parseCurrency(cell.textContent);
            cell.classList.add('editing');
            
            const input = document.createElement('input');
            input.type = 'number';
            input.value = currentValue;
            input.style.width = '100%';
            input.style.border = 'none';
            input.style.background = 'transparent';
            input.style.color = 'inherit';
            input.style.textAlign = 'right';
            input.style.outline = 'none';
            
            cell.innerHTML = '';
            cell.appendChild(input);
            input.focus();
            input.select();

            const saveValue = () => {
                const newValue = parseFloat(input.value) || 0;
                const name = cell.dataset.name;
                const month = cell.dataset.month;
                const table = cell.dataset.table;
                
                // Update data
                if (table === 'savings') {
                    if (!this.savingsData[name]) this.savingsData[name] = {};
                    this.savingsData[name][month] = newValue;
                } else if (table === 'lending') {
                    if (!this.lendingData[name]) this.lendingData[name] = {};
                    this.lendingData[name][month] = newValue;
                } else if (table === 'emi') {
                    if (!this.emiData[name]) this.emiData[name] = {};
                    this.emiData[name][month] = newValue;
                }
                
                // Update display
                cell.textContent = this.formatCurrency(newValue);
                cell.classList.remove('editing');
                
                // Add balance styling for lending
                if (table === 'lending' && newValue !== 0) {
                    cell.classList.remove('positive-balance', 'negative-balance');
                    cell.classList.add(newValue > 0 ? 'positive-balance' : 'negative-balance');
                } else if (table === 'lending' && newValue === 0) {
                    cell.classList.remove('positive-balance', 'negative-balance');
                }
                
                // Update totals and save
                this.updateTableTotals(table);
                this.saveData();
                this.updateDashboard();
            };

            input.addEventListener('blur', saveValue);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveValue();
                }
                if (e.key === 'Escape') {
                    cell.textContent = this.formatCurrency(currentValue);
                    cell.classList.remove('editing');
                }
            });
        });
    }

    deleteRow(name, tableType) {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;
        
        if (tableType === 'savings') {
            delete this.savingsData[name];
            this.renderSavingsTable();
        } else if (tableType === 'lending') {
            delete this.lendingData[name];
            this.renderLendingTable();
        } else if (tableType === 'emi') {
            delete this.emiData[name];
            this.renderEMITable();
        }
        
        this.saveData();
        this.updateDashboard();
    }

    updateTableTotals(tableType) {
        const table = document.getElementById(tableType + 'Table');
        if (!table) return;
        
        const monthTotals = table.querySelectorAll('.month-total');
        const grandTotalCell = table.querySelector('.grand-total');
        
        if (!monthTotals.length || !grandTotalCell) return;
        
        let grandTotal = 0;
        
        // Calculate month totals
        this.months.forEach((month, index) => {
            let monthTotal = 0;
            const data = tableType === 'savings' ? this.savingsData : 
                         tableType === 'lending' ? this.lendingData : this.emiData;
            
            Object.keys(data).forEach(key => {
                monthTotal += data[key][month] || 0;
            });
            
            if (monthTotals[index]) {
                monthTotals[index].textContent = this.formatCurrency(monthTotal);
            }
            grandTotal += monthTotal;
        });
        
        // Update row totals
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const nameText = row.cells[0].textContent.replace('×', '').trim();
            const totalCell = row.querySelector('.row-total');
            if (!totalCell) return;
            
            const data = tableType === 'savings' ? this.savingsData[nameText] : 
                         tableType === 'lending' ? this.lendingData[nameText] : this.emiData[nameText];
            
            if (!data) return;
            
            if (tableType === 'lending') {
                const balance = this.calculateRunningBalance(data);
                totalCell.textContent = this.formatCurrency(balance);
                totalCell.classList.remove('positive-balance', 'negative-balance');
                totalCell.classList.add(balance >= 0 ? 'positive-balance' : 'negative-balance');
            } else {
                const total = Object.values(data).reduce((sum, val) => sum + (val || 0), 0);
                totalCell.textContent = this.formatCurrency(total);
            }
        });
        
        grandTotalCell.textContent = this.formatCurrency(grandTotal);
    }

    calculateRunningBalance(data) {
        return Object.values(data || {}).reduce((sum, val) => sum + (val || 0), 0);
    }

    // Event Listeners
    initEventListeners() {
        // Add category/person buttons
        const addSavingsBtn = document.getElementById('addSavingsCategory');
        if (addSavingsBtn) {
            addSavingsBtn.addEventListener('click', () => {
                this.addNewEntry('savings', 'Category');
            });
        }
        
        const addLendingBtn = document.getElementById('addLendingPerson');
        if (addLendingBtn) {
            addLendingBtn.addEventListener('click', () => {
                this.addNewEntry('lending', 'Person');
            });
        }
        
        const addEMIBtn = document.getElementById('addEMIPerson');
        if (addEMIBtn) {
            addEMIBtn.addEventListener('click', () => {
                this.addNewEntry('emi', 'Person');
            });
        }

        // Export buttons
        const exportSavingsBtn = document.getElementById('exportSavings');
        if (exportSavingsBtn) {
            exportSavingsBtn.addEventListener('click', () => {
                this.exportToCSV('savings');
            });
        }
        
        const exportLendingBtn = document.getElementById('exportLending');
        if (exportLendingBtn) {
            exportLendingBtn.addEventListener('click', () => {
                this.exportToCSV('lending');
            });
        }
        
        const exportEMIBtn = document.getElementById('exportEMI');
        if (exportEMIBtn) {
            exportEMIBtn.addEventListener('click', () => {
                this.exportToCSV('emi');
            });
        }
        
        const exportAllBtn = document.getElementById('exportAll');
        if (exportAllBtn) {
            exportAllBtn.addEventListener('click', () => {
                this.exportToCSV('all');
            });
        }

        // Import file inputs
        const importSavingsInput = document.getElementById('importSavings');
        if (importSavingsInput) {
            importSavingsInput.addEventListener('change', (e) => {
                this.importFromCSV(e.target.files[0], 'savings');
            });
        }
        
        const importLendingInput = document.getElementById('importLending');
        if (importLendingInput) {
            importLendingInput.addEventListener('change', (e) => {
                this.importFromCSV(e.target.files[0], 'lending');
            });
        }
        
        const importEMIInput = document.getElementById('importEMI');
        if (importEMIInput) {
            importEMIInput.addEventListener('change', (e) => {
                this.importFromCSV(e.target.files[0], 'emi');
            });
        }

        // Data management buttons
        const resetDataBtn = document.getElementById('resetData');
        if (resetDataBtn) {
            resetDataBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                    localStorage.removeItem('financeTrackerData');
                    this.savingsData = {};
                    this.lendingData = {};
                    this.emiData = {};
                    this.initTables();
                    this.updateDashboard();
                }
            });
        }
        
        const loadSampleBtn = document.getElementById('loadSampleData');
        if (loadSampleBtn) {
            loadSampleBtn.addEventListener('click', () => {
                if (confirm('Load sample data? This will replace current data.')) {
                    this.loadSampleData();
                    this.initTables();
                    this.updateDashboard();
                }
            });
        }
    }

    addNewEntry(tableType, entryType) {
        const name = prompt(`Enter ${entryType} name:`);
        if (!name || name.trim() === '') return;
        
        const cleanName = name.trim();
        const data = {};
        this.months.forEach(month => {
            data[month] = 0;
        });
        
        if (tableType === 'savings') {
            this.savingsData[cleanName] = data;
            this.renderSavingsTable();
        } else if (tableType === 'lending') {
            this.lendingData[cleanName] = data;
            this.renderLendingTable();
        } else if (tableType === 'emi') {
            this.emiData[cleanName] = data;
            this.renderEMITable();
        }
        
        this.saveData();
        this.updateDashboard();
    }

    // Dashboard
    updateDashboard() {
        this.updateMetrics();
        setTimeout(() => this.updateCharts(), 100);
    }

    updateMetrics() {
        // Total Savings
        const totalSavings = Object.values(this.savingsData).reduce((total, categoryData) => {
            return total + Object.values(categoryData || {}).reduce((sum, val) => sum + (val || 0), 0);
        }, 0);
        
        // Net Lending
        const netLending = Object.values(this.lendingData).reduce((total, personData) => {
            return total + this.calculateRunningBalance(personData);
        }, 0);
        
        // Total EMI
        const totalEMI = Object.values(this.emiData).reduce((total, personData) => {
            return total + Object.values(personData || {}).reduce((sum, val) => sum + (val || 0), 0);
        }, 0);
        
        // Monthly Average
        const monthlyAverage = totalSavings / 12;
        
        const totalSavingsEl = document.getElementById('totalSavings');
        const netLendingEl = document.getElementById('netLending');
        const totalEMIEl = document.getElementById('totalEMI');
        const monthlyAverageEl = document.getElementById('monthlyAverage');
        
        if (totalSavingsEl) totalSavingsEl.textContent = this.formatCurrency(totalSavings);
        if (netLendingEl) netLendingEl.textContent = this.formatCurrency(netLending);
        if (totalEMIEl) totalEMIEl.textContent = this.formatCurrency(totalEMI);
        if (monthlyAverageEl) monthlyAverageEl.textContent = this.formatCurrency(monthlyAverage);
    }

    updateCharts() {
        this.updateSavingsChart();
        this.updateLendingChart();
    }

    updateSavingsChart() {
        const canvas = document.getElementById('savingsChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Calculate monthly totals
        const monthlyData = this.months.map(month => {
            return Object.values(this.savingsData).reduce((total, categoryData) => {
                return total + ((categoryData && categoryData[month]) || 0);
            }, 0);
        });

        if (this.charts.savings) {
            this.charts.savings.destroy();
        }

        this.charts.savings = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.months,
                datasets: [{
                    label: 'Monthly Savings',
                    data: monthlyData,
                    backgroundColor: '#1FB8CD',
                    borderColor: '#1FB8CD',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    updateLendingChart() {
        const canvas = document.getElementById('lendingChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        const people = Object.keys(this.lendingData);
        const balances = people.map(person => this.calculateRunningBalance(this.lendingData[person]));
        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545'];

        if (this.charts.lending) {
            this.charts.lending.destroy();
        }

        this.charts.lending = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: people,
                datasets: [{
                    data: balances.map(Math.abs),
                    backgroundColor: colors.slice(0, people.length),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // CSV Export/Import
    exportToCSV(type) {
        if (type === 'all') {
            this.exportToCSV('savings');
            setTimeout(() => this.exportToCSV('lending'), 100);
            setTimeout(() => this.exportToCSV('emi'), 200);
            return;
        }

        const data = type === 'savings' ? this.savingsData : 
                     type === 'lending' ? this.lendingData : this.emiData;
        
        let csv = 'Name,' + this.months.join(',') + ',Total\n';
        
        Object.keys(data).forEach(name => {
            const row = [name];
            this.months.forEach(month => {
                row.push(data[name][month] || 0);
            });
            
            const total = type === 'lending' ? 
                         this.calculateRunningBalance(data[name]) :
                         Object.values(data[name] || {}).reduce((sum, val) => sum + (val || 0), 0);
            row.push(total);
            
            csv += row.join(',') + '\n';
        });

        this.downloadCSV(csv, `${type}_data.csv`);
    }

    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    importFromCSV(file, type) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const lines = csv.split('\n');
                const headers = lines[0].split(',');
                
                const newData = {};
                
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    
                    const values = line.split(',');
                    const name = values[0];
                    if (!name) continue;
                    
                    const monthlyData = {};
                    
                    this.months.forEach((month, index) => {
                        monthlyData[month] = parseFloat(values[index + 1]) || 0;
                    });
                    
                    newData[name] = monthlyData;
                }
                
                if (type === 'savings') {
                    this.savingsData = newData;
                    this.renderSavingsTable();
                } else if (type === 'lending') {
                    this.lendingData = newData;
                    this.renderLendingTable();
                } else if (type === 'emi') {
                    this.emiData = newData;
                    this.renderEMITable();
                }
                
                this.saveData();
                this.updateDashboard();
                alert('Data imported successfully!');
            } catch (error) {
                console.error('Import error:', error);
                alert('Error importing file. Please check the format.');
            }
        };
        
        reader.readAsText(file);
    }

    // Utility Functions
    formatCurrency(amount) {
        if (amount === 0) return '₹0';
        const absAmount = Math.abs(amount);
        const formatted = '₹' + absAmount.toLocaleString('en-IN');
        return amount < 0 ? formatted + ' (-)' : formatted;
    }

    parseCurrency(text) {
        if (!text) return 0;
        const cleaned = text.replace(/[₹,\s]/g, '').replace('(-)', '');
        const num = parseFloat(cleaned) || 0;
        return text.includes('(-)') ? -num : num;
    }
}

// Initialize the application
let financeTracker;
document.addEventListener('DOMContentLoaded', () => {
    financeTracker = new FinanceTracker();
});