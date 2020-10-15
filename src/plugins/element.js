import Vue from 'vue';
import {
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  Input,
  InputNumber,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  DatePicker,
  TimePicker,
  Popover,
  Tooltip,
  ColorPicker,
  Loading,
  Message,
  Form,
  FormItem,
  Tree,
  Icon,
  Row,
  Col,
  Upload,
  TimeSelect,
  MessageBox,
  Radio,
  Cascader,

  //     ButtonGroup,
      OptionGroup,
    RadioGroup,
      RadioButton,
  //     MenuItemGroup,
  //   Breadcrumb,
  //   BreadcrumbItem,
    Tabs,
    TabPane,
  //   Tag,
  //   Alert,
  //   Slider,
  //   Progress,
    Badge,
  //   Card,
    Rate,
  //   Steps,
  //   Step,
  //   Carousel,
  //   CarouselItem,
    Collapse,
    CollapseItem,
  //   Cascader,
  //   Transfer,
  //   Container,
  //   Header,
  //   Aside,
  //   Main,
  //   Footer,
  //   Notification
} from 'element-ui';
import './table-body.extend'
import tableMixins from './table.mixins'

if (!Table.mixins) {
  Table.mixins = []
}

Table.mixins.push(tableMixins)

Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Autocomplete);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tree);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Upload);
Vue.use(ColorPicker);
Vue.use(Radio);



// Vue.use(MenuItemGroup);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(OptionGroup);
// Vue.use(ButtonGroup);
// Vue.use(Breadcrumb);
// Vue.use(BreadcrumbItem);
Vue.use(Tabs);
Vue.use(TabPane);
// Vue.use(Tag);
// Vue.use(Alert);
// Vue.use(Slider);
// Vue.use(Progress);
Vue.use(Badge);
// Vue.use(Card);
Vue.use(Rate);
// Vue.use(Steps);
// Vue.use(Step);
// Vue.use(Carousel);
// Vue.use(CarouselItem);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Cascader);
// Vue.use(Transfer);
// Vue.use(Container);
// Vue.use(Header);
// Vue.use(Aside);
// Vue.use(Main);
// Vue.use(Footer);

Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt

