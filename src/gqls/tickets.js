import { gql } from '@apollo/client'

export const FIND_MANY_TICKETS = gql`
  query ($where: TicketWhereInput, $skip: Int, $take: Int) {
    findManyTicket(where: $where, skip: $skip, take: $take) {
      id
      amount
      purchasedIn
    }
  }
`
export const REFUND_INPUT = gql`
  mutation ($data: RefundInput!) {
    refundInput(data: $data)
  }
`
export const DELETE_ONE_TICKET = gql`
  mutation ($where: TicketWhereUniqueInput!) {
    deleteOneTicket(where: $where) {
      id
    }
  }
`
