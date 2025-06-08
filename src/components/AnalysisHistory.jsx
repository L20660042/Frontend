"use client"

import { useEffect, useState } from "react"
import { Trash2, Clock } from "lucide-react"
import axios from "axios"

const API = process.env.NEXT_PUBLIC_BACKEND || "https://backend-production-e954.up.railway.app"

export default function AnalysisHistory() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API}/analysis/all`)
        setAnalyses(res.data)
      } catch (err) {
        const saved = localStorage.getItem("emotionAnalyses")
        if (saved) {
          setAnalyses(JSON.parse(saved))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const deleteAnalysis = async (id) => {
    if (!window.confirm("¿Eliminar análisis?")) return

    try {
      await axios.delete(`${API}/analysis/${id}`)
      setAnalyses((prev) => prev.filter((a) => a._id !== id))
    } catch (err) {
      alert("Error al eliminar")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Historial de Análisis</h1>
      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : analyses.length === 0 ? (
        <p className="text-center text-gray-500">No hay análisis disponibles</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyses.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md p-4 relative hover:ring-2 hover:ring-blue-400 transition-all"
            >
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                onClick={() => deleteAnalysis(item._id)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="mb-2">
                <img
                  src={item.imageUrl || `${process.env.PUBLIC_URL}/placeholder.svg`}
                  alt="Análisis"
                  className="w-full h-32 object-contain rounded-md bg-gray-100"
                />
              </div>
              <h3 className="font-bold capitalize text-blue-600">{item.dominantEmotion}</h3>
              <p className="text-xs text-gray-500">
                {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}
              </p>
              <p className="mt-2 text-sm text-gray-700 line-clamp-3">{item.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

