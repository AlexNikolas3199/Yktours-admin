import { Table } from 'antd'
import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import Top from '../../components/Top'
import { useState, useEffect } from 'react'
import { FIND_MANY_ADMIN } from '../../gqls/admin'
import { useUser } from '../../utils/hooks'
import styled from 'styled-components'

const limit = 50
const FreeTime = ({ history }) => {
  const { user } = useUser()
  const [skip, setSkip] = useState(0)

  useEffect(() => {
    if (!user?.role?.canViewRole) history.goBack()
  })

  const { data, loading } = useQuery(FIND_MANY_ADMIN, {
    fetchPolicy: 'network-only',
    variables: { take: limit, skip },
  })

  const onChangeTable = (pagination) => {
    setSkip((pagination.current - 1) * limit)
  }

  const record = data ? data?.findManyAdmin : []
  const total = data ? data?.findManyAdmin.length : 0
  const columns = [
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Фамилия',
      dataIndex: 'surname',
      key: 'surname',
    },
    {
      title: 'Почта',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      render: (role) => role?.title,
    },
  ]

  if (user?.role?.canUpdateRole) {
    columns.push({
      title: 'Действие',
      key: 'operation',
      align: 'center',
      render: (record) => <Link to={`/admins/update/${record.id}`}>Изменить</Link>,
    })
  }

  const getButtons = () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <NavButton>{user?.role?.canViewRole && <Link to={`/admins/roles`}>Роли</Link>}</NavButton>
      {user?.role?.canCreateRole && <Link to={`/admins/create`}>Добавить</Link>}
    </div>
  )

  return (
    <>
      <Top title='Права' action={getButtons()} />
      <Table
        dataSource={record}
        loading={loading}
        onChange={onChangeTable}
        pagination={{
          total,
          pageSize: limit,
        }}
        scroll={{ x: 600 }}
        rowKey={(row) => row.id}
        columns={columns}
      />
    </>
  )
}

const NavButton = styled.div`
  padding: 5px 10px;
  margin: 0 10px;
  border-right: 1px solid #d9d9d9;
`
export default FreeTime
