import { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Upload,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  DeleteOutlined,
  UploadOutlined,
  MailOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";

const AccountSettings = () => {
  const [form] = Form.useForm();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      // API call to update profile
      message.success("Profile updated successfully");
    } catch (error) {
      message.error("Failed to update profile");
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      // API call to change password
      message.success("Password changed successfully");
    } catch (error) {
      message.error("Failed to change password");
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // API call to delete account
      message.success("Account deleted successfully");
    } catch (error) {
      message.error("Failed to delete account");
    }
    setLoading(false);
    setIsDeleteModalOpen(false);
  };

  const uploadProps: UploadProps = {
    name: "avatar",
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
      }
      return isImage || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      if (info.file.status === "done") {
        message.success("Avatar uploaded successfully");
      }
    },
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Account Settings
      </h1>

      <div className="grid gap-6">
        {/* Profile Section */}
        <Card className="shadow-md">
          <div className="flex items-center gap-6 mb-6">
            <Upload {...uploadProps}>
              <div className="relative group cursor-pointer">
                <Avatar
                  size={100}
                  icon={<UserOutlined />}
                  className="border-2 border-blue-500"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <UploadOutlined className="text-white text-xl" />
                </div>
              </div>
            </Upload>
            <div>
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <p className="text-gray-500">Update your profile details</p>
            </div>
          </div>

          <Form form={form} onFinish={handleUpdateProfile} layout="vertical">
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[
                  { required: true, message: "Please input your first name!" },
                ]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[
                  { required: true, message: "Please input your last name!" },
                ]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </div>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input prefix={<MailOutlined />} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Profile
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Change Password Section */}
        <Card className="shadow-md">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <Form onFinish={handleChangePassword} layout="vertical">
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[
                {
                  required: true,
                  message: "Please input your current password!",
                },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: "Please input your new password!" },
                { min: 8, message: "Password must be at least 8 characters!" },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Delete Account Section */}
        <Card className="shadow-md border-red-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-red-600">
                Delete Account
              </h2>
              <p className="text-gray-500">
                Permanently delete your account and all data
              </p>
            </div>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Account
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        title="Delete Account"
        open={isDeleteModalOpen}
        onOk={handleDeleteAccount}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        confirmLoading={loading}
      >
        <p>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
};

export default AccountSettings;
