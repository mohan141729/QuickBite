// src/components/Sidebar.jsx
import React from "react"
import { Utensils, ClipboardList, BarChart2, LogOut } from "lucide-react"

const Sidebar = ({ active, onChange, onLogout }) => {
  const items = [
    { key: "menu", name: "Menu", icon: <Utensils size={18} /> },
    { key: "orders", name: "Orders", icon: <ClipboardList size={18} /> },
    { key: "analytics", name: "Analytics", icon: <BarChart2 size={18} /> },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-8 text-gray-800">Dashboard</h2>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => onChange(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  active === item.key
                    ? "bg-gradient-to-r from-[#FC8019] to-[#E23744] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  )
}

export default Sidebar
