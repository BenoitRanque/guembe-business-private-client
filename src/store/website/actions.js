import { gql } from 'src/boot/api'

export async function INITIALIZE_WEBSITE_STORE ({ commit }) {
  const query = /* GraphQL */`query {
    i18n_locale {
      locale_id
      name
    }
    website_format {
      format_id,
      name
    }
  }`

  const { i18n_locale, website_format } = await gql(query, {}, { role: 'administrator' })

  commit('LOCALES', i18n_locale)
  commit('FORMATS', website_format)
}

export async function IMAGE (ctx, image_id) {
  const query = /* GraphQL */`query ($image_id: uuid!) {
    image: website_image_by_pk (image_id: $image_id) {
      ...Image
      name
    }
  }

  fragment Image on website_image {
    image_id
    placeholder
    format {
      format_id
      format_sizes {
        size_id
        width
      }
    }
  }`

  const variables = {
    image_id
  }

  const { image } = await gql(query, variables, { role: 'administrador' })

  return image
}

export async function LOAD_PAGE ({ commit, state }, { path = null } = { }) {
  const query = /* GraphQL */`query ($where: website_page_bool_exp $locale_id: String!) {
    pages: website_page (where: $where) {
      page_id
      image_id
      image {
        ...Image
      }
      name
      path
      sections (order_by: { index: asc }) {
        section_id
        index
        elements (order_by: { index: asc }) {
          element_id
          index
          size_id
          i18n (where: { locale_id: { _eq: $locale_id } }) {
            locale_id
            image_id
            image {
              name
              ...Image
            }
            body
            caption
            subtitle
            title
          }
        }
      }
    }
  }

  fragment Image on website_image {
    image_id
    placeholder
    format {
      format_sizes {
        size_id
        width
      }
    }
  }`

  const variables = {
    locale_id: state.locale,
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

  return page
}

export async function LOAD_ELEMENT_I18N_BY_PK ({ dispatch }, { locale_id, element_id }) {
  const query = /* GraphQL */`query ($locale_id: String! $element_id: uuid!) {
    element_i18n: website_element_i18n_by_pk (locale_id: $locale_id, element_id: $element_id) {
      image_id
      caption
      title
      subtitle
      body
    }
  }`

  const variables = { locale_id, element_id }

  let { element_i18n } = await gql(query, variables, { role: 'administrador' })

  if (!element_i18n) {
    let { insert: { element_i18n: [ new_element_i18n ] } } = await dispatch('CREATE_ELEMENT_I18N', { locale_id, element_id })
    element_i18n = new_element_i18n
  }

  return element_i18n
}

export async function CREATE_ELEMENT_I18N (ctx, objects) {
  const query = /* GraphQL */`mutation ($objects: [website_element_i18n_insert_input!]!) {
    insert: insert_website_element_i18n (objects: $objects) {
      affected_rows
      element_i18n: returning {
        image_id
        caption
        title
        subtitle
        body
      }
    }
  }`

  const variables = { objects }

  return gql(query, variables, { role: 'administrator' })
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

export async function UPDATE_ELEMENT_I18N (ctx, { where, _set }) {
  const query = /* GraphQL */`mutation ($where: website_element_i18n_bool_exp! $_set: website_element_i18n_set_input) {
    update: update_website_element_i18n (where: $where _set: $_set) {
      affected_rows
      element: returning {
        element_id
      }
    }
  }`

  const variables = { where, _set }
  console.log('updating i18n', where, _set)

  return gql(query, variables, { role: 'administrator' })
}
