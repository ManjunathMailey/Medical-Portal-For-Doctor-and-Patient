// Initialize all components when document is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeCalendar();
    initializeCharts();
    setupEventListeners();
    loadDashboardData();
    checkThemePreference();
});

// Calendar Initialization and Management
function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: getInitialEvents(),
        editable: true,
        selectable: true,
        select: handleDateSelect,
        eventClick: handleEventClick,
        eventDrop: handleEventDrop,
        eventResize: handleEventResize,
        height: 'auto',
        contentHeight: 600
    });

    calendar.render();
    window.calendar = calendar;
    loadUpcomingAppointments();
}

function getInitialEvents() {
    return [
        {
            id: '1',
            title: 'John Doe - Checkup',
            start: new Date(new Date().setHours(10, 0)),
            end: new Date(new Date().setHours(11, 0)),
            backgroundColor: '#009688',
            extendedProps: {
                patient: 'John Doe',
                type: 'Checkup',
                notes: 'Regular checkup'
            }
        },
        {
            id: '2',
            title: 'Sarah Smith - Follow-up',
            start: new Date(new Date().setDate(new Date().getDate() + 1)),
            backgroundColor: '#00796b',
            extendedProps: {
                patient: 'Sarah Smith',
                type: 'Follow-up',
                notes: 'Post-surgery follow-up'
            }
        }
    ];
}

// Charts Initialization
function initializeCharts() {
    // Patient Demographics Chart
    const demographicsCtx = document.getElementById('patientDemographicsChart')?.getContext('2d');
    if (demographicsCtx) {
        new Chart(demographicsCtx, {
            type: 'doughnut',
            data: {
                labels: ['18-30', '31-50', '51-70', '70+'],
                datasets: [{
                    data: [30, 45, 15, 10],
                    backgroundColor: [
                        '#009688',
                        '#4CAF50',
                        '#FFC107',
                        '#F44336'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Patient Stats Chart
    const statsCtx = document.getElementById('patientStatsChart')?.getContext('2d');
    if (statsCtx) {
        new Chart(statsCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Patient Visits',
                    data: [65, 78, 90, 85, 95, 110],
                    borderColor: '#009688',
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Event Handlers
function handleDateSelect(selectInfo) {
    const modal = document.getElementById('appointment-modal');
    const dateInput = document.getElementById('appointment-date');
    if (dateInput) {
        const selectedDate = new Date(selectInfo.start);
        selectedDate.setHours(9, 0); // Default to 9 AM
        dateInput.value = formatDateTimeForInput(selectedDate);
    }
    showModal('appointment-modal');
}

function handleEventClick(clickInfo) {
    const event = clickInfo.event;
    showEventDetails(event);
}

function handleEventDrop(dropInfo) {
    updateAppointment(dropInfo.event);
    loadUpcomingAppointments();
}

function handleEventResize(resizeInfo) {
    updateAppointment(resizeInfo.event);
}

// Appointment Management
function addNewAppointment(formData) {
    const appointment = {
        title: `${formData.patient} - ${formData.type}`,
        start: formData.date,
        end: calculateEndTime(formData.date),
        backgroundColor: getAppointmentColor(formData.type),
        extendedProps: {
            patient: formData.patient,
            type: formData.type,
            notes: formData.notes
        }
    };

    window.calendar.addEvent(appointment);
    loadUpcomingAppointments();
    showToast('Appointment scheduled successfully!');
}

function updateAppointment(event) {
    showToast('Appointment updated successfully!');
    loadUpcomingAppointments();
}

function loadUpcomingAppointments() {
    const container = document.getElementById('upcoming-appointments');
    if (!container) return;

    const events = window.calendar.getEvents();
    const upcoming = events
        .filter(event => event.start > new Date())
        .sort((a, b) => a.start - b.start)
        .slice(0, 5);

    container.innerHTML = upcoming.map(event => `
        <div class="appointment-item">
            <div class="appointment-time">
                ${formatDateTime(event.start)}
            </div>
            <div class="appointment-details">
                <h4>${event.extendedProps.patient}</h4>
                <p>${event.extendedProps.type}</p>
                ${event.extendedProps.notes ? `<small>${event.extendedProps.notes}</small>` : ''}
            </div>
        </div>
    `).join('');
}

// Modal Management
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('active'), 10);
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

// Dashboard Data
function loadDashboardData() {
    // Update stats
    updateStats({
        totalPatients: 150,
        newPatients: 20,
        totalAppointments: 70,
        pendingAppointments: 15
    });
}

function updateStats(data) {
    // Animate number updates
    animateNumber('total-patients', data.totalPatients);
    animateNumber('new-patients', data.newPatients);
    animateNumber('total-appointments', data.totalAppointments);
    animateNumber('pending-appointments', data.pendingAppointments);
}

// Event Listeners Setup
function setupEventListeners() {
    // Form Submissions
    document.getElementById('appointment-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = {
            patient: document.getElementById('patient-name').value,
            date: document.getElementById('appointment-date').value,
            type: document.getElementById('appointment-type').value,
            notes: document.getElementById('appointment-notes').value
        };
        addNewAppointment(formData);
        hideModal('appointment-modal');
    });

    // Modal Close Buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            hideModal(this.closest('.modal').id);
        });
    });

    // Theme Toggle
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            // Handle section visibility
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });
}

// Utility Functions
function formatDateTime(date) {
    return new Date(date).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateTimeForInput(date) {
    return date.toISOString().slice(0, 16);
}

function calculateEndTime(startTime) {
    const end = new Date(new Date(startTime).getTime() + 3600000); // 1 hour appointment
    return end.toISOString();
}

function getAppointmentColor(type) {
    const colors = {
        'Checkup': '#009688',
        'Follow-up': '#4CAF50',
        'Emergency': '#F44336',
        'Consultation': '#FFC107'
    };
    return colors[type] || '#009688';
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = message;
    document.getElementById('toast-container').appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function checkThemePreference() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

function animateNumber(elementId, finalValue) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const duration = 1000;
    const startValue = parseInt(element.innerText) || 0;
    const increment = (finalValue - startValue) / (duration / 16);
    let currentValue = startValue;

    const animate = () => {
        currentValue += increment;
        element.innerText = Math.round(currentValue);

        if (increment > 0 ? currentValue < finalValue : currentValue > finalValue) {
            requestAnimationFrame(animate);
        } else {
            element.innerText = finalValue;
        }
    };

    animate();
}

// Initialize on load
window.addEventListener('load', function() {
    // Hide loading screen if exists
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    }
});