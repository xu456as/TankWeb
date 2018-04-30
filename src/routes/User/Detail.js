import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Input, Checkbox, Alert, Icon, Form, Select, Tooltip,
  AutoComplete, Cascader, Row, Col, Button, Layout
} from 'antd';
import styles from './Detail.less';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;


@Form.create()
@connect(({ user }) => ({ user }))
export default class Detail extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent'
    });
  }
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };
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
  handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  }
  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { autoCompleteResult } = this.state;

    const currentUser = this.props.user.currentUser;
    console.log(currentUser);

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
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
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );

    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));



    const ui =  (
      <Layout style={{
        width: "600px",
        height: "300px",
        margin: "0 auto",
        background: "#fff",
        border: "solid #222"}}>
        <Form onSubmit={this.handleSubmit} style={{margin: "35px auto"}}>
          <FormItem
            {...formItemLayout}
            label="邮  箱"
          >
            {getFieldDecorator('email', {
              initialValue: currentUser.email
            })(
              <Input disabled={true}  />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="账号类型"
          >
            {getFieldDecorator('type', {
              initialValue: currentUser === "1" ? "管理员" : "普通用户"
            })(
              <Input disabled={true}  />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="电  话"
          >
            {getFieldDecorator('phone', {
              initialValue: currentUser.phone
            })(
              <Input disabled={true} />
            )}
          </FormItem>
          {/* <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">编辑</Button>
          </FormItem> */}
        </Form>
      </Layout>
    );
    return ui;
  }
}
