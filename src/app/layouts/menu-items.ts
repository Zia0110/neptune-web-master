import { Injectable } from '@angular/core'

const MENUITEMS = [
  {
    GroupName: '系统管理',
    type: 'group',
    Icon: 'av_timer',
    Url: '/admin/management',
    Children: [
      { Url: '/admin/management/users', type: 'link', PageName: '用户管理', Icon: 'view_list' },
      { Url: '/admin/management/staff/authorization', type: 'link', PageName: '用户权限', Icon: 'view_list' },
      { Url: '/admin/management/name', type: 'link', PageName: '标准名称管理', Icon: 'view_list' },
      { Url: '/admin/management/customer-group', type: 'link', PageName: '客户组管理', Icon: 'view_list' },
      { Url: '/admin/management/place-of-origin', type: 'link', PageName: '原产地管理', Icon: 'view_list' },
      { Url: '/admin/management/distribution-rule', type: 'link', PageName: '分仓规则管理', Icon: 'view_list' },
      { Url: '/admin/management/page-group', type: 'link', PageName: '页面表管理', Icon: 'view_list' },
      { Url: '/admin/management/product-category', type: 'link', PageName: '产品类型管理', Icon: 'view_list' },
      { Url: '/admin/management/notification-configuration', type: 'link', PageName: 'Notification配置管理', Icon: 'view_list' },
      { Url: '/admin/management/stock-customer-mapping', type: 'link', PageName: '库存客户映射关系管理', Icon: 'view_list' },
    ],
  },
  {
    GroupName: '零售订单',
    type: 'group',
    Icon: 'av_timer',
    Url: '/admin/order',
    Children: [
      { Url: '/admin/order/consumer-import', type: 'link', PageName: '订单批量导入', Icon: 'view_list' },
      { Url: '/admin/order/consumer-list', type: 'link', PageName: '订单识别', Icon: 'view_list' },
      { Url: '/admin/finance/order/authorise', type: 'link', PageName: '财务订单批准', Icon: 'view_list' },
      { Url: '/admin/finance/order/authorise-customer', type: 'link', PageName: '财务订单批准客户货', Icon: 'view_list' },
      { Url: '/admin/warehouse/pre-dispatch-new', type: 'link', PageName: '仓库预分仓', Icon: 'view_list' },
      { Url: '/admin/warehouse/pre-dispatch-status-five', type: 'link', PageName: '修改预分仓', Icon: 'view_list' },
      { Url: '/admin/warehouse/outbound', type: 'link', PageName: '操作出库', Icon: 'view_list' },
      { Url: '/admin/warehouse/outbound-undo', type: 'link', PageName: '撤销出库', Icon: 'view_list' },

      { Url: '/admin/order/consumer-search/customerservice', type: 'link', PageName: '订单搜索 客服', Icon: 'view_list' },
      { Url: '/admin/order/consumer-search/finance', type: 'link', PageName: '订单搜索 财务', Icon: 'view_list' },
      { Url: '/admin/order/ticket-list', type: 'link', PageName: '订单客服 问题单', Icon: 'view_list' },

      { Url: '/admin/finance/cin7import', type: 'link', PageName: 'Cin7 导入', Icon: 'view_list' },
      { Url: '/admin/finance/credit/import', type: 'link', PageName: 'Credit 导入', Icon: 'view_list' },

      { Url: '/admin/finance/cin7export', type: 'link', PageName: 'Cin7 导出', Icon: 'view_list' },
      { Url: '/admin/finance/credit/list', type: 'link', PageName: 'Credit 管理', Icon: 'view_list' },
      { Url: '/admin/finance/order-history-search', type: 'link', PageName: '操作查询', Icon: 'view_list' },
      { Url: '/admin/finance/tracking-info-batch-upload', type: 'link', PageName: '物流信息批量上传', Icon: 'view_list' },
    ],
  },
  {
    GroupName: '批发订单',
    type: 'group',
    Icon: 'av_timer',
    Url: '/admin/order',
    Children: [
      { Url: '/admin/finance/invoice/generate', type: 'link', PageName: '批发开票', Icon: 'view_list' },
      { Url: '/admin/warehouse/confirmation', type: 'link', PageName: '批发仓库分配', Icon: 'view_list' },
      { Url: '/admin/warehouse/inventory-transfer-notice', type: 'link', PageName: '库存转移 通知', Icon: 'view_list' },
      { Url: '/admin/finance/invoice/payment', type: 'link', PageName: '批发发票付款', Icon: 'view_list' },
      { Url: '/admin/warehouse/invoice-update', type: 'link', PageName: '批发订单仓库修改', Icon: 'view_list' },
    ],
  },
  {
    GroupName: '客户管理',
    type: 'group',
    Icon: 'av_timer',
    Url: '/admin/client',
    Children: [
      { Url: '/admin/client', type: 'link', PageName: '客户 列表', Icon: 'view_list' },
      { Url: '/admin/client/dashboard/0', type: 'link', PageName: '客户情报', Icon: 'view_list' },
    ],
  },
  {
    GroupName: '产品&库存',
    type: 'group',
    Icon: 'av_timer',
    Url: '/admin/product',
    Children: [
      { Url: '/admin/product', type: 'link', PageName: '产品 列表', Icon: 'view_list' },
      { Url: '/admin/warehouse/list', type: 'link', PageName: '仓库 列表', Icon: 'view_list' },
      { Url: '/admin/inventory/inquiry', type: 'link', PageName: '库存查询', Icon: 'view_list' },
      { Url: '/admin/finance/products', type: 'link', PageName: '产品价格管理', Icon: 'view_list' },
      { Url: '/admin/warehouse/warehouse-damage-lose', type: 'link', PageName: '报损和本地销售', Icon: 'view_list' },
      { Url: '/admin/warehouse/business-transfer-show', type: 'link', PageName: '客户库存转移', Icon: 'view_list' },
      { Url: '/admin/inventory/view', type: 'link', PageName: '库存视图', Icon: 'view_list' },
      { Url: '/admin/inventory/client/purchase', type: 'link', PageName: '库存客户自买', Icon: 'view_list' },
      { Url: '/admin/product/supplier-management', type: 'link', PageName: '供应商管理', Icon: 'view_list' },
    ],
  },
  {
    GroupName: '运输管理',
    type: 'group',
    Icon: 'av_timer',
    Url: '/admin/transport',
    Children: [
      { Url: '/admin/transport/plan/new', type: 'link', PageName: '新建运输计划', Icon: 'view_list' },
      { Url: '/admin/transport/plan/list/1', type: 'link', PageName: '运输 库管修改', Icon: 'view_list' },
      { Url: '/admin/transport/plan/list/2', type: 'link', PageName: '运输 确定发送', Icon: 'view_list' },
      { Url: '/admin/transport/plan/list/3', type: 'link', PageName: '运输 确定到货', Icon: 'view_list' },
      { Url: '/admin/transport/logistics/invoice', type: 'link', PageName: '物流发票查询', Icon: 'view_list' },
    ],
  },
  {
    GroupName: '采购',
    type: 'group',
    Icon: 'av_timer',
    Url: '/admin/transport',
    Children: [
      { Url: '/admin/finance/purchase-order/create', type: 'link', PageName: '采购单入库', Icon: 'view_list' },
      { Url: '/admin/finance/purchase-order/check', type: 'link', PageName: '采购单查询', Icon: 'view_list' },
    ],
  },
]

@Injectable()
export class MenuItems {
  getMenuitem() {
    return MENUITEMS
  }
}
