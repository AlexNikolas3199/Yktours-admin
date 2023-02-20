import { useEffect } from 'react'
import { Button, Form, message, Select, Input } from 'antd'
import Top from '../../components/Top'
import { useMutation, useQuery } from '@apollo/client'
import { useUser } from '../../utils/hooks'
import { DELETE_ONE_ADMIN, FIND_MANY_ADMIN, UPDATE_ONE_ADMIN } from '../../gqls/admin'
import { FIND_MANY_ADMIN_ROLE } from '../../gqls/roles'
const { Option } = Select

const UpdateFreetime = ({ match, history }) => {
  const { id } = match.params
  const { user, loading: loadingMe } = useUser()

  useEffect(() => {
    if (!user?.role?.canUpdateRole) history.goBack()
  })

  const { data: dataRole, loading: loadingRole } = useQuery(FIND_MANY_ADMIN_ROLE, {
    fetchPolicy: 'network-only',
  })

  const { data, loading: loadingAdmin } = useQuery(FIND_MANY_ADMIN, {
    fetchPolicy: 'network-only',
    variables: { where: { id: { equals: id } } },
  })

  const onCompleted = () => history.goBack()

  const onError = (err) => {
    console.error(err)
    message.error('Не удалось выполнить запрос')
  }

  const [updateOneAdmin, { loading }] = useMutation(UPDATE_ONE_ADMIN, {
    onCompleted,
    onError,
  })

  const [deleteOneAdmin, { loading: loadingDel }] = useMutation(DELETE_ONE_ADMIN, {
    onCompleted,
    onError,
  })

  const handleCreate = (v) => {
    updateOneAdmin({
      variables: {
        where: { id },
        data: {
          name: { set: v.name ? v.name : admin.name },
          surname: { set: v.surname ? v.surname : admin.surname },
          role: { connect: { id: v.role ? v.role : admin.role } },
        },
      },
    })
  }

  const deleteAdmin = () => {
    let isRight = window.confirm('Вы уверены, что хотите удалить данные?')
    if (isRight) deleteOneAdmin({ variables: { where: { id } } })
  }

  if (loadingMe || loadingAdmin || loadingRole) return 'Загрузка...'
  if (!user?.role?.canUpdateRole) return 'Ошибка'
  const admin = data?.findManyAdmin[0]
  const role = dataRole?.findManyAdminRole

  return (
    <>
      <Top title='Изменить данные' />
      <div style={{ maxWidth: 500 }}>
        <Form initialValues={{ ...admin, role: admin.role.id }} onFinish={handleCreate} layout='vertical'>
          <Form.Item name='name' label='Имя'>
            <Input />
          </Form.Item>
          <Form.Item name='surname' label='Фамилия'>
            <Input />
          </Form.Item>
          <Form.Item name='role' label='Роль'>
            <Select placeholder='Выберите роль'>
              {role.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label='Email' name='email'>
            <Input disabled />
          </Form.Item>
          <Button loading={loading || loadingDel} htmlType='submit' type='primary'>
            Изменить
          </Button>
        </Form>
        <div style={{ paddingTop: 30 }}>
          <hr />
          <Button danger ghost loading={loading || loadingDel} onClick={deleteAdmin} type='primary'>
            Удалить
          </Button>
        </div>
      </div>
    </>
  )
}

export default UpdateFreetime
