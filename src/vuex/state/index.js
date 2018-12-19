const state = {
  // 目录结构
  catalog: [],
  // 目录结构的kv值
  catalogKv: {},
  // 当前目录
  activeCatalog: {},
  // 当前笔记
  activeNote: {},
  // 当前选中进行操作的节点
  selectedNode: {},
  // 显示catalog-menu
  showCatalogMenu: false,
  // 显示delete-dialog
  showDeleteDialog: false,
  // 显示rename-dialog
  showRenameDialog: false,
  // 显示change-catalog-dialog
  showChangeCatalogDialog: false,
  // 更新目录
  update: {}
}

export default state
