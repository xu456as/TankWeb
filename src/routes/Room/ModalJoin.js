import { Upload, Modal, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
import { connect } from 'dva';

@Form.create()
export default class ModalJoin extends React.Component {

  state = {
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
    const roomId = this.props.roomId;
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        console.log({values: values});
        this.props.onSubmit(roomId, values.projectId);
      }
    });
  };

  render() {
    console.log(this.props);
    const { visible, onCancel, onSubmit, currentUser, projectList } = this.props;
    const { getFieldDecorator } = this.props.form;

    // const mapList = map.list;
    // const projectList = project.list;
    // const currentUser = user.currentUser;

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

    const projectSelectNode = (
      <Select style={{ width: 280 }}>
        {projectList.map( (project, index) => {
          return (<Option key={index} value={project.id}>{project.name}</Option>);
        })}
      </Select>
    );


    return (
      <Modal
        title="进入房间战斗"
        visible={visible}
        onCancel={onCancel}
        footer={null}>
        <Form onSubmit={this.handleSubmit} style={{ margin: "30px auto" }}>
          <FormItem
            {...formItemLayout}
            label="选择你的参战项目"
          >
            {getFieldDecorator('projectId', { initialValue: projectList[0] ? projectList[0].id: "" })(
              projectSelectNode
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button disabled={ !projectList ||  projectList.length == 0}
               onClick={this.handleSubmit} type="primary" htmlType="submit">
                确认
            </Button>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
