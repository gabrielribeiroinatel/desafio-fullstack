import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

function App() {
  const [records, setRecords] = useState([])
  const [summary, setSummary] = useState({
    total_records: 0,
    total_deliveries: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const recordsResponse = await fetch(
          'http://127.0.0.1:8001/records'
        )

        const summaryResponse = await fetch(
          'http://127.0.0.1:8001/summary'
        )

        if (!recordsResponse.ok || !summaryResponse.ok) {
          throw new Error('Erro ao carregar dados')
        }

        const recordsData = await recordsResponse.json()
        const summaryData = await summaryResponse.json()

        setRecords(recordsData)
        setSummary(summaryData)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const chartData = Object.values(
    records.reduce((acc, record) => {
      const department = record.department

      if (!acc[department]) {
        acc[department] = {
          department,
          deliveries: 0,
        }
      }

      acc[department].deliveries += record.deliveries

      return acc
    }, {})
  )

  if (loading) {
    return (
      <div className="p-10 text-center text-xl">
        Carregando dados...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600 text-xl">
        Erro ao carregar os dados da API.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Painel de Indicadores
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500">Total de registros</p>

            <p className="text-4xl font-bold mt-2">
              {summary.total_records}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500">Total de entregas</p>

            <p className="text-4xl font-bold mt-2">
              {summary.total_deliveries}
            </p>
          </div>

        </div>

        {records.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            Nenhum registro encontrado.
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-8">

              <h2 className="text-xl font-bold mb-4">
                Entregas por departamento
              </h2>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="deliveries" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">

              <div className="p-6">
                <h2 className="text-xl font-bold">
                  Registros
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">

                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-4">Nome</th>
                      <th className="p-4">Departamento</th>
                      <th className="p-4">Data</th>
                      <th className="p-4">Entregas</th>
                    </tr>
                  </thead>

                  <tbody>
                    {records.map((record) => (
                      <tr
                        key={record.id}
                        className="border-t"
                      >
                        <td className="p-4">
                          {record.name}
                        </td>

                        <td className="p-4">
                          {record.department}
                        </td>

                        <td className="p-4">
                          {record.reference_date}
                        </td>

                        <td className="p-4">
                          {record.deliveries}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default App