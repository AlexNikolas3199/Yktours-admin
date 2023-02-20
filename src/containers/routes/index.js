import { Table } from 'antd'
import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import Top from '../../components/Top'
import { FIND_MANY_ROUTE } from '../../gqls/tours'
import { useState, useEffect } from 'react'
import { useUser } from '../../utils/hooks'
import TodayDate from '../../components/TodayDate'
// import { FIND_MANY_ADMIN } from '../../gqls/admin'
const limit = 50
const nowDate = new Date()

const Routes = ({ history }) => {
  const { user, loading: loadingMe } = useUser()
  const [skip, setSkip] = useState(0)

  useEffect(() => {
    if (!user?.role?.canViewRoutePage) history.goBack()
  })

  const { data, loading } = useQuery(FIND_MANY_ROUTE, {
    fetchPolicy: 'network-only',
    variables: {
      take: limit,
      skip,
      where: { date: { gt: nowDate.toISOString() } },
    },
  })
  const onChangeTable = (pagination) => setSkip((pagination.current - 1) * limit)
  const tours = data ? data?.findManyRoute : []
  const total = data ? data?.findManyRoute.length : 0

  return (
    <>
      <Top title='Круизы' action={user?.role?.canCreateRoute && <Link to='/routes/create'>Добавить</Link>} />
      <Table
        dataSource={tours}
        loading={loading || loadingMe}
        onChange={onChangeTable}
        pagination={{ total, pageSize: limit }}
        scroll={{ x: 700 }}
        rowKey={(row) => row.id}
        columns={[
          {
            title: 'Маршрут',
            dataIndex: 'route',
            key: 'route',
            render: (route) => route.join(' → '),
          },
          {
            title: 'Дата отплытия',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
            render: (date) => TodayDate(new Date(date)),
          },
          {
            title: 'Длительность',
            dataIndex: 'duration',
            key: 'duration',
            sorter: (a, b) => a.duration - b.duration,
            render: (dur) => dur + 'ч.',
          },
          {
            title: 'Судно',
            dataIndex: 'ship',
            key: 'ship',
            sorter: (a, b) => a.ship - b.ship,
            render: (ship) => (ship === 1 ? 'МИХАИЛ СВЕТЛОВ' : 'ДЕМЬЯН БЕДНЫЙ'),
          },
          {
            title: 'Действие',
            align: 'center',
            key: 'operation',
            render: (record) => (
              <div>
                {user?.role?.canUpdateRoute && (
                  <div>
                    <Link to={`/routes/update/${record.id}`}>Изменить</Link>
                  </div>
                )}
                {user?.role?.canViewRoute && (
                  <div style={{ marginTop: 5, marginBottom: 5 }}>
                    <Link to={`/routes/tickets/${record.id}`}>К каютам</Link>
                  </div>
                )}
                {user?.role?.canViewArrived && (
                  <div style={{ marginTop: 5, marginBottom: 5 }}>
                    <Link to={`/routes/passengerList/${record.id}`}>Пассажиры</Link>
                  </div>
                )}
              </div>
            ),
          },
        ]}
      />
    </>
  )
}

export default Routes
