const STORAGE_KEY = 'tasks-v1';

function init() {
	const formInput = document.getElementById('taskInput');
	const addButton = document.getElementById('addBtn');
	const listElement = document.getElementById('taskList');

	let tasks = loadTasks();
	renderTasks();

	addButton.addEventListener('click', function () {
		const text = formInput.value.trim();
		if (!text) return;
		const item = { id: Date.now(), text: text };
		tasks.unshift(item);
		saveTasks(tasks);
		formInput.value = '';
		formInput.focus();
		renderTasks();
	});

	function loadTasks() {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	}

	function saveTasks(list) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
	}

	function renderTasks() {
		listElement.innerHTML = '';
		if (tasks.length === 0) {
			const empty = document.createElement('li');
			empty.className = 'muted';
			empty.textContent = 'No tasks yet — add your first task!';
			listElement.appendChild(empty);
			return;
		}

		tasks.forEach(function (task) {
			listElement.appendChild(createTaskElement(task));
		});
	}

	function createTaskElement(task) {
		const li = document.createElement('li');
		li.className = 'task-item';

		const textDiv = document.createElement('div');
		textDiv.className = 'task-text';
		textDiv.textContent = task.text;

		const actions = document.createElement('div');
		actions.className = 'task-actions';

		const editButton = document.createElement('button');
		editButton.className = 'icon-btn';
		editButton.textContent = 'Edit';

		const deleteButton = document.createElement('button');
		deleteButton.className = 'icon-btn';
		deleteButton.textContent = 'Delete';

		actions.appendChild(editButton);
		actions.appendChild(deleteButton);
		li.appendChild(textDiv);
		li.appendChild(actions);

		editButton.addEventListener('click', function () {
			if (li.classList.contains('editing')) return;
			li.classList.add('editing');
			const editInput = document.createElement('input');
			editInput.className = 'edit-input';
			editInput.value = task.text;
			textDiv.textContent = '';
			textDiv.appendChild(editInput);
			editInput.focus();
			editButton.textContent = 'Save';

			function finish(save) {
				li.classList.remove('editing');
				editButton.textContent = 'Edit';
				if (save) {
					const newText = editInput.value.trim();
					if (newText) {
						task.text = newText;
						tasks = tasks.map(function (t) { return t.id === task.id ? task : t; });
						saveTasks(tasks);
					}
				}
				renderTasks();
			}

			editInput.addEventListener('keydown', function (e) {
				if (e.key === 'Enter') finish(true);
				if (e.key === 'Escape') finish(false);
			});

			editButton.onclick = function () { finish(true); };
		});

		deleteButton.addEventListener('click', function () {
			if (!confirm('Delete this task?')) return;
			tasks = tasks.filter(function (t) { return t.id !== task.id; });
			saveTasks(tasks);
			renderTasks();
		});

		return li;
	}
}

document.addEventListener('DOMContentLoaded', init);
