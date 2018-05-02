import { Upload, Modal, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

@Form.create()
export default class ModalAdd extends React.Component {

  state = {
    projectFile: null
  }

  // handleSubmit = (e) => {
  //   e.preventDefault();
  //   this.props.form.validateFieldsAndScroll((err, values) => {
  //     if (!err) {
  //       console.log('Received values of form: ', values);
  //     }
  //   });
  // }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        const requestParam = {
          name: values.name,
          language: values.language,
          compressType: values.compressType
        }
        const payload = {
          requestParam: requestParam,
          projectFile: this.state.projectFile
        };
        this.props.onSubmit(payload);
      }
    });
  };

  render() {
    const { visible, onCancel, onSubmit } = this.props;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 20 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    const chooseFile = (file) => {
      this.setState({projectFile : file});
      return false;
    }

    return (
      <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}>
        <Form onSubmit={this.handleSubmit} style={{margin: "30px auto"}}>
          <FormItem
            {...formItemLayout}
            label="名字"
          >
            {getFieldDecorator('name', )(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="语言类型"
          >
            {getFieldDecorator('language', {initialValue: "java"})(
              <Select>
              <Option value="java">Java</Option>
            </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="格式"
          >
            {getFieldDecorator('compressType', {initialValue: "zip"})(
              <Select>
                <Option value="zip">zip</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="项目文件"
          >
            {getFieldDecorator('projectFile')(
              <Upload beforeUpload={chooseFile}  >
                <Button>
                  <Icon type="upload" /> 选择文件
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button disabled={this.state.projectFile==null} type="primary" htmlType="submit">确认</Button>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
