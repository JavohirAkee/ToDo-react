import React, { useMemo, useRef, useState } from 'react'

const ToDo = () => {
  const [newTaskText, setNewTaskText] = useState('')
  const [tasks, setTasks] = useState([])
  const inputRef = useRef(null)

  const canAdd = useMemo(() => newTaskText.trim().length > 0, [newTaskText])

  const handleAddTask = () => {
    if (!canAdd) return
    const task = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      isCompleted: false,
      isEditing: false,
    }
    setTasks(prev => [task, ...prev])
    setNewTaskText('')
    inputRef.current?.focus()
  }

  const handleKeyDownNew = (e) => {
    if (e.key === 'Enter') handleAddTask()
  }

  const toggleCompleted = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
  }

  const startEditing = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isEditing: true } : { ...t, isEditing: false }))
  }

  const saveEditing = (id, text) => {
    const nextText = text.trim()
    if (nextText.length === 0) return
    setTasks(prev => prev.map(t => t.id === id ? { ...t, text: nextText, isEditing: false } : t))
  }

  const cancelEditing = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isEditing: false } : t))
  }

  const removeTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900/60 backdrop-blur border border-white/10 shadow-2xl shadow-black/40">
        <div className="p-6 sm:p-8">
          <h1 className="text-center text-2xl sm:text-3xl font-semibold tracking-tight">
            ToDo APP
          </h1>
          <p className="mt-1 text-center text-slate-400 text-sm">
            Ishlarni rejalang va bajarilganini belgilang
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Vazifa yozing..."
              className="w-full sm:flex-1 rounded-xl bg-slate-800/70 border border-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500/40 transition"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={handleKeyDownNew}
            />
            <button
              onClick={handleAddTask}
              disabled={!canAdd}
              className={`w-full sm:w-auto rounded-xl px-5 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-violet-500/60 ${canAdd ? 'bg-violet-600 hover:bg-violet-500 active:bg-violet-600 text-white' : 'bg-slate-700 text-slate-400 cursor-not-allowed'}`}
            >
              Qo'shish
            </button>
          </div>

          <ul className="mt-6 space-y-2">
            {tasks.length === 0 && (
              <li className="text-center text-slate-500 text-sm py-6 border border-dashed border-white/10 rounded-xl">
                Hozircha hech narsa yo'q. Yangi vazifa qo'shing.
              </li>
            )}

            {tasks.map(task => (
              <li key={task.id} className="group flex items-center gap-3 rounded-xl border border-white/10 bg-slate-800/50 px-3 py-2 sm:px-4 sm:py-3 hover:border-violet-500/30 transition">
                <input
                  aria-label="Bajarildi"
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => toggleCompleted(task.id)}
                  className="size-5 accent-violet-600 rounded cursor-pointer"
                />

                <div className="flex-1 min-w-0">
                  {!task.isEditing ? (
                    <p className={`truncate ${task.isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                      {task.text}
                    </p>
                  ) : (
                    <InlineEditor
                      initialText={task.text}
                      onSave={(text) => saveEditing(task.id, text)}
                      onCancel={() => cancelEditing(task.id)}
                    />
                  )}
                </div>

                {!task.isEditing && (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <IconButton label="Tahrirlash" onClick={() => startEditing(task.id)} variant="ghost">
                      <PencilIcon />
                    </IconButton>
                    <IconButton label="O'chirish" onClick={() => removeTask(task.id)} variant="danger">
                      <TrashIcon />
                    </IconButton>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

const IconButton = ({ label, onClick, variant = 'ghost', children }) => {
  const base = 'inline-flex items-center justify-center rounded-lg p-2 transition focus:outline-none focus:ring-2'
  const styles = variant === 'danger'
    ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 focus:ring-rose-500/40'
    : 'text-slate-300 hover:text-white hover:bg-white/10 focus:ring-violet-500/40'
  return (
    <button aria-label={label} title={label} onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  )
}

const InlineEditor = ({ initialText, onSave, onCancel }) => {
  const [text, setText] = useState(initialText)
  const editorRef = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSave(text)
    if (e.key === 'Escape') onCancel()
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={editorRef}
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500/40 transition"
      />
      <button
        onClick={() => onSave(text)}
        className="rounded-lg px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition"
      >
        Saqlash
      </button>
      <button
        onClick={onCancel}
        className="rounded-lg px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm font-medium transition"
      >
        Bekor qilish
      </button>
    </div>
  )
}

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path d="M16.862 3.487a1.5 1.5 0 0 1 2.121 0l1.53 1.53a1.5 1.5 0 0 1 0 2.122l-10.4 10.4a2 2 0 0 1-.894.506l-4.27 1.14a.5.5 0 0 1-.608-.608l1.14-4.27a2 2 0 0 1 .506-.894l10.4-10.4Zm-2.121 2.122L5.2 15.15a.5.5 0 0 0-.127.223l-.744 2.787 2.787-.744a.5.5 0 0 0 .223-.127l9.54-9.54-2.928-2.928Zm4.242-1.414 2.121 2.121-1.06 1.061-2.122-2.121 1.061-1.06Z" />
  </svg>
)

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path d="M9 3.75A2.25 2.25 0 0 1 11.25 1.5h1.5A2.25 2.25 0 0 1 15 3.75V4.5h4.125a.75.75 0 0 1 0 1.5H4.875a.75.75 0 0 1 0-1.5H9V3.75Zm-3 4.5h12l-.694 12.152A2.25 2.25 0 0 1 15.06 22.5H8.94a2.25 2.25 0 0 1-2.246-2.098L6 8.25Z" />
  </svg>
)

export default ToDo
