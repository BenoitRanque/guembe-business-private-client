import { gql } from 'src/boot/API'

export async function LOAD_PAGE ({ commit, state }, { path = null } = { }) {
  const query = /* GraphQL */`query ($where: website_page_bool_exp) {
    pages: website_page (where: $where) {
      page_id
      name
      path
      sections (order_by: { index: asc }) {
        section_id
        index
        elements (order_by: { index: asc }) {
          element_id
          index
          size_id
          i18n {
            body
            caption
            subtitle
            title
          }
        }
      }
    }
  }`

  const variables = {
    where: {
      path: {
        _eq: path === null ? state.page.path : path
      }
    }
  }

  const { pages: [ page ] } = await gql(query, variables, { role: 'administrador' })

  if (!page) {
    commit('PAGE', null)
    throw new Error(`Page at /${path} not found`)
  }

  commit('PAGE', page)
}

export async function CREATE_PAGE (ctx, objects) {
  const query = /* GraphQL */`mutation ($objects: [website_page_insert_input!]!) {
    insert: insert_website_page (objects: $objects) {
      affected_rows
      page: returning {
        page_id
        name
        path
      }
    }
  }`

  const variables = { objects }

  return gql(query, variables, { role: 'administrator' })
}
export async function UPDATE_PAGE (ctx, { where, _set }) {
  const query = /* GraphQL */`mutation ($where: website_page_bool_exp! $_set: website_page_set_input) {
    update: update_website_page (where: $where _set: $_set) {
      affected_rows
      page: returning {
        page_id
      }
    }
  }`

  const variables = { where, _set }

  return gql(query, variables, { role: 'administrator' })
}
export async function DELETE_PAGE (ctx, { where }) {
  const query = /* GraphQL */`mutation ($where: website_page_bool_exp!) {
    delete: delete_website_page (where: $where) {
      affected_rows
      page: returning {
        page_id
      }
    }
  }`

  const variables = { where }

  return gql(query, variables, { role: 'administrator' })
}

export async function CREATE_SECTION (ctx, objects) {
  const query = /* GraphQL */`mutation ($objects: [website_section_insert_input!]!) {
    insert: insert_website_section (objects: $objects) {
      affected_rows
      section: returning {
        section_id
      }
    }
  }`

  const variables = { objects }

  return gql(query, variables, { role: 'administrator' })
}
export async function UPDATE_SECTION (ctx, { where, _set }) {
  const query = /* GraphQL */`mutation ($where: website_section_bool_exp! $_set: website_section_set_input) {
    update: update_website_section (where: $where _set: $_set) {
      affected_rows
      section: returning {
        section_id
      }
    }
  }`

  const variables = { where, _set }

  return gql(query, variables, { role: 'administrator' })
}
export async function DELETE_SECTION (ctx, { where }) {
  const query = /* GraphQL */`mutation ($where: website_section_bool_exp!) {
    delete: delete_website_section (where: $where) {
      affected_rows
      section: returning {
        section_id
      }
    }
  }`

  const variables = { where }

  return gql(query, variables, { role: 'administrator' })
}

export async function CREATE_ELEMENT (ctx, objects) {
  const query = /* GraphQL */`mutation ($objects: [website_element_insert_input!]!) {
    insert: insert_website_element (objects: $objects) {
      affected_rows
      element: returning {
        id: element_id
      }
    }
  }`

  const variables = { objects }

  return gql(query, variables, { role: 'administrator' })
}
export async function UPDATE_ELEMENT (ctx, { where, _set }) {
  const query = /* GraphQL */`mutation ($where: website_element_bool_exp! $_set: website_element_set_input) {
    update: update_website_element (where: $where _set: $_set) {
      affected_rows
      element: returning {
        element_id
      }
    }
  }`

  const variables = { where, _set }

  return gql(query, variables, { role: 'administrator' })
}
export async function DELETE_ELEMENT (ctx, { where }) {
  const query = /* GraphQL */`mutation ($where: website_element_bool_exp!) {
    delete: delete_website_element (where: $where) {
      affected_rows
      element: returning {
        element_id
      }
    }
  }`

  const variables = { where }

  return gql(query, variables, { role: 'administrator' })
}
