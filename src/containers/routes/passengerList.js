import { useEffect } from 'react'
import { Checkbox, message, Spin, Table } from 'antd'
import { useMutation, useQuery } from '@apollo/client'
import Top from '../../components/Top'
import { FIND_MANY_ROUTE, UPDATE_ONE_ROUTE } from '../../gqls/tours'
import { useUser } from '../../utils/hooks'
import { Link } from 'react-router-dom'

const Routes = ({ match, history }) => {
  const { user, loading: loadingMe } = useUser()

  useEffect(() => {
    if (!user?.role?.canViewArrived) history.goBack()
  })

  const { id } = match.params
  const { data, loading } = useQuery(FIND_MANY_ROUTE, {
    fetchPolicy: 'network-only',
    variables: {
      where: { id: { equals: id } },
    },
  })

  const [updateOneRoute, { loading: loadingRoute }] = useMutation(UPDATE_ONE_ROUTE, {
    onError: (err) => {
      console.error(err)
      message.error('Не удалось выполнить запрос')
    },
  })

  const arrivedHandler = (isArrived, passId, what, isBookedId) => {
    if (!loadingRoute) {
      updateOneRoute({
        variables: {
          where: { id },
          data: {
            [what]: {
              update: {
                where: { id: isBookedId },
                data: { passengers: { update: { where: { id: passId }, data: { arrived: { set: isArrived } } } } },
              },
            },
          },
        },
      })
    }
  }

  if (loading || loadingMe) return null

  const route = data.findManyRoute[0]
  let tours1 = [],
    tours2 = []
  const addRoom = (item, isBooked = false) => {
    for (let passenger of item.passengers) {
      passenger.room = item.room
      passenger.roomId = item.id
      if (!isBooked) passenger.purchasedIn = item.purchasedIn
    }
  }
  for (let item of route.ticket) {
    addRoom(item)
    tours1 = tours1.concat(item.passengers)
  }
  for (let item of route.bookedRoom) {
    addRoom(item, true)
    tours2 = tours2.concat(item.passengers)
  }

  return (
    <>
      <Top title='Пассажиры' action={loadingRoute ? <Spin size='large' spinning={loadingRoute} /> : <Link to={`/routes/charts/${id}`}>Отчет</Link>} />
      <Table
        dataSource={tours1}
        loading={loading}
        scroll={{ x: 700 }}
        rowKey={(row) => row.id}
        pagination={false}
        columns={[
          {
            title: 'ФИО',
            key: 'passenger',
            render: (item) => item.name + ' ' + item.surname + ' ' + item.patronymic,
          },
          {
            title: 'Каюта',
            dataIndex: 'room',
            key: 'room',
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.room - b.room,
            render: (room) => room,
          },
          {
            title: 'Билет куплен в',
            dataIndex: 'purchasedIn',
            key: 'purchasedIn',
            sorter: (a, b) => a.purchasedIn - b.purchasedIn,
            render: (purchasedIn) => purchasedIn,
          },
          {
            title: 'Прибыл',
            key: 'arrived',
            render: (item) => (
              <Checkbox
                disabled={!user?.role?.canAddArrived}
                defaultChecked={item.arrived}
                onChange={(e) => arrivedHandler(e.target.checked, item.id, 'ticket', item.roomId)}
              />
            ),
          },
        ]}
      />
      <Top style={{ marginTop: 30 }} title='Пассажиры (Бронь)' />
      <Table
        dataSource={tours2}
        loading={loading}
        scroll={{ x: 700 }}
        pagination={false}
        rowKey={(row) => row.id}
        columns={[
          {
            title: 'ФИО',
            key: 'passenger',
            render: (item) => item.name + ' ' + item.surname + ' ' + item.patronymic,
          },
          {
            title: 'Каюта',
            dataIndex: 'room',
            key: 'room',
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.room - b.room,
            render: (room) => room,
          },
          {
            title: 'Прибыл',
            key: 'arrived',
            render: (item) => (
              <Checkbox
                disabled={!user?.role?.canAddArrived}
                defaultChecked={item.arrived}
                onChange={(e) => arrivedHandler(e.target.checked, item.id, 'bookedRoom', item.roomId)}
              />
            ),
          },
        ]}
      />
    </>
  )
}

export default Routes
