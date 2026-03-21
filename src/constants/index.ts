export const ROUTES = {
  LOGIN: '/',
  HOME: '/home',
  INVENTORY: '/inventario',
  USERS: '/usuarios',
  CATALOGS: '/catalogos',
  CATEGORIES: '/catalogos/categorias',
  SUBCATEGORIES: '/catalogos/subcategorias',
  PROFILE: '/mi-perfil',
  NOT_FOUND: '*',
} as const

/** Role id for admin; only admin can see Users in sidebar */
export const ADMIN_ROLE_ID = 1
