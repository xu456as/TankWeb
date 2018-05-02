import { Upload, Modal, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

@Form.create()
export default class ModalEdit extends React.Component {

  state = {
    mapFile: null
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
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
        console.log(values);
        const payload = {
          ...values,
          mapFile: this.state.mapFile
        };
        this.props.onSubmit(payload);
      }
    });
  };

  render() {
    const { visible, onCancel, onSubmit, currentMap } = this.props;
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
      this.setState({mapFile : file});
      return false;
    }

    return (
      <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}>
        <Form onSubmit={this.handleSubmit} style={{margin: "30px auto"}}>
          <FormItem>
            {getFieldDecorator('id', {initialValue: currentMap.id})(
              <Input disabled={true} type="hidden" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="名字"
          >
            {getFieldDecorator('name', {initialValue: currentMap.name})(
              <Input disabled={true} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="winScore"
          >
            {getFieldDecorator('winScore', {initialValue: currentMap.winScore})(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="loseScore"
          >
            {getFieldDecorator('loseScore', {initialValue: currentMap.loseScore})(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="numberOfTank"
          >
            {getFieldDecorator('numberOfTank', {initialValue: currentMap.numberOfTank})(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="tankSpeed"
          >
            {getFieldDecorator('tankSpeed', {initialValue: currentMap.tankSpeed})(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="shellSpeed"
          >
            {getFieldDecorator('shellSpeed', {initialValue: currentMap.shellSpeed})(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="tankHp"
          >
            {getFieldDecorator('tankHp', {initialValue: currentMap.tankHp})(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="tankScore"
          >
            {getFieldDecorator('tankScore', {initialValue: currentMap.tankScore})(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="flagScore"
          >
            {getFieldDecorator('flagScore', {initialValue: currentMap.flagScore})(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="roundTimeout"
          >
            {getFieldDecorator('roundTimeout', {initialValue: currentMap.roundTimeout})(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="maxRound"
          >
            {getFieldDecorator('maxRound', {initialValue: currentMap.maxRound})(
              <Input />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">确认</Button>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
