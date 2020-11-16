import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import { MatStepper } from '@angular/material/stepper'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-dashboard-user-instructions',
  templateUrl: './dashboard-user-instructions.component.html',
  styleUrls: ['./dashboard-user-instructions.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardUserInstructionComponent implements OnInit {
  panelOpenState = false
  isLinear = false
  // @ViewChild('stepper') public stepper: MatStepper
  stepperCurrent = 0
  selected = new FormControl(0)

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {}

  datas = {
    others: [
      [{ selectedIndex: 0, label: '主页', url: '/admin', user: '', subLabel: '', content: { title: 's', info: '' } }],
      [
        { selectedIndex: 0, label: '用户管理', url: '/admin/management/users', user: '', subLabel: '', content: { title: 's', info: '' } },
        {
          selectedIndex: 0,
          label: '用户权限',
          url: '/admin/management/staff/authorization',
          user: '',
          subLabel: '',
          content: { title: 's', info: '' },
        },
        { selectedIndex: 0, label: '名称管理', url: '/admin/management/name', user: '', subLabel: '', content: { title: 's', info: '' } },
        { selectedIndex: 0, label: '客户组管理', url: '/admin/management/customer-group', user: '', subLabel: '', content: { title: 's', info: '' } },
      ],
      [
        {
          selectedIndex: 3,
          label: '客户列表',
          url: '/admin/client',
          user: '',
          subLabel: 'Check and approve order for processing.',
          content: { title: '', info: '' },
        },
        { selectedIndex: 0, label: '客户情报', url: '/admin/client/dashboard/0', user: '', subLabel: '', content: { title: 's', info: '' } },
      ],
      [
        {
          selectedIndex: 4,
          label: '产品列表',
          url: '/admin/product',
          user: '库管',
          subLabel: 'Pre dispatch orders for delivery.',
          content: { title: '', info: '' },
        },
        {
          selectedIndex: 2,
          label: '产品价格',
          url: '/admin/finance/products',
          user: '',
          subLabel: 'Confirm and rectify order information, standardise order datas. ',
          content: { title: '', info: '' },
        },
        {
          selectedIndex: 1,
          label: '产品库存查询',
          url: '/admin/inventory/inquiry',
          user: '',
          subLabel: 'Import orders from Excel, create a new batch of orders.',
          content: { title: '', info: '' },
        },
        {
          selectedIndex: 1,
          label: '客户库存转移',
          url: '/admin/warehouse/business-transfer-show',
          user: '',
          subLabel: 'Import orders from Excel, create a new batch of orders.',
          content: { title: '', info: '' },
        },
        {
          selectedIndex: 1,
          label: '库存客户 自购买',
          url: '/admin/inventory/client/purchase',
          user: '',
          subLabel: 'Client buys products for inventory on their own',
          content: { title: '', info: '' },
        },
      ],
      [
        {
          selectedIndex: 4,
          label: '仓库列表',
          url: '/admin/warehouse/list',
          user: '库管',
          subLabel: 'Pre dispatch orders for delivery.',
          content: { title: '', info: '' },
        },
        {
          selectedIndex: 4,
          label: '仓库报损和本地销售',
          url: '/admin/warehouse/warehouse-damage-lose',
          user: '库管',
          subLabel: 'Pre dispatch orders for delivery.',
          content: { title: '', info: '' },
        },
      ],
    ],
    courses: [
      {
        title: '零售订单',
        datas: {
          stepper: [
            {
              selectedIndex: 1,
              label: '零售 订单批量录入',
              url: '/admin/order/consumer-import',
              user: '',
              subLabel: 'Import orders from Excel, create a new batch of orders.',
              content: { title: '', info: '' },
            },
            {
              selectedIndex: 2,
              label: '零售 订单识别',
              url: '/admin/order/consumer-list',
              user: '',
              subLabel: 'Confirm and rectify order information, standardise order datas. ',
              content: { title: '', info: '' },
            },
            {
              selectedIndex: 3,
              label: '零售 订单批准',
              url: '/admin/finance/order/authorise',
              user: '财务',
              subLabel: 'Check and approve order for processing.',
              content: { title: '', info: '' },
            },
            {
              selectedIndex: 4,
              label: '零售 Cin7 导出',
              url: '/admin/finance/cin7export',
              user: '财务',
              subLabel: 'Export to Cin7.',
              content: { title: '', info: '' },
            },
            {
              selectedIndex: 5,
              label: '零售 预分仓',
              url: '/admin/warehouse/pre-dispatch',
              user: '库管',
              subLabel: 'Pre dispatch orders for delivery.',
              content: { title: '', info: '' },
            },
            {
              selectedIndex: 7,
              label: '零售 操作出库',
              url: '/admin/warehouse/outbound',
              user: '库管',
              subLabel: '',
              content: { title: '', info: '' },
            },
            {
              selectedIndex: 8,
              label: '零售 撤销出库',
              url: '/admin/warehouse/outbound-undo',
              user: '库管',
              subLabel: '',
              content: { title: '', info: '' },
            },
            {
              selectedIndex: 9,
              label: '零售 客服问题单',
              url: '/admin/order/ticket-list',
              user: '客服',
              subLabel: '',
              content: { title: '', info: '' },
            },
          ],
          other: [
            {
              selectedIndex: 0,
              label: '订单搜索',
              url: '/admin/order/consumer-search/finance',
              user: '财务',
              subLabel: '',
              content: { title: 's', info: '' },
            },
            {
              selectedIndex: 0,
              label: '订单搜索',
              url: '/admin/order/consumer-search/customerservice',
              user: '客服',
              subLabel: '',
              content: { title: 's', info: '' },
            },
            {
              selectedIndex: 0,
              label: '零售 预分仓 (修改)',
              url: '/admin/warehouse/pre-dispatch-status-five',
              user: '库管',
              subLabel: '',
              content: { title: '', info: '' },
            },
            {
              selectedIndex: 0,
              label: 'Credit 管理',
              url: '/admin/finance/credit/list',
              user: '财务',
              subLabel: '',
              content: { title: '', info: '' },
            },
            {
              selectedIndex: 0,
              label: 'Credit 导入',
              url: '/admin/finance/credit/import',
              user: '财务',
              subLabel: '',
              content: { title: '', info: '' },
            },
            { selectedIndex: 0, label: 'Cin7 导入', url: '/admin/finance/cin7import', user: '财务', subLabel: '', content: { title: '', info: '' } },
          ],
        },
      },
      {
        title: '批发订单',
        datas: {
          stepper: [
            {
              selectedIndex: 21,
              label: '批发 开票',
              url: '/admin/finance/invoice/generate',
              user: '财务',
              subLabel: '',
              content: { title: '', info: '' },
            },
            {
              selectedIndex: 22,
              label: '批发仓库分配',
              url: '/admin/warehouse/confirmation',
              user: '库管',
              subLabel: '',
              content: { title: '', info: '' },
            },
            {
              selectedIndex: 23,
              label: '库存转移确定&通知',
              url: '/admin/warehouse/inventory-transfer',
              user: '财务',
              subLabel: '',
              content: { title: '', info: '' },
            },
            {
              selectedIndex: 24,
              label: '批发发票付款',
              url: '/admin/finance/invoice/payment',
              user: '财务',
              subLabel: '',
              content: { title: '', info: '' },
            },
          ],
          other: [
            {
              selectedIndex: 11,
              label: '批发订单仓库修改',
              url: '/admin/warehouse/invoice-update',
              user: '财务',
              subLabel: '',
              content: { title: '', info: '' },
            },
          ],
        },
      },
      {
        title: '运输',
        datas: {
          stepper: [
            { selectedIndex: 31, label: '新建运输计划', url: '/admin/transport/plan/new', user: '', subLabel: '', content: { title: '', info: '' } },
            {
              selectedIndex: 32,
              label: '运输计划 库管修改',
              url: '/admin/transport/plan/list/1',
              user: '库管',
              subLabel: '',
              content: { title: '', info: '' },
            },
            {
              selectedIndex: 33,
              label: '运输计划 确定发送',
              url: '/admin/transport/plan/list/2',
              user: '',
              subLabel: '',
              content: { title: '', info: '' },
            },
            {
              selectedIndex: 34,
              label: '运输计划 确定到货',
              url: '/admin/transport/plan/list/3',
              user: '',
              subLabel: '',
              content: { title: '', info: '' },
            },
            {
              selectedIndex: 35,
              label: '物流 发票',
              url: '/admin/transport/logistics/invoice',
              user: '',
              subLabel: '',
              content: { title: '', info: '' },
            },
          ],
          other: [],
        },
      },
      {
        title: '采购',
        datas: {
          stepper: [
            {
              selectedIndex: 41,
              label: '采购单入库',
              url: '/admin/finance/purchase-order/create',
              user: '',
              subLabel: '',
              content: { title: '', info: '' },
            },
            {
              selectedIndex: 42,
              label: '采购单查询',
              url: '/admin/finance/purchase-order/check',
              user: '',
              subLabel: '',
              content: { title: '', info: '' },
            },
          ],
          other: [],
        },
      },
    ],
  }
}
