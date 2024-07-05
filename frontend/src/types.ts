
export type TLead = {
    id: number
    name: string
    price: number
    responsible_user_id: number
    group_id: number
    status_id: number
    pipeline_id: number
    loss_reason_id: any
    created_by: number
    updated_by: number
    created_at: number
    updated_at: number
    closed_at: any
    closest_task_at: any
    is_deleted: boolean
    custom_fields_values: any
    score: any
    account_id: number
    labor_cost: any
    _links: {
      self: {
        href: string
      }
    }
    _embedded: {
      tags: any[]
      companies: Array<{
        id: number
        _links: {
          self: {
            href: string
          }
        }
      }>
      contacts: Array<{
          id: number
          is_main: boolean
          _links: {
            self: {
              href: string
            }
          }
        }>
    }
  }


  export type TContact = {
    id: number
    name: string
    first_name: string
    last_name: string
    responsible_user_id: number
    group_id: number
    created_by: number
    updated_by: number
    created_at: number
    updated_at: number
    closest_task_at: any
    is_deleted: boolean
    is_unsorted: boolean
    custom_fields_values: Array<{
      field_id: number
      field_name: string
      field_code: string
      field_type: string
      values: Array<{
        value: string
        enum_id: number
        enum_code: string
      }>
    }>
    account_id: number
    _links: {
      self: {
        href: string
      }
    }
    _embedded: {
      tags: Array<any>
      companies: Array<{
        id: number
        _links: {
          self: {
            href: string
          }
        }
      }>
    }
  }

  
  export type TTableData = {
    key: number
    name: string
    budget: number
    status: string[]
    responsible?: string
    date: string,
    description?: (TContact | undefined)[] ,
  }



 export type TUser = {
    id: number
    name: string
    email: string
    lang: string
    rights: {
      leads: {
        view: string
        edit: string
        add: string
        delete: string
        export: string
      }
      contacts: {
        view: string
        edit: string
        add: string
        delete: string
        export: string
      }
      companies: {
        view: string
        edit: string
        add: string
        delete: string
        export: string
      }
      tasks: {
        edit: string
        delete: string
      }
      mail_access: boolean
      catalog_access: boolean
      files_access: boolean
      status_rights: Array<{
        entity_type: string
        pipeline_id: number
        status_id: number
        rights: {
          view: string
          edit: string
          delete: string
        }
      }>
      catalog_rights: any
      custom_fields_rights: any
      oper_day_reports_view_access: boolean
      oper_day_user_tracking: boolean
      is_admin: boolean
      is_free: boolean
      is_active: boolean
      group_id: any
      role_id: any
    }
    _links: {
      self: {
        href: string
      }
    }
 }