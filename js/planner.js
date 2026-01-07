// Planner Data Structure
let plannerData = {
    weeks: [
        {
            id: 'week1',
            name: 'This Week',
            days: []
        }
    ],
    currentWeek: 'week1'
};

// Initialize with current week if no data exists
function initializeDefaultWeek() {
    const week = plannerData.weeks[0];
    if (week.days.length === 0) {
        const today = new Date();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        // Start from today
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            const dayName = daysOfWeek[date.getDay()];
            const monthDay = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
            
            week.days.push({
                id: generateId('day'),
                name: `${dayName}, ${monthDay}`,
                workSchedule: 'Edit Schedule',
                isOffDay: false,
                notes: '',
                sections: []
            });
        }
    }
}

let nextId = 1000;

// Toast Notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.success}</span>
        <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 3000);
}

// Utility Functions
function generateId(prefix) {
    // Use timestamp + random for truly unique IDs
    return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
}

function saveData() {
    localStorage.setItem('plannerData', JSON.stringify(plannerData));
}

function loadData() {
    const saved = localStorage.getItem('plannerData');
    if (saved) {
        plannerData = JSON.parse(saved);
        
        // Repair duplicate IDs
        const seenIds = new Set();
        let needsRepair = false;
        
        plannerData.weeks.forEach(week => {
            if (seenIds.has(week.id)) {
                console.log('Found duplicate week ID:', week.id, '- repairing...');
                week.id = generateId('week');
                needsRepair = true;
            }
            seenIds.add(week.id);
            
            week.days.forEach(day => {
                if (seenIds.has(day.id)) {
                    day.id = generateId('day');
                    needsRepair = true;
                }
                seenIds.add(day.id);
                
                day.sections.forEach(section => {
                    if (seenIds.has(section.id)) {
                        section.id = generateId('section');
                        needsRepair = true;
                    }
                    seenIds.add(section.id);
                    
                    section.tasks.forEach(task => {
                        if (seenIds.has(task.id)) {
                            task.id = generateId('task');
                            needsRepair = true;
                        }
                        seenIds.add(task.id);
                    });
                });
            });
        });
        
        if (needsRepair) {
            console.log('Repaired duplicate IDs, saving...');
            saveData();
        }
    }
}

// Week Management
function renderWeekSelector() {
    const selector = document.getElementById('weekSelector');
    selector.innerHTML = '';
    
    plannerData.weeks.forEach(week => {
        const weekItem = document.createElement('div');
        weekItem.className = 'week-item' + (week.id === plannerData.currentWeek ? ' active' : '');
        
        const btn = document.createElement('button');
        btn.className = 'week-btn';
        btn.textContent = week.name;
        btn.onclick = () => switchWeek(week.id);
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'week-actions';
        
        // Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'week-action-btn';
        editBtn.textContent = '✎';
        editBtn.title = 'Edit week name';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            editWeekName(week.id);
        };
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'week-action-btn delete';
        deleteBtn.textContent = '×';
        deleteBtn.title = 'Delete week';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteWeek(week.id);
        };
        
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        
        weekItem.appendChild(btn);
        weekItem.appendChild(actionsDiv);
        selector.appendChild(weekItem);
    });
}

function switchWeek(weekId) {
    plannerData.currentWeek = weekId;
    const week = plannerData.weeks.find(w => w.id === weekId);
    document.getElementById('weekTitle').textContent = week.name;
    saveData();
    renderWeekSelector();
    renderDays();
    updateProgress();
}

function addNewWeek() {
    document.getElementById('weekModal').classList.add('active');
}

function closeModal() {
    document.getElementById('weekModal').classList.remove('active');
}

function createNewWeek() {
    const name = document.getElementById('weekNameInput').value;
    const startDate = document.getElementById('weekStartDate').value;
    
    if (!name) {
        showToast('Please enter a week name', 'warning');
        return;
    }

    const newWeek = {
        id: generateId('week'),
        name: name,
        days: []
    };

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let date;
    
    if (startDate) {
        // Parse date string as local time, not UTC
        const [year, month, day] = startDate.split('-').map(Number);
        date = new Date(year, month - 1, day);
    } else {
        date = new Date();
    }
    
    for (let i = 0; i < 7; i++) {
        const dayName = daysOfWeek[date.getDay()];
        const monthDay = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
        
        newWeek.days.push({
            id: generateId('day'),
            name: `${dayName}, ${monthDay}`,
            workSchedule: 'Edit Schedule',
            isOffDay: false,
            notes: '',
            sections: []
        });
        
        date.setDate(date.getDate() + 1);
    }

    plannerData.weeks.push(newWeek);
    plannerData.currentWeek = newWeek.id;
    saveData();
    
    document.getElementById('weekNameInput').value = '';
    document.getElementById('weekStartDate').value = '';
    closeModal();
    
    renderWeekSelector();
    renderDays();
    updateProgress();
    
    showToast(`Week "${name}" created successfully`, 'success');
}

let currentEditingWeekId = null;

function editWeekName(weekId) {
    currentEditingWeekId = weekId;
    const week = plannerData.weeks.find(w => w.id === weekId);
    
    document.getElementById('editWeekInput').value = week.name;
    document.getElementById('editWeekModal').classList.add('active');
    
    setTimeout(() => {
        document.getElementById('editWeekInput').focus();
        document.getElementById('editWeekInput').select();
    }, 100);
}

function closeEditWeekModal() {
    document.getElementById('editWeekModal').classList.remove('active');
    currentEditingWeekId = null;
}

function saveWeekName() {
    if (!currentEditingWeekId) return;
    
    const newName = document.getElementById('editWeekInput').value.trim();
    if (!newName) {
        showToast('Please enter a week name', 'warning');
        return;
    }
    
    const week = plannerData.weeks.find(w => w.id === currentEditingWeekId);
    week.name = newName;
    saveData();
    
    if (currentEditingWeekId === plannerData.currentWeek) {
        document.getElementById('weekTitle').textContent = week.name;
    }
    
    closeEditWeekModal();
    renderWeekSelector();
    showToast('Week renamed successfully', 'success');
}

function deleteWeek(weekId) {
    // Don't allow deleting if it's the only week
    if (plannerData.weeks.length === 1) {
        showToast('Cannot delete the only week', 'warning');
        return;
    }
    
    const week = plannerData.weeks.find(w => w.id === weekId);
    const weekIdToDelete = weekId;
    
    showConfirmModal(
        'Delete Week',
        `Delete "${week.name}"? This cannot be undone.`,
        () => {
            // Double-check we still have more than one week
            if (plannerData.weeks.length <= 1) {
                showToast('Cannot delete the only week', 'warning');
                return;
            }
            
            // Find remaining week BEFORE deleting
            const remainingWeek = plannerData.weeks.find(w => w.id !== weekIdToDelete);
            
            if (!remainingWeek) {
                showToast('Cannot delete week - no other weeks available', 'error');
                return;
            }
            
            // If deleting the current week, switch to another week first
            if (weekIdToDelete === plannerData.currentWeek) {
                plannerData.currentWeek = remainingWeek.id;
            }
            
            // Remove the week
            plannerData.weeks = plannerData.weeks.filter(w => w.id !== weekIdToDelete);
            saveData();
            
            // Re-render everything
            const currentWeek = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
            document.getElementById('weekTitle').textContent = currentWeek.name;
            renderWeekSelector();
            renderDays();
            updateProgress();
            
            showToast(`Week "${week.name}" deleted`, 'success');
        }
    );
}

// Confirmation Modal
let confirmCallback = null;

function showConfirmModal(title, message, onConfirm) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    confirmCallback = onConfirm;
    document.getElementById('confirmModal').classList.add('active');
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('active');
    confirmCallback = null;
}

function closeNotifyModal() {
    document.getElementById('notifyModal').classList.remove('active');
}

function showNotification(title, message) {
    document.getElementById('notifyTitle').textContent = title;
    document.getElementById('notifyMessage').textContent = message;
    document.getElementById('notifyModal').classList.add('active');
}

function handleConfirm() {
    if (confirmCallback) {
        confirmCallback();
    }
    closeConfirmModal();
}

function confirmAction() {
    const callback = confirmCallback;
    closeConfirmModal();
    if (callback) {
        setTimeout(() => {
            callback();
        }, 10);
    }
}

// Day Management
function renderDays() {
    const container = document.getElementById('daysContainer');
    container.innerHTML = '';
    
    const currentWeek = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
    if (!currentWeek) return;

    currentWeek.days.forEach((day, index) => {
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card' + (day.isOffDay ? ' off-day' : '');
        
        dayCard.innerHTML = `
            <div class="day-card-header">
                <div class="day-name-group">
                    <input type="text" class="day-name-input" value="${day.name}" 
                        onchange="updateDayName('${day.id}', this.value)"
                        onclick="this.select()">
                </div>
                <div class="work-schedule-badge" onclick="editWorkSchedule('${day.id}')">
                    Edit Schedule
                </div>
            </div>
            <div class="day-card-body">
                <div id="sections-${day.id}"></div>
                <button class="add-section-btn" onclick="addSection('${day.id}')">+ Add Section</button>
                <div class="notes-section">
                    <div class="notes-header">
                        <div class="notes-title">📝 Daily Notes</div>
                    </div>
                    <textarea class="notes-textarea" 
                        placeholder="Reflections, thoughts, or anything else for today..."
                        onchange="updateDayNotes('${day.id}', this.value)">${day.notes || ''}</textarea>
                </div>
            </div>
        `;
        
        container.appendChild(dayCard);
        renderSections(day);
    });
}

function updateDayName(dayId, newName) {
    const week = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
    const day = week.days.find(d => d.id === dayId);
    day.name = newName;
    saveData();
}

function updateDayNotes(dayId, notes) {
    const week = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
    const day = week.days.find(d => d.id === dayId);
    day.notes = notes;
    saveData();
}

let currentEditingDayId = null;

function editWorkSchedule(dayId) {
    currentEditingDayId = dayId;
    const week = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
    const day = week.days.find(d => d.id === dayId);
    
    document.getElementById('scheduleInput').value = day.workSchedule;
    document.getElementById('scheduleModal').classList.add('active');
    
    // Focus the input
    setTimeout(() => {
        document.getElementById('scheduleInput').focus();
        document.getElementById('scheduleInput').select();
    }, 100);
}

function closeScheduleModal() {
    document.getElementById('scheduleModal').classList.remove('active');
    currentEditingDayId = null;
}

function saveWorkSchedule() {
    if (!currentEditingDayId) return;
    
    const newSchedule = document.getElementById('scheduleInput').value.trim();
    if (!newSchedule) {
        showToast('Please enter a work schedule', 'warning');
        return;
    }
    
    const week = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
    const day = week.days.find(d => d.id === currentEditingDayId);
    day.workSchedule = newSchedule;
    
    saveData();
    closeScheduleModal();
    renderDays();
    showToast('Schedule updated', 'success');
}

// Section Management
function renderSections(day) {
    const container = document.getElementById(`sections-${day.id}`);
    container.innerHTML = '';
    
    day.sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section';
        
        sectionDiv.innerHTML = `
            <div class="section-header">
                <span class="section-drag-handle" title="Drag to reorder section">⋮⋮</span>
                <input type="text" class="section-title-input" value="${section.name}" 
                    placeholder="Section name..."
                    onchange="updateSectionName('${day.id}', '${section.id}', this.value)"
                    onkeypress="if(event.key === 'Enter') { updateSectionName('${day.id}', '${section.id}', this.value); this.blur(); }"
                    onclick="this.select()">
                <div class="section-actions">
                    <button class="icon-btn" onclick="addTask('${day.id}', '${section.id}')">+ Task</button>
                    <button class="icon-btn danger" onclick="deleteSection('${day.id}', '${section.id}')">Delete</button>
                </div>
            </div>
            <div class="tasks-list" id="tasks-${section.id}"></div>
        `;
        
        container.appendChild(sectionDiv);
        renderTasks(day, section);
    });
    
    // Initialize drag and drop for sections
    if (typeof Sortable !== 'undefined') {
        new Sortable(container, {
            animation: 150,
            handle: '.section-drag-handle',
            ghostClass: 'section-ghost',
            dragClass: 'section-dragging',
            onEnd: function(evt) {
                // Update section order in data
                const movedSection = day.sections[evt.oldIndex];
                day.sections.splice(evt.oldIndex, 1);
                day.sections.splice(evt.newIndex, 0, movedSection);
                saveData();
            }
        });
    }
}

function updateSectionName(dayId, sectionId, newName) {
    const week = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
    const day = week.days.find(d => d.id === dayId);
    const section = day.sections.find(s => s.id === sectionId);
    section.name = newName;
    saveData();
}

function addSection(dayId) {
    console.log('addSection called with dayId:', dayId);
    const week = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
    console.log('Found week:', week);
    const day = week.days.find(d => d.id === dayId);
    console.log('Found day:', day);
    
    const newSection = {
        id: generateId('section'),
        name: '',
        tasks: []
    };
    
    console.log('Created new section:', newSection);
    day.sections.push(newSection);
    console.log('Day sections after push:', day.sections.length);
    saveData();
    console.log('Data saved, rendering...');
    renderDays();
    console.log('Render complete');
    
    // Focus the new section input
    setTimeout(() => {
        const input = document.querySelector(`input.section-title-input[value=""]`);
        if (input) input.focus();
    }, 100);
}

function deleteSection(dayId, sectionId) {
    console.log('=== DELETE SECTION CALLED ===');
    console.log('dayId:', dayId);
    console.log('sectionId:', sectionId);
    
    const week = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
    if (!week) {
        console.log('ERROR: Week not found');
        return;
    }
    
    const day = week.days.find(d => d.id === dayId);
    if (!day) {
        console.log('ERROR: Day not found');
        return;
    }
    
    console.log('Day sections before delete:', day.sections.map(s => ({ id: s.id, name: s.name })));
    
    const section = day.sections.find(s => s.id === sectionId);
    if (!section) {
        console.log('ERROR: Section not found');
        return;
    }
    
    // Capture these in local variables for the closure
    const sectionName = section.name || 'this section';
    const dayIdCopy = dayId;
    const sectionIdCopy = sectionId;
    
    showConfirmModal(
        'Delete Section',
        `Delete "${sectionName}" and all its tasks?`,
        () => {
            console.log('=== DELETE CALLBACK EXECUTING ===');
            console.log('Looking for dayId:', dayIdCopy);
            console.log('Looking to delete sectionId:', sectionIdCopy);
            
            // Fresh lookup each time
            const currentWeek = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
            if (!currentWeek) {
                console.log('ERROR: Current week not found in callback');
                return;
            }
            
            const currentDay = currentWeek.days.find(d => d.id === dayIdCopy);
            if (!currentDay) {
                console.log('ERROR: Current day not found in callback');
                return;
            }
            
            console.log('Current day sections BEFORE filter:', currentDay.sections.map(s => ({ id: s.id, name: s.name })));
            
            // Filter out only the specific section
            const beforeCount = currentDay.sections.length;
            currentDay.sections = currentDay.sections.filter(s => {
                const keep = s.id !== sectionIdCopy;
                console.log(`Section ${s.id} (${s.name}): ${keep ? 'KEEP' : 'DELETE'}`);
                return keep;
            });
            const afterCount = currentDay.sections.length;
            
            console.log('Current day sections AFTER filter:', currentDay.sections.map(s => ({ id: s.id, name: s.name })));
            console.log(`Deleted section ${sectionIdCopy}. Before: ${beforeCount}, After: ${afterCount}`);
            
            saveData();
            console.log('Data saved');
            renderDays();
            console.log('Days rendered');
            updateProgress();
            console.log('=== DELETE COMPLETE ===');
        }
    );
}

// Task Management
function renderTasks(day, section) {
    const container = document.getElementById(`tasks-${section.id}`);
    container.innerHTML = '';
    
    section.tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-item' + (task.completed ? ' completed' : '');
        
        taskDiv.innerHTML = `
            <span class="task-drag-handle" title="Drag to reorder">⋮⋮</span>
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                onchange="toggleTask('${day.id}', '${section.id}', '${task.id}', this.checked)">
            <textarea class="task-text" rows="1" 
                placeholder="Task description..."
                onchange="updateTaskText('${day.id}', '${section.id}', '${task.id}', this.value)"
                onkeypress="if(event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); updateTaskText('${day.id}', '${section.id}', '${task.id}', this.value); this.blur(); }"
                oninput="autoResize(this)">${task.text}</textarea>
            ${task.estimate ? `
                <div class="task-estimate">
                    <input type="text" value="${task.estimate}" 
                        onchange="updateTaskEstimate('${day.id}', '${section.id}', '${task.id}', this.value)"
                        onclick="this.select()" placeholder="Est">
                </div>
            ` : `
                <button class="icon-btn" onclick="addTaskEstimate('${day.id}', '${section.id}', '${task.id}')">+ Est</button>
            `}
            ${task.time ? `
                <div class="task-time">
                    <input type="text" value="${task.time}" 
                        onchange="updateTaskTime('${day.id}', '${section.id}', '${task.id}', this.value)"
                        onclick="this.select()">
                </div>
            ` : `
                <button class="icon-btn" onclick="addTaskTime('${day.id}', '${section.id}', '${task.id}')">+ Time</button>
            `}
            <button class="task-delete" onclick="deleteTask('${day.id}', '${section.id}', '${task.id}')">×</button>
        `;
        
        container.appendChild(taskDiv);
        
        const textarea = taskDiv.querySelector('textarea');
        autoResize(textarea);
    });
    
    // Initialize drag and drop for this task list
    if (typeof Sortable !== 'undefined') {
        new Sortable(container, {
            animation: 150,
            handle: '.task-drag-handle',
            ghostClass: 'task-ghost',
            dragClass: 'task-dragging',
            onEnd: function(evt) {
                // Update task order in data
                const movedTask = section.tasks[evt.oldIndex];
                section.tasks.splice(evt.oldIndex, 1);
                section.tasks.splice(evt.newIndex, 0, movedTask);
                saveData();
            }
        });
    }
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function addTask(dayId, sectionId) {
    const week = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
    const day = week.days.find(d => d.id === dayId);
    const section = day.sections.find(s => s.id === sectionId);
    
    const newTask = {
        id: generateId('task'),
        text: '',
        time: '',
        estimate: '',
        completed: false
    };
    
    section.tasks.push(newTask);
    saveData();
    renderDays();
    updateProgress();
    
    // Focus the new task input
    setTimeout(() => {
        const taskInputs = document.querySelectorAll(`#tasks-${sectionId} .task-text`);
        const lastInput = taskInputs[taskInputs.length - 1];
        if (lastInput) lastInput.focus();
    }, 100);
}

function updateTaskText(dayId, sectionId, taskId, newText) {
    const week = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
    const day = week.days.find(d => d.id === dayId);
    const section = day.sections.find(s => s.id === sectionId);
    const task = section.tasks.find(t => t.id === taskId);
    task.text = newText;
    saveData();
}

function updateTaskTime(dayId, sectionId, taskId, newTime) {
    const week = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
    const day = week.days.find(d => d.id === dayId);
    const section = day.sections.find(s => s.id === sectionId);
    const task = section.tasks.find(t => t.id === taskId);
    task.time = newTime;
    saveData();
    renderDays();
}

function addTaskTime(dayId, sectionId, taskId) {
    const week = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
    const day = week.days.find(d => d.id === dayId);
    const section = day.sections.find(s => s.id === sectionId);
    const task = section.tasks.find(t => t.id === taskId);
    task.time = '12:00 PM';
    saveData();
    renderDays();
}

function updateTaskEstimate(dayId, sectionId, taskId, newEstimate) {
    const week = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
    const day = week.days.find(d => d.id === dayId);
    const section = day.sections.find(s => s.id === sectionId);
    const task = section.tasks.find(t => t.id === taskId);
    task.estimate = newEstimate;
    saveData();
    renderDays();
}

function addTaskEstimate(dayId, sectionId, taskId) {
    const week = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
    const day = week.days.find(d => d.id === dayId);
    const section = day.sections.find(s => s.id === sectionId);
    const task = section.tasks.find(t => t.id === taskId);
    task.estimate = '30 min';
    saveData();
    renderDays();
}

function toggleTask(dayId, sectionId, taskId, completed) {
    const week = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
    const day = week.days.find(d => d.id === dayId);
    const section = day.sections.find(s => s.id === sectionId);
    const task = section.tasks.find(t => t.id === taskId);
    task.completed = completed;
    saveData();
    renderDays();
    updateProgress();
}

function deleteTask(dayId, sectionId, taskId) {
    const week = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
    if (!week) return;
    
    const day = week.days.find(d => d.id === dayId);
    if (!day) return;
    
    const section = day.sections.find(s => s.id === sectionId);
    if (!section) return;
    
    section.tasks = section.tasks.filter(t => t.id !== taskId);
    saveData();
    renderDays();
    updateProgress();
}

// Progress Tracking
function updateProgress() {
    const week = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
    if (!week) return;
    
    let totalTasks = 0;
    let completedTasks = 0;
    
    week.days.forEach(day => {
        day.sections.forEach(section => {
            section.tasks.forEach(task => {
                totalTasks++;
                if (task.completed) completedTasks++;
            });
        });
    });
    
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    document.getElementById('progress-fill-mini').style.width = percentage + '%';
    document.getElementById('progress-text-mini').textContent = percentage + '%';
    document.getElementById('completed-tasks-mini').textContent = completedTasks;
    document.getElementById('total-tasks-mini').textContent = totalTasks;
}

// Export/Import Functions
function exportData() {
    const dataStr = JSON.stringify(plannerData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    link.download = `weekflow-backup-${date}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('Planner data exported successfully', 'success');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate the data structure
            if (!importedData.weeks || !Array.isArray(importedData.weeks)) {
                throw new Error('Invalid planner data format');
            }
            
            // Confirm before overwriting
            showConfirmModal(
                'Import Data',
                '⚠️ This will replace all your current data with the imported data. Continue?',
                () => {
                    plannerData = importedData;
                    saveData();
                    
                    // Re-render everything
                    const week = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
                    if (week) {
                        document.getElementById('weekTitle').textContent = week.name;
                    }
                    renderWeekSelector();
                    renderDays();
                    updateProgress();
                    
                    showToast('Data imported successfully', 'success');
                }
            );
        } catch (error) {
            showToast('Error importing data: ' + error.message, 'error');
        }
        
        // Reset the file input
        event.target.value = '';
    };
    
    reader.readAsText(file);
}

// Initialize on load
window.addEventListener('load', () => {
    loadData();
    loadDarkMode();
    
    // Initialize default week if starting fresh
    const week = plannerData.weeks.find(w => w.id === plannerData.currentWeek);
    if (week && week.days.length === 0) {
        initializeDefaultWeek();
        saveData();
    }
    
    document.getElementById('weekTitle').textContent = week.name;
    renderWeekSelector();
    renderDays();
    updateProgress();
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const weekModal = document.getElementById('weekModal');
    const scheduleModal = document.getElementById('scheduleModal');
    const editWeekModal = document.getElementById('editWeekModal');
    const confirmModal = document.getElementById('confirmModal');
    const notifyModal = document.getElementById('notifyModal');
    const timerSettingsModal = document.getElementById('timerSettingsModal');
    
    if (e.target === weekModal) {
        closeModal();
    }
    
    if (e.target === scheduleModal) {
        closeScheduleModal();
    }
    
    if (e.target === editWeekModal) {
        closeEditWeekModal();
    }
    
    if (e.target === confirmModal) {
        closeConfirmModal();
    }
    
    if (e.target === notifyModal) {
        closeNotifyModal();
    }
    
    if (e.target === timerSettingsModal) {
        closeTimerSettings();
    }
});

// Dark Mode
function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');
    
    // Update icon
    const icon = document.querySelector('.theme-icon');
    icon.textContent = isDark ? '🌙' : '☀️';
    
    // Save preference
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
}

function loadDarkMode() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        document.querySelector('.theme-icon').textContent = '🌙';
    }
}

// Help Modal
function showHelpModal() {
    document.getElementById('helpModal').classList.add('active');
}

function closeHelpModal() {
    document.getElementById('helpModal').classList.remove('active');
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ignore if user is typing in an input/textarea
    const activeElement = document.activeElement;
    const isTyping = activeElement.tagName === 'INPUT' || 
                     activeElement.tagName === 'TEXTAREA' ||
                     activeElement.isContentEditable;
    
    // Ctrl + N: Add new task (when focused on a task)
    if (e.ctrlKey && e.key === 'n' && !e.shiftKey) {
        e.preventDefault();
        // Find the currently focused task and add a new task to its section
        if (activeElement.classList.contains('task-text')) {
            const taskItem = activeElement.closest('.task-item');
            const tasksContainer = taskItem.closest('.tasks-list');
            const sectionId = tasksContainer.id.replace('tasks-', '');
            const dayCard = taskItem.closest('.day-card');
            const dayId = dayCard.querySelector('[id^="sections-"]').id.replace('sections-', '');
            addTask(dayId, sectionId);
        }
    }
    
    // Ctrl + Shift + N: Add new section (when focused anywhere in a day)
    if (e.ctrlKey && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        const dayCard = activeElement.closest('.day-card');
        if (dayCard) {
            const dayId = dayCard.querySelector('[id^="sections-"]').id.replace('sections-', '');
            addSection(dayId);
        }
    }
    
    // Delete: Remove focused task
    if (e.key === 'Delete' && activeElement.classList.contains('task-text')) {
        e.preventDefault();
        const taskItem = activeElement.closest('.task-item');
        const deleteBtn = taskItem.querySelector('.task-delete');
        if (deleteBtn) deleteBtn.click();
    }
    
    // Ctrl + S: Export data
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        exportData();
    }
    
    // Ctrl + D: Toggle dark mode
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleDarkMode();
    }
    
    // ?: Show help
    if (e.key === '?' && !isTyping) {
        e.preventDefault();
        showHelpModal();
    }
    
    // Esc: Close any modal
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    // Space: Start/Pause timer (when not typing)
    if (e.key === ' ' && !isTyping) {
        e.preventDefault();
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        if (startBtn.style.display !== 'none') {
            startTimer();
        } else {
            pauseTimer();
        }
    }
    
    // R: Reset timer (when not typing)
    if (e.key === 'r' && !isTyping) {
        e.preventDefault();
        resetTimer();
    }
});
