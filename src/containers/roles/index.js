import { Table } from 'antd'
import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import Top from '../../components/Top'
import { useState, useEffect } from 'react'
import { useUser } from '../../utils/hooks'
import { FIND_MANY_ADMIN_ROLE } from '../../gqls/roles'
const limit = 50

const Roles = ({ history }) => {
  const { user } = useUser()
  const [skip, setSkip] = useState(0)

  useEffect(() => {
    if (!user?.role?.canViewRole) history.goBack()
  })

  const { data, loading } = useQuery(FIND_MANY_ADMIN_ROLE, {
    fetchPolicy: 'network-only',
    variables: { take: limit, skip },
  })

  const onChangeTable = (pagination) => {
    setSkip((pagination.current - 1) * limit)
  }

  const record = data ? data?.findManyAdminRole : []
  const total = data ? data?.findManyAdminRole.length : 0
  const columns = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
    },
  ]

  if (user?.role?.canUpdateRole) {
    columns.push({
      title: 'Действие',
      key: 'operation',
      align: 'center',
      render: (record) => <Link to={`/admins/roles/update/${record.id}`}>Изменить</Link>,
    })
  }

  return (
    <>
      <Top title='Роли' action={user?.role?.canCreateRole && <Link to={`/admins/roles/create`}>Добавить</Link>} />
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

export default Roles
