import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { Menu } from 'antd'
import { HomeOutlined, UserAddOutlined, FieldTimeOutlined, HistoryOutlined } from '@ant-design/icons'
import { useUser } from '../utils/hooks'

const MenuComponent = () => {
  const { user, loading } = useUser()
  const { pathname } = window.location

  if (loading) return 'Загрузка...'
  if (!user) return 'Ошибка'
  const role = user?.role

  return (
    <Menu theme='dark' mode='inline' defaultSelectedKeys={[pathname]}>
      <Menu.Item style={{ marginTop: 7 }} key={`/`}>
        <MenuLink to={`/`}>
          <HomeOutlined style={{ marginRight: 8 }} />
          Главная
        </MenuLink>
      </Menu.Item>
      {role.canViewRoutePage && (
        <Menu.Item style={{ marginTop: 7 }} key={`/routes`}>
          <MenuLink to={`/routes`}>
            <UserAddOutlined style={{ marginRight: 8 }} />
            Круизы
          </MenuLink>
        </Menu.Item>
      )}
      {role.canViewRouteHistory && (
        <Menu.Item style={{ marginTop: 7 }} key={`/history`}>
          <MenuLink to={`/history`}>
            <HistoryOutlined style={{ marginRight: 8 }} />
            История круизов
          </MenuLink>
        </Menu.Item>
      )}
      {role.canViewRole && (
        <Menu.Item style={{ marginTop: 7 }} key={`/admins`}>
          <MenuLink to={`/admins`}>
            <FieldTimeOutlined style={{ marginRight: 8 }} />
            Права
          </MenuLink>
        </Menu.Item>
      )}
    </Menu>
  )
}

const MenuLink = styled(NavLink)`
  display: flex;
  flex-direction: row;
  align-items: center;
  a {
    color: white;
  }
`

export default MenuComponent
