import { gql } from '@apollo/client'

export const FIND_MANY_ADMIN_ROLE = gql`
  query ($where: AdminRoleWhereInput) {
    findManyAdminRole(where: $where) {
      id
      title
      description
    }
  }
`

export const FIND_UNIQUE_ADMIN_ROLE = gql`
  query ($where: AdminRoleWhereUniqueInput!) {
    findUniqueAdminRole(where: $where) {
      id
      title
      description
      canViewRoute
      canViewRoutePage
      canCreateRoute
      canUpdateRoute
      canAddBooking
      canDeleteBooking
      canViewRouteHistory
      canCreateRole
      canUpdateRole
      canViewRole
      canViewArrived
      canAddArrived
    }
  }
`
export const CREATE_ONE_ADMIN_ROLE = gql`
  mutation ($data: AdminRoleCreateInput!) {
    createOneAdminRole(data: $data) {
      id
    }
  }
`
export const UPDATE_ONE_ADMIN_ROLE = gql`
  mutation ($where: AdminRoleWhereUniqueInput!, $data: AdminRoleUpdateInput!) {
    updateOneAdminRole(where: $where, data: $data) {
      id
    }
  }
`
export const DELETE_ONE_ADMIN_ROLE = gql`
  mutation ($where: AdminRoleWhereUniqueInput!) {
    deleteOneAdminRole(where: $where) {
      id
    }
  }
`
